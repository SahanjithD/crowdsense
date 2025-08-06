require('dotenv').config();

// Debug environment variables
console.log('DATABASE_URL is set:', !!process.env.DATABASE_URL);
if (process.env.DATABASE_URL) {
  const url = process.env.DATABASE_URL;
  console.log('DATABASE_URL starts with:', url.substring(0, 15) + '...');
}

const pool = require('./db');

async function testDatabase() {
  try {
    console.log('Testing database connection...');
    
    // Test basic connection
    const result = await pool.query('SELECT NOW() as current_time');
    console.log('✅ Database connected successfully');
    console.log('Current time:', result.rows[0].current_time);
    
    // Test if users table exists and has the right structure
    const userTableCheck = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position;
    `);
    
    console.log('\n📊 Users table structure:');
    userTableCheck.rows.forEach(row => {
      console.log(`  ${row.column_name}: ${row.data_type}`);
    });
    
    // Test if we can query users
    const userCount = await pool.query('SELECT COUNT(*) FROM users');
    console.log(`\n👥 Number of users in database: ${userCount.rows[0].count}`);
    
    // Check if admin user exists
    const adminUser = await pool.query("SELECT email, role FROM users WHERE email = 'admin@crowdsense.com'");
    if (adminUser.rows.length > 0) {
      console.log('✅ Admin user exists:', adminUser.rows[0]);
    } else {
      console.log('❌ Admin user not found');
    }
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    console.error('Full error:', error);
  } finally {
    await pool.end();
  }
}

testDatabase();
