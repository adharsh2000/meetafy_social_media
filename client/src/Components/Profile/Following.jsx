import React from "react";
import { Box, Modal, Typography, styled } from "@mui/material";
import { useSelector } from "react-redux";
import Usercard from "../UserCard/UserCard";
import FollowButton from "../FollowButton/FollowButton";

const SytledModal = styled(Modal)({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",

  });
  
  const StyledContainer = styled(Box)(({ theme }) => ({
    width: "auto",
    position: "fixed",
    top: 0,
    left: "50%",
    transform: "translateX(-50%)",
    marginTop: "1.5rem",
    backgroundColor:theme.palette.background.paper,
    color:theme.palette.secondary.main,
    padding:'2rem',
    borderRadius:theme.shape.borderRadius,
  }));
  
  const StyledHeader = styled(Typography)({
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: "1rem",
  });
  
  const StyledContent = styled(Box)({
    width: "100%",
    height: "calc(80vh - 2rem)",
    overflow: "auto",
  });
  
  const Following = ({ users, showFollowing, setShowFollwing }) => {
    const user = useSelector((state) => state.user);
  
    return (
      <SytledModal
        open={showFollowing}
        onClose={() => setShowFollwing(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <StyledContainer>
          <StyledHeader variant="h5">Following</StyledHeader>
          <StyledContent>
          {users.length > 0 ? (
            users.map((otherUser) => (
              <Box width="21rem" key={otherUser._id} >
                <Usercard
                  key={otherUser._id}
                  user={otherUser}
                  setShowFollwing={setShowFollwing}
                >
                  {user._id !== otherUser._id && (
                    <FollowButton otherUser={otherUser} />
                  )}
                </Usercard>
              </Box>
            ))
          ) : (
            <Typography variant="body1" width="22rem" mb="">No followers</Typography>
          )}
        </StyledContent>
        </StyledContainer>
      </SytledModal>
    );
  };
  
  export default Following;
  