module.exports = {
  apps: [
    {
      name: 'das-stok-akrab',
      script: 'server/index.js',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      }
    }
  ]
};
