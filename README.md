# friendipity

A spontaneous social meetup app that flips the traditional event invitation model. Instead of planning events in advance, share your location and activity with friends in real-time, allowing for serendipitous hangouts without the back-and-forth of traditional planning.

## 🎯 Core Concept

**Traditional apps:** "I'm hosting dinner at 7pm.  Want to come?" (requires RSVPs, planning, coordination)

**friendipity:** "I'm grabbing coffee at Blue Bottle right now" (friends can just show up)

Share what you're doing and where you are—with the implicit invitation that others are welcome to join. No formal invites, no complex planning, just spontaneous connection.

---

## 🏗️ Tech Stack

- **Frontend:** React Native, Expo, TypeScript
- **Backend:** Supabase (PostgreSQL + PostGIS, Auth, Storage, Real-time)
- **Key Libraries:** React Navigation, React Native Maps, Expo Location/Contacts/Notifications

---

## 🚀 Quick Start

### Prerequisites

- Node.js (v18+)
- [Expo Go](https://expo.dev/client) app on your phone
- [Supabase](https://supabase.com) account (free tier)

### Setup

```bash
# Clone and install
git clone https://github.com/YOUR_USERNAME/friendipity. git
cd friendipity
npm install

# Configure environment
cp .env.example .env
# Add your Supabase URL and anon key to .env

# Set up Supabase database
# Run the SQL schema from docs/schema.sql in your Supabase SQL Editor

# Run the app
npx expo start
# Scan QR code with Expo Go
```

**Get Supabase credentials:**
- Supabase Dashboard → Settings → API
- Copy "Project URL" and "anon/public" key into `.env`

---

## 🗺️ Roadmap

### Phase 1: MVP (Current)
- [x] Project setup & database schema
- [x] Auth context & TypeScript types
- [ ] Login/signup screens (magic link email)
- [ ] Profile setup (name, photo, phone)
- [ ] Friend discovery via contact sync
- [ ] Activity creation & map view
- [ ] Push notifications

### Phase 2: Polish
- [ ] Activity scheduling (day-of only)
- [ ] Live location when "on my way"
- [ ] Activity categories
- [ ] Improved UI/UX

### Phase 3: Growth
- [ ] QR code friend adds
- [ ] Invite links
- [ ] Friend groups
- [ ] Activity history

### Phase 4: Advanced
- [ ] Geofencing (auto-notify nearby friends)
- [ ] Activity suggestions
- [ ] Calendar integration
- [ ] Public events (opt-in)

---

## 📁 Project Structure

```
friendipity/
├── src/
│   ├── components/       # Reusable UI components
│   ├── contexts/         # React contexts (auth, etc.)
│   ├── navigation/       # Navigation setup
│   ├── screens/          # Screen components
│   │   ├── auth/
│   │   ├── profile/
│   │   ├── friends/
│   │   ├── activities/
│   │   └── map/
│   ├── services/         # API services (Supabase)
│   ├── types/            # TypeScript types
│   └── utils/            # Helper functions
├── docs/
│   └── schema.sql        # Database schema
├── .env                  # Environment variables (not in git)
├── App.tsx
└── package.json
```

---

## 🙏 Acknowledgments

- Inspired by Find My Friends, Partiful, and all the times I've reached out to friends at the last minute.
- Built with Expo and Supabase
- Location services powered by PostGIS

---

**Built with ❤️ for spontaneous connections**
