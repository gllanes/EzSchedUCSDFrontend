import {
  AppBar,
  Typography,
  Toolbar,
  IconButton
} from "@mui/material";


import {
  lightBlue
} from "@mui/material/colors";


import {
  GitHub
} from "@mui/icons-material"


export default function MyAppBar(props) {
  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{color: "yellow"}}>
            EzSchedUCSD
          </Typography>
          <IconButton href="https://github.com/gllanes/">
            <GitHub style={{ color: lightBlue[50] }}>
            </GitHub>
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  );
}