require('dotenv').config();
const db = require('./db');
const bcrypt = require('bcryptjs');

async function testDatabase() {
    try {
        // Log the database connection string (with password redacted)
        const dbUrl = process.env.DATABASE_URL.replace(/:[^:@]*@/, ':****@');
        console.log('Using database URL:', dbUrl);

        // Check if admin user exists
        const result = await db.query('SELECT * FROM users WHERE email = $1', ['admin@crowdsense.com']);
        if (result.rows.length === 0) {
            console.log('Admin user does not exist. Creating one...');
            
            // Create new admin user
            const saltRounds = 12;
            const hashedPassword = await bcrypt.hash('admin123', saltRounds);
            
            await db.query(`
                INSERT INTO users (
                    email,
                    username,
                    password_hash,
                    first_name,
                    last_name,
                    role,
                    is_email_verified,
                    created_at,
                    updated_at
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
            `, [
                'admin@crowdsense.com',
                'admin',
                hashedPassword,
                'Admin',
                'User',
                'admin',
                true
            ]);
            
            console.log('Admin user created successfully');
        } else {
            const user = result.rows[0];
            console.log('Found admin user:', {
                email: user.email,
                role: user.role,
                username: user.username,
                is_email_verified: user.is_email_verified
            });

            // Test raw password hash
            console.log('Current password hash:', user.password_hash);

            // Test password verification
            const testPassword = 'admin123';
            console.log('Testing password:', testPassword);
            const isValidPassword = await bcrypt.compare(testPassword, user.password_hash);
            console.log('Password verification result:', isValidPassword);

            if (!isValidPassword) {
                // Create new password hash for comparison
                const newHash = await bcrypt.hash(testPassword, 12);
                console.log('New hash generated:', newHash);
            }
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        process.exit();
    }
}

testDatabase();
