require('dotenv').config();
const db = require('../db');

async function testDatabaseConnection() {
    try {
        // Log the database connection string (with password redacted)
        const dbUrl = process.env.DATABASE_URL.replace(/:[^:@]*@/, ':****@');
        console.log('Using database URL:', dbUrl);

        // Test connection
        await db.query('SELECT NOW()');
        console.log('Database connection successful');

        // Get database size
        const dbSize = await db.query(`
            SELECT pg_size_pretty(pg_database_size(current_database())) as size;
        `);
        console.log('Current database size:', dbSize.rows[0].size);

        // Get table counts
        const tableCounts = await db.query(`
            SELECT 
                (SELECT COUNT(*) FROM users) as users_count,
                (SELECT COUNT(*) FROM feedback) as feedback_count,
                (SELECT COUNT(*) FROM public_spaces) as spaces_count;
        `);
        console.log('\nTable statistics:', tableCounts.rows[0]);

        // Show recent activities
        const recentActivity = await db.query(`
            SELECT 
                (SELECT COUNT(*) FROM users WHERE created_at > NOW() - INTERVAL '24 hours') as new_users_24h,
                (SELECT COUNT(*) FROM feedback WHERE created_at > NOW() - INTERVAL '24 hours') as new_feedback_24h,
                (SELECT COUNT(*) FROM public_spaces WHERE created_at > NOW() - INTERVAL '24 hours') as new_spaces_24h;
        `);
        console.log('\nLast 24 hours activity:', recentActivity.rows[0]);

    } catch (error) {
        console.error('Database test failed:', error);
    } finally {
        process.exit();
    }
}

// Run the test
testDatabaseConnection();
