#import libs that will be used
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from fastapi.responses import JSONResponse
from datetime import datetime
from bson.objectid import ObjectId
from google.protobuf.json_format import MessageToDict
import importlib  
import sys

from datetime import datetime, timedelta

from dateutil.parser import parse as datetimeParse

#appended path in the system to use the cloud orchestrator directly =
sys.path.append("./global-testbed")
sys.path.append("./global-testbed/certs")
client_module = importlib.import_module("global-testbed.common.client")

from geopy.geocoders import Nominatim
import os

import config_env as config_env

def create_experiment_in_db(experiment,token):
    """
    Create an experiment in the database.

    This function takes experiment data from the frontend via the API and relays it to the backend
    cloud orchestrator to schedule an experiment using :meth:`client_module.LeotestClient.schedule_job`.
    Token-based authentication is used to validate the request and identify the user.

    :param experiment: The experiment data to be scheduled.
    :type experiment: ExperimentData
    :param token: The JWT access token for user authentication.
    :type token: str
    :return: A JSON response containing the result of the experiment scheduling.
    :rtype: JSONResponse

    :Example:

    >>> experiment_data = ExperimentData(...)
    >>> jwt_token = "your_jwt_token"
    >>> response = create_experiment_in_db(experiment_data, jwt_token)
    """
    # Initialize the Leotest client with the provided gRPC settings and JWT access token
    client = client_module.LeotestClient(grpc_hostname=config_env.grpc_hostname,grpc_port=config_env.grpc_port,jwt_access_token=token)
    jobid = experiment.name.lower()
    nodeid = experiment.node
    type_name = "cron" if experiment.cron_string else "atq"
    schedule = experiment.cron_string
    start_date = experiment.start_date.isoformat()
    end_date = experiment.end_date.isoformat()
    length = experiment.experiment_duration
    overhead = experiment.overhead_experiment
    server = experiment.server_details
    trigger = experiment.trigger    
    experiment_file_txt = experiment.experiment_config_file
    res = client.schedule_job(
        jobid, 
        nodeid, 
        type_name,
        "docker", 
        "-","-","-", 
        schedule, 
        start_date, 
        end_date, 
        length, 
        overhead, 
        server, 
        trigger,
        experiment_config = experiment_file_txt)
    #insert experiment in database
    res = MessageToDict(res)
    # os.remove(global_file_path)
    # os.remove(experiment_file_path)
    return JSONResponse(content=res, status_code=status.HTTP_201_CREATED)


#function to get experiment schedule list for the calendar
def get_calendar_from_db(calender, token):
    """
    Get the experiment schedule list for the calendar.

    This function takes calendar data from the frontend via the API and retrieves the scheduled runs
    within the specified time range from the backend using :meth:`client_module.LeotestClient.get_scheduled_runs`.
    Token-based authentication is used to validate the request and identify the user.

    :param calender: The calendar data specifying the node and time range for the schedule.
    :type calender: CalendarData
    :param token: The JWT access token for user authentication.
    :type token: str
    :return: A JSON response containing the scheduled runs within the specified time range.
    :rtype: JSONResponse
    """
    client = client_module.LeotestClient(grpc_hostname=config_env.grpc_hostname,grpc_port=config_env.grpc_port,jwt_access_token=token)
    nodeid = calender.node 
    start = calender.start 
    end = calender.end
    res = client.get_scheduled_runs(
				nodeid=nodeid,
				start=start,
				end=end
			)
    res = MessageToDict(res)
    print(res)
    return JSONResponse(content=res, status_code=status.HTTP_201_CREATED)


#function to use the Google Maps API and get city, state & country from the coordinates of the user
import requests

def get_location(coords):
    """
    Get the location details from coordinates.

    :param coords: The coordinates in the format "latitude,longitude".
    :type coords: str
    :return: The extracted city, state, and country.
    :rtype: tuple
    """
    latitude,longitude=  coords.split(',')
    # Create a geocoder instance
    # geolocator = Nominatim(user_agent="geoapiExercises")
    # Reverse geocode the coordinates
    # location = geolocator.reverse(f"{latitude}, {longitude}", exactly_one=True)
    # Extract the relevant address components
    # city = location.raw['address'].get('city', '')
    # state = location.raw['address'].get('state', '')
    # country = location.raw['address'].get('country', '')
    city = latitude
    state = longitude
    country = "to be fixed"
    return city,state,country


#function to check if input time is less than 10 mins ot not from the current time
def is_less_than_10_minutes(last_seen):
    """
    Check if the input time is less than 10 minutes from the current time.

    :param last_seen: The timestamp to compare with.
    :type last_seen: str
    :return: True if the time difference is less than or equal to 10 minutes, False otherwise.
    :rtype: bool
    """
    last_seen=datetimeParse(last_seen)
    current_time = datetime.now()
    time_difference = current_time - last_seen
    ten_minutes = timedelta(minutes=10)
    return time_difference <= ten_minutes


def add_node_in_db(node,token):
    """
    Add a new node to the testbed.

    This function takes input node data from the frontend via the API and registers it with the backend
    using :meth:`client_module.LeotestClient.register_node`. Token-based authentication is used to validate
    the request and identify the user.

    :param node: The node data to be added to the testbed.
    :type node: dict
    :param token: The JWT access token for user authentication.
    :type token: str
    :return: A JSON response containing the result of the node registration.
    :rtype: JSONResponse
    """    
    city,state,country = get_location(node['location'])
    client = client_module.LeotestClient(grpc_hostname=config_env.grpc_hostname,grpc_port=config_env.grpc_port,jwt_access_token=token)
    nodeid = node['name'].lower()
    name=node['name']
    description = node['node_description']
    coords = node['location']
    location = str(city) + ', ' + str(state) + ', ' + str(country)
    res = client.register_node(nodeid, name, description, coords, location, provider=node['terminal_type']+','+node['access_type'])
    res = MessageToDict(res)
    return JSONResponse(content=res, status_code=status.HTTP_201_CREATED)

def delete_experiment(experiments, token):
    """
    Delete experiments from the database.

    :param experiments: The list of experiment IDs to be deleted.
    :type experiments: list[str]
    :param token: The JWT access token for user authentication.
    :type token: str
    :return: A JSON response containing the result of the experiment deletion.
    :rtype: JSONResponse
    """
    client= client_module.LeotestClient(grpc_hostname=config_env.grpc_hostname,grpc_port=config_env.grpc_port,jwt_access_token=token)
    print(experiments)
    final = []
    for experiment in experiments:
        res = client.delete_job_by_id(experiment)
        res = MessageToDict(res)
        if 'exists' not in res:
            res['exists']='False'
        final.append((experiment,str(res['exists']),res['message']))
    return JSONResponse(content=final, status_code=status.HTTP_201_CREATED)

def get_run_details_from_db(token,runId):
    """
    Get run details from the database for a specific run ID.

    :param token: The JWT access token for user authentication.
    :type token: str
    :param runId: The ID of the run to retrieve details for.
    :type runId: str
    :return: A JSON response containing the run details.
    :rtype: JSONResponse
    """
    client= client_module.LeotestClient(grpc_hostname=config_env.grpc_hostname,grpc_port=config_env.grpc_port,jwt_access_token=token)
    res= client.get_runs(runid=runId, jobid=None, nodeid=None, time_range=None, limit=None)
    res = MessageToDict(res)
    run_list = []
    if 'runs' not in res:
        res['runs']=[]
    for run in res['runs']:
        run_list.append({
           'Experiment_RUN_ID':run['runid'],
            'Experiment_ID':run['jobid'],
            'Experiment_Name':run['jobid'],
            'owner':run['userid'],
            'Node':run['nodeid'],
            'start_time':run['startTime'],
            'end_time':run['endTime'],
            'status':run['status'] + ": " + run['statusMessage'],
            'last_updated':run['lastUpdated'],
            'experiment_data':run['blobUrl'] if 'blobUrl' in run else '-'
        })
    return JSONResponse(content=run_list, status_code=status.HTTP_201_CREATED)

    

def get_nodes_from_db(token):
    """
    Get nodes details from the database.

    :param token: The JWT access token for user authentication.
    :type token: str
    :return: A JSON response containing the list of nodes with their details.
    :rtype: JSONResponse
    """
    client = client_module.LeotestClient(grpc_hostname=config_env.grpc_hostname,grpc_port=config_env.grpc_port,jwt_access_token=token)
    res = client.get_nodes()
    data = []
    json = MessageToDict(res)
    if 'nodes' in json:
        for node in json['nodes']:
            data.append({
                'id':node['nodeid'],
                'node_description': node['description'],
                'owner': 'admin', #need to change this at the cloud orchestrator to return the actual admin from the database
                'location': node['location'] + " " + node['coords'],
                'date_added': '2023-01-01',
                'status_active': is_less_than_10_minutes(node['lastActive']),
                'last_seen': node['lastActive'],
                'last_status_change': '2023-04-01',
                'terminal_type': 'Residential:' + " " + node['provider'],
                'access_type': 'Private'
                
            })
    return JSONResponse(content=data, status_code=status.HTTP_201_CREATED)


def get_experiments_from_db(email,token):
    """
    Get experiment details of a user from the database.

    :param email: The email address of the user.
    :type email: str
    :param token: The JWT access token for user authentication.
    :type token: str
    :return: A JSON response containing the list of experiments with their details.
    :rtype: JSONResponse
    """
    client= client_module.LeotestClient(grpc_hostname=config_env.grpc_hostname,grpc_port=config_env.grpc_port,jwt_access_token=token)
    userid=email
    res = client.get_jobs_by_userid(userid)
    res = MessageToDict(res)
    experiment_list = res
    experiment_list_new = []
    if 'jobs' not in experiment_list:
        experiment_list['jobs'] = []
    for exp in experiment_list['jobs']:
        if not 'type' in exp:
            exp['type']='cron'
        if not 'overhead' in exp:
            exp['overhead']='False'
        experiment_list_new.append({
            'Experiment_ID':exp['id'],
            'Experiment_Name':exp['id'],
            'owner':exp['userid'],
            'Node':exp['nodeid'],
            'schedule_cron_string':get_cron_string(exp['schedule']) if "schedule" in exp else "",
            'preferred_start_time':exp['startDate'],
            'preferred_end_time':exp['endDate'],
            'isRescheduleAllowed': 'True (atq)' if exp['type']=='ATQ' else 'False (cron)',
            'Length':exp['lengthSecs'],
            'isOverhead':str(exp['overhead']),
            'Server_Node':exp['server'] if "server" in exp else "",
            'Trigger':exp['trigger'] if 'trigger' in exp else '',
            'isApproved':str(True),
            'submit_time':exp['startDate'],
            'last_updated':exp['startDate']
        })
    return JSONResponse(content=experiment_list_new, status_code=status.HTTP_201_CREATED)


def get_runs_from_db(token):
    """
    Get experiment run details from the database.

    :param token: The JWT access token for user authentication.
    :type token: str
    :return: A JSON response containing the list of runs with their details.
    :rtype: JSONResponse
    """
    client= client_module.LeotestClient(grpc_hostname=config_env.grpc_hostname,grpc_port=config_env.grpc_port,jwt_access_token=token)
    res= client.get_runs(runid=None, jobid=None, nodeid=None, time_range=None, limit=None)
    res = MessageToDict(res)
    run_list = []
    if 'runs' not in res:
        res['runs']=[]
    for run in res['runs']:
        run_list.append({
           'Experiment_RUN_ID':run['runid'],
            'Experiment_ID':run['jobid'],
            'Experiment_Name':run['jobid'],
            'owner':run['userid'],
            'Node':run['nodeid'],
            'start_time':run['startTime'],
            'end_time':run['endTime'],
            'status':run['status'] + ": " + run['statusMessage'],
            'last_updated':run['lastUpdated'],
            'experiment_data':run['blobUrl'] if 'blobUrl' in run else '-'
        })
    #insert experiment in database
    return JSONResponse(content=run_list, status_code=status.HTTP_201_CREATED)

def get_cron_string(schedule):
    """
    Get the cron string representation from the datetime schedule.

    :param schedule: The schedule in datetime format or dictionary format.
    :type schedule: Union[datetime, dict]
    :return: The cron string representation of the schedule.
    :rtype: str
    """
    if type(schedule)==dict:
        return "%s %s %s %s %s" % (schedule['minute'],schedule['hour'],schedule['day_of_month'],schedule['month'],schedule['day_of_week'])
    else:
        return schedule

