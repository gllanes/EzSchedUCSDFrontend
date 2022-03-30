import { useState, useEffect } from "react";
import API from "../api/API";
import logger from "../utils/logger";
import Select from 'react-select';

import { Grid } from "@mui/material"

const defaultOption = {
  label: '--- No subject selected ---',
  value: ''
}

export default function SubjectSelector(props) {
  /**
   * Where the user selects a subject to narrow down courses
   * On mount, retrieve all available subjects to select from.
   * Updated selected subject using handler in props
   */

  const {
    selectedSubject,
    onChange,
    setLoadingState
  } = props;

  const [subjects, setSubjects] = useState([]);


  const setSubjectsOptions = (subjects) => {
    const subjectsOptions = subjects.map(subject => {
      return {
        label: `${subject.code} - ${subject.name}`,
        value: subject.code,
      }
    });
    setSubjects(subjectsOptions);
  }


  // Need to get available quarters only once
  useEffect(() => {
    logger("Getting quarters...");
    setLoadingState(true, false, "Getting available subjects...");
    API.getSubjects()
      .then(setSubjectsOptions)
      .then(() => 
        setLoadingState(false, false, "Successfully retrieved subjects.")
      ).catch(err => setLoadingState(false, true, err.message));
  }, [setLoadingState]);

  let options;
  if (subjects.length === 0) {
    options = [defaultOption];
  } else {
    options = subjects.concat([defaultOption]);
  }

  return (
    <Grid container spacing={1}>
      <Grid item xs={4} />
      <Grid item xs={8}>
        <Select onChange={onChange} options={options} placeholder='Select a subject...'/>
      </Grid>
    </Grid>
  );
}