import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import mongoose from 'mongoose'
import myUserRoutes from './routes/myUserRoutes'

const app = express()
app.use(cors())
app.use(express.json());

const url = process.env.MONGODB_CONNECTION_STRING

mongoose.connect(`${url}`).then(() => {
    console.log("connected to database");
})

app.get('/health', (req, res) => {
    res.status(200).json({message:'Health OK'})
})


app.use('/api/my/user/', myUserRoutes);

app.listen(7000, () => {
    console.log('Server is running on port 7000')
})