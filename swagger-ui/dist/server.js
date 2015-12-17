var connect = require('connect'),
    directory = '/path/to/Folder';

connect()
    .use(connect.static(directory))
    .listen(80);

A
console.log('Listening on port 80.');
