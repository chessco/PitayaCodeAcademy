const http = require('http');

const data = JSON.stringify({
    email: 'admin@pitayacode.io',
    password: 'pitaya123'
});

const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/auth/login',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

console.log('--- TEST LOGIN HTTP START ---');
const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    res.on('data', (d) => {
        process.stdout.write(d);
        console.log('\n--- TEST LOGIN HTTP END ---');
    });
});

req.on('error', (error) => {
    console.error(error);
});

req.write(data);
req.end();
