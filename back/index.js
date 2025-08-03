const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const port = 3000;

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('<h1>my first backend<h1>');
});

app.post('/email', (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }
    const dbPath = path.join(__dirname, 'db', 'data.json');
    let data = {};
    try {
        if (fs.existsSync(dbPath)) {
            const file = fs.readFileSync(dbPath, 'utf8');
            data = file ? JSON.parse(file) : {};
        }
    } catch (err) {
        return res.status(500).json({ error: 'Failed to read database' });
    }
    if (!Array.isArray(data.emails)) {
        data.emails = [];
    }
    data.emails.push(email);
    try {
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
        res.json({ status: 'ok' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to save email' });
    }
});

app.listen(port, () => {
    console.log(`Running on port ${port}`)
})
//traitement des emails