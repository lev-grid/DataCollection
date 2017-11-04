var http = require('http');
var fs = require('fs');
var path = require('path');

http.createServer(function (request, response) {
    console.log('request:  ' + request.url);

    var filePath = '.' + request.url;
    if (filePath == './')
        filePath = './index.html';

    var extname = path.extname(filePath);
    var contentType = 'text/html';
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;      
        case '.jpg':
            contentType = 'image/jpg';
            break;
        case '.wav':
            contentType = 'audio/wav';
            break;
        case '.pdf':
            contentType = 'application/pdf';
            break;
        case '.doc':
            contentType = 'application/msword';
            break;
        case '.docx':
            contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
            break;
    }

    fs.readFile(filePath, function(error, content) {
        if (error) {
            if(error.code == 'ENOENT') {
                response.writeHead(404);
                response.end('<h1>404 Not Found</h1>');
            } else {
                response.writeHead(500);
                response.end('Server error: '+error.code+' ..\n');
            }
        } else {
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content, 'utf-8');
        }
    });

}).listen(80);
console.log('Server running at http://127.0.0.1:80/');