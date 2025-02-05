const express = require("express");
const amqp = require("amqplib");

const app = express();
const PORT = 3000;
const RABBITMQ_URL = "amqp://guest:guest@localhost:5672";
const QUEUE_NAME = "textQueue";

async function sendToQueue(message) {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: false });

    channel.sendToQueue(QUEUE_NAME, Buffer.from(message));
    console.log(`Sent: "${message}" to RabbitMQ`);

    await channel.close();
    await connection.close();
  } catch (error) {
    console.error("RabbitMQ Error:", error);
  }
}

app.get("/api/printText", async (req, res) => {
  const message = req.query.message;
  if (!message) {
    return res
      .status(400)
      .json({ error: "Message query parameter is required" });
  }

  await sendToQueue(message);
  res.json({ status: "Message sent", message });
});

app.listen(PORT, () => {
  console.log(`🚀 Producer running at http://localhost:${PORT}`);
});
