const express = require('express');
const path = require('path');
const cors = require('cors');  // Import the cors module
const app = express();
const PORT = 3000;

// Use CORS to allow requests from different origins
app.use(cors());

app.use(express.json());
app.use(express.static(__dirname));

// Helper functions and endpoints as before...

// Helper function to generate a random password
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

// Endpoint to generate a password
app.post('/generate-password', (req, res) => {
    const { length, useUppercase, useLowercase, useNumbers, useSymbols } = req.body;

    try {
        const password = generatePassword(length, useUppercase, useLowercase, useNumbers, useSymbols);
        res.json({ password });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Helper function to validate password strength
function validatePasswordStrength(password) {
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSymbols = /[!@#$%^&*()_+\-=\[\]{}|;:',.<>?]/.test(password);
    
    const lengthScore = password.length >= 12 ? 2 : (password.length >= 8 ? 1 : 0);
    const varietyScore = [hasUppercase, hasLowercase, hasNumbers, hasSymbols].filter(Boolean).length;

    if (lengthScore >= 1 && varietyScore >= 3) {
        return "Strong";
    } else if (lengthScore >= 1 && varietyScore >= 2) {
        return "Medium";
    } else {
        return "Weak";
    }
}

// Endpoint to validate password strength
app.post('/validate-password', (req, res) => {
    const { password } = req.body;

    if (!password || typeof password !== 'string') {
        return res.status(400).json({ error: "A valid password must be provided" });
    }

    const strength = validatePasswordStrength(password);
    res.json({ strength });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Password generation and validation microservice is running on http://localhost:${PORT}`);
});
