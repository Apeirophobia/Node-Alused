const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http.createServer((req, res) => {
    // console.log("Päring saadetud"); 
    console.log(req.method, req.url);
    res.setHeader("Content-Type", "text/html");
    /*
    res.write('<!DOCTYPE html>');
    res.write('<html>');
    res.write('<head>');
    res.write('<title>Minu leht</title>');
    res.write('<link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png"></link>');
    res.write('</head>');
    res.write('<body>');
    res.write('<h1>Tere serverist</h1>');
    res.write('</body>');
    res.write('</html>');
    */

    let filePath = './views/index.html';
    
    if (req.url === '/') {
        filePath = './views/index.html';
    } else if (req.url === '/teenused') {
        filePath = './views/teenused.html';
    } else if (req.url === '/vana-leht') {
        res.statusCode = 301;
        res.setHeader('Location', '/');
        res.end();
    } else {
        filePath = './views/404.html';
    }   
    
    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.log(err);
            res.end();
            return;
        }
        
        res.write(data);
        res.end();
    });
});

server.listen(3000, () => {
    console.log("Server töötab pordil 3000");
});

