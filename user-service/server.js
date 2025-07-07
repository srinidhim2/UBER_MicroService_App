const http = require('http');
const app = require('./app');
require('dotenv').config()
const server = http.createServer(app);

server.listen(process.env.PORT, () => {
  console.log(`User service is running on port ${process.env.PORT}`);
});
