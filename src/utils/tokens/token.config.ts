export const TOKEN_CONFIG = {
  accessSecret: process.env.ACCESS_SECRET || 'access_jwt_secret',
  accessExpiresIn: '15m',

  refreshLength: 64,
  refreshRounds: 10,
};
