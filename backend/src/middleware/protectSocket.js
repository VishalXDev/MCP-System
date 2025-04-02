// protectSocket.js

export const protectSocket = (socket, next) => {
    const token = socket.handshake.query.token;  // Assuming the token is sent as a query parameter
  
    if (!token) {
      console.log("Unauthorized connection attempt.");
      return next(new Error("Unauthorized"));
    }
  
    // Verify token (this example assumes JWT; you can modify based on your method of auth)
    try {
      const user = jwt.verify(token, process.env.JWT_SECRET);  // Assuming JWT and JWT_SECRET are set in .env
  
      // Attach user information to socket (optional)
      socket.user = user;
      next();
    } catch (error) {
      console.log("Invalid token.");
      return next(new Error("Unauthorized"));
    }
  };
  