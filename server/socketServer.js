let users = [];

const EditData = (data, id, call) => {
  const newData = data.map(item =>
    item.id === id ? { ...item, call } : item
  )
  return newData;
}

const SocketServer = (socket) => {
  //connect - disconnect
  socket.on('joinUser', user => {
    const id = user?._id;
    // console.log(user);
    const existingUserIndex = users.findIndex(user => user?.socketId === socket?.id);

    if (existingUserIndex !== -1) {
      // Update the existing user's data
      users[existingUserIndex] = { id, socketId: socket?.id, followers: user?.followers };
    } else {
      // Add the new user to the users array
      users.push({ id, socketId: socket?.id, followers: user?.followers });
      // console.log({users});
    }
  })

  socket.on('disconnect', () => {
    const data = users.find(user => user?.socketId === socket?.id)
    // console.log("data");
    // console.log(data);
    if (data) {
      const clients = users.filter(user =>
        data?.followers?.find(item => item?._id === user?.id)
      )
      // console.log("clients");
      // console.log(clients);
      if (clients.length > 0) {
        clients.forEach(client => {
          socket.to(`${client.socketId}`).emit('CheckUserOffline', data?.id)
        })
      }

      if (data.call) {
        const callUser = users.find(user => user.id === data.call)
        if (callUser) {
          users = EditData(users, callUser.id, null)
          socket.to(`${callUser.socketId}`).emit('callerDisconnect')
        }
      }
    }
    users = users.filter(user => user?.socketId !== socket?.id)
  })

  //LikePost
  socket.on('likePost', updatedPost => {
    const ids = [...updatedPost?.user?.followers, updatedPost?.user?._id];
    const clients = users.filter(user => ids?.includes(user?.id))
    // console.log(clients);
    if (clients?.length > 0) {
      clients.forEach(client => {
        socket.to(`${client.socketId}`).emit('likeToClient', updatedPost)
      })
    }
  })

  //unLike post
  socket.on('unLikePost', updatedPost => {
    const ids = [...updatedPost?.user?.followers, updatedPost?.user?._id];
    const clients = users.filter(user => ids?.includes(user?.id))
    // console.log(clients);
    if (clients?.length > 0) {
      clients.forEach(client => {
        socket.to(`${client.socketId}`).emit('unLikeToClient', updatedPost)
      })
    }
  })

  //createComment
  socket.on('createComment', updatedPost => {
    const ids = [...updatedPost?.user?.followers, updatedPost?.user?._id];
    const clients = users.filter(user => ids?.includes(user?.id))
    // console.log(clients);
    if (clients?.length > 0) {
      clients.forEach(client => {
        socket.to(`${client.socketId}`).emit('createCommentToClient', updatedPost)
      })
    }
  })

  //delete Comment
  socket.on('deleteComment', updatedPost => {
    const ids = [...updatedPost?.user?.followers, updatedPost?.user?._id];
    const clients = users.filter(user => ids?.includes(user?.id))
    // console.log(clients);
    if (clients?.length > 0) {
      clients.forEach(client => {
        socket.to(`${client.socketId}`).emit('deleteCommentToClient', updatedPost)
      })
    }
  })

  //follow user
  socket.on('follow', newUser => {
    const user = users?.find(user => user?.id === newUser?._id)
    user && socket.to(`${user.socketId}`).emit('followToClient', newUser)
  })

  //unfollow user
  socket.on('unFollow', newUser => {
    const user = users?.find(user => user?.id === newUser?._id)
    user && socket.to(`${user.socketId}`).emit('unFollowToClient', newUser)
  })

  //notification 
  socket.on('createNotify', msg => {
    const client = users.find(user => msg?.recipients?.includes(user?.id))
    client && socket.to(`${client.socketId}`).emit('createNotifyToClient', msg)
  })

  socket.on('removeNotify', msg => {
    const client = users.find(user => msg?.recipients?.includes(user?.id))
    client && socket.to(`${client.socketId}`).emit('removeNotifyToClient', msg)
  })

  //Message
  socket.on('addMessage', msg => {
    // console.log(msg);
    const user = users.find(user => user?.id === msg.recipient)
    user && socket.to(`${user.socketId}`).emit('addMessageToClient', msg)
  })

  socket.on('deletedMessage', msg => {
    const { newData, _id } = msg
    const user = users.find(user => user?.id === _id)
    user && socket.to(`${user.socketId}`).emit('deletedMessageToClient', msg)
  })

  //online offline
  socket.on('checkUserOnline', data => {
    const following = users.filter(user =>
      data.following.find(item => item._id === user.id)
    )
    socket.emit('checkUserOnlineToMe', following)
    const clients = users.filter(user =>
      data.followers.find(item => item._id === user.id)
    )
    // console.log(clients);
    if (clients.length > 0) {
      clients.forEach(client => {
        socket.to(`${client.socketId}`).emit('checkUserOnlineToClient', data._id)
      })
    }
  })

  //call
  socket.on('callUser', data => {
    // console.log({oldusers:users});
    // console.log("sender"+data.sender);
    // console.log("recipient"+data.recipient);
    users = EditData(users, data.sender, data.recipient);
    const client = users.find(user => user.id === data.recipient)
    // console.log(client);
    if (client) {
      if (client.call) {
        // console.log("busy");
        users = EditData(users, data.sender, null)
        socket.emit('userBusy', data)
      } else {
        // console.log("calling");
        users = EditData(users, data.recipient, data.sender);
        // console.log(client.socketId);
        socket.to(`${client.socketId}`).emit('callUserToClient', data)
      }
    }

    // console.log({newUsers:users});
  })

  //end call
  socket.on('endCall', data => {
    // console.log(data);
    const client = users.find(user => user.id === data.sender)

    if (client) {
      socket.to(`${client.socketId}`).emit('endCallToClient', data);

      if (client.call) {
        const clientCall = users.find(user => user.id === client.call)
        clientCall && socket.to(`${clientCall.socketId}`).emit('endCallToClient', data)
      }
    }

    users = EditData(users, data.sender, null)
    users = EditData(users, data.recipient, null)

    // console.log({new: users});
  })

}

module.exports = SocketServer;