const dev = process.env.NODE_ENV !== 'production';

export const BASE_URL = dev
  ? 'http://localhost:3000'
  : 'https://your_deployment.server.com';
