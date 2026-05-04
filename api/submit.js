const multer = require('multer');

// Initialize multer to parse multipart/form-data
const upload = multer();

// Helper method to wait for middleware to execute
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

module.exports = async function (req, res) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    // Run multer to parse the FormData fields into req.body
    await runMiddleware(req, res, upload.none());

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
        res.status(200).json({ success: true, message: 'Form submitted successfully', data });
    } else {
        res.status(response.status).json({ success: false, message: data.message || 'Error submitting form' });
    }
  } catch (error) {
    console.error('Error in form submission proxy:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
