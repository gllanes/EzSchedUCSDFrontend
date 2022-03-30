import {
  Box
} from "@mui/material";



export default function makeBox(attrs, children) {
  return (
    <Box {...attrs}>{children}</Box>
  );
}