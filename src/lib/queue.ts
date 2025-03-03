import { Redis } from "ioredis";
import { Queue } from "bullmq";

export const redis = new Redis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: 5,
});

export const notificationQueue = new Queue("notification", {
  connection: {
    host: new URL(process.env.REDIS_URL!).hostname,
    port: Number(new URL(process.env.REDIS_URL!).port),
    password: new URL(process.env.REDIS_URL!).password,
    maxRetriesPerRequest: 5,
  },
  defaultJobOptions: {
    removeOnComplete: true, 
    removeOnFail: true, 
    attempts: 5,
    backoff: {
      type: 'exponential', 
      delay: 1000,  
    },
  },
});