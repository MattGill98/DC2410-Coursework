const server = require('./server.js');

const port = process.env.PORT || 9000;

server.listen(port, err => {
    console.log('Started server on port ' + port);
});