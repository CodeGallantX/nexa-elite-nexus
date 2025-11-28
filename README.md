# NeXa Esports 🎮

**Nexa_Esports** is a clan-driven esports platform built for gamers, teams, and competitive communities. This MVP empowers users to create or join clans, engage in clan-based activities, and compete in scrims or ranked tournaments — all within a sleek, mobile-optimized dashboard powered by **TailwindCSS** and **ShadCN UI**.

> "Give gamers an identity, a team, a home — then build the war room around it."

---

## 🚀 Features

### Core Platform
- 🔐 **Role-based Authentication** - Sign Up, Login, Reset Password with email confirmation
- 🧑‍🤝‍🧑 **Clan System** - Create, join, or manage clans with hierarchical roles
- 📊 **Personalized Dashboards** - Real-time clan activity, stats & announcements
- 🛡️ **PWA Support** - Installable progressive web app with offline capabilities
- 🌙 **Responsive Dark Mode** - Optimized for both PC and mobile

### Player Features
- 📈 **Statistics & Analytics** - Comprehensive kill tracking (BR/MP), attendance, and performance metrics
- 🎯 **Loadout Management** - Personal weapon loadouts and configurations
- 🏆 **Leaderboards** - Weekly and all-time performance rankings
- 👤 **Profile System** - Customizable profiles with gaming stats, social links, and banking info
- 💰 **Wallet System** - Deposit, withdraw, transfer funds, and create/redeem giveaways

### Admin Features
- 👥 **Player Management** - View, edit, ban, or delete players
- 📅 **Events Management** - Create tournaments, scrims, and schedule events with auto-status updates
- 📢 **Announcements** - Create and manage clan-wide or targeted announcements
- ✅ **Attendance Tracking** - Monitor and manage player participation
- 🎁 **Giveaway System** - Create giveaways with auto-generated redemption codes
- 💼 **Earnings Management** - Track and manage player earnings
- 📊 **Activity Logging** - Comprehensive activity tracking and audit logs
- ⚙️ **Configuration** - System-wide settings including wallet and tax configurations

### Push Notifications 🔔
- 📲 **Real-time Push Notifications** - Users receive instant notifications on their devices
- 🎮 **Event Notifications** - Automatic push notifications when events are created or updated
- 📢 **Announcement Notifications** - Push notifications for new announcements
- 🎁 **Giveaway Alerts** - Instant notifications for new giveaways
- ⚙️ **Notification Settings** - Users can enable/disable push notifications in settings

---

## 📸 Screenshots

> *(Replace with real screenshots later)*

![Dashboard Preview](public/thumbnail.png)
![Clan Base UI](public/nexa-logo.jpg)

---

## 🧱 Tech Stack

- **Frontend**: React 18 + Vite + TypeScript
- **Styling**: Tailwind CSS + ShadCN UI + Framer Motion
- **Backend**: Supabase (Auth, Database, Storage, Edge Functions)
- **Payments**: Paystack Integration
- **Push Notifications**: Web Push API + Service Workers
- **PWA**: VitePWA with Workbox
- **Routing**: React Router DOM v6
- **State Management**: TanStack React Query + Custom React Hooks & Context
- **Deployment**: Vercel (via `vercel.json`)

---

## 📦 Installation

```bash
# 1. Clone the repo
git clone https://github.com/CodeGallantX/nexa-elite-nexus.git

# 2. Navigate into the project
cd nexa-elite-nexus

# 3. Install dependencies
npm install

# 4. Start dev server
npm run dev
```

---

## 🔑 Environment Setup

> Create a `.env` file and configure the required keys

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key

# Paystack Configuration
VITE_PAYSTACK_PUBLIC_KEY=your_paystack_public_key

# Push Notifications (VAPID Keys)
VITE_VAPID_PUBLIC_KEY=your_vapid_public_key

# Email Service Configuration (for contact form)
BREVO_API_KEY=your_brevo_api_key
EMAILJS_SERVICE_ID=your_emailjs_service_id
EMAILJS_TEMPLATE_ID=your_emailjs_template_id
EMAILJS_PUBLIC_KEY=your_emailjs_public_key
```

### Supabase Edge Function Environment Variables

```env
# Required for edge functions
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_ANON_KEY=your_anon_key

# VAPID Keys for Push Notifications
VAPID_PUBLIC_KEY=your_vapid_public_key
VAPID_PRIVATE_KEY=your_vapid_private_key
VAPID_EMAIL=mailto:your_email@example.com

# Paystack (for payment processing)
PAYSTACK_SECRET_KEY=your_paystack_secret_key
```

---

## 📁 Project Structure

```
├── src/
│   ├── pages/               # Page components
│   │   ├── admin/           # Admin pages (Players, Events, Announcements, etc.)
│   │   ├── auth/            # Authentication pages (Login, Signup, etc.)
│   │   └── payment/         # Payment success pages
│   ├── components/          # Reusable UI components
│   │   └── ui/              # ShadCN UI components
│   ├── hooks/               # Custom React hooks
│   │   ├── useNotifications.tsx    # Notification management
│   │   ├── usePushNotifications.tsx # Push notification subscription
│   │   └── ...
│   ├── contexts/            # React context providers
│   │   ├── AuthContext.tsx  # Authentication state
│   │   └── ThemeContext.tsx # Theme management
│   ├── lib/                 # Utility functions
│   │   ├── pushNotifications.ts # Push notification helpers
│   │   └── activityLogger.ts    # Activity logging
│   ├── integrations/        # External service integrations
│   │   └── supabase/        # Supabase client & types
│   └── sw.ts                # Service worker for PWA & push notifications
├── supabase/
│   ├── functions/           # Edge functions
│   │   ├── send-push-notification/
│   │   ├── create-giveaway/
│   │   ├── paystack-transfer/
│   │   └── ...
│   └── migrations/          # Database migrations
├── public/                  # Static assets & PWA icons
├── tailwind.config.ts       # Tailwind CSS configuration
└── vite.config.ts           # Vite configuration with PWA plugin
```

---

## 🧪 Development Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Build for development (with source maps)
npm run build:dev

# Lint code
npm run lint

# Preview production build
npm run preview
```

---

## 🔔 Push Notification System

The platform includes a comprehensive push notification system that automatically notifies users when:

1. **Events are created or updated** - Clan members receive notifications about new tournaments, scrims, and schedule changes
2. **Announcements are posted** - Users get notified about important clan updates
3. **Giveaways are available** - Instant alerts when new giveaway codes are available

### Enabling Push Notifications

1. Navigate to **Settings** → **Notifications** tab
2. Toggle **Push Notifications** to enable
3. Allow browser permission when prompted

### Technical Implementation

- Service Worker (`src/sw.ts`) handles push events and notification display
- `usePushNotifications` hook manages subscription state
- Push subscriptions are stored in Supabase `push_subscriptions` table
- Edge function `send-push-notification` handles server-side push delivery

---

## 👑 User Roles

| Role | Description | Access Level |
|------|-------------|--------------|
| **Clan Master** | Platform owner with full access | All features + system config |
| **Admin** | Clan administrators | Player management, events, announcements |
| **Moderator** | Event and content moderators | Limited admin features |
| **Player** | Regular clan members | Personal features, wallet, events |

---

## 🔐 Auth Pages

- `/auth/signup` - New user registration
- `/auth/login` - User login
- `/auth/forgot-password` - Password reset request
- `/auth/reset-password` - Password reset confirmation
- `/auth/email-confirmation` - Email verification
- `/auth/onboarding` - New user onboarding

---

## 📱 PWA Features

- **Installable** - Add to home screen on mobile/desktop
- **Offline Support** - Cached assets and API responses
- **Background Sync** - Sync data when connection is restored
- **Push Notifications** - Real-time updates even when app is closed

---

## 📬 Contact & Contribution

Want to contribute or test it?

* 🧙 Built by [@CodeGallantX](https://github.com/CodeGallantX)
* 🛠 Pull requests welcome!
* 👀 DM for onboarding, issue reporting, or clan requests

---

## 🪪 License

MIT — free to fork, modify, or build on.
Give credit if you clone the whole war room ⚔️

---

## 🌐 Demo Link

> [Live App](https://nexa-esports.vercel.app)
