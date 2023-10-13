import React, { useState, useContext, useRef, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { fetchCalendarEvents } from '../services/api';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import {Tooltip as ReactTooltip} from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

import { SnackbarProvider, wrapComponent } from 'react-snackbar-alert';
import CustomSnackbarComponent from './CustomSnackbarComponent';
import LoadingBar from 'react-top-loading-bar'

export default function ViewScheduleCalender() {
  return (
    <div>
      <SnackbarProvider component={CustomSnackbarComponent} timeout={10000} pauseOnHover={true} dismissable={true}>
        <ViewScheduleCalenderContainer />
      </SnackbarProvider>
    </div>
  );
}
const ViewScheduleCalenderContainer = wrapComponent(({ createSnackbar }) => {
    const { isAuthenticated } = useContext(AuthContext);
    // const [startDate, setStartDate] = useState('');
    // const [endDate, setEndDate] = useState('');
    const [node, setNode] = useState('');
    const calendarRef = useRef();
    const loadingBarRef = useRef(null); 
    // access calenderApi in the following way: 
    // let calendarApi = calendarRef.current.getApi();


    useEffect(() => {
        if (isAuthenticated) {
          fetchData();
        } 
      }, [isAuthenticated]);

      const fetchData = async () => {
        try {
          const token = localStorage.getItem('access');
        } catch (error) {
          console.log(error);
        }
      };

    const handleEventPositioned = async (info) => {
        info.el.setAttribute("data-tooltip-id","my-tooltip");
        info.el.setAttribute("data-tooltip-content","my-tooltip");
        ReactTooltip.rebuild();
    }

    const handleDateSet = async (start, end) => {
        if (loadingBarRef.current != null)
            loadingBarRef.current.continuousStart();
        try {
            const token = localStorage.getItem('access');
            const formData2 = new FormData();
            // formData2.append('start_date', startDate);
            // formData2.append('end_date', endDate);
            formData2.append('node', node);
            formData2.append('start',start)
            formData2.append('end',end)
            console.log(node)
            console.log(start)
            console.log(end)
            let calendarApi = calendarRef.current.getApi();
            // clear all events 
            calendarApi.removeAllEvents();

            // do an API call with start, end, and node [TODO]
            const data = await fetchCalendarEvents(formData2,token);
            console.log(data.events);
            var events = data.events;

            for (let index = 0; index < events.length; index++) {
                var e = events[index];
                if (Object.hasOwn(e, 'overhead')) {
                    if (e.overhead) {
                        e.color = "firebrick";
                    }
                }
                // console.log(e);
                calendarApi.addEvent(e);
                // break;
            }
            
            //insert the new events 
            // calendarApi.addEvent(
            //     {
            //         title: "leoscope-fairness-surrey-edn-1-part-2",
            //         id: 15,
            //         start: "2023-07-12 00:00:00",
            //         end: "2023-07-12 02:00:00",
            //         type: "cron",
            //         params: {
            //           mode: "docker",
            //           deploy: "-",
            //           execute: "-",
            //           finish: "-"
            //         },
            //         schedule: "0 4,12,18,22 * * *",
            //         length: 7200,
            //         overhead: true,
            //         server: "azure-server-ldn-2",
            //         trigger: ""
            //     }
            // );

            // calendarApi.addEvent(
            //     {
            //         title: "leoscope-fairness-surrey-edn-1-part-2",
            //         id: 15,
            //         start: "2023-07-13 00:00:00",
            //         end: "2023-07-13 02:00:00",
            //         type: "cron",
            //         params: {
            //           mode: "docker",
            //           deploy: "-",
            //           execute: "-",
            //           finish: "-"
            //         },
            //         schedule: "0 4,12,18,22 * * *",
            //         length: 7200,
            //         overhead: true,
            //         server: "azure-server-ldn-2",
            //         trigger: ""
            //     }
            // );
        } catch (error) {
            console.log(error);
        }

        if (loadingBarRef.current != null)
            loadingBarRef.current.complete();
    }


    if (!isAuthenticated) {
        return <p>Verifying authentication...Click <a href={"/login"}>here</a> to login again if it takes too long.</p>;
    }

    return (
        <div className="container">
            <LoadingBar color="#f11946" ref={loadingBarRef} shadow={true} />
            <h1>View Scheduled Runs Calender</h1>
            <p>Enter a nodeid from the list of registered nodes and click on "week" or "day" to update the calender.</p>
            {/* <form onSubmit={handleSubmit}> */}
            <form>

            <div className="form-group">
            <label htmlFor="node">Node</label>
            <input
                type="text"
                className="form-control"
                id="node"
                value={node}
                onChange={(event) => setNode(event.target.value)}
            />
            </div>

            {/* <div className="form-group">
            <label htmlFor="startDate">Preferred Start Date</label>
            <input
                type="datetime-local"
                className="form-control"
                id="startDate"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
            />
            </div>
    
            <div className="form-group">
            <label htmlFor="endDate">Preferred End Date</label>
            <input
                type="datetime-local"
                className="form-control"
                id="startDate"
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
            />
            </div> */}
    
            <br></br>
            
            {/* <button type="submit" className="btn btn-primary">
            Get Runs Schedule
            </button> */}
            
            </form>

            {/* <div class="ui container">
                <div class="ui grid">
                    <div class="ui sixteen column">
                        <div id="calendar"></div>
                    </div>
                </div>
            </div> */}
        <br />
        <FullCalendar
            ref={calendarRef}
            timeZone={'UTC'}
            plugins={[ dayGridPlugin, interactionPlugin, timeGridPlugin]}
            headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'timeGridWeek,timeGridDay'
            }}
            eventLimit={true}
            navLinks={true}
            initialView='timeGridWeek'
            selectable={true}
            datesSet={ function(dateInfo) {
                // alert('start=' + dateInfo.startStr + " end=" + dateInfo.endStr);
                handleDateSet(
                    dateInfo.startStr.replace('Z', ''), 
                    dateInfo.endStr.replace('Z', '')
                )
            }}
            eventPositioned={handleEventPositioned}
            // initialEvents={INITIAL_EVENTS}
        />

        </div>
    );
});
// export default ViewScheduleCalender;