import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/users.js";
import roomRoutes from "./routes/rooms.js";
import requestRoutes from "./routes/requests.js"
import blockroutes from "./routes/blockroom.js"
const app = express();
dotenv.config();

app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
app.use(cors());

app.use('/user', userRoutes);
app.use('/rooms',roomRoutes);
app.use('/requests',requestRoutes)
app.use('/block',blockroutes)
app.get('/', (req, res) => {
    res.send("App Is Running");
});

const CONNECTION_URL = process.env.MONGO

const PORT = process.env.PORT;

mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true, }).then(() => app.listen(PORT, () => console.log(`Server running on port:${PORT}`)))
    .catch((error) => console.log(error.message));



export default app;