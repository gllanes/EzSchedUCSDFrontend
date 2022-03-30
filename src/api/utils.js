const getScheduleMeta = (schedule) => {
  // Return, as a list, the courses (and later section numbers) 
  // of the schedule.
  const courses = Object.keys(schedule);
  // We want to extract the section code as well
  const courses_section_codes = courses.map(course => {

    // If there is an instructor, then we want to return the instructor as
    // well

    let info = `${course} ${schedule[course].section_meeting.number}`;
    if (schedule[course].instructor) 
      info = `${info} ${schedule[course].instructor}`;
    return info;
  })

  return courses_section_codes;
};


const getScheduleMeetings = (schedule) => {
  // Return, as a list, all the essential meetings of a given schedule.
  // These will be used by the schedule display in the calendar
  let meetings = [];
  for (let course of Object.keys(schedule)) {
    let courseInfo = schedule[course];
    let [subject_code, course_number] = course.split(' ');
    meetings = meetings.concat(courseInfo.main_meetings, [courseInfo.section_meeting]);
    for (let meeting of meetings) {
      meeting.subject_code = subject_code;
      meeting.course_number = course_number;
    }
  }
  return meetings;
};


const getScheduleFinals = (schedule) => {
  // Return, as a list, all the finals of a given schedule.
  let finals = [];
  for (let course of Object.keys(schedule)) {
    let courseInfo = schedule[course];
    let [subject_code, course_number] = course.split(' ');
    finals = finals.concat(courseInfo.finals);
    for (let final of finals) {
      final.subject_code = subject_code;
      final.course_number = course_number;
    }
  }
  return finals;
}


export {
  getScheduleMeta,
  getScheduleMeetings,
  getScheduleFinals
};