import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import UserNavbar from "../Components/UserNavbar/UserNavbar";
import LeftSidePanel from "../Components/LeftSidePanel/LeftSidePanel";
import { styled, useTheme } from "@mui/material";
import LeftSide from "../Components/Messages/LeftSide";
import RightSideChat from "../Components/Messages/RightSideChat";

const MainBox = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2), // Add vertical spacing
  boxShadow: theme.shape.shadow,
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
}));

const PersonalChat = () => {
  const theme = useTheme();
  const backgroundColor = theme.palette.background.paper;
  return (
    <Box>
      <UserNavbar />
      <Grid container>
        <Grid item bgcolor={backgroundColor} xs={2}>
          <LeftSidePanel />
        </Grid>
        <Grid item xs={10} display={"flex"} justifyContent={"center"}>
          <MainBox width="97%" display="flex" >
            <Box width="25%">
              <LeftSide />
            </Box>
            <Box
              width="75%"
              sx={{
                border: "2px solid #c7c7c7",
              }}
            >
              <RightSideChat />
            </Box>
          </MainBox>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PersonalChat;
