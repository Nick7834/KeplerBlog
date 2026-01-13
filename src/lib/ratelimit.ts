import { Ratelimit } from "@upstash/ratelimit";
import { redisRest } from "./redisRest";

export const authRateLimit = new Ratelimit({
  redis: redisRest,
  limiter: Ratelimit.slidingWindow(5, "1 m"),
  analytics: true,
  prefix: "@ratelimit/auth",
});

export const postRateLimit = new Ratelimit({
  redis: redisRest,
  limiter: Ratelimit.slidingWindow(2, "1 m"),
  prefix: "ratelimit:posts",
});

export const codeRateLimit = new Ratelimit({
  redis: redisRest,
  limiter: Ratelimit.slidingWindow(1, "1 m"),
  prefix: "ratelimit:code",
});