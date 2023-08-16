import { Box, InputBase } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import Usercard from "../UserCard/UserCard";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../Axios/axiosInstance";
import {
  addUser,
  checkOnlineOffline,
  getConversations,
} from "../../redux/AllReducers/messageSlice";
import { useNavigate, useParams } from "react-router-dom";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

const LeftSide = () => {
  const { id } = useParams();
  const currentUser = useSelector((state) => state.user);
  const message = useSelector((state) => state.message);
  const online = useSelector((state) => state.online);
  const [search, setSearch] = useState("");
  const [searchUsers, setSearchUsers] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const pageEnd = useRef();
  const [page, setPage] = useState(0);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search) return setSearchUsers([]);
    axios
      .get(`/api/user/search?username=${search}`)
      .then(({ data }) => {
        setSearchUsers(data?.users);
      })
      .catch((err) => {
        console.log("err while search user in chat" + err);
      });
  };

  const handleAddUser = (user) => {
    setSearch("");
    setSearchUsers([]);
    const newData = { ...user, text: "", media: [] };
    dispatch(addUser(newData));
    dispatch(checkOnlineOffline(online))
    return navigate(`/chat/${user?._id}`);
  };

  // const isActive = (user) => {
  //   if (id === user._id) return true;
  //   return false;
  // };

  //active do here
  useEffect(() => {
    if(message.firstLoad){
      dispatch(checkOnlineOffline(online))
    }
  },[online, message.firstLoad, dispatch])

  //loading message
  useEffect(() => {
    if(message?.firstLoad) return;
    // if (!currentUser || message?.firstLoad) return;
    // let page = 1;
    axios
      .get("/api/conversations")
      .then(({ data }) => {
        let newArr = [];
        // console.log(data);
        data.conversations.forEach(item => {
          item.recipients.forEach(cv => {
            if (cv?._id !== currentUser._id) {
              newArr.push({ ...cv, text: item?.text, media: item?.media ,call:item?.call});
            }
          });
        });
        // console.log(newArr);
        const newData = {
          newArr,
          result: data.result,
        };
        // console.log(newData);
        dispatch(getConversations(newData));
      })
      .catch((err) => {
        console.log("error while fetching conversation" + err);
      });
  }, [message?.firstLoad, currentUser, dispatch]);

  //load more
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((p) => p + 1);
        }
      },
      {
        threshold: 0.1,
      }
    );

    observer.observe(pageEnd.current);
  }, [setPage]);

  useEffect(() => {
    if (message.resultUsers >= (page - 1) * 9 && page > 1) {
      axios
        .get(`/api/conversations?limit=${page * 9}`)
        .then(({ data }) => {
          let newArr = [];
          // console.log(data);
          data.conversations.forEach((item) => {
            item.recipients.forEach((cv) => {
              if (cv?._id !== currentUser._id) {
                newArr.push({ ...cv, text: item?.text, media: item?.media });
              }
            });
          });
          // console.log(newArr);
          const newData = {
            newArr,
            result: data.result,
          };
          // console.log(newData);
          dispatch(getConversations(newData));
        })
        .catch((err) => {
          console.log("error while fetching conversation" + err);
        });
    }
  }, [message.resultUsers, page, currentUser, dispatch]);

  return (
    <>
      <Box component="form" width="100%" p={1} onSubmit={handleSearch}>
        <InputBase
          placeholder="search user..."
          sx={{ color: "black", width: "90%", backgroundColor: "#babab9" }}
          value={search}
          onChange={(e) =>
            setSearch(e.target.value.toLowerCase().replace(/ /g, ""))
          }
        />

        <button type="submit" style={{ display: "none" }}>
          Search
        </button>
      </Box>
      <Box maxHeight={600} minHeight={600} overflow="auto">
        {searchUsers.length !== 0 ? (
          <>
            {searchUsers.map((user) => (
              <Box key={user?._id} onClick={() => handleAddUser(user)}>
                <Usercard user={user} />
              </Box>
            ))}
          </>
        ) : (
          <>
            {message?.users.map((user) => (
              <Box key={user?._id} onClick={() => handleAddUser(user)}>
                <Usercard user={user} msg={true}>
                  {user?.online ? (
                    <FiberManualRecordIcon
                      sx={{
                        color: "#44b700",
                        //aaa for offline
                        width: "10px",
                      }}
                    />
                  ) : (currentUser?.following?.find(item => item?._id === user?._id)) && (
                    <FiberManualRecordIcon
                      sx={{
                        color: "#aaa",
                        //aaa for offline
                        width: "10px",
                      }}
                    />
                  )}
                </Usercard>
              </Box>
            ))}
          </>
        )}
        <button ref={pageEnd} style={{ opacity: 0 }}>
          Load More
        </button>
      </Box>
    </>
  );
};

export default LeftSide;
