require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const dataBase = require('./config/connection')
const session = require('express-session')
const passport = require('passport')
const SocketServer = require('./socketServer')
const { PeerServer } = require('peer')
const app = express()
app.use(express.json())
app.use(cors());
app.use(cookieParser())


require('./helpers/passportGoogle')
    
app.use(session({
    secret: 'YourSessionSecret', // Replace with your own session secret
    resave: false,
    saveUninitialized: false,
  }));

app.use(passport.initialize());
app.use(passport.session());

//socket server
// const http = require('http').createServer(app)
// const io = require('socket.io')(http)

const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST','PATCH','PUT','DELETE'],
  },
});


io.on('connection', socket => {
  SocketServer(socket);
  // console.log(socket.id + 'connected');
})

//creating peer server
PeerServer({ port:3001, path:'/'});


//routes
app.use('/api', require('./routes/auth.router'))
app.use('/api', require('./routes/user.router'))
app.use('/api', require('./routes/post.router'))
app.use('/api', require('./routes/comment.router'))
app.use('/api', require('./routes/notify.router'))
app.use('/api', require('./routes/message.router'))

dataBase.connection()
const port = process.env.PORT || 4000;
httpServer.listen(port,()=>{
    console.log(`server running on port:${port}`);
})