const amqp = require('amqplib');
require('dotenv').config()
const RABBITMQ_URL = process.env.RABBIT_URL;

let connection, channel;

async function connect() {
  try {
    console.log(process.env.RABBIT_URL)
    connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();
    console.log('Connected to RabbitMQ');
  } catch (err) {
    // logger.error('RabbitMQ connection error:', err);
    console.log('RabbitMQ connection error:', err);
    // Optionally retry connection here or process.exit(1)
  }
}

async function subscribeToQueue(queueName, callback) {
    if (!channel) await connect();
    await channel.assertQueue(queueName);
    channel.consume(queueName, (message) => {
        callback(message.content.toString());
        channel.ack(message);
    });
}

async function publishToQueue(queueName, data) {
    if (!channel) await connect();
    await channel.assertQueue(queueName);
    channel.sendToQueue(queueName, Buffer.from(data));
}

module.exports = {
    subscribeToQueue,
    publishToQueue,
    connect,
};