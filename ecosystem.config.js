module.exports = {
  apps: [{
    name: 'gateway-api-v2',
    script: './gateway-api-expanded.js',
    env_file: '.env.local',
    env: {
      NODE_ENV: 'production',
    },
  }],
};
