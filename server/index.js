import express from 'express'
import bodyParser from 'body-parser'
import dotenv from "dotenv"
import route from './routes/userRoute.js'
import authRoute from './routes/authRoute.js'
import cookieParser from 'cookie-parser'
import "./crons/userCron.js" 

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());


//serve static files 
app.use("/uploads", express.static("uploads"));

app.use("/api", route);
app.use("/api/auth", authRoute);

const PORT = process.env.PORT || 7000;

app.listen(PORT, ()=>{
     console.log(`Server is running on port: ${PORT}`); 
    });

