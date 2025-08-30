require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('./db');

async function debugAuth() {
    try {
        console.log('Debugging admin authentication...');
        
        // 1. Check if admin user exists and get their details
        const result = await db.query('SELECT * FROM users WHERE email = $1', ['admin@crowdsense.com']);
        
        if (result.rows.length === 0) {
            console.log('Admin user does not exist in the database!');
            return;
        }

        const user = result.rows[0];
        console.log('\nAdmin user found:', {
            user_id: user.user_id,
            email: user.email,
            role: user.role,
            is_email_verified: user.is_email_verified,
            password_hash_length: user.password_hash?.length || 0
        });

        // 2. Test password verification
        const testPassword = 'admin123';
        console.log('\nTesting password verification...');
        console.log('Test password:', testPassword);
        console.log('Stored hash:', user.password_hash);
        
        const isValidPassword = await bcrypt.compare(testPassword, user.password_hash);
        console.log('Password verification result:', isValidPassword);

        // 3. Create a new hash with the same password for comparison
        const newHash = await bcrypt.hash(testPassword, 12);
        console.log('\nNew hash generated with same password:', newHash);
        
        // 4. Compare the structure of both hashes
        console.log('\nHash comparison:');
        console.log('Stored hash format valid:', user.password_hash?.startsWith('$2'));
        console.log('New hash format valid:', newHash.startsWith('$2'));

    } catch (error) {
        console.error('Debug error:', error);
    } finally {
        process.exit();
    }
}

debugAuth();
