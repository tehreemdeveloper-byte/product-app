// import mongoose from "mongoose";

// export const connectDB = async () => {
//     try {
//         //StrictQuery
//         const conn = await mongoose.connect(process.env.MONGO_URI);
//         console.log(`MongoDB Connected: ${conn.connection.host}`);
//     } catch (error) {
//         console.log(error);
//         process.exit(1);
//     }
// };



import mongoose from "mongoose";

const mongoOptions = {
  minPoolSize: 10,
  maxPoolSize: 100,
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 30000,
  maxIdleTimeMS: 60000,
  compressors: ["zlib"],
  retryWrites: true,
  w: "majority",
  readPreference: "primaryPreferred",
  autoIndex: process.env.NODE_ENV !== "production",
  bufferCommands: false,
};

let isConnected = false;
let connectionRetries = 0;
const MAX_RETRIES = 5;
const RETRY_DELAY = 5000;
export const connectDB = async () => {
  try {
    mongoose.set("strictQuery", false);
    if (isConnected && mongoose.connection.readyState === 1) {
      console.log("MongoDB already connected");
      return;
    }
    const conn = await mongoose.connect(process.env.MONGO_URI, mongoOptions);
    isConnected = true;
    connectionRetries = 0;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(
      `Connection Pool - Min: ${mongoOptions.minPoolSize}, Max: ${mongoOptions.maxPoolSize}`
    );
    mongoose.connection.on("connected", () => {
      console.log("Mongoose connected to MongoDB");
      isConnected = true;
    });
    mongoose.connection.on("error", (err) => {
      console.error("Mongoose connection error:", err);
      isConnected = false;
    });
    mongoose.connection.on("disconnected", () => {
      console.log("Mongoose disconnected from MongoDB");
      isConnected = false;
      if (connectionRetries < MAX_RETRIES) {
        connectionRetries++;
        console.log(
          `Attempting to reconnect... (${connectionRetries}/${MAX_RETRIES})`
        );
        setTimeout(() => connectDB(), RETRY_DELAY);
      } else {
        console.error(
          "Max reconnection attempts reached. Manual intervention required."
        );
      }
    });
  } catch (error) {
    console.error("MongoDB connection error:", error);
    isConnected = false;
    if (connectionRetries < MAX_RETRIES) {
      connectionRetries++;
      console.log(
        `Retrying connection in ${RETRY_DELAY / 1000
        } seconds... (${connectionRetries}/${MAX_RETRIES})`
      );
      setTimeout(() => connectDB(), RETRY_DELAY);
    } else {
      console.error("Failed to connect to MongoDB after maximum retries");
      process.exit(1);
    }
  }
};

export const disconnectDB = async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      console.log("MongoDB connection closed gracefully");
    }
  } catch (error) {
    console.error("Error closing MongoDB connection:", error);
  }
};

export const getConnectionStats = () => {
  const { readyState } = mongoose.connection;
  const states = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };
  return {
    status: states[readyState] || "unknown",
    isConnected,
    host: mongoose.connection.host || "not connected",
    name: mongoose.connection.name || "not connected",
    models: Object.keys(mongoose.models).length,
  };
};
