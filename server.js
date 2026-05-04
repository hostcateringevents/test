require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend static files
app.use(express.static(__dirname));

// Setup multer to parse multipart/form-data
// The frontend uses FormData, which sends requests as multipart/form-data
const upload = multer();

app.post('/api/submit', upload.none(), async (req, res) => {
    try {
        const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
        if (!accessKey) {
            return res.status(500).json({ success: false, message: 'Server configuration error' });
        }

        // Web3Forms accepts a JSON payload with the form data + access_key
        const payload = {
            ...req.body,
            access_key: accessKey
        };

        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        
        if (response.status === 200) {
            res.json({ success: true, message: 'Form submitted successfully', data });
        } else {
            res.status(response.status).json({ success: false, message: data.message || 'Error submitting form' });
        }
    } catch (error) {
        console.error('Error in form submission proxy:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
