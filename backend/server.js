import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import authRoutes from './routes/auth.route.js'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
const app = express()
app.use(cors())
app.use(bodyParser.json())
const PORT = 5000 || process.env.PORT
dotenv.config()

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI )
.then(() => {
    console.log('MongoDB Connected');
})
.catch((err) => {
    console.log(err);
});

app.get('/', (req, res) => {
  res.send('Hello from the backend!')
}
)
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
