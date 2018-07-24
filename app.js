const server = require('./server.js');
const config = require('./config.json');

server.listen(config.port, err => {
    console.log('Started server on port ' + config.port);
});