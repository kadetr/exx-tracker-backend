"use strict";
/** source/server.ts */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const http_1 = __importDefault(require("http"));
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
const mongoose = require("mongoose");
dotenv_1.default.config();
// import connectDB from "./config/db";
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const exerciseRoutes_1 = __importDefault(require("./routes/exerciseRoutes"));
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const conn = yield mongoose.connect((_a = process.env.MONGO_URI) !== null && _a !== void 0 ? _a : "");
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
    catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
});
const por = process.env.PORT || 6060;
exports.config = {
    server: {
        port: por
    }
};
connectDB();
const exxApp = (0, express_1.default)();
/** Logging */
if (process.env.NODE_ENV === 'development')
    exxApp.use((0, morgan_1.default)('dev'));
/** Parse the request */
exxApp.use(express_1.default.urlencoded({ extended: false }));
/** Takes care of JSON data */
exxApp.use(express_1.default.json());
exxApp.use("/api/users", userRoutes_1.default);
exxApp.use("/api/exercises", exerciseRoutes_1.default);
/** RULES OF API */
exxApp.use((req, res, next) => {
    // set the CORS policy
    res.header('Access-Control-Allow-Origin', '*');
    // set the CORS headers
    res.header('Access-Control-Allow-Headers', 'origin, X-Requested-With,Content-Type,Accept, Authorization');
    // set the CORS method headers
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET PUT DELETE POST');
        return res.status(200).json({});
    }
    next();
});
if (process.env.NODE_ENV === 'production') {
    exxApp.use(express_1.default.static(path_1.default.join(__dirname, '/frontend/build')));
    exxApp.get('*', (req, res) => res.sendFile(path_1.default.resolve(__dirname, 'frontend', 'build', 'index.html')));
}
else {
    exxApp.get('/', (req, res) => {
        res.send('API is running....');
    });
}
/** Error handling */
exxApp.use((req, res, next) => {
    const error = new Error('not found');
    return res.status(404).json({
        message: error.message
    });
});
/** Server */
const httpServer = http_1.default.createServer(exxApp);
//const PORT = process.env.PORT;
httpServer.listen(exports.config.server.port, () => console.log(`The server is running on port ${exports.config.server.port}`));
