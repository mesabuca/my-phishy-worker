const { Worker } = require('bull');
const Queue = require('bull');
const QueueScheduler = require('bull');



// Redis konfigürasyonunu al
const redisConfig = require('./config/redisConf.json')[process.env.NODE_ENV || 'development'];

const queue = new Queue('campaigns', { redis: redisConfig});
queue.process(async job => {
    const targets = job.data;
  
    for (const target of targets) {
      const { fullName, email } = target;
  
      console.log(`Simulation Test: ${fullName}`);
    }
  
    return Promise.resolve();
  });

// Worker'ın hatalarını dinle ve tekrar deneyin
queue.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed with error: ${err.message}`);
  // Hata durumuna göre tekrar deneme mantığı ekleyebilirsiniz.
});

// QueueScheduler, scheduled işleri kontrol eder
const scheduler = new QueueScheduler('campaigns', { redis: redisConfig});
scheduler.on('error', err => {
  console.error('Scheduler error:', err.message);
});

console.log('Worker is running...');

// Express ile sağlık kontrolü endpoint'i ekle
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3030;

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Health check server is running on port ${PORT}`);
});