const amqp = require('amqplib');

const RABBITMQ_URL = 'amqp://guest:guest@localhost:5672';
const QUEUE_NAME = 'textQueue';

async function consumeMessages() {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    await channel.assertQueue(QUEUE_NAME, { durable: false });

    // Set prefetch count to 1 (only process one message at a time)
    channel.prefetch(1);

    console.log('🎧 Waiting for messages...');

    channel.consume(QUEUE_NAME, (msg) => {
      if (msg !== null) {
        const messageContent = msg.content.toString();
        console.log(`📩 Received message: "${messageContent}" - Processing...`);

        // Simulate processing time (5 seconds)
        setTimeout(() => {
          console.log(`✅ Processed message: "${messageContent}"`);
          channel.ack(msg); // Acknowledge message after processing
        }, 5000);
      }
    });
  } catch (error) {
    console.error('RabbitMQ Error:', error);
  }
}

consumeMessages();
