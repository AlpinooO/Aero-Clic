const express = require('express');
const router = express.Router();
const axios = require('axios');
const { authenticateToken } = require('../middleware/auth.middleware');

const BUSINESS_API_URL = process.env.BUSINESS_API_URL || 'http://localhost:5001';

// Proxy middleware to forward requests to business API
const proxyRequest = async (req, res) => {
  try {
    const response = await axios({
      method: req.method,
      url: `${BUSINESS_API_URL}${req.originalUrl.replace('/api', '')}`,
      data: req.body,
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': req.user?.userId,
        'x-username': req.user?.username
      }
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Proxy error:', error.message);
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ error: 'Failed to connect to business API' });
    }
  }
};

// Protected routes - require authentication
router.use('/scores', authenticateToken);
router.use('/game', authenticateToken);

// Forward to business API
router.all('/scores*', proxyRequest);
router.all('/game*', proxyRequest);

module.exports = router;
