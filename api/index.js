const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Root route
app.get('/', (req, res) => {
    res.send('Password Generation Microservice is running!');
});

// Password generation logic sofar 
function generatePassword(length, useUppercase, useLowercase, useNumbers, useSymbols) {
    const upperCaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowerCaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()_+[]{}|;:,.<>?';

    let characterPool = '';
    if (useUppercase) characterPool += upperCaseChars;
    if (useLowercase) characterPool += lowerCaseChars;
    if (useNumbers) characterPool += numberChars;
    if (useSymbols) characterPool += symbolChars;

    if (characterPool === '') {
        throw new Error('No character types selected');
    }

    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characterPool.length);
        password += characterPool[randomIndex];
    }

    return password;
}

// Endpoint: Generate Password
app.post('/generate-password', (req, res) => {
    const { length, useUppercase, useLowercase, useNumbers, useSymbols } = req.body;

    try {
        const password = generatePassword(length, useUppercase, useLowercase, useNumbers, useSymbols);
        res.json({ password });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Endpoint: Validate Password
app.post('/validate-password', (req, res) => {
    const password = req.body.password;

    if (!password || typeof password !== 'string') {
        return res.status(400).json({ error: 'A valid password must be provided' });
    }

    const strength = password.length >= 12 ? 'Strong' : password.length >= 8 ? 'Medium' : 'Weak';
    res.json({ strength });
});

// Export for serverless
module.exports = app;
module.exports.handler = serverless(app);
