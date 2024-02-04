#import libs
from fastapi import FastAPI, HTTPException, Depends, Response, status
import aiofiles
from fastapi import Query
from fastapi import FastAPI, File, UploadFile
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, Field
from typing import Optional
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import datetime as datetime
from bson import ObjectId
from datetime import datetime, timedelta
from pydantic import ValidationError
from jose import JWTError, jwt
from passlib.context import CryptContext
from pymongo import MongoClient
from typing import List, Optional
import cloud_orch as cloud
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware
import uvicorn
import config_env as config_env
from fastapi import FastAPI, Depends, HTTPException, Request

# MongoDB Configuration
client = config_env.client
db = config_env.db
user_collection = config_env.user_collection
experiment_collection = config_env.experiment_collection
node_collection = config_env.node_collection

# JWT Configuration (need to change this to env)
SECRET_KEY = config_env.SECRET_KEY
ALGORITHM = config_env.ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES = config_env.ACCESS_TOKEN_EXPIRE_MINUTES

# Password Hashing
pwd_context = config_env.pwd_context

# FastAPI Configuration
app = FastAPI()
app.add_middleware(HTTPSRedirectMiddleware)

#open ips for requests
origins = [
    config_env.ip1,
    config_env.ip2,
    config_env.ip3
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# OAuth2 Configuration
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")
oauth2_refresh_scheme = OAuth2PasswordBearer(tokenUrl="/refresh")



from typing import Optional
from datetime import datetime
...
#Classes
#################################
#################################
#################################
#################################


class ExperimentCreate(BaseModel):
    # id: Optional[int] = Field(..., ge=1)
    name: str = Field(..., min_length=1, max_length=100)
    cron_string: str = Field(..., min_length=0, max_length=100)
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    allow_reschedule: bool = Field(default=False)
    experiment_duration: Optional[int] = Field(default=None, ge=1)
    server_details: Optional[str] = Field(default=[])
    overhead_experiment: bool = Field(default=None)
    node: Optional[str] = Field(default=None)
    trigger: Optional[str] = Field(default=None)
    global_config_file: Optional[str] = Field(default=None)
    experiment_config_file: Optional[str] = Field(default=None)


class CalenderCreate(BaseModel):
    node: Optional[str] = Field(default=None)
    start: Optional[str] = None
    end: Optional[str] = None
    
    


# # Pydantic Models
class UserUI(BaseModel):
    id: Optional[str] = str(ObjectId())
    first_name: str
    last_name: str
    email: str
    password: str
    location: Optional[str] = None
    organisation: Optional[str] = None
    description: Optional[str] = None


# Pydantic Models
class User(BaseModel):
    id: str
    name: str
    access_token: str
    role: int
    team: str


# Pydantic Models
class UserOut(BaseModel):
    # id: Optional[str] = str(ObjectId())
    first_name: str
    last_name: str
    email: str
    # password: str
    location: Optional[str] = None
    organisation: Optional[str] = None
    description: Optional[str] = None



class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    
    
#################################
#################################
#################################
#################################


# Helper Functions
def get_user_by_email(email: str):
    """
    Get user data by email.

    :param email: The email of the user.
    :type email: str
    :return: The user data.
    :rtype: User
    """
    user = user_collection.find_one({"id": email})
    if user:
        return User(**user)
    

def verify_password(plain_password, hashed_password):
    """
    Verify the provided plain password with the hashed password.

    :param plain_password: The plain password to be verified.
    :type plain_password: str
    :param hashed_password: The hashed password to be compared.
    :type hashed_password: str
    :return: True if the passwords match, False otherwise.
    :rtype: bool
    """
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    """
    Hash the provided password.

    :param password: The password to be hashed.
    :type password: str
    :return: The hashed password.
    :rtype: str
    """
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """
    Create an access token.

    :param data: The data to be encoded in the token.
    :type data: dict
    :param expires_delta: The expiration time for the token.
    :type expires_delta: Optional[timedelta]
    :return: A dictionary containing the access token and its details.
    :rtype: dict
    """

    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    access_token = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    refresh_token = jwt.encode({"userid": to_encode.get("sub")}, SECRET_KEY, algorithm=ALGORITHM)
    return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer"}


async def get_current_user(token: str = Depends(oauth2_scheme)):
    """
    Get the current user based on the provided token.

    :param token: The authentication token.
    :type token: str
    :return: The current user.
    :rtype: User
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("userid")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        token_data = TokenData(email=email)
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")

    user = get_user_by_email(token_data.email)
    if user is None:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    return user

# API Endpoints
@app.post("/api/signup")
async def create_user(user:UserUI, response: Response):
    """
    Create a new user.

    :param user: User data.
    :type user: UserUI
    :param response: Response object.
    :type response: Response
    :return: JSON response.
    :rtype: JSONResponse
    """
    existing_user = get_user_by_email(user.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    user.password = get_password_hash(user.password)
    new_user_dict = {}
    user_dict = user.dict()
    new_user_dict['id'] = user_dict['email']
    new_user_dict['name'] = user_dict['first_name'] + " " + user_dict['last_name']
    new_user_dict['team'] = user_dict['organisation'] + " - " + user_dict['location']
    new_user_dict['role'] = 0
    new_user_dict['access_token'] = user_dict['password']
    new_user_dict['static_access_token'] = user_dict['password']
    result = user_collection.insert_one(new_user_dict)
    # user.id = str(result.inserted_id)
    response.status_code = 201
    return JSONResponse(content=[], status_code=status.HTTP_201_CREATED)


@app.post("/api/login", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    """
    Log in and obtain an access token.

    :param form_data: Form data including username and password.
    :type form_data: OAuth2PasswordRequestForm
    :return: Token information.
    :rtype: Token
    """
    user = get_user_by_email(form_data.username)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    if not verify_password(form_data.password, user.access_token):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token_dict = create_access_token(data={"userid": user.id}, expires_delta=access_token_expires)
    return access_token_dict


@app.post("/api/refresh", response_model=Token)
async def refresh_token(response: Response, token: str = Depends(oauth2_refresh_scheme)):
    """
    Refresh an access token.

    :param response: Response object.
    :type response: Response
    :param token: Refresh token.
    :type token: str
    :return: New access token.
    :rtype: Token
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("userid")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")

    user = get_user_by_email(email)
    if user is None:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"userid": email}, expires_delta=access_token_expires)

    return access_token


@app.get("/api/profile", response_model=UserOut)
async def read_user_profile(token: str = Depends(oauth2_scheme)):
    """
    Read user profile information.

    :param token: Authentication token.
    :type token: str
    :return: User profile data.
    :rtype: UserOut
    """
    try:
        # print(token)
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        # print(payload,"***")
        email: str = payload.get("userid")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        token_data = TokenData(email=email)
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")

    user = get_user_by_email(token_data.email)
    split_name = user.name.split(" ")
    if len(split_name) >= 2:
        first_name,last_name= split_name[:2]
    elif user.name:
        first_name = last_name = user.name
    user_team = user.team.split(" - ")
    if user.team and (len(user_team) >= 2):
        org,loc=user.team.split(" - ")
    else:
        org = loc = " "

    email = user.id
    desc = " "
    new_user_dict = {
        'first_name':first_name,
        'last_name': last_name,
        'organisation':org,
        'location':loc,
        'email':email,
        'description':desc
        }

    if user is None:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    return UserOut(**new_user_dict)


#schedule an expriment 
@app.post("/api/experiments/")
async def create_experiment(experiment: ExperimentCreate, token: str = Depends(oauth2_scheme)):
    """
    Create a new experiment.

    :param experiment: Experiment data.
    :type experiment: ExperimentCreate
    :param token: Authentication token.
    :type token: str
    :return: Experiment details.
    :rtype: dict
    """
    # current_user = get_current_user(token)
    try:
        # code to create experiment in database
        db_experiment = cloud.create_experiment_in_db(experiment, token)
        return db_experiment
    except ValidationError as e:
        print(e)
        raise HTTPException(status_code=400, detail="Invalid experiment data")
    
    
@app.post("/api/fetch-calendar-events/")
async def getCalendarEvents(calender: CalenderCreate, token: str = Depends(oauth2_scheme)):
    """
    Fetch calendar events.

    :param calender: Calendar data.
    :type calender: CalenderCreate
    :param token: Authentication token.
    :type token: str
    :return: Calendar events.
    :rtype: dict
    """
    # current_user = get_current_user(token)
    print("***")
    try:
        # code to create experiment in database
        db_calendar = cloud.get_calendar_from_db(calender, token)
        return db_calendar
    except ValidationError as e:
        print(e)
        raise HTTPException(status_code=400, detail="Invalid Calender Request/Data")


@app.post("/api/nodes/")
async def add_node(request: Request, token: str = Depends(oauth2_scheme)):
    """
    Add a new node.

    :param request: Request object.
    :type request: Request
    :param token: Authentication token.
    :type token: str
    :return: Node details.
    :rtype: dict
    """
    # current_user = get_current_user(token)
    print("***")
    try:
        # retrieve the raw request body
        node = await request.json()
        # code to create experiment in database
        db_node = cloud.add_node_in_db(node, token)
        return db_node
    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail="Invalid Node data")

@app.post("/api/delete-experiments/")
async def delete_experiment(request: Request, token: str = Depends(oauth2_scheme)):
    """
    Delete experiments.

    :param request: Request object.
    :type request: Request
    :param token: Authentication token.
    :type token: str
    :return: Deletion result.
    :rtype: dict
    """
    try:
        # retrieve the raw request body
        experiments = await request.json()
        # code to create experiment in database
        res = cloud.delete_experiment(experiments, token)
        return res
    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail="Invalid Experiment data")


@app.get("/api/get-nodes")
async def get_user_nodes(token: str = Depends(oauth2_scheme)):
    """
    Get user nodes.

    :param token: Authentication token.
    :type token: str
    :return: List of nodes.
    :rtype: List[dict]
    """
    node_list = []
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("userid")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        token_data = TokenData(email=email)
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")

    
    user = get_user_by_email(token_data.email)
    if user is None:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    else:
        node_list = cloud.get_nodes_from_db(token)
    return node_list
    
    


@app.get("/api/get-specific-experiment-run/")
async def get_specific_run(runId: str = Query(...), token: str = Depends(oauth2_scheme)):
    """
    Get details of a specific experiment run.

    :param runId: Experiment run ID.
    :type runId: str
    :param token: Authentication token.
    :type token: str
    :return: Experiment run details.
    :rtype: dict
    """
    run_details = []
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("userid")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        token_data = TokenData(email=email)
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    user = get_user_by_email(token_data.email)
    if user is None:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    else:
        run_details = cloud.get_run_details_from_db(token, runId)
    return run_details




@app.get("/api/get-my-experiment-runs")
async def get_user_runs(token: str = Depends(oauth2_scheme)):
    """
    Get user experiment runs.

    :param token: Authentication token.
    :type token: str
    :return: List of experiment runs.
    :rtype: List[dict]
    """
    all_run_list = []
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("userid")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        token_data = TokenData(email=email)
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")

    user = get_user_by_email(token_data.email)
    if user is None:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    else:
        all_run_list = cloud.get_runs_from_db(token)
    return all_run_list



@app.post("/uploadfile/")
async def create_upload_file(file: UploadFile = File(...)):
    """
    Upload a file. (Unused at the moment)

    :param file: File to upload.
    :type file: UploadFile
    """
    out_path = 'test.txt'
    async with aiofiles.open(out_path, 'wb') as out_file:
        content = await file.read()
        await out_file.write(content)
        

@app.get("/api/get-my-experiments")
async def get_user_experiments(token: str = Depends(oauth2_scheme)):
    """
    Get user experiments.

    :param token: Authentication token.
    :type token: str
    :return: List of experiments.
    :rtype: List[dict]
    """
    
    experiment_list = []
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("userid")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        token_data = TokenData(email=email)
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    user = get_user_by_email(token_data.email)
    if user is None:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    else:
        # experiments = experiment_collection.find({"userid": user.id})        
        experiment_list = cloud.get_experiments_from_db(email,token)
    return experiment_list


def get_cron_string(schedule):
    """
    Get the cron string representation from the schedule.

    :param schedule: The schedule in datetime format or dictionary format.
    :type schedule: Union[datetime, dict]
    :return: The cron string representation of the schedule.
    :rtype: str
    """
    if type(schedule)==dict:
        return "%s %s %s %s %s" % (schedule['minute'],schedule['hour'],schedule['day_of_month'],schedule['month'],schedule['day_of_week'])
    else:
        return schedule
