const axios = require('axios');

async function testPort() {
    try {
        console.log('--- Logging In ---');
        const loginRes = await axios.post('http://127.0.0.1:3001/auth/login', {
            username: 'mail2deepeka@gmail.com',
            password: 'mail@123'
        });
        const token = loginRes.data.access_token;
        console.log('Logged in! Token received.');

        console.log('--- Creating Institution ---');
        const res = await axios.post('http://127.0.0.1:3001/master/institutions', {
            name: 'Test Institution',
            code: 'T001'
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log('Success!', res.data);
    } catch (err) {
        if (err.response) {
            console.error('Error Status:', err.response.status);
            console.error('Error Data:', err.response.data);
        } else {
            console.error('Error:', err.message);
        }
    }
}

testPort();
