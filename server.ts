/** source/server.ts */

import express, {Express} from "express";
import http from 'http';

import dotenv from "dotenv";
import morgan from 'morgan';
import mongoose from "mongoose";

dotenv.config();

// import connectDB from "./config/db";

import userRoutes from "./routes/userRoutes";
import exerciseRoutes from "./routes/exerciseRoutes";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI ?? "");
  
        console.log(`MongoDB Connected: ${conn.connection.host}`);
     } catch (error: any) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
     }
};

const por = process.env.PORT || 6060;

export const config = {
    server: {
        port: por
    }
};

connectDB();

const exxApp: Express = express();

/** Logging */
if (process.env.NODE_ENV === 'development') exxApp.use(morgan('dev'));
/** Parse the request */
exxApp.use(express.urlencoded({ extended: false }));
/** Takes care of JSON data */
exxApp.use(express.json());

exxApp.use("/api/users", userRoutes);
exxApp.use("/api/exercises", exerciseRoutes);

/** RULES OF API */
exxApp.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    // set the CORS policy
    res.header('Access-Control-Allow-Origin', '*');
    // set the CORS headers
    res.header('Access-Control-Allow-Headers', '*');
    // set the CORS method headers
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET, PUT, DELETE, POST');
        return res.status(200).json({});
    }
    next();
});

// if (process.env.NODE_ENV === 'production') {
//   exxApp.use(express.static(path.join(__dirname, '/frontend/build')))

//   exxApp.get('*', (req: express.Request, res: express.Response) =>
//     res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
//   )
// } else {
//   exxApp.get('/', (req: express.Request, res: express.Response) => {
//     res.send('API is running....')
//   })
// }

/** Error handling */
exxApp.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    const error = new Error('not found');
    return res.status(404).json({
        message: error.message
    });
});

/** Server */
const httpServer = http.createServer(exxApp);
//const PORT = process.env.PORT;
httpServer.listen(process.env.PORT, () => console.log(`The server is running on port ${config.server.port}`));