/* eslint no-console: 0 */

import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import projectRouter from './routes/projectRoutes.js';
import toolRouter from './routes/toolRoutes.js';

const { createError } = express;

const app = express();
const port = 3000;

const mongoBD = 'mongodb://127.0.0.1/projects';
mongoose.connect(mongoBD);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB Connection Error'));

db.once('open', () => {
    console.log('MongoDB connection established');
});

// Default configs
app.use(morgan('dev'));
app.use(express.json());

// Routers
app.use('/project', projectRouter);
app.use('/tool', toolRouter);

// 404
app.use((req, res, next) => {
    next(createError(404));
});

// Error Handler
app.use((err, req, res) => {
    // TODO not sure if this is right, I must check
    res.status(err.status || 500).send();
});

// Listen
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
