import { useState, useEffect } from "react";
import API from "../api/API";
import {Grid} from "@mui/material"
import Select from 'react-select';

const defaultOption = {
  label: '--- No course selected ---', 
  value: ''
};

export default function CourseSelector(props) {

  const {
    selectedQuarter,
    selectedSubject,
    selectedCourse,
    onChange,
    setLoadingState,
  } = props;
  
  const [courses, setCourses] = useState([]);

  const setCoursesOptions = (courses) => {
    let coursesOptions;
    coursesOptions = courses.map(course => {
      return {
        label: `${course.subject_code} ${course.number} - ${course.title}`,
        value: JSON.stringify(course)
      }
    });
    setCourses(coursesOptions);
  }

  // Set new courses whenever the current subject or quarter changes.
  useEffect(() => {
    // If there is no quarter selected or no subject selected,
    // set the list of avail. courses to empty
    setCourses([]);
    // Quarter, subject changed, need to get new courses
    if (selectedQuarter && selectedSubject) {
      setLoadingState(true, false, `Getting courses for ${selectedSubject} ${selectedQuarter}...`);
      API.getCourses(selectedQuarter, selectedSubject)
        .then(setCoursesOptions)
        .then(() => 
          setLoadingState(false, false, `Courses for ${selectedSubject} ${selectedQuarter} successfully retrieved.`)
        ).catch(err => setLoadingState(false, true, err.message));
    }
  }, [selectedQuarter, selectedSubject, setLoadingState]);


  let options;
  // No courses available
  if (courses.length === 0) {
    options = [defaultOption];
  } else {
    options = courses.concat([defaultOption]);
  }

  return (
    <Grid container spacing={1}>
      <Grid item xs={4} />
      <Grid item xs={8}>
        <Select options={options} placeholder='Select a course...' onChange={onChange}/>
      </Grid>
    </Grid>
  );


}