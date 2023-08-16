import React, { useEffect, useRef, useState } from "react";
import {
  Avatar,
  Box,
  IconButton,
  Modal,
  Typography,
  styled,
} from "@mui/material";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import CallEndIcon from "@mui/icons-material/CallEnd";
import VideocamIcon from "@mui/icons-material/Videocam";
import { useDispatch, useSelector } from "react-redux";
import { callUser } from "../../redux/AllReducers/callSlice";
import { toast } from "react-toastify";
import axios from "../../Axios/axiosInstance";
import { addMessage } from "../../redux/AllReducers/messageSlice";

const SytledModal = styled(Modal)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "auto",
  marginTop: "1.5rem",
});

const MainBox = styled(Box)(({ theme }) => ({
  minWidth: 100,
  minHeight: 200,
  width: "auto",
  height: "auto",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
}));

const CallModal = () => {
  const call = useSelector((state) => state.call);
  const currentUser = useSelector((state) => state.user);
  const socket = useSelector((state) => state?.socket?.socket);
  const peer = useSelector((state) => state?.peer?.peerUser);
  const [second, setSecond] = useState(0);
  const [mins, setMins] = useState(0);
  const [total, setTotal] = useState(0);
  const [hours, setHours] = useState(0);
  const [answer, setAnswer] = useState(false);
  const [tracks, setTracks] = useState(null);
  const dispatch = useDispatch();
  const youVideo = useRef();
  const otherVideo = useRef();

  //!check the timer
  //sert time
  useEffect(() => {
    const timer = setTimeout(() => {
      setTotal((prevTotal) => prevTotal + 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [total]);

  useEffect(() => {
    setSecond(total % 60);
    setMins(parseInt(total / 60));
    setHours(parseInt(total / 3600));
  }, [total]);

  const addCallMessage = (call, times) => {
    const msg ={
      sender: call.sender,
      recipient: call.recipient,
      text:"",
      media:[],
      call:{video:call.video, times},
      createdAt: new Date().toISOString()
    }
    axios
      .post("/api/message", msg)
      .then(({ data }) => {
        // console.log("Message sent successfully");
        // console.log(data);
        dispatch(addMessage(data.message));
        const {_id, profilePicture, fullname, username} = currentUser
        socket.emit("addMessage", {...data.message, user:{_id, profilePicture, fullname, username}});
      })
      .catch((err) => {
        console.log("err while messaging" + err);
      });
  }

  const handleEndCall = () => {
    tracks && tracks.forEach((track) => track.stop());
    let times = answer ? total : 0;
    socket.emit("endCall", { ...call, times });
    addCallMessage(call, times)
    dispatch(callUser(null));
  };

  useEffect(() => {
    if (answer) {
      setTotal(0);
    } else {
      const timer = setTimeout(() => {
        //remove if next line
        // tracks && tracks.forEach(track => track.stop())
        socket.emit("endCall", call);
        dispatch(callUser(null));
      }, 15000);
      return () => clearTimeout(timer);
    }
  }, [dispatch, answer, call, socket, tracks]);

  //end call
  useEffect(() => {
    if (currentUser && socket) {
      socket.on("endCallToClient", (data) => {
        console.log(data);
        tracks && tracks.forEach((track) => track.stop());
        dispatch(callUser(null));
      });
    }
    return () => {
      if (socket) {
        socket.off("endCallToClient");
      }
    };
  }, [dispatch, socket, tracks]);

  //stream media
  const openStream = (video) => {
    const config = { audio: true, video };
    return navigator.mediaDevices.getUserMedia(config);
  };

  const playStream = (tag, stream) => {
    let video = tag;
    video.srcObject = stream;
    // video.play();

    // Add an event listener to wait for the 'canplaythrough' event
    video.addEventListener("canplaythrough", () => {
      video
        .play()
        .then(() => {})
        .catch((error) => {
          console.error("Error playing video:", error);
        });
    });
  };

  //answer call
  const handleAnswer = () => {
    openStream(call.video).then((stream) => {
      playStream(youVideo.current, stream);
      const track = stream.getTracks();
      setTracks(track);
      const newCall = peer.call(call.peerId, stream);
      newCall.on("stream", function (remoteStream) {
        playStream(otherVideo.current, remoteStream);
      });
      setAnswer(true);
    });
  };

  useEffect(() => {
    peer.on("call", (newCall) => {
      openStream(call.video).then((stream) => {
        if (youVideo.current) {
          playStream(youVideo.current, stream);
        }
        const track = stream.getTracks();
        setTracks(track);
        newCall.answer(stream);
        newCall.on("stream", function (remoteStream) {
          if (otherVideo.current) {
            playStream(otherVideo.current, remoteStream);
          }
          setAnswer(true);
        });
      });
    });
    return () => peer.removeListener("call");
  }, [peer, call.video]);

  // Create a named function for the callback
  // const handleIncomingCall = (newCall) => {
  //   openStream(call.video).then((stream) => {
  //     if (youVideo.current) {
  //       playStream(youVideo.current, stream);
  //     }
  //     const track = stream.getTracks();
  //     setTracks(track);
  //     newCall.answer(stream);
  //     newCall.on("stream", function (remoteStream) {
  //       if (otherVideo.current) {
  //         playStream(otherVideo.current, remoteStream);
  //       }
  //     });
  //   });
  // };

  // useEffect(() => {
  //   // Add the event listener with the named function callback
  //   peer.on("call", handleIncomingCall);

  //   return () => {
  //     // Remove the event listener with the same named function callback
  //     peer.removeListener("call", handleIncomingCall);
  //   };
  // }, [peer, call.video]);

  // Disconnect
  useEffect(() => {
    socket.on("callerDisconnect", () => {
      tracks && tracks.forEach((track) => track.stop());
      dispatch(callUser(null));
      toast.error("The user is disconnected...!");
    });

    return () => socket.off("callerDisconnect");
  }, [socket, tracks, dispatch]);

  return (
    <SytledModal
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      open={true}
    >
      <MainBox>
        <Box
          sx={{
            width: 300,
            height: 400,
            display: answer && call.video ? "none" : "block",
          }}
        >
          <Box
            width="100%"
            height="40%"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Avatar
              alt="call/logo"
              src={call?.profilePicture}
              sx={{ width: 80, height: 80 }}
            />
          </Box>
          <Box
            width="100%"
            height="30%"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <Typography variant="h6" fontWeight={600}>
              {call?.username}
            </Typography>
            <Typography>{call?.fullname}</Typography>
            <Typography variant="body2" display="block">
              {answer ? (
                <Box display="flex">
                  <Typography variant="overline" display="block">
                    {hours.toString().length < 2 ? "0" + hours : hours}
                  </Typography>
                  <Typography variant="overline" display="block">
                    :
                  </Typography>
                  <Typography variant="overline" display="block">
                    {mins.toString().length < 2 ? "0" + mins : mins}
                  </Typography>
                  <Typography variant="overline" display="block">
                    :
                  </Typography>
                  <Typography variant="overline" display="block">
                    {second.toString().length < 2 ? "0" + second : second}
                  </Typography>
                </Box>
              ) : (
                <>{call.video ? "calling video..." : "calling audio..."}</>
              )}
            </Typography>
            {!answer && (
              <Box display="flex">
                <Typography variant="overline" display="block">
                  {mins.toString().length < 2 ? "0" + mins : mins}
                </Typography>
                <Typography variant="overline" display="block">
                  :
                </Typography>
                <Typography variant="overline" display="block">
                  {second.toString().length < 2 ? "0" + second : second}
                </Typography>
              </Box>
            )}
          </Box>
          <Box
            width="100%"
            height="30%"
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
          >
            {call.recipient === currentUser._id && !answer && (
              <Box
                sx={{
                  borderRadius: "50%",
                  height: 50,
                  width: 50,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "white",
                  marginBottom: "10px",
                }}
              >
                {call.video ? (
                  <IconButton onClick={handleAnswer}>
                    <VideocamIcon color="success" />
                  </IconButton>
                ) : (
                  <IconButton onClick={handleAnswer}>
                    <LocalPhoneIcon color="success" />
                  </IconButton>
                )}
              </Box>
            )}
            <Box
              sx={{
                borderRadius: "50%",
                height: 50,
                width: 50,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IconButton onClick={handleEndCall}>
                <CallEndIcon color="error" />
              </IconButton>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            display: answer && call.video ? "block" : "none",
            // display="flex"
            alignItems: "center",
            justifyItems: "center",
            width: "100%",
          }}
        >
          <>
            <video
              ref={youVideo}
              style={{
                position: "absolute",
                display: "flex",
                width: 150,
                height: 150,
                alignItems: "flex-end",
                justifyContent: "flex-end",
                border: `1px solid crimson`,
              }}
            />
            <video ref={otherVideo} />
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box display="flex">
                <Typography variant="overline" display="block">
                  {hours.toString().length < 2 ? "0" + hours : hours}
                </Typography>
                <Typography variant="overline" display="block">
                  :
                </Typography>
                <Typography variant="overline" display="block">
                  {mins.toString().length < 2 ? "0" + mins : mins}
                </Typography>
                <Typography variant="overline" display="block">
                  :
                </Typography>
                <Typography variant="overline" display="block">
                  {second.toString().length < 2 ? "0" + second : second}
                </Typography>
              </Box>
              <Box>
                <IconButton onClick={handleEndCall}>
                  <CallEndIcon color="error" />
                </IconButton>
              </Box>
            </Box>
          </>
        </Box>
      </MainBox>
    </SytledModal>
  );
};

export default CallModal;
