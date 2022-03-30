import {
  Grid
} from "@mui/material";

export default function StartTimeSelector(props) {
  const {
    preferredStartTime,
    onChange
  } = props;

  const options = [
    <option key="NONE" value="">--- No preferred start time ---</option>,
    <option key="EARLY" value="EARLY">Earlier start times</option>,
    <option key="LATE" value="LATE">Later start times</option>
  ];

  return (
    <Grid container spacing={1}>
      <Grid item xs={4} style={{textAlign: "right"}}>Preferred start time:</Grid>
      <Grid item xs={8}>
        <select
          value={preferredStartTime}
          onChange={onChange}
          id="startTimeSelector"
          style={{width: "100%"}}
        >
          {options}
        </select>
      </Grid>
    </Grid>
  );

}