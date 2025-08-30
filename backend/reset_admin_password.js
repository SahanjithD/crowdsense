require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('./db');

async function resetAdminPassword() {
    try {
        console.log('Resetting admin password...');
        
        // Hash the new password
        const password = 'admin123';
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        // Update the admin user's password
        const result = await db.query(
            'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE email = $2 RETURNING user_id, email, role',
            [hashedPassword, 'admin@crowdsense.com']
        );
        
        if (result.rows.length === 0) {
            console.log('Admin user not found!');
            return;
        }

        console.log('Admin password has been reset successfully!');
        console.log('Admin user:', result.rows[0]);
        
        // Verify the new password
        const user = await db.query('SELECT * FROM users WHERE email = $1', ['admin@crowdsense.com']);
        const isValid = await bcrypt.compare(password, user.rows[0].password_hash);
        console.log('Password verification after reset:', isValid);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        process.exit();
    }
}

resetAdminPassword();
