import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
// import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import FolderIcon from "@mui/icons-material/Folder";
import { Button, ButtonGroup } from "@mui/material";
import { useTheme } from "@emotion/react";
// import DeleteIcon from "@mui/icons-material/Delete";
// import { Button } from "@mui/material";

const Demo = styled("div")(({ theme }) => ({
  width: "100%",
}));

export default function Suggested() {
  const theme = useTheme();
  const backgroundColor = theme.palette.background.paper;
  console.log(backgroundColor);
  return (
    <Demo sx={{backgroundColor:backgroundColor,width:'28rem',marginTop:'1.3rem'}} >
      <Grid item >
        <Typography sx={{ p: 2 }} variant="h6" component="div">
          Avatar with text and icon
        </Typography>
        <Box>
          <List>
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <FolderIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary="Single-line item"
                secondary="Secondary text"
              />
              <ButtonGroup
                disableElevation
                variant="outlined"
              >
                <Button color="success" size="small">Accept</Button>
                <Button color="error" size="small">Reject</Button>
              </ButtonGroup>
            </ListItem>
          </List>
        </Box>
      </Grid>
    </Demo>
  );
}
