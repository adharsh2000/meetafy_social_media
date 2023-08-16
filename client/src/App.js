import React, { useCallback, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom'
import UserHome from './Pages/UserHome'
import Login from './Pages/Login';
import Register from './Pages/Register';
import ProtectedRoutes from './utils/ProtectedRoutes';
import PublicRoutes from './utils/PublicRoutes';
import EmailVerify from './Components/EmailVerify/EmailVerify';
import { Box, createTheme, ThemeProvider } from '@mui/material';
import { defaultTheme } from './themes/userTheme'
import { useDispatch, useSelector } from 'react-redux';
import axios from './Axios/axiosInstance';
import { setUser } from './redux/AllReducers/userSlice';
import { USER_TOKEN } from './Constants/Constants';
import { clearAuth, setAuth } from './redux/AllReducers/authReducer';
import Peer from "peerjs";
import { loadMorePosts } from './redux/AllReducers/postSlice';
import ProfilePage from "./Pages/ProfilePage"
import PostSingle from './Pages/PostSingle';
import Discover from './Pages/Discover';
import { setLoading, setUsers } from './redux/AllReducers/suggestionSlice';
import { socket } from './socket';
import { setSocket } from './redux/AllReducers/socketSlice';
import SocketClient from './SocketClient';
import { getNotifies } from './redux/AllReducers/notifySlice';
import AllChat from './Pages/AllChat';
import PersonalChat from './Pages/PersonalChat';
import CallModal from './Components/Messages/CallModal';
import PageLoader from './Components/PageLoader/PageLoader';
import { peerUser } from './redux/AllReducers/peerSlice';


function App() {
  const auth = useSelector((state) => state.auth)
  const user = useSelector((state) => state.user)
  const call = useSelector((state) => state?.call)
  const dispatch = useDispatch()
  const appearance = useSelector((state) => state.appearance)
  const theme = createTheme(defaultTheme(appearance))
  const backgroundColor = theme.palette.background.default
  const navigate = useNavigate()


  useEffect(() => {
    socket.connect();

    // Wait for the socket connection to be established
    socket.on("connect", () => {
      // Dispatch the setSocket action with the socket object
      dispatch(setSocket({ Socket: socket }));
    });

    // Clean up the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, [dispatch]);


  useEffect(() => {
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    }
    else if (Notification.permission === "granted") {}
    else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(function (permission) {
        if (permission === "granted") {}
      });
    }
  },[])


  const fetchData = useCallback(() => {
    axios
      .get('/api/user/userdetails')
      .then(({ data }) => {
        dispatch(setAuth());
        dispatch(setUser(data));
      })
      .catch((err) => {
        const { response } = err;
        if (response) {
          if (response.status === 500) {
            localStorage.removeItem(USER_TOKEN);
            dispatch(clearAuth());
            navigate('/login');
          }
          if (response.status === 401) {
            console.log('Unauthorized Access!');
            localStorage.removeItem(USER_TOKEN);
            dispatch(clearAuth());
            navigate('/login');
          }
        }
      });

    const limit = 9;
    dispatch(loadMorePosts(limit));
  }, [dispatch, navigate]);

  const fetchUser = useCallback(() => {
    dispatch(setLoading(true));
    axios.get(`/api/suggestionsUser`)
      .then(({ data }) => {
        // console.log(data);
        dispatch(setUsers(data))
        dispatch(setLoading(false));
      })
      .catch((err) => {
        console.log(err);
        dispatch(setLoading(false));
      })
  }, [dispatch])

  const fetchNotify = useCallback(async () => {
    await axios.get(`/api/notifies`,user)
    .then(({data}) => {
      // console.log(data);
      dispatch(getNotifies(data.notifies))
    })
    .catch((err) => {
      console.log("err from notify" + err);
    })
  },[])

  useEffect(() => {
    if (auth) {
      fetchData();
      fetchUser();
      fetchNotify();
    }
  }, [auth, fetchData, fetchUser, fetchNotify]);

  useEffect(() => {
    const newPeer = new Peer(undefined, {
      host: '/', port: '3001'
    })
    dispatch(peerUser(newPeer))
  },[dispatch])

  return (
    <ThemeProvider theme={theme}>
      <Box bgcolor={backgroundColor}>
        {auth && <SocketClient />}
        {call && <CallModal />}
        <PageLoader/>
        {/* <LoaderHOC> */}
        <Routes>
          <Route element={<ProtectedRoutes />}>
            <Route path='/' element={<UserHome />} />
            <Route path='/profile/:id' element={<ProfilePage />} />
            <Route path='/post/:id' element={<PostSingle />} />
            <Route path='/discover' element={<Discover />} />
            <Route path='/chats' element={<AllChat />} />
            <Route path='/chat/:id' element={<PersonalChat />} />
          </Route>
          <Route element={<PublicRoutes />}>
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/:id/verify' element={<EmailVerify />} />
          </Route>
        </Routes>
        {/* </LoaderHOC> */}
      </Box>
    </ThemeProvider>
  );
}

export default App;
