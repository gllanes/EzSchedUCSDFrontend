import { useState, useEffect } from "react";
import API from "../api/API";
import logger from "../utils/logger";
import Select from 'react-select';

import {
  Grid
} from "@mui/material"


const defaultOption = {
  label: '--- No quarter selected ---',
  value: '',
};


export default function QuarterSelector(props) {
  /**
   * Where the user selects a quarter for schedules.
   * On mount, retrieve all available quarters to select from.
   * Update selected subject using props handler.
   */

  const {
    selectedQuarter,
    onChange,
    setLoadingState
  } = props;

  const [quarters, setQuarters] = useState([]);

  const setQuartersOptions = (quarters) => {
    const quartersOptions = quarters.map(quarter => {
      return {
        label: `${quarter.code} - ${quarter.name}`,
        value: quarter.code,
      }
    });
    setQuarters(quartersOptions);
  }

  useEffect(() => {
    logger("Brand new quarter selector");
  }, []);

  // Need to get available quarters only once
  useEffect(() => {
    logger("getting quarters...");
    setLoadingState(true, false, "Getting available quarters...");
    API.getQuarters()
      .then(setQuartersOptions)
      .then(() => 
        setLoadingState(false, false, "Successfully retrieved quarters.")
      ).catch(err => setLoadingState(false, true, err.message));
  }, [setLoadingState]);


  let options;

  if (quarters.length === 0) {
    options = [defaultOption];
  } else {
    options = quarters.concat([defaultOption]);
  }

  return (
    <Grid container spacing={1}>
      <Grid item xs={4} />
      <Grid item xs={8}>
        <Select options={options} onChange={onChange} placeholder='Select a quarter...'/>
      </Grid> 
    </Grid>
  );
}