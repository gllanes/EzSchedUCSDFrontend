import { useState, useCallback } from "react";
import "./styles.css";

import QuarterSelector from "./components/QuarterSelector";
import LoadingMessage from "./components/LoadingMessage";
import SubjectSelector from "./components/SubjectSelector";
import CourseSelector from "./components/CourseSelector";
import SelectedCourses from "./components/SelectedCourses";
import StartTimeSelector from "./components/StartTimeSelector";
import SchedulesDisplay from "./components/SchedulesInfo";
import API from "./api/API";
import logger from "./utils/logger";

import MyAppBar from "./components/MyAppBar";
import BoxHeader from "./components/BoxHeader";
import { 
  Container, 
  Grid
} from "@mui/material";


function App() {

  const [loadingMessage, setLoadingMessage] = useState("No data to load right now.");
  const [isLoadingError, setIsLoadingError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const setLoadingState = useCallback((isLoadingNew, isLoadingErrorNew, loadingMessageNew) => {
    logger("Setting loading state...");
    setIsLoading(isLoadingNew);
    setIsLoadingError(isLoadingErrorNew);
    setLoadingMessage(loadingMessageNew);
  }, []);


  const [selectedQuarter, setSelectedQuarter] = useState("");
  const onSelectedQuarterChange = (option) => {
    logger(`new quarter ${option.value}`);
    setSelectedQuarter(option.value);
    setSelectedSubject("");
    setSelectedCourse("");
    setAddedCourses([]);
  }


  const [selectedSubject, setSelectedSubject] = useState("");


  // react-select
  const onSelectedSubjectChange = (option) => {
    logger(`new subject ${option.value}`);
    setSelectedSubject(option.value);
    setSelectedCourse("");
  }


  const [selectedCourse, setSelectedCourse] = useState("");
  const onSelectedCourseChange = (option) => {
    if (!option.value) {
      logger("No selected course.");
    } else {
      logger("new selected course ", JSON.parse(option.value));
    }
    setSelectedCourse(option.value);
  };


  const [addedCourses, setAddedCourses] = useState([]);
  const onAddSelectedCourse = (event) => {
    if (!selectedCourse) {
      alert("You need to select a course first!");
      return;
    }

    const course = JSON.parse(selectedCourse);
    const addedCoursesCopy = addedCourses.slice();
    // If the course is already in the added courses, don't add.
    const alreadyAdded = addedCoursesCopy.find(addedCourse =>
      addedCourse.subject_code === course.subject_code &&
      addedCourse.number === course.number
    );
    
    if (alreadyAdded) {
      return;
    }

    course.instructors = [];
    course.preferredInstructor = "";

    // Get instructors, initialize preferred instructor
    setLoadingState(true, false, `Getting instructors for ${course.subject_code} ${course.number}`);
    API.getInstructors(selectedQuarter, course.subject_code, course.number)
      .then(instructors => {
        course.instructors = instructors;
        addedCoursesCopy.push(course);
        setAddedCourses(addedCoursesCopy);
      })
      .then(() => setLoadingState(false, false, "Successfully retrieved instrutors."))
      .catch(err => {
        setLoadingState(false, true, err.message);
      })

  };


  const onCourseInstructorPreferenceChange = (event, subjectCode, courseNumber) => {

    const addedCoursesCopy = addedCourses.slice();

    // First, find the course object in the selected courses
    // by subject code and course number
    const targetCourse = addedCoursesCopy.find(course =>
      course.subject_code === subjectCode && course.number === courseNumber
    );

    // This should never happen.
    if (!targetCourse) {
      logger("Unable to find target course for instructor preference.");
      return;
    }

    // Set the new instructor.
    targetCourse.preferredInstructor = event.target.value;
    setAddedCourses(addedCoursesCopy);

  }


  const onRemoveAddedCourse = (event, subjectCode, courseNumber) => {
    const addedCoursesCopy = addedCourses.slice();

    // First, find the course object in the selected courses
    // by subject code and course number
    const targetCourseIndex = addedCoursesCopy.findIndex(course =>
      course.subject_code === subjectCode && course.number === courseNumber
    );

    // This should never happen.
    if (targetCourseIndex === -1) {
      logger("Unable to find target course for removal.");
      return;
    }

    addedCoursesCopy.splice(targetCourseIndex, 1);
    setAddedCourses(addedCoursesCopy);

  }


  const [preferredStartTime, setPreferredStartTime] = useState("");
  const onPreferredStartTimeChange = (event) => {
    setPreferredStartTime(event.target.value);
  };


  const [schedulesInfo, setSchedulesInfo] = useState(null);
  const onSubmitForScheduling = (event) => {
    // Submit currently added courses information for scheduling.
    if (addedCourses.length === 0) {
      alert("You need to select at least one course first!");
      return;
    }

    setLoadingState(true, false, "Creating schedules...");
    API.postSchedules(selectedQuarter, addedCourses, preferredStartTime)
      .then((id) => {
        setLoadingState(true, false, "Fetching schedules...");
        // If we fail here, then set the API message.
        return API.getSchedules(id);
      })
      .then(schedulesInfo => {
        // The schedules object was retrieved successfully.
        // Contains, success, message, and schedules
        if (!schedulesInfo.success) {
          setLoadingState(false, true, `There was an error building schedules: ${schedulesInfo.message}`);
        } else {
          setSchedulesInfo(schedulesInfo);
          setLoadingState(false, false, "Schedules successfully generated.");
        }
      })
      .catch(err => {
        console.log(err);
        setLoadingState(false, true, err.message)
      });

  }
  

  
  // Building child components

  const loadingMessageDisplay = (
    <LoadingMessage
      isLoading={isLoading}
      isLoadingError={isLoadingError}
      loadingMessage={loadingMessage}
    />
  );

  const quarterSelector = (
    <QuarterSelector
      selectedQuarter={selectedQuarter}
      onChange={onSelectedQuarterChange}
      setLoadingState={setLoadingState}
    />
  );


  const subjectSelector = (
    <SubjectSelector
      selectedSubject={selectedSubject}
      onChange={onSelectedSubjectChange}
      setLoadingState={setLoadingState}
    />
  );


  const courseSelector = (
    <CourseSelector
      selectedQuarter={selectedQuarter}
      selectedSubject={selectedSubject}
      selectedCourse={selectedCourse}
      onChange={onSelectedCourseChange}
      setLoadingState={setLoadingState}
      onClick={onAddSelectedCourse}
    />
  );


  const selectedCourses = (
    <SelectedCourses
      addedCourses={addedCourses}
      onCourseInstructorPreferenceChange={onCourseInstructorPreferenceChange}
      onClick={onRemoveAddedCourse}
    />
  );


  const startTimeSelector = (
    <StartTimeSelector 
      preferredStartTime={preferredStartTime}
      onChange={onPreferredStartTimeChange}
    />
  );


  const schedulesDisplay = (
    <SchedulesDisplay 
      schedulesInfo={schedulesInfo}
    />
  );


  return (
    <div>
      {<MyAppBar/>}
      <Container>
        {loadingMessageDisplay}
        <Grid container spacing={2} wrap="wrap">
          <Grid item xs={12} sm={6}>
            <div className="padded-border-box">
              <BoxHeader textContent="Add your courses"/>
              {quarterSelector}
              {subjectSelector}
              {courseSelector}
              <div style={{textAlign: "right"}}><button onClick={onAddSelectedCourse}>Add course</button></div>
            </div>
          </Grid>
          <Grid item xs={12} sm={6}>
            <div className="padded-border-box selected-courses-box">
              <BoxHeader textContent="Added courses"/>
              {selectedCourses}
            </div>
          </Grid>
          <Grid item xs={12} sm={6}>
            <div className="padded-border-box">
              <BoxHeader textContent="Additional preferences"></BoxHeader>
              {startTimeSelector}
            </div>
          </Grid>
          <Grid item xs={12} style={{textAlign: "center"}}
            ><button onClick={onSubmitForScheduling}>Generate schedules</button>
          </Grid>
          <Grid item xs={12}>
            <div className="padded-border-box">
              <BoxHeader textContent="Compare schedules"></BoxHeader>
              {schedulesDisplay}
            </div>
          </Grid>
        </Grid>
      </Container>  
    </div>
  );


}

export default App;