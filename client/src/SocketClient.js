import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setUpdatePost } from './redux/AllReducers/postSlice'
import { setUser } from './redux/AllReducers/userSlice'
import { createNotify, removeNotify } from './redux/AllReducers/notifySlice';
import audiobell from "./Images/Notification.mp3";
import { addMessage, addUser, deleteMessages } from './redux/AllReducers/messageSlice';
import { onlineUserAdded, onlineUserRemoved } from './redux/AllReducers/onlineSlice';
import { peerUser } from './redux/AllReducers/peerSlice';
import { callUser } from './redux/AllReducers/callSlice';
import { toast } from 'react-toastify';


const spawnNotification = (body, icon, url, title) => {
  let options = {
    body, icon
  }
  let n = new Notification(title, options)

  n.onclick = e => {
    e.preventDefault()
    window.open(url, '_blank')
  }
}

const SocketClient = () => {
  const user = useSelector((state) => state?.user)
  const socket = useSelector((state) => state?.socket?.socket)
  const notify = useSelector((state) => state?.notify)
  const online = useSelector((state) => state?.online)
  const dispatch = useDispatch()
  const audioRef = useRef()

  //join users
  useEffect(() => {
    if (user && socket) {
      socket.emit("joinUser", user);
      // console.log({user});
    }
  }, [socket, user])


  //likes
  useEffect(() => {
    if (user && socket) {
      socket.on('likeToClient', updatedPost => {
        dispatch(setUpdatePost(updatedPost))
      })
    }
    return () => {
      if (socket) {
        socket.off('likeToClient');
      }
    };
  }, [socket, user, dispatch])

  //unlike post
  useEffect(() => {
    if (user && socket) {
      socket.on('unLikeToClient', updatedPost => {
        dispatch(setUpdatePost(updatedPost))
      })
    }
    return () => {
      if (socket) {
        socket.off('unLikeToClient');
      }
    };
  }, [socket, user, dispatch])

  //create comment
  useEffect(() => {
    if (user && socket) {
      socket.on('createCommentToClient', updatedPost => {
        dispatch(setUpdatePost(updatedPost))
      })
    }
    return () => {
      if (socket) {
        socket.off('createCommentToClient');
      }
    };
  }, [socket, user, dispatch])

  //delete comment
  useEffect(() => {
    if (user && socket) {
      socket.on('deleteCommentToClient', updatedPost => {
        dispatch(setUpdatePost(updatedPost))
      })
    }
    return () => {
      if (socket) {
        socket.off('deleteCommentToClient');
      }
    };
  }, [socket, user, dispatch])

  //follow user
  useEffect(() => {
    if (user && socket) {
      socket.on('followToClient', newUser => {
        dispatch(setUser(newUser))
      })
    }
    return () => {
      if (socket) {
        socket.off('followToClient');
      }
    };
  }, [socket, user, dispatch])

  //unfollow user
  useEffect(() => {
    if (user && socket) {
      socket.on('unFollowToClient', newUser => {
        dispatch(setUser(newUser))
      })
    }
    return () => {
      if (socket) {
        socket.off('unFollowToClient');
      }
    };
  }, [socket, user, dispatch])

  //notification
  useEffect(() => {
    if (user && socket) {
      socket.on('createNotifyToClient', newUser => {
        dispatch(createNotify(newUser))

        if (notify.sound) audioRef.current.play()
        spawnNotification(
          newUser.user.username + ' ' + newUser.text,
          newUser.user.profilePicture,
          newUser.url,
          'MEETAFY'
        )
      })
    }
    return () => {
      if (socket) {
        socket.off('createNotifyToClient');
      }
    };
  }, [socket, dispatch, notify.sound])

  useEffect(() => {
    if (user && socket) {
      socket.on('removeNotifyToClient', newUser => {
        dispatch(removeNotify(newUser))
      })
    }
    return () => {
      if (socket) {
        socket.off('removeNotifyToClient');
      }
    };
  }, [socket, dispatch])

  //Messages
  useEffect(() => {
    if (user && socket) {
      socket.on('addMessageToClient', msg => {
        dispatch(addMessage(msg));
        dispatch(addUser({...msg.user, text:msg.text, media:msg.media}))
      })
    }
    return () => {
      if (socket) {
        socket.off('addMessageToClient');
      }
    };
  },[socket, dispatch, user])

  useEffect(() => {
    if (user && socket) {
      socket.on('deletedMessageToClient', (msg) => {
        const {newData, id} = msg
        let _id = id;
        dispatch(deleteMessages({ newData, _id }));
      })
    }
    return () => {
      if (socket) {
        socket.off('deletedMessageToClient');
      }
    };
  },[socket, dispatch, user])

  //check User online/offine
  useEffect(() => {
    if (socket && user) {
      socket.emit('checkUserOnline', user);
    }
  }, [socket, user]);

  useEffect(() => {
    if (user && socket) {
      socket.on('checkUserOnlineToMe', data => {
        data.forEach(item => {
          if(!online.includes(item.id)){
            dispatch(onlineUserAdded(item.id))
          }
        })
      })
    }
    return () => {
      if (socket) {
        socket.off('checkUserOnlineToMe');
      }
    };
  },[socket, dispatch, user,online])

  useEffect(() => {
    if (user && socket) {
      socket.on('checkUserOnlineToMe', data => {
        data.forEach(item => {
          if(!online.includes(item.id)){
            dispatch(onlineUserAdded(item.id))
          }
        })
      })
    }
    return () => {
      if (socket) {
        socket.off('checkUserOnlineToMe');
      }
    };
  },[socket, dispatch, user,online])

  useEffect(() => {
    if (user && socket) {
      socket.on('checkUserOnlineToClient', id => {
        // console.log(id);
        dispatch(onlineUserAdded(id))
      })
    }
    return () => {
      if (socket) {
        socket.off('checkUserOnlineToClient');
      }
    };
  },[socket, dispatch, user,online])

  useEffect(() => {
    if (user && socket) {
      socket.on('CheckUserOffline', id => {
        // console.log(id);
        dispatch(onlineUserRemoved(id));
      })
    }
    return () => {
      if (socket) {
        socket.off('CheckUserOffline');
      }
    };
  },[socket, dispatch, user,online])


  //call
  useEffect(() => {
    if (user && socket) {
      socket.on('callUserToClient', data => {
        console.log("busy");
        console.log(data);
        dispatch(callUser(data))
      })
    }
    return () => {
      if (socket) {
        socket.off('callUserToClient');
      }
    };
  },[dispatch,socket])

  useEffect(() => {
    if (user && socket) {
      socket.on('userBusy', data => {
        console.log(data);
        toast.error(`${data.username} is busy now!`);
        // dispatch(callUser(data))
      })
    }
    return () => {
      if (socket) {
        socket.off('userBusy');
      }
    };
  },[dispatch,socket])

  return <>
    <audio controls ref={audioRef} style={{ display: 'none' }} >
      <source src={audiobell} type="audio/mp3" />
    </audio>
  </>
}

export default SocketClient
