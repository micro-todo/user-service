const appConfig = () => ({
  databaseUrl: process.env.DATABASE_URL ?? '',
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET ?? '',
  rmqUrl: process.env.RMQ_URL ?? '',
  rmqNotificationsQueue: process.env.RMQ_NOTIFICATIONS_QUEUE ?? '',
  rmqTasksQueue: process.env.RMQ_TASKS_QUEUE ?? '',
  tcpHost: process.env.TCP_HOST ?? '',
  tcpPort: parseInt(process.env.TCP_PORT ?? '0'),
});

export type AppConfig = typeof appConfig;

export default appConfig;
