const express = require('express');
const router = express.Router(); // Initialize the router
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Supabase initialization
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Add a new client or update an existing one
router.post('/webhook/client', async (req, res) => {
    try {
        const {
            first_name,
            last_name,
            email,
            phone,
            address1: homeAddress,
            city,
            state,
            postal_code,
            property_address: propertyAddress,
        } = req.body;

        console.log('Received payload:', req.body);

        // Check if the client already exists
        const { data: existingUsers, error: fetchError } = await supabase.auth.admin.listUsers();
        if (fetchError) {
            console.error('Error fetching users:', fetchError);
            return res.status(500).json({ error: 'Failed to fetch users' });
        }

        const user = existingUsers.users.find((u) => u.email === email);
        let userId;

        if (user) {
            console.log(`Updating client: ${email}`);
            const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
                user_metadata: { role: 'Client' },
            });
            if (updateError) {
                console.error('Error updating client:', updateError);
                return res.status(400).json({ error: 'Failed to update client' });
            }
            userId = user.id;
        } else {
            console.log(`Creating new client: ${email}`);
            const { data: newUser, error: authError } = await supabase.auth.admin.createUser({
                email,
                password: 'defaultpassword123', // Default password or token
                user_metadata: { role: 'Client' },
            });
            if (authError) {
                console.error('Error creating client:', authError);
                return res.status(400).json({ error: 'Failed to create client' });
            }
            userId = newUser.id;
        }

        // Insert client info into the 'clients' table
        const { error: clientError } = await supabase.from('clients').upsert({
            user_id: userId,
            first_name,
            last_name,
            email,
            phone,
            home_address: homeAddress,
            city,
            state,
            postal_code,
        });

        if (clientError) {
            console.error('Error upserting client:', clientError);
            return res.status(400).json({ error: 'Failed to upsert client' });
        }

        // Insert property info into the 'properties' table
        if (propertyAddress) {
            const { error: propertyError } = await supabase.from('properties').upsert({
                client_id: userId,
                address: propertyAddress,
            });

            if (propertyError) {
                console.error('Error upserting property:', propertyError);
                return res.status(400).json({ error: 'Failed to upsert property' });
            }
        }

        res.status(200).json({ message: `Client ${email} processed successfully` });
    } catch (error) {
        console.error('Unexpected error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
