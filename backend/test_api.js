const http = require('http');

const data = JSON.stringify({
    name: "API Test User",
    email: "apitest@algoverse.com",
    password: "password123"
});

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/users/signup',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, res => {
    let body = '';
    res.on('data', d => {
        body += d;
    });
    res.on('end', () => {
        console.log('Status Code:', res.statusCode);
        console.log('Response:', body);
    });
});

req.on('error', error => {
    console.error('Error:', error);
});

req.write(data);
req.end();
