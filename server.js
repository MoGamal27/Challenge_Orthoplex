require('dotenv').config()
const express = require('express')
const appError = require('./utils/appError')
const globalError = require('./middleware/errorMiddleware')
const mainRoutes = require('./Routes/index')

const app = express()
const PORT = process.env.PORT || 3000


app.use(express.json())

app.use('/api', mainRoutes)


app.all("*", (req, res, next) => {
    next(new appError(`Can't find this route ${req.originalUrl}`, 400));
  });
  
  // Global Error Handling Middleware For Express
  app.use(globalError);

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})

