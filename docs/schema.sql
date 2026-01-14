-- Enable PostGIS for location queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create enums for status fields
CREATE TYPE friendship_status AS ENUM ('pending', 'accepted', 'rejected');
CREATE TYPE participant_status AS ENUM ('interested', 'on_my_way', 'arrived');

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  phone_number TEXT UNIQUE NOT NULL, -- required
  name TEXT NOT NULL,
  photo_url TEXT,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Friendships table
CREATE TABLE friendships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  friend_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status friendship_status DEFAULT 'pending',  -- Using enum
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, friend_id),
  CHECK (user_id != friend_id)
);

-- Create index for faster friendship lookups
CREATE INDEX friendships_user_id_idx ON friendships(user_id);
CREATE INDEX friendships_friend_id_idx ON friendships(friend_id);
CREATE INDEX friendships_status_idx ON friendships(status);

-- Activities table (with day-of scheduling support)
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  location GEOGRAPHY(POINT, 4326) NOT NULL,
  location_name TEXT,
  scheduled_start_time TIMESTAMPTZ, -- null = "right now", else = scheduled for later today
  start_time TIMESTAMPTZ DEFAULT NOW(),
  end_time TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for activities
CREATE INDEX activities_location_idx ON activities USING GIST(location);
CREATE INDEX activities_user_id_idx ON activities(user_id);
CREATE INDEX activities_active_idx ON activities(is_active, end_time) WHERE is_active = true;
CREATE INDEX activities_scheduled_idx ON activities(scheduled_start_time) WHERE scheduled_start_time IS NOT NULL;

-- Activity participants table
CREATE TABLE activity_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status participant_status DEFAULT 'interested',  -- Using enum
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(activity_id, user_id)
);

-- Push notification tokens
CREATE TABLE push_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, token)
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_tokens ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view friends' profiles" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM friendships
      WHERE ((user_id = auth.uid() AND friend_id = users.id) OR 
             (friend_id = auth.uid() AND user_id = users.id))
        AND status = 'accepted'
    )
  );

CREATE POLICY "Users can search by phone number" ON users
  FOR SELECT USING (true);

-- Friendships policies
CREATE POLICY "Users can view their friendships" ON friendships
  FOR SELECT USING (user_id = auth.uid() OR friend_id = auth.uid());

CREATE POLICY "Users can create friendships" ON friendships
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update friendships" ON friendships
  FOR UPDATE USING (friend_id = auth.uid());

CREATE POLICY "Users can delete their friendships" ON friendships
  FOR DELETE USING (user_id = auth.uid() OR friend_id = auth.uid());

-- Activities policies
CREATE POLICY "Users can view friends' activities" ON activities
  FOR SELECT USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM friendships
      WHERE ((user_id = auth.uid() AND friend_id = activities.user_id) OR 
             (friend_id = auth.uid() AND user_id = activities.user_id))
        AND status = 'accepted'
    )
  );

CREATE POLICY "Users can create own activities" ON activities
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own activities" ON activities
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own activities" ON activities
  FOR DELETE USING (user_id = auth.uid());

-- Activity participants policies
CREATE POLICY "Users can view participants" ON activity_participants
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM activities
      WHERE activities.id = activity_participants.activity_id
        AND (activities.user_id = auth.uid() OR
             EXISTS (
               SELECT 1 FROM friendships
               WHERE ((user_id = auth.uid() AND friend_id = activities.user_id) OR 
                      (friend_id = auth.uid() AND user_id = activities.user_id))
                 AND status = 'accepted'
             ))
    )
  );

CREATE POLICY "Users can join activities" ON activity_participants
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own participation" ON activity_participants
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can remove own participation" ON activity_participants
  FOR DELETE USING (user_id = auth.uid());

-- Push tokens policies
CREATE POLICY "Users can manage own push tokens" ON push_tokens
  FOR ALL USING (user_id = auth.uid());

-- Helper functions
CREATE OR REPLACE FUNCTION get_mutual_friends_count(user1_id UUID, user2_id UUID)
RETURNS INTEGER AS $$
  SELECT COUNT(*):: INTEGER FROM (
    SELECT friend_id FROM friendships 
    WHERE user_id = user1_id AND status = 'accepted'
    INTERSECT
    SELECT friend_id FROM friendships 
    WHERE user_id = user2_id AND status = 'accepted'
  ) AS mutual;
$$ LANGUAGE SQL STABLE;

CREATE OR REPLACE FUNCTION are_friends(user1_id UUID, user2_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM friendships
    WHERE ((user_id = user1_id AND friend_id = user2_id) OR 
           (user_id = user2_id AND friend_id = user1_id))
      AND status = 'accepted'
  );
$$ LANGUAGE SQL STABLE;

CREATE OR REPLACE FUNCTION expire_old_activities()
RETURNS void AS $$
  UPDATE activities
  SET is_active = false
  WHERE is_active = true AND end_time < NOW();
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION activate_scheduled_activities()
RETURNS void AS $$
  UPDATE activities
  SET is_active = true, start_time = NOW()
  WHERE is_active = false 
    AND scheduled_start_time IS NOT NULL 
    AND scheduled_start_time <= NOW();
$$ LANGUAGE SQL;