require('dotenv').config()
import express from 'express'
import cors from 'cors'
import prisma from './src/prisma'  // use prisma as ORM

// Import all handlers from src, including middlewares (to be made soon)
// ...

const app = express()
const PORT = 8080
const startDate = new Date()

app.listen(PORT, () => {
    console.log(`⚡️[server]: Server started at http://localhost:${PORT}`);
    console.log(`⚡️[server]: using database url ${process.env.DATABASE_URL}`);
})

app.use(express.json())
app.use(cors())

app.get('/', (_, res) => {
    res.send(`Server has started since ${startDate}`)
})

// API Handling, including methods and JWT usage