import {
  Grid
} from "@mui/material";

import React from "react";


function GridItemFullWrapper(Component) {
  return function (props) {
    return (
      <Grid item xs={12}>
        <Component {...props}/>
      </Grid>
    );
  }
}



export {
  GridItemFullWrapper
};