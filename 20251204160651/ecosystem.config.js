module.exports = {
  apps: [
    {
      name: 'iluck-server',
      script: 'server/app.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      log_file: './logs/server.log',
      out_file: './logs/server-out.log',
      error_file: './logs/server-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    },
    {
      name: 'iluck-admin',
      script: 'serve',
      cwd: './admin',
      args: '-s build -l 3001',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production'
      },
      log_file: './logs/admin.log',
      out_file: './logs/admin-out.log',
      error_file: './logs/admin-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    }
  ],
  
  deploy: {
    production: {
      user: 'deploy',
      host: ['your-server.com'],
      ref: 'origin/main',
      repo: 'git@github.com:your-username/iluck-annual-party-system.git',
      path: '/var/www/iluck-system',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    },
    
    staging: {
      user: 'deploy',
      host: ['staging-server.com'],
      ref: 'origin/develop',
      repo: 'git@github.com:your-username/iluck-annual-party-system.git',
      path: '/var/www/iluck-staging',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env staging'
    }
  }
};