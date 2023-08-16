import {
  Avatar,
  Badge,
  Box,
  CircularProgress,
  IconButton,
  ImageList,
  ImageListItem,
  InputBase,
  Popper,
  Typography,
  styled,
} from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import { EmojiEmotions, Image } from "@mui/icons-material";
import { Picker } from "emoji-mart";
import MessageDisplay from "./MessageDisplay";
import SendIcon from "@mui/icons-material/Send";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { imageUpload } from "../../utils/imageUploads";
import {
  addMessage,
  deleteConversation,
  getMessages,
  updateMessages,
} from "../../redux/AllReducers/messageSlice";
import axios from "../../Axios/axiosInstance";
import PhoneIcon from '@mui/icons-material/Phone';
import VideocamIcon from '@mui/icons-material/Videocam';
import { callUser } from "../../redux/AllReducers/callSlice";

const InputBox = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: "0 10px",
  borderRadius: "50px",
  width: "100%",
  height: "2.6rem",
  display: "flex",
  alignItems: "center",
  border: "2px solid #c7c7c7",
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

const RightSideChat = () => {
  const { id } = useParams();
  const message = useSelector((state) => state.message);
  const currentUser = useSelector((state) => state.user);
  const socket = useSelector((state) => state?.socket?.socket);
  const peer = useSelector((state) => state?.peer?.peerUser);
  const [user, setUser] = useState([]);
  const [content, setContent] = useState("");
  const [media, setMedia] = useState([]);
  // const [imageError, setImageError] = useState("");
  const fileInputRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [loadMedia, setLoadMedia] = useState(false);
  const dispatch = useDispatch();

  const refDisplay = useRef();
  const pageEnd = useRef();

  const [data, setData] = useState([]);
  const [result, setResult] = useState(9);
  const [page, setPage] = useState(0);
  const [isLoadMore, setIsLoadMore] = useState(0);
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const ids = open ? "simple-popper" : undefined;

  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const addEmoji = (emoji) => {
    const updatedDescription = content + emoji.native;
    setContent(updatedDescription);
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  //getting mesges and more secure
  useEffect(() => {
    const newData = message?.data?.find((item) => item?._id === id);
    if (newData) {
      setData(newData?.messages);
      setResult(newData?.result);
      setPage(newData?.page);
    }
  }, [message.data, id]);

  //getting messages
  useEffect(() => {
    if (id) {
      const getMessagesData = async () => {
        if (message?.data?.every((item) => item?._id !== id)) {
          const curretPage = 1;
          await axios
            .get(`/api/message/${id}`)
            .then(({ data }) => {
              const newData = { ...data, messages: data.messages.reverse() };
              // console.log({...newData, _id:id, page:curretPage});
              dispatch(getMessages({ ...newData, _id: id, page: curretPage }));
              setTimeout(() => {
                refDisplay.current.scrollIntoView({
                  behavior: "smooth",
                  block: "end",
                });
              }, 50);
            })
            .catch((err) => {
              console.log("err while geting messages" + err);
            });
        }
      };
      getMessagesData();
    }
  }, [id, dispatch, message?.data]);

  //setting user
  useEffect(() => {
    if (id && message.users.length > 0) {
      setTimeout(() => {
        refDisplay.current.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }, 50);
      const newUser = message?.users?.find((user) => user?._id === id);
      if (newUser) {
        setUser(newUser);
        // setPage(1);
      }
    }
  }, [message.users, id]);

  //scroll to bottum
  const scrollToBottom = () => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  };

  useEffect(() => {
    // Call the scrollToBottom function whenever message.data or media changes
    scrollToBottom();
  }, [message?.data, media]);

  const handleChangeImages = (e) => {
    // console.log(e.target.files);
    const files = [...e.target.files];
    let err = "";
    let newMedia = [];

    files.forEach((file) => {
      if (!file) return (err = "File does not exist.");

      if (file.size > 1024 * 1024 * 5) {
        return (err = "The image/video largest is 5mb.");
      }

      return newMedia.push(file);
    });

    if (err) {
      // setImageError(err);
      return;
    }
    setMedia([...media, ...newMedia]);
  };

  const handleDeleteMedia = (index) => {
    const newArr = [...media];
    newArr.splice(index, 1);
    setMedia(newArr);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && media.length === 0) return;
    setContent("");
    setMedia([]);
    setLoadMedia(true);

    let newArr = [];
    if (media.length > 0) newArr = await imageUpload(media);

    const message = {
      sender: currentUser?._id,
      recipient: id,
      text: content,
      media: newArr,
      createdAt: new Date().toISOString(),
    };

    // dispatch(addMessage(message));
    setLoadMedia(false);
    // console.log(message);
    axios
      .post("/api/message", message)
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
  };

  //load more
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsLoadMore((p) => p + 1);
          // setPage(prevPage => prevPage + 1);
        }
      },
      {
        threshold: 0.1,
      }
    );

    observer.observe(pageEnd.current);

    // Clean up the observer when the component unmounts
    return () => {
      observer.disconnect();
    };
  }, [setIsLoadMore]);

  //load more function
  const loadMore = useCallback(
    (id, page) => {
      axios
        .get(`/api/message/${id}?limit=${page * 9}`)
        .then(({ data }) => {
          console.log("Load More Data:", data);
          const newData = { ...data, messages: data.messages.reverse() };
          dispatch(updateMessages({ ...newData, _id: id, page }));
        })
        .catch((err) => {
          alert(`Something went wrong! loading more messages${err}`);
        });
    },
    [dispatch]
  );

  //loadmore api
  //loadmore api
  useEffect(() => {
    if (isLoadMore > 1) {
      if (result >= page * 9) {
        // setPage(prevPage => prevPage + 1);

        // axios.get(`/api/message/${id}?limit=${page * 9}`)
        // .then(({data}) => {
        //   console.log("Load More Data:", data )
        //   const newData = {...data, messages:data.messages.reverse()}
        //   dispatch(updateMessages({...newData, _id:id, page}));
        // })
        // .catch((err) => {
        //   alert(`Something went wrong! loading more messages${err}`);
        // })
        loadMore(id, page + 1);
      }
      setIsLoadMore(1);
    }
  }, [isLoadMore, id, page, result, loadMore]);

  //scroll
  // useEffect(() => {
  //   if(refDisplay.current){
  //     refDisplay.current.scrollIntoView({behavior: 'smooth', block: 'end'})
  //   }
  // })

  //delete convrsation
  const handleDeleteConversation = () => {
    axios.delete(`/api/conversation/${id}`)
    .then(() => {
      console.log("deleted");
      dispatch(deleteConversation(id))
    })
    .catch((err) => {
      console.log("error while deletng conversation"+err);
    })
    navigate("/chats");
  }

  //caller
  const caller = ({video}) => {
    const { _id, profilePicture, username, fullname} = user;
    const msg ={
      sender: currentUser?._id,
      recipient: _id,
      profilePicture,
      username,
      fullname,
      video
    }
    dispatch(callUser(msg))
  }

  //calling user
  const callingUser = ({video}) => {
    const { _id, profilePicture, fullname, username } = currentUser;
    const msg ={
      sender: _id,
      recipient: user?._id,
      profilePicture,
      username,
      fullname,
      video
    }
    if(peer.open) msg.peerId = peer._id;
    socket.emit('callUser', msg);
  }

  //audio call
  const handleAudioCall = () => {
    caller({video:false})
    callingUser({video:false})
  }

  //video call
  const handleVideoCall = () => {
    caller({video:true})
    callingUser({video:true})
  }

  return (
    <>
      <Box
        p={1}
        display="flex"
        justifyContent="space-between"
        sx={{
          borderBottom: "2px solid #c7c7c7",
        }}
      >
        {user.length !== 0 && (
          <>
            <Box display="flex">
              <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                variant="dot"
              >
                <Avatar alt="profile/img" src={user?.profilePicture} />
              </StyledBadge>
              <Typography ml={1}>{user?.username}</Typography>
            </Box>
            <Box>
              <IconButton aria-label="delete" onClick={handleAudioCall}>
                <PhoneIcon color="success" />
              </IconButton>
              <IconButton aria-label="delete" onClick={handleVideoCall}>
                <VideocamIcon color="success" />
              </IconButton>
              <IconButton aria-label="delete" onClick={handleDeleteConversation}>
                <DeleteIcon color="error" />
              </IconButton>
            </Box>
          </>
        )}
      </Box>

      <Box
        minHeight={545}
        maxHeight={545}
        ref={chatContainerRef}
        // sx={{
        //   position: "relative",
        //   display: "flex",
        //   flexDirection: "column",
        //   overflowY: "auto",
        //   justifyContent: "flex-end",
        // }}
        sx={{
          width: "100%",
          height: `calc(100% - 110px)`,
          overflowY: "auto",
          padding: "0 10px",
          // scrollbarWidth: "none", // For Firefox
          // msOverflowStyle: "none", // For Internet Explorer and Edge
          // "&::-webkit-scrollbar": {
          //   width: "0.5em", // Set the width to 0.5em to hide the scrollbar
          // },
          // "&::-webkit-scrollbar-thumb": {
          //   backgroundColor: "transparent", // Set the thumb color to transparent to hide it
          // },
        }}
      >
        <Box
          // ref={chatContainerRef}
          sx={{
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            //justifyContent:'flex-end'
            // alignItems: "flex-end",
            paddingX: 2,
          }}
          ref={refDisplay}
        >
          <button style={{ opacity: 0 }} ref={pageEnd}>
            Load more
          </button>

          {data?.map((msg, index) => (
            <Box
              key={index}
              // display="flex"
              //       flexDirection="column"
              //     justifyContent="flex-start"
              // alignItems="start"
            >
              {msg.sender !== currentUser?._id && (
                <Box
                  py={1}
                  display="flex"
                  flexDirection="column"
                  alignSelf="start"
                  alignItems="flex-start"
                >
                  <MessageDisplay user={user} msg={msg} />
                </Box>
              )}
              {msg.sender === currentUser?._id && (
                <Box
                  // width={400}
                  p={1}
                  display="flex"
                  flexDirection="column"
                  justifyContent="flex-end"
                  alignItems="flex-end"
                  alignSelf="end"
                >
                  <MessageDisplay
                    user={currentUser}
                    msg={msg}
                    data={data}
                    isPurple
                  />
                </Box>
              )}
            </Box>
          ))}
          {loadMedia && (
            <Box display="flex" justifyContent="flex-end">
              <CircularProgress sx={{ margin: 3, left: 3 }} />
            </Box>
          )}
        </Box>
        {media?.length > 0 && (
          <ImageList
            sx={{
              width: "100%",
              maxHeight: 350,
              overflowX: "auto",
              display: "flex",
              position: "absolute",
              bottom: 17,
            }}
            rowHeight={100}
          >
            {media?.map((item, index) => (
              <ImageListItem key={index}>
                <IconButton
                  onClick={() => handleDeleteMedia(index)}
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    color: "red",
                  }}
                >
                  <HighlightOffIcon />
                </IconButton>
                <img
                  src={item?.url ? item?.url : URL.createObjectURL(item)}
                  alt={item.name}
                  loading="lazy"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                />
              </ImageListItem>
            ))}
          </ImageList>
        )}
      </Box>

      <form onSubmit={handleSubmit}>
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          {/* {children} */}
          <InputBox>
            <InputBase
              placeholder="Add your comments..."
              sx={{ color: "black", width: "100%" }}
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <EmojiEmotions
              color="primary"
              onClick={handleClick}
              aria-describedby={id}
              sx={{ cursor: "pointer" }}
            />
            <Popper
              id={ids}
              open={open}
              anchorEl={anchorEl}
              placement="right-end"
            >
              <Box sx={{ p: 1, bgcolor: "background.paper" }}>
                <Picker onSelect={addEmoji} />
              </Box>
            </Popper>
            <input
              type="file"
              ref={fileInputRef}
              style={{
                display: "none",
              }}
              multiple
              accept="image/*,video/*"
              name="file"
              onChange={handleChangeImages}
            />
            <Image
              color="secondary"
              onClick={handleButtonClick}
              sx={{ cursor: "pointer" }}
            />
            <IconButton
              disabled={content || media?.length > 0 ? false : true}
              onClick={handleSubmit}
            >
              <SendIcon fontSize={"small"} />
            </IconButton>
          </InputBox>
        </Box>
      </form>
    </>
  );
};

export default RightSideChat;
