const express = require("express")
const app = express()

const rateLimit = new Map()

const WINDOW_SIZE = 60 * 1000
const MAX_REQUESTS = 5

app.use((req, res, next) => {
     const {ip} = req 
     const now = Date.now()

     if(!rateLimit.has(ip)) {
          rateLimit.set(ip, [])
     }

     const timestamps = rateLimit.get(ip)
     while(timestamps.length && timestamps[0] < now - WINDOW_SIZE) {
          timestamps.shift()
     }

     if(timestamps.length > MAX_REQUESTS) {
          return res.status(429).json({errMessge : "Too many request... Please try  again after 1 minutes", statusCode : 429})
     }
     timestamps.push(now)
     next()

})
app.get("/", (req, res) => {
    res.send("Hello World Welcome to the Node.js Rate Limiter")
})
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`)
})