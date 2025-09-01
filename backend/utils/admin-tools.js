require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('../db');

async function createAdmin(email = 'admin@crowdsense.com', password = 'admin123') {
    try {
        console.log(`Creating admin user with email: ${email}`);
        
        // Check if admin exists
        const existingAdmin = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        
        if (existingAdmin.rows.length > 0) {
            console.log('Admin user already exists.');
            return;
        }

        // Create new admin user
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
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
            email,
            'admin',
            hashedPassword,
            'Admin',
            'User',
            'admin',
            true
        ]);
        
        console.log('Admin user created successfully');
    } catch (error) {
        console.error('Error creating admin:', error);
    }
}

async function resetAdminPassword(email = 'admin@crowdsense.com', newPassword = 'admin123') {
    try {
        console.log(`Resetting password for admin: ${email}`);
        
        // Check if admin exists
        const existingAdmin = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        
        if (existingAdmin.rows.length === 0) {
            console.log('Admin user does not exist.');
            return;
        }

        // Update password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        
        await db.query(`
            UPDATE users 
            SET password_hash = $1, updated_at = NOW()
            WHERE email = $2
        `, [hashedPassword, email]);
        
        console.log('Admin password reset successfully');
    } catch (error) {
        console.error('Error resetting admin password:', error);
    }
}

async function verifyAdmin(email = 'admin@crowdsense.com', password = 'admin123') {
    try {
        console.log(`Verifying admin authentication for: ${email}`);
        
        // Get admin user
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        
        if (result.rows.length === 0) {
            console.log('Admin user does not exist.');
            return;
        }

        const user = result.rows[0];
        console.log('\nAdmin user found:', {
            user_id: user.user_id,
            email: user.email,
            role: user.role,
            is_email_verified: user.is_email_verified
        });

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        console.log('Password verification result:', isValidPassword);

        return isValidPassword;
    } catch (error) {
        console.error('Error verifying admin:', error);
        return false;
    }
}

// Command line interface
const command = process.argv[2];
const email = process.argv[3];
const password = process.argv[4];

switch (command) {
    case 'create':
        createAdmin(email, password).finally(() => process.exit());
        break;
    case 'reset':
        resetAdminPassword(email, password).finally(() => process.exit());
        break;
    case 'verify':
        verifyAdmin(email, password).finally(() => process.exit());
        break;
    default:
        console.log(`
Usage: node admin-tools.js <command> [email] [password]

Commands:
  create [email] [password]  Create a new admin user
  reset [email] [password]   Reset an admin's password
  verify [email] [password]  Verify admin credentials

Examples:
  node admin-tools.js create admin@crowdsense.com newpassword
  node admin-tools.js reset admin@crowdsense.com newpassword
  node admin-tools.js verify admin@crowdsense.com password
        `);
        process.exit();
}
