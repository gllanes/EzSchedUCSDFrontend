import _ from 'lodash';
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from '@fullcalendar/timegrid';
import { useState, useEffect } from "react";

import logger from "../utils/logger";

import {
  getScheduleMeta,
  getScheduleMeetings,
  getScheduleFinals
} from '../api/utils';


const DAYS_OF_WEEK = ["SUNDAY_NOT_VALID", "M", "Tu", "W", "Th", "F", "S"];


const daysStrToDaysIndices = (daysStr) => {
  // Sunday - 0, Monday - 1, ..., Saturday - 6
  let daysList = [];
  for (let i = 0; i < DAYS_OF_WEEK.length; i++) {
    if (daysStr.search(DAYS_OF_WEEK[i]) !== -1) {
      daysList.push(i);
    }
  }
  return daysList;
}


const timeRegex = /(\d{2}):(\d{2})(AM|PM)/;
const parseTime = (time) => {
  const match = time.match(timeRegex);
  var hour = match[1];
  const minute = match[2];
  var locale = match[3];
  if (locale === 'PM') {
    if (hour !== '12') {
      hour = String(parseInt(hour) + 12);
    }
  }
  return `${hour}:${minute}`
}


function WeeklySchedule(props) {

  const {
    schedulesInfo,
    currentScheduleIndex
  } = props;


  // Current weekly view is of main meetings only.
  const [currentView, setCurrentView] = useState("main");
  // toggle b/t main meetings and finals view
  const onCurrentViewChange = (event) => {
    setCurrentView(event.target.value);
  }

  // If the index changes, reset view back to main
  useEffect(() => {
    setCurrentView("main");
  }, [currentScheduleIndex]);


  let events = [];

  // Render events only if there is a schedule to render.
  if (schedulesInfo) {

    const schedules = schedulesInfo.schedules;

    // Get the schedule indexed by the current schedule index.
    const currentScheduleInfo = schedules[currentScheduleIndex];
    // Get all the meeting objects - get main meetings (might be empty) and section meeting
    // console.log(`current schedule info ${JSON.stringify(currentScheduleInfo)}`)
    // for each course key
    let scheduleMeetings;
    if (currentView === 'main')
      scheduleMeetings = getScheduleMeetings(currentScheduleInfo);
    else
      scheduleMeetings = getScheduleFinals(currentScheduleInfo);
    events = scheduleMeetings.map(meeting => {
      // Every meeting should have a daysOfWeek, start time and end time, and meeting type.
      // Some meetings, however, might not have a number
      let title = `${meeting.subject_code} ${meeting.course_number} ${meeting.type_}`;
      if (meeting.number)
        title = title.concat(` ${meeting.number}`);
      if (meeting.date)
        title = title.concat(` ${meeting.date}`);
      return {
        title,
        startTime: parseTime(meeting.start_time),
        endTime: parseTime(meeting.end_time),
        daysOfWeek: daysStrToDaysIndices(meeting.days)
      };
    });
  }

  var switchViewButton;

  if (currentView === "main") {
    switchViewButton = (
      <button value="final" onClick={onCurrentViewChange}>View finals</button>
    );
  } else {
    switchViewButton = (
      <button value="main" onClick={onCurrentViewChange}>View weekly meetings</button>
    );
  }

  return (
    <div>
      {switchViewButton}
      <FullCalendar
        plugins={[timeGridPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          start: "",
          center: "",
          end: ""
        }}
        dayHeaderFormat={{weekday: "short"}}
        slotMinTime={"8:00"}
        slotMaxTime={"22:00"}
        hiddenDays={[0]}
        allDaySlot={false}
        events={events}
      />
    </div>
  );
}


function SchedulesHeader(props) {

  const {
    schedulesInfo,
    currentScheduleIndex
  } = props;

  // If there are no schedules, show a header saying that there are no schedules.
  if (!props.schedulesInfo) {
    return (
      <div>No schedules created yet.</div>
    );
  }

  // Get the current schedule object.
  console.log(JSON.stringify(schedulesInfo))
  const index = currentScheduleIndex;
  const currentSchedule = schedulesInfo.schedules[index];
  var scheduleMetaInfoList = getScheduleMeta(currentSchedule);
  scheduleMetaInfoList = scheduleMetaInfoList.map(info => {
    return <li key={info}>{info}</li>
  });

  return (
    <ul>
      {scheduleMetaInfoList}
    </ul>
  );

}


function SchedulesNavigation(props) {
  const {
    schedulesInfo,
    currentScheduleIndex,
    onClick
  } = props;

  let buttonProps = {};

  var scheduleNumberOutOfTotal;

  if (schedulesInfo) {
    scheduleNumberOutOfTotal = (
      <span>{`(${currentScheduleIndex + 1} of ${schedulesInfo.schedules.length})`}</span>
    );
  } else {
    scheduleNumberOutOfTotal = (
      <span>(0 of 0)</span>
    );
    buttonProps.disabled = "disabled";
  }

  const prevScheduleButton = (
    <button 
      onClick={onClick} 
      name="prev"
      {...buttonProps}
    >
      Previous schedule
    </button>
  );

  const nextScheduleButton = (
    <button 
      onClick={onClick} 
      name="next"
      {...buttonProps}
    >
      Next schedule
    </button>
  );


  return (
    <div>
      {prevScheduleButton}
      {nextScheduleButton}
      {scheduleNumberOutOfTotal}
    </div>
  );

}



export default function SchedulesDisplay(props) {
  const {
    schedulesInfo
  } = props;

  const [currentScheduleIndex, setCurrentScheduleIndex] = useState(0);
  
  const onCurrentScheduleIndexChange = (event) => {
    let totalNumSchedules = 0;
    if (schedulesInfo) {
      totalNumSchedules = schedulesInfo.schedules.length;
    }

    if (event.target.name === "prev") {
      setCurrentScheduleIndex(Math.max(0, currentScheduleIndex - 1));
    } else if (event.target.name === "next") {
      setCurrentScheduleIndex(Math.min(totalNumSchedules - 1, currentScheduleIndex + 1));
    }
  }

  // reset schedule index when schedules info changes
  useEffect(() => {
    logger("resetting index");
    setCurrentScheduleIndex(0);
  }, [schedulesInfo]);

  const schedulesHeader = (
    <SchedulesHeader 
      schedulesInfo={schedulesInfo}
      currentScheduleIndex={currentScheduleIndex}
    />
  );

  
  const weeklySchedule = (
    <WeeklySchedule 
      schedulesInfo={schedulesInfo}
      currentScheduleIndex={currentScheduleIndex}
    />
  );


  const schedulesNavigation = (
    <SchedulesNavigation 
      schedulesInfo={schedulesInfo}
      currentScheduleIndex={currentScheduleIndex}
      onClick={onCurrentScheduleIndexChange}
    />
  );

  
  return (
    <div>
      {schedulesHeader}
      {schedulesNavigation}
      {weeklySchedule}
    </div>
  );

}