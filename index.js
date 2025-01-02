const express = require('express');
const cors = require('cors'); // Import the cors module
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const port = 5000;

// Enable CORS
app.use(cors());
app.use(express.json()); // Parse JSON payloads

// Supabase setup
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Base route
app.get('/', (req, res) => {
    res.send('Welcome to the Backend API');
});

// List users endpoint
app.get('/api/users', async (req, res) => {
    try {
        const { data, error } = await supabase.auth.admin.listUsers();
        if (error) return res.status(400).json({ error });
        res.json({ users: data });
    } catch (err) {
        console.error('Unexpected error occurred:', err);
        res.status(500).json({ error: 'Unexpected error occurred' });
    }
});

// Route for debugging webhook payloads
app.post('/webhook', async (req, res) => {
    try {
        // Log the webhook data to the console for debugging
        console.log('Webhook received:', req.body);

        // Respond with the received webhook data
        res.status(200).json({
            message: 'Webhook data received successfully',
            data: req.body,
        });
    } catch (error) {
        console.error('Error handling webhook:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Import and use modularized routes
const clientRoutes = require('./routes/clients');
app.use('/api', clientRoutes); // Prefixed with /api for proper structure

// Start the server
app.listen(port, () => {
    console.log(`Backend running at http://localhost:${port}`);
});
