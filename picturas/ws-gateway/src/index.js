/* eslint no-console: 0 */

import {Server as SocketIo} from 'socket.io';
import {createServer} from 'node:http';
import amqp from 'amqplib';

const port = 3000;

const server = createServer();
const io = new SocketIo(server);
const userSessions = {};

const redisClient = createClient({
    url: `redis://${process.env.WS_REDIS_HOST}`,
    password: process.env.WS_REDIS_PASSWORD,
});

redisClient.connect().catch((err) => {
    console.error("Redis connection error:", err);
    process.exit(1);
});

io.adapter(createAdapter(redisClient));

io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
        return next(new Error("Authentication error"));
    }

    try {
        const payload = jwt.verify(token, process.env.AUTH_JWT_SECRET);
        socket.user = payload;
        next();
    } catch (err) {
        next(new Error("Invalid token"));
    }
});

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.user._id}`);

    socket.join(socket.user._id);

    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.user._id}`);
    });
});

(async () => {
    try {
        const connection = await amqp.connect(
        `amqp://${process.env.RABBITMQ_USERNAME}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`
        );
        const channel = await connection.createChannel();
        const queue = process.env.NOTIFICATION_QUEUE;

        await channel.assertQueue(queue, { durable: true });

        channel.consume(queue, (msg) => {
        if (msg !== null) {
            const content = JSON.parse(msg.content.toString());
            const { userId, projectId, message } = content;

            io.to(userId).emit("notification", { project: projectId, message });
            channel.ack(msg);
        }
        });

        console.log(`Listening to RabbitMQ queue: ${queue}`);
    } catch (err) {
        console.error("RabbitMQ connection error:", err);
        process.exit(1);
    }
})();

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
