// CrowdSense MVP Database Schema - Minimum Viable Tables Only

// Core Tables
Table Users {
  user_id uuid [pk, default: 'gen_random_uuid()']
  username varchar(64) [unique]
  email varchar(128) [unique, not null]
  password_hash varchar(256) [not null]
  first_name varchar(64)
  last_name varchar(64)
  role varchar(16) [default: 'user'] // user, admin, moderator
  created_at timestamp [default: 'now()']
  updated_at timestamp [default: 'now()']
  last_login_at timestamp
  is_active boolean [default: true]
  is_email_verified boolean [default: false]
  profile_picture_url varchar(256)
  timezone varchar(64) [default: 'UTC']
}

Table PublicSpaces {
  space_id uuid [pk]
  name varchar(128) [not null]
  space_type varchar(32) [not null] // toilet, park, station, bus_stop, mall, other
  location point [not null, note: 'PostGIS geometry']
  address varchar(256)
  description text
  metadata jsonb [note: 'hours, facilities, accessibility, etc.']
  created_at timestamp [default: 'now()']
  updated_at timestamp [default: 'now()']
  is_active boolean [default: true]
  is_verified boolean [default: false] // admin verified
  avg_rating decimal(3,2) [default: 0.0]
  total_feedback_count int [default: 0]
  last_feedback_at timestamp
  created_by_user_id uuid [ref: > Users.user_id, note: 'who added this space']
}

Table FeedbackCategories {
  category_id uuid [pk]
  name varchar(64) [unique, note: 'cleanliness, crowding, safety, etc.']
  description text
  icon_url varchar(256)
  is_active boolean
  sort_order int
}

Table Feedback {
  feedback_id uuid [pk]
  space_id uuid [ref: > PublicSpaces.space_id]
  user_id uuid [ref: > Users.user_id, note: 'nullable for anonymous feedback']
  category_id uuid [ref: > FeedbackCategories.category_id]
  status varchar(16) [default: 'good'] // good, mixed, problematic
  severity varchar(16) [default: 'low'] // low, medium, high, critical
  rating int [note: '1-5 star rating']
  comment text
  user_location point [note: 'PostGIS geometry where feedback was submitted']
  location_accuracy float [note: 'in meters']
  created_at timestamp [default: 'now()']
  updated_at timestamp [default: 'now()']
  is_anonymous boolean [default: false]
  session_id varchar(64) [note: 'for anonymous tracking']
  device_info jsonb [note: 'browser/device information as JSON']
  attachments jsonb [note: 'photo URLs, etc.']
  upvotes int [default: 0]
  downvotes int [default: 0]
  is_verified boolean [default: false] // admin verified
}

// System Tables
Table EmailVerifications {
  verification_id uuid [pk]
  user_id uuid [ref: > Users.user_id]
  verification_token varchar(128) [unique]
  expires_at timestamp
  is_used boolean [default: false]
  created_at timestamp [default: 'now()']
}

Table PasswordResets {
  reset_id uuid [pk]
  user_id uuid [ref: > Users.user_id]
  reset_token varchar(128) [unique]
  expires_at timestamp
  is_used boolean [default: false]
  created_at timestamp [default: 'now()']
}

Table FeedbackVotes {
  vote_id uuid [pk]
  feedback_id uuid [ref: > Feedback.feedback_id]
  user_id uuid [ref: > Users.user_id, note: 'nullable for anonymous']
  vote_type varchar(8) [note: 'upvote, downvote']
  session_id varchar(64) [note: 'for anonymous voting']
  created_at timestamp [default: 'now()']
}

Table FeedbackResponses {
  response_id uuid [pk]
  feedback_id uuid [ref: > Feedback.feedback_id]
  admin_id uuid [ref: > Users.user_id]
  response_text text
  action_taken varchar(32) // acknowledged, in_progress, resolved, dismissed
  created_at timestamp [default: 'now()']
  updated_at timestamp [default: 'now()']
}

Table Sessions {
  session_id uuid [pk]
  user_id uuid [ref: > Users.user_id, note: 'nullable for anonymous']
  ip_address varchar(64)
  user_agent varchar(256)
  created_at timestamp [default: 'now()']
  expires_at timestamp
}

Table AuditLogs {
  log_id uuid [pk]
  table_name varchar(64)
  record_id uuid
  action varchar(16) // INSERT, UPDATE, DELETE
  old_data jsonb
  new_data jsonb
  user_id uuid [ref: > Users.user_id, note: 'nullable for system actions']
  ip_address varchar(64)
  user_agent varchar(256)
  created_at timestamp [default: 'now()']
}

// Data Export Feature
Table downloadable_files_tab {
  id bigint [pk]
  filter_hash varchar(32) [unique]
  file_name varchar(64)
  file_size bigint
  report_type smallint
  download_status tinyint
  
  // the value under should align with the latest action
  triggered_by varchar(128)
  triggered_time timestamp
  expiry_time timestamp

  // new
  row_size bigint
  processing_time bigint
}

Table downloadable_session_tab {
  id bigint [pk]
  filter_hash varchar(32) [ref: > downloadable_files_tab.filter_hash]
  
  triggered_by varchar(128)
  triggered_time timestamp
  expiry_time timestamp
  // filter_hash + triggered_by is unique
}

// Indexes
// Note: Indexes are represented as comments since they're not directly supported in this syntax

// PublicSpaces Indexes:
// CREATE INDEX idx_spaces_location ON PublicSpaces USING GIST (location);
// CREATE INDEX idx_spaces_type_location ON PublicSpaces USING GIST (location) WHERE is_active = true;
// CREATE INDEX idx_spaces_nearby ON PublicSpaces USING GIST (location) WHERE is_active = true;

// Feedback Indexes:
// CREATE INDEX idx_feedback_space_created ON Feedback(space_id, created_at DESC);
// CREATE INDEX idx_feedback_space_recent ON Feedback(space_id, created_at DESC) WHERE is_active = true;
// CREATE INDEX idx_feedback_status ON Feedback(status);
// CREATE INDEX idx_feedback_category ON Feedback(category_id);
// CREATE INDEX idx_feedback_created_at ON Feedback(created_at DESC);
// CREATE INDEX idx_feedback_user_location ON Feedback USING GIST (user_location);
// CREATE INDEX idx_feedback_location_recent ON Feedback USING GIST (user_location) WHERE created_at > NOW() - INTERVAL '30 days';
// CREATE INDEX idx_feedback_anonymous ON Feedback(session_id) WHERE is_anonymous = true;

// User Indexes:
// CREATE INDEX idx_users_email ON Users(email);
// CREATE INDEX idx_users_email_verified ON Users(email) WHERE is_email_verified = true;
// CREATE INDEX idx_users_role ON Users(role);

// Voting Indexes:
// CREATE INDEX idx_feedback_votes_feedback ON FeedbackVotes(feedback_id);
// CREATE INDEX idx_feedback_votes_user ON FeedbackVotes(user_id) WHERE user_id IS NOT NULL;

// Authentication Indexes:
// CREATE INDEX idx_email_verifications_token ON EmailVerifications(verification_token) WHERE is_used = false;
// CREATE INDEX idx_password_resets_token ON PasswordResets(reset_token) WHERE is_used = false;

// Session Indexes:
// CREATE INDEX idx_sessions_user ON Sessions(user_id) WHERE user_id IS NOT NULL;
// CREATE INDEX idx_sessions_expires ON Sessions(expires_at);

// Constraints and Triggers:
// ALTER TABLE Feedback ADD CONSTRAINT chk_rating CHECK (rating >= 1 AND rating <= 5);
// ALTER TABLE Users ADD CONSTRAINT chk_role CHECK (role IN ('user', 'admin', 'moderator'));
// ALTER TABLE FeedbackVotes ADD CONSTRAINT chk_vote_type CHECK (vote_type IN ('upvote', 'downvote'));

// Auto-update triggers for updated_at fields:
// CREATE OR REPLACE FUNCTION update_updated_at()
// RETURNS TRIGGER AS $$
// BEGIN
//     NEW.updated_at = NOW();
//     RETURN NEW;
// END;
// $$ LANGUAGE plpgsql;

// CREATE TRIGGER tr_users_updated_at BEFORE UPDATE ON Users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
// CREATE TRIGGER tr_public_spaces_updated_at BEFORE UPDATE ON PublicSpaces FOR EACH ROW EXECUTE FUNCTION update_updated_at();
// CREATE TRIGGER tr_feedback_updated_at BEFORE UPDATE ON Feedback FOR EACH ROW EXECUTE FUNCTION update_updated_at();
