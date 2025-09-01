-- CrowdSense MVP Database Schema
-- Enable UUID extension (usually already enabled in Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- Note: PostGIS might not be available in all Supabase plans, we'll use basic POINT type

-- Create users table for CrowdSense authentication
CREATE TABLE IF NOT EXISTS users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(64) UNIQUE,
    email VARCHAR(128) UNIQUE NOT NULL,
    password_hash VARCHAR(256) NOT NULL,
    first_name VARCHAR(64),
    last_name VARCHAR(64),
    role VARCHAR(16) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    is_email_verified BOOLEAN DEFAULT FALSE,
    profile_picture_url VARCHAR(256),
    timezone VARCHAR(64) DEFAULT 'UTC'
);

-- Create public spaces table
CREATE TABLE IF NOT EXISTS public_spaces (
    space_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(128) NOT NULL,
    space_type VARCHAR(32) NOT NULL CHECK (space_type IN ('toilet', 'park', 'station', 'bus_stop', 'mall', 'other')),
    latitude DECIMAL(10, 8),  -- More practical than POINT type
    longitude DECIMAL(11, 8), -- More practical than POINT type
    address VARCHAR(256),
    description TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    avg_rating DECIMAL(3,2) DEFAULT 0.0,
    total_feedback_count INT DEFAULT 0,
    last_feedback_at TIMESTAMP WITH TIME ZONE,
    created_by_user_id UUID REFERENCES users(user_id)
);

-- Create feedback categories table
CREATE TABLE IF NOT EXISTS feedback_categories (
    category_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(64) UNIQUE NOT NULL,
    description TEXT,
    icon_url VARCHAR(256),
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT
);

-- Create feedback table
CREATE TABLE IF NOT EXISTS feedback (
    feedback_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    space_id UUID REFERENCES public_spaces(space_id),
    user_id UUID REFERENCES users(user_id),
    category_id UUID REFERENCES feedback_categories(category_id),
    status VARCHAR(16) DEFAULT 'good' CHECK (status IN ('good', 'mixed', 'problematic')),
    severity VARCHAR(16) DEFAULT 'low' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    user_latitude DECIMAL(10, 8),  -- User's location when submitting feedback
    user_longitude DECIMAL(11, 8), -- User's location when submitting feedback
    location_accuracy FLOAT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_anonymous BOOLEAN DEFAULT FALSE,
    session_id VARCHAR(64),
    device_info JSONB,
    attachments JSONB,
    upvotes INT DEFAULT 0,
    downvotes INT DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE
);

-- Create email verifications table
CREATE TABLE IF NOT EXISTS email_verifications (
    verification_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id),
    verification_token VARCHAR(128) UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE,
    is_used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create password resets table
CREATE TABLE IF NOT EXISTS password_resets (
    reset_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id),
    reset_token VARCHAR(128) UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE,
    is_used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create feedback votes table
CREATE TABLE IF NOT EXISTS feedback_votes (
    vote_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    feedback_id UUID REFERENCES feedback(feedback_id),
    user_id UUID REFERENCES users(user_id),
    vote_type VARCHAR(8) CHECK (vote_type IN ('upvote', 'downvote')),
    session_id VARCHAR(64),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create feedback responses table
CREATE TABLE IF NOT EXISTS feedback_responses (
    response_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    feedback_id UUID REFERENCES feedback(feedback_id),
    admin_id UUID REFERENCES users(user_id),
    response_text TEXT,
    action_taken VARCHAR(32) CHECK (action_taken IN ('acknowledged', 'in_progress', 'resolved', 'dismissed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sessions table
CREATE TABLE IF NOT EXISTS sessions (
    session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id),
    ip_address VARCHAR(64),
    user_agent VARCHAR(256),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);

-- Create audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
    log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name VARCHAR(64),
    record_id UUID,
    action VARCHAR(16) CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
    old_data JSONB,
    new_data JSONB,
    user_id UUID REFERENCES users(user_id),
    ip_address VARCHAR(64),
    user_agent VARCHAR(256),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_email_verified ON users(email) WHERE is_email_verified = TRUE;
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Note: POINT columns need special indexing - skipping for basic setup
-- CREATE INDEX IF NOT EXISTS idx_spaces_location ON public_spaces (location);
-- CREATE INDEX IF NOT EXISTS idx_spaces_nearby ON public_spaces (location) WHERE is_active = TRUE;

CREATE INDEX IF NOT EXISTS idx_feedback_space_recent ON feedback(space_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_status ON feedback(status);
CREATE INDEX IF NOT EXISTS idx_feedback_category ON feedback(category_id);
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback(created_at DESC);
-- Note: POINT columns need special indexing - skipping for basic setup
-- CREATE INDEX IF NOT EXISTS idx_feedback_user_location ON feedback (user_location);
CREATE INDEX IF NOT EXISTS idx_feedback_anonymous ON feedback(session_id) WHERE is_anonymous = TRUE;

CREATE INDEX IF NOT EXISTS idx_feedback_votes_feedback ON feedback_votes(feedback_id);
CREATE INDEX IF NOT EXISTS idx_email_verifications_token ON email_verifications(verification_token) WHERE is_used = FALSE;
CREATE INDEX IF NOT EXISTS idx_password_resets_token ON password_resets(reset_token) WHERE is_used = FALSE;
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);

-- Add indexes for location columns
CREATE INDEX IF NOT EXISTS idx_spaces_location ON public_spaces (latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_feedback_user_location ON feedback (user_latitude, user_longitude);

-- Create auto-update triggers for updated_at fields
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_public_spaces_updated_at BEFORE UPDATE ON public_spaces FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_feedback_updated_at BEFORE UPDATE ON feedback FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_feedback_responses_updated_at BEFORE UPDATE ON feedback_responses FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Insert default feedback categories
INSERT INTO feedback_categories (name, description, sort_order) VALUES
('cleanliness', 'Report cleanliness issues', 1),
('crowding', 'Report overcrowding or capacity issues', 2),
('safety', 'Report safety concerns', 3),
('accessibility', 'Report accessibility issues', 4),
('maintenance', 'Report maintenance or facility issues', 5),
('other', 'Other feedback not covered by specific categories', 6)
ON CONFLICT (name) DO NOTHING;

-- Insert a test admin user (password: admin123)
-- Password hash for 'admin123' using bcrypt with 12 rounds
INSERT INTO users (email, password_hash, first_name, last_name, role, is_email_verified, username)
VALUES (
    'admin@crowdsense.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewfeOcMAsJJ6WM3W',
    'Admin',
    'User',
    'admin',
    TRUE,
    'admin'
) ON CONFLICT (email) DO NOTHING;

-- Insert some test public spaces (with latitude/longitude)
INSERT INTO public_spaces (name, space_type, latitude, longitude, address, description) VALUES
('Central Library Restroom', 'toilet', 40.7589, -73.9851, '123 Main St, Your City', 'Public restroom in the central library'),
('City Park', 'park', 40.7614, -73.9776, '456 Park Ave, Your City', 'Main city park with playground and walking trails'),
('Metro Station', 'station', 40.7527, -73.9772, '789 Transit Blvd, Your City', 'Main metro/bus station downtown')
ON CONFLICT DO NOTHING;
