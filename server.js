require('dotenv').config()
const express = require('express')
const appError = require('./utils/appError')
const globalError = require('./middleware/errorMiddleware')
const mainRoutes = require('./Routes/index')
const cors = require('cors')
const limiter = require('./middleware/rateLimit');

const app = express()
const PORT = process.env.PORT || 3000


app.use(express.json())

app.use(cors())

app.use('/api', limiter, mainRoutes)


app.all("*", (req, res, next) => {
    next(new appError(`Can't find this route ${req.originalUrl}`, 400));
  });
  
  // Global Error Handling Middleware For Express
  app.use(globalError);

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})


// Handle Unhandled Promise Rejections Globally
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  server.close(() => {
    process.exit(1);
  });
});
