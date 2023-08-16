import React from "react";
import {
  Box,
  CircularProgress,
  IconButton,
  Typography,
  styled,
} from "@mui/material";
import Usercard from "../UserCard/UserCard";
import RefreshIcon from "@mui/icons-material/Refresh";
import FollowButton from "../FollowButton/FollowButton";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../Axios/axiosInstance";
import { setLoading, setUsers } from "../../redux/AllReducers/suggestionSlice";

const RightBox = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shape.shadow,
  width: "90%",
  marginTop: "5%",
  height: "auto",
}));

const RightSidePanel = () => {
  const user = useSelector((state) => state.user);
  const suggestions = useSelector((state) => state.suggestions);
  const dispatch = useDispatch();

  const handleRefresh = () => {
    dispatch(setLoading(true));
    axios
      .get(`/api/suggestionsUser`)
      .then(({ data }) => {
        console.log(data);
        dispatch(setUsers(data));
        dispatch(setLoading(false));
      })
      .catch((err) => {
        console.log(err);
        dispatch(setLoading(false));
      });
  };

  return (
    <RightBox>
      <Usercard user={user} />
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        px={3}
      >
        <Typography variant="body1" component="h3" sx={{ mt: "2%" }}>
          Suggestions for you..
        </Typography>
        {!suggestions?.loading && (
          <IconButton aria-label="delete" onClick={handleRefresh}>
            <RefreshIcon />
          </IconButton>
        )}
      </Box>
      <Box
        display="flex"
        justifyContent="center"
        flexDirection="column"
        sx={{
          maxHeight: "300px",
          overflow: "auto",
        }}
      >
        {suggestions?.loading ? (
          <Box width="auto" height="100px" alignSelf="center">
            <CircularProgress />
          </Box>
        ) : (
          <>
            {suggestions?.users?.users?.map((user) => (
              <Usercard key={user?._id} user={user}>
                <FollowButton otherUser={user}/>
              </Usercard>
            ))}
          </>
        )}
      </Box>
    </RightBox>
  );
};

export default RightSidePanel;
