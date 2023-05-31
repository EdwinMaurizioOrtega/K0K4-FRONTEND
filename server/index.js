
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';

import postRoutes from './routes/posts.js';
import userRouter from "./routes/user.js";

const app = express();

app.use(express.json({ limit: '30mb', extended: true }))
app.use(express.urlencoded({ limit: '30mb', extended: true }))
app.use(cors());

app.use('/posts', postRoutes);
app.use("/user", userRouter);

app.get('/', (req, res) => {
    res.send('APP IS RUNNING.');
})

//local
//const CONNECTION_URL = 'mongodb://localhost:27017/memories';
//old
//const CONNECTION_URL = 'mongodb+srv://lidenar:MsNMrMrXBpiY7Nml@cluster0.mq3f7dd.mongodb.net/memories?retryWrites=true&w=majority';
//new
const CONNECTION_URL = 'mongodb+srv://doadmin:t5D3z1v9pG4J027d@db-mongodb-nyc1-59708-afda928b.mongo.ondigitalocean.com/memories?tls=true&authSource=admin&replicaSet=db-mongodb-nyc1-59708';
const PORT = process.env.PORT|| 3000;

mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log(`Server Running on Port: http://localhost:${PORT}`)))
  .catch((error) => console.log(`${error} did not connect`));

mongoose.set('useFindAndModify', false);