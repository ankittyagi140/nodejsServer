// src/logger.ts
import winston from 'winston';
import path from 'path';
import fs from 'fs';


// Create logs directory if it doesn't exist
const logDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const { combine, timestamp, printf, json } = winston.format;

// Custom format for console output
const consoleFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
});

// Logger configuration
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info', // Set default log level
    format: combine(
        timestamp(),
        process.env.NODE_ENV === 'production' ? json() : consoleFormat
    ),
    transports: [
        // Log to console
        new winston.transports.Console(),
        // Log to a file
        new winston.transports.File({ filename: path.join(__dirname, 'logs', 'info.log'), level: 'info' }),
        new winston.transports.File({ filename: path.join(__dirname, 'logs', 'error.log'), level: 'error' }),
    ],
});

// Export the logger
export default logger;
