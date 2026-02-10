const startTime = Date.now();
import express from "express";
import { connectDB } from "./config/db.js";
import cors from "cors";
import path from 'path';
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import http from "http";

import fs from 'fs/promises';

dotenv.config({ silent: process.env.NODE_ENV === "production" });

import { errorhandler } from "./middlewares/errorMiddleware.js";

import { socketInit } from "./controllers/socketController.js";

import roleRoutes from "./routes/rolesRoutes.js";
import accessRoutes from "./routes/accessRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import industryRoutes from "./routes/industryRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import appsettings from "./routes/appSettingsRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import airCraftRoutes from "./routes/airCraftRoutes.js";
import locationRoutes from "./routes/locationRoutes.js";
import pilotProfileRoutes from "./routes/pilotProfileRoutes.js";
import employmentHistoryRoutes from "./routes/employmentHistoryRoutes.js";
import aircraftExperienceRoutes from "./routes/aircraftExperienceRoutes.js";
import flightlogBookRoutes from "./routes/flightlogBookRoutes.js";
import jobApplicationRoutes from "./routes/jobApplicationRoutes.js";
import saveJobsRoutes from "./routes/saveJobsRoutes.js";
import licenseRoutes from "./routes/licenseRoutes.js";
import jobtypeRoutes from "./routes/jobTypeRoutes.js";
import typeRatingRoutes from "./routes/typeRatingRoutes.js";
import chatRouter from "./routes/chatRoutes.js";
import planRoutes from "./routes/planRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import saveSearchRoutes from "./routes/saveSearchRoutes.js";
import contractRoutes from "./routes/contractRoutes.js";
import subscriptionroutes from './routes/subscriptionRoutes.js';
import savePilotsRoutes from "./routes/savePilotsRoutes.js";
import creatorRoutes from "./routes/creatorRoutes.js";
import consultantRoutes from "./routes/consultantRoutes.js";
import saveJobApplicationRoutes from "./routes/savedJobApplicationRoutes.js";
import cronRoutes from "./routes/cronRoutes.js";
import postRoutes from './routes/postRoutes.js';
import interviewScheduleRouter from "./routes/interviewScheduleRoutes.js";
import fcmTokenRouter from "./routes/fcmTokenRoutes.js";
import dashBoardRoutes from "./routes/dashBoardRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";
import mediaRoutes from "./routes/mediaRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";


const port = process.env.PORT || 4000;

const __filename = fileURLToPath(
  import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, '/uploads')

const app = express();
const corsOpts = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      "https://flyhire.thetechgroove.com",
      "http://localhost:4200",
      "http://localhost:8100",
      "https://dashboard.flyhire.app",
      "http://localhost:8101",
      "https://localhost",
      "capacitor://localhost"
    ];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('Blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.options('*', cors(corsOpts)); 
app.use(cors(corsOpts)); 

// const logFilePath = path.join(__dirname, 'file.txt');

// app.use(async (req, res, next) => {
//   const logMessage = `Incoming Origin: ${req.headers.origin || 'N/A'}\nRequest Method: ${req.method}\nTime: ${new Date().toISOString()}\n\n`;
//   try {
//     await fs.appendFile(logFilePath, logMessage); // Append log to file
//   } catch (err) {
//     console.error('Failed to write log:', err);
//   }

//   next();
// });

const server = http.createServer(app);

app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));
app.use("/uploads", express.static(filePath))

app.use("/", accessRoutes);
app.use("/appsettings", appsettings);
app.use("/role", roleRoutes);
app.use("/company", companyRoutes);
app.use("/industry", industryRoutes);
app.use("/user", userRoutes);
app.use("/job", jobRoutes);
app.use("/saveJobs", saveJobsRoutes);
app.use("/aircraft", airCraftRoutes);
app.use("/location", locationRoutes);
app.use("/pilotprofile", pilotProfileRoutes);
app.use("/employmenthistory", employmentHistoryRoutes);
app.use("/aircraftexperience", aircraftExperienceRoutes);
app.use("/flightlogbook", flightlogBookRoutes);
app.use("/jobapplication", jobApplicationRoutes);
app.use("/license", licenseRoutes);
app.use("/jobtype", jobtypeRoutes);
app.use("/typerating", typeRatingRoutes);
app.use("/chat", chatRouter);
app.use("/plan", planRoutes);
app.use("/payment", paymentRoutes);
app.use("/savesearch", saveSearchRoutes);
app.use("/contract", contractRoutes);
app.use('/subscribe', subscriptionroutes);
app.use('/savepilots', savePilotsRoutes);
app.use('/creator', creatorRoutes);
app.use('/consultant', consultantRoutes);
app.use('/savejobapplication', saveJobApplicationRoutes);
app.use('/cron', cronRoutes);
app.use('/post', postRoutes);
app.use('/interview', interviewScheduleRouter);
app.use('/fcm', fcmTokenRouter);
app.use('/dashboard', dashBoardRoutes);
app.use('/comment', commentRoutes);
app.use('/video', videoRoutes);
app.use('/media', mediaRoutes);
app.use('/report', reportRoutes);


socketInit(server);
app.use(errorhandler);

server.listen(port, async () => {
  console.log("app took", Date.now() - startTime);
  await connectDB();
  console.log("server is listening on port", port);
});