require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const testUsers = [
    { email: 'testcompanyadmin@example.com', role: 'CompanyAdmin' },
    { email: 'testagent@example.com', role: 'Agent' },
    { email: 'testclient@example.com', role: 'Client' },
];

const updateRoles = async () => {
    try {
        // Fetch all users from Supabase
        const { data: users, error: fetchError } = await supabase.auth.admin.listUsers();
        if (fetchError) {
            console.error('Failed to fetch users:', fetchError.message);
            return;
        }

        // Iterate over testUsers and update their roles
        for (const testUser of testUsers) {
            const user = users.users.find((u) => u.email === testUser.email); // Match user by email
            if (user) {
                console.log(`Updating role for user: ${testUser.email} to ${testUser.role}`);
                const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
                    user_metadata: { role: testUser.role },
                });

                if (updateError) {
                    console.error(`Failed to update user ${testUser.email}:`, updateError.message);
                } else {
                    console.log(`Successfully updated user ${testUser.email}`);
                }
            } else {
                console.warn(`User not found: ${testUser.email}`);
            }
        }
    } catch (error) {
        console.error('Unexpected error:', error.message);
    }
};

updateRoles();
