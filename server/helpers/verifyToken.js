const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; 
    // console.log("--"+token);
    if (!token) {
      return res.status(401).json({ message: 'Unouthorized to access' });
    }
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === 'JsonWebTokenError' && err.message === 'jwt malformed') {
          console.log('JWT Malformed Error');
          return res.status(403).json({ msg: 'Invalid token format' });
        }
        console.log(err);
        return res.status(401).json({ msg: 'UnAuthorized to access' });
      }
      const userId = decoded.id;
      req.userId = userId;
      // console.log("token id"+userId);
      // console.log(userId+'id');
      next();
    });
  } catch (error) {
    console.log("frgcyy"+error);
    return res.status(500).json({ msg: error.message })
  }

};

module.exports = verifyToken ;
