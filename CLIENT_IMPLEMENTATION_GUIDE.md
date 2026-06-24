# 🪷 WeddingSnaps - Client Implementation Guide

**Professional Wedding Photo Gallery & Management System**

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Key Features](#key-features)
3. [System Architecture](#system-architecture)
4. [User Flows](#user-flows)
5. [Admin Features](#admin-features)
6. [Gallery Features](#gallery-features)
7. [Technical Stack](#technical-stack)
8. [Installation & Setup](#installation--setup)
9. [Environment Configuration](#environment-configuration)
10. [Database Schema](#database-schema)
11. [API Routes Reference](#api-routes-reference)
12. [Component Structure](#component-structure)
13. [Deployment Guide](#deployment-guide)
14. [Performance & Optimization](#performance--optimization)

---

## 🎯 Project Overview

**WeddingSnaps** is a modern, production-ready web application that helps photographers and event managers:

- **Share wedding photos** with guests in a beautiful, branded gallery
- **Manage events** with full control over uploads, access, and download permissions
- **Track analytics** (views, downloads, guest activity)
- **Handle guest uploads** (optional feature)
- **Process download requests** with photographer approval workflow
- **Provide themed galleries** with customizable colors and branding

### Who Uses What?

| User Type | Access | Main Actions |
|-----------|--------|--------------|
| **Admin/Photographer** | Login required | Upload photos, manage events, approve downloads, view analytics |
| **Guests** | Event code required | View photos, like, request downloads, optional upload |
| **Event Hosts** | Share event code | Control who sees photos, download permissions |

---

## ✨ Key Features

### 🎨 Guest Gallery
- ✅ Beautiful, responsive photo grid with Masonry layout
- ✅ Light/Dark theme with persistent user preference
- ✅ Full-screen photo modal with keyboard navigation
- ✅ Photo liking system with local storage
- ✅ Download request workflow (with photographer approval)
- ✅ Category-based filtering (WEDDING, RECEPTION, CANDID, etc.)
- ✅ Search functionality
- ✅ Slideshow mode with auto-play
- ✅ Optional guest photo uploads
- ✅ Marathi language support
- ✅ Professional hero section with event details
- ✅ Share functionality (copy link / native share)

### 👨‍💼 Admin Dashboard
- ✅ Event management (create, edit, delete)
- ✅ Photo upload & management
- ✅ Storage usage tracking
- ✅ Download request approval system
- ✅ Event analytics (total views, downloads, guest count)
- ✅ QR code generation for event sharing
- ✅ Guest upload approval workflow
- ✅ Event settings (color, watermark, download controls)
- ✅ Batch photo management
- ✅ Real-time guest activity

### 🔐 Security & Access Control
- ✅ NextAuth authentication with secure session management
- ✅ Event code-based access (guest galleries)
- ✅ Download token system (time-limited access)
- ✅ Password-protected admin login
- ✅ Role-based access control
- ✅ CORS protection on API routes

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    WeddingSnaps App                      │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────────┐  ┌──────────────────────────────┐  │
│  │   Public Routes  │  │    Protected Admin Routes    │  │
│  ├──────────────────┤  ├──────────────────────────────┤  │
│  │ /login           │  │ /admin/dashboard             │  │
│  │ /gallery/[code]  │  │ /admin/events                │  │
│  │ /download/[token]│  │ /admin/events/[id]           │  │
│  └──────────────────┘  │ /admin/events/new            │  │
│                         │ /admin/storage               │  │
│                         │ /admin/requests              │  │
│                         └──────────────────────────────┘  │
│                                                           │
│  ┌──────────────────────────────────────────────────┐   │
│  │              API Routes (/api)                     │   │
│  ├──────────────────────────────────────────────────┤   │
│  │ /auth/[...nextauth]  → NextAuth authentication   │   │
│  │ /events              → Event CRUD operations      │   │
│  │ /photos              → Photo management & likes   │   │
│  │ /upload              → Photo upload (Cloudinary) │   │
│  │ /download-requests   → Download workflow         │   │
│  │ /analytics           → Event analytics tracking  │   │
│  └──────────────────────────────────────────────────┘   │
│                                                           │
│  ┌──────────────────────────────────────────────────┐   │
│  │         Database (Prisma + SQLite)               │   │
│  ├──────────────────────────────────────────────────┤   │
│  │ Admin, Event, Photo, Analytics, DownloadRequest │   │
│  └──────────────────────────────────────────────────┘   │
│                                                           │
│  ┌──────────────────────────────────────────────────┐   │
│  │    External Services                             │   │
│  ├──────────────────────────────────────────────────┤   │
│  │ • Cloudinary  → Image hosting & optimization    │   │
│  │ • NextAuth    → Authentication                  │   │
│  │ • Prisma      → Database ORM                    │   │
│  └──────────────────────────────────────────────────┘   │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

---

## 🔄 User Flows

### 1️⃣ Guest Viewing Flow

```
Guest Opens Link
    ↓
Enter Event Code OR Direct Link
    ↓
View Gallery (Photos Listed)
    ↓
Browse Photos → Like → View Details → Download Request
    ↓
[If Download Control = FULL_QUALITY]
    → Download Immediately
[If Download Control = LOW_QUALITY]
    → Get Low-Quality Version
[If Download Control = VIEW_ONLY]
    → Request Download (Photographer Reviews)
    ↓
Share Photo or View Slideshow
```

### 2️⃣ Photographer/Admin Flow

```
Admin Login
    ↓
Dashboard (Overview of all events)
    ↓
[Manage Events]
    → Create New Event
    → Upload Photos (Batch)
    → Edit Event Settings (Colors, Watermark, Downloads)
    ↓
[Analytics]
    → View Total Views, Downloads, Likes
    → See Guest Activity
    ↓
[Download Requests]
    → Review Pending Requests
    → Approve/Deny Downloads
    → Send Download Links
    ↓
[Storage Management]
    → Check Storage Usage
    → Delete Old Photos
    → Archive Events
```

### 3️⃣ Photo Upload & Approval Flow

```
Admin Uploads Photos to Event
    ↓
Photos Stored in Cloudinary
    ↓
Metadata Saved in Database
    ↓
Guest Access Based on Event Settings
    ↓
[Optional: Guest Upload]
    → Guest Uploads Photo
    → Marked as "Pending Approval"
    → Admin Reviews & Approves
    → Published to Gallery
```

### 4️⃣ Download Request Flow

```
Guest Sees Photo
    ↓
[Download Control = FULL_QUALITY/LOW_QUALITY]
    → Instant Download Available
[Download Control = VIEW_ONLY]
    → Click "Request Download"
    ↓
Fill Form (Email, Name, Photo ID)
    ↓
Request Sent to Admin
    ↓
Admin Reviews in "/admin/requests"
    ↓
Approve → Send Download Link via Email
    OR
Deny → Guest Notified
    ↓
Guest Downloads via Secure Link
```

---

## 👨‍💼 Admin Features (Detailed)

### 📊 Dashboard
- **Stats Overview**: Total events, active events, total photos, total views
- **Recent Uploads**: Thumbnail grid of 8 most recent photos
- **Events List**: Quick access to all events with status indicators
- **Action Buttons**: Create new event, view all events

### 🎥 Event Management
- **Create Event**
  - Event name, couple names, date, venue
  - Customizable primary color
  - Event code (auto-generated or custom)
  - Guest upload enable/disable
  - Download control settings
  - Watermark configuration

- **Edit Event**
  - Modify all event details
  - Generate QR code for easy sharing
  - Enable/disable event
  - Change download permissions

- **Delete Event**
  - Cascading delete (removes all photos & analytics)
  - Warning confirmation

### 📸 Photo Management
- **Upload Photos**
  - Drag & drop upload zone
  - Multiple file selection
  - Progress tracking
  - Automatic resizing & optimization via Cloudinary
  - Category assignment (WEDDING, RECEPTION, CANDID, etc.)

- **Edit Photo**
  - Add/edit caption
  - Change category
  - Reorder photos
  - Approve/reject guest uploads

- **Delete Photo**
  - Remove from gallery
  - Delete from Cloudinary

### 📈 Analytics & Tracking
- **Event Analytics**
  - Total views per event
  - Total downloads per event
  - Guest count
  - Most liked photos
  - Download request status

- **Storage Usage**
  - Total storage used (GB)
  - Storage by event
  - Storage trends over time

### 📥 Download Request Management
- **Request Queue**
  - Pending download requests
  - Guest information
  - Request timestamp
  - Photo information

- **Approval Process**
  - Review request details
  - Approve with download link
  - Deny with reason
  - Bulk actions

---

## 🖼️ Gallery Features (Detailed)

### 🎨 Visual Experience
- **Hero Section**
  - Couple names (decorative script font)
  - Event name & date
  - Venue information
  - Live indicator
  - Quick stats (# of photos)

- **Search & Filter**
  - Real-time search by caption/category
  - Category filter tabs with counts
  - Search result highlighting

- **Photo Grid**
  - Responsive Masonry layout (2-4 columns)
  - Lazy loading
  - Skeleton loading states
  - Hover effects with like button

### 👁️ Photo Viewing
- **Modal/Lightbox**
  - Full-screen immersive view
  - Keyboard navigation (← → for prev/next, Esc to close)
  - Zoom in/out
  - Like photo
  - Share functionality
  - Photo counter
  - Photo caption display

- **Slideshow**
  - Auto-play with interval
  - Manual controls
  - Full-screen mode
  - Beautiful transitions

### ❤️ Engagement Features
- **Liking System**
  - Click heart to like
  - Like count display
  - Persistent likes (localStorage)
  - Total likes counter

- **Social Sharing**
  - Copy link to clipboard
  - Native share (on mobile)
  - Share individual photos

### 📥 Download Functionality
- **Instant Download** (FULL_QUALITY / LOW_QUALITY modes)
  - Download directly from gallery
  - Various quality options
  - Fast streaming

- **Request Download** (VIEW_ONLY mode)
  - Fill request form
  - Email & name required
  - Photographer approval required
  - Time-limited download links

### 📤 Guest Upload (Optional)
- **Guest Photo Contribution**
  - Drag & drop upload
  - Multiple files
  - Admin approval required
  - Auto-watermark optional

---

## 🛠️ Technical Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 | UI framework |
| | Next.js 14 (App Router) | Full-stack framework |
| | Tailwind CSS 3 | Styling |
| | Framer Motion | Animations |
| | React Query | Data fetching & caching |
| | TypeScript | Type safety |
| **Backend** | Next.js API Routes | Serverless backend |
| | NextAuth 4 | Authentication |
| **Database** | Prisma 5 | ORM |
| | SQLite | Database (dev), Can use PostgreSQL for prod |
| **Storage** | Cloudinary | Image hosting & optimization |
| **UI Library** | Lucide Icons | Icon library |
| **Utilities** | React Hot Toast | Notifications |
| | date-fns | Date formatting |
| | UUID | ID generation |

### Key Dependencies
```json
{
  "next": "^14.2.3",
  "react": "^18.3.1",
  "prisma": "^5.14.0",
  "@prisma/client": "^5.14.0",
  "next-auth": "^4.24.7",
  "tailwindcss": "^3.4.1",
  "framer-motion": "^11.2.10",
  "@tanstack/react-query": "^5.40.0",
  "axios": "^1.7.2",
  "react-dropzone": "^14.2.3",
  "react-hot-toast": "^2.4.1",
  "react-qr-code": "^2.0.14",
  "lucide-react": "^0.395.0"
}
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js 18+ (recommended 20+)
- npm or yarn
- Git

### Quick Start

```bash
# 1. Clone or extract project
cd f:\App

# 2. Install dependencies
npm install

# 3. Set up environment variables (see next section)
# Create .env file with required variables

# 4. Initialize database
npm run db:generate   # Generate Prisma client
npm run db:push       # Push schema to database
npm run db:seed       # (Optional) Seed sample data

# 5. Start development server
npm run dev

# 6. Open in browser
# Navigate to http://localhost:3000
```

### Build for Production

```bash
# Build the app
npm run build

# Start production server
npm start

# Or deploy to Vercel/hosting provider
```

---

## 🔐 Environment Configuration

### Required Environment Variables

Create a `.env` file in the root directory:

```bash
# Database (Prisma)
DATABASE_URL="file:./prisma/dev.db"              # For SQLite (dev)
# DATABASE_URL="postgresql://user:pass@host/db"  # For PostgreSQL (production)

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here-min-32-chars"
NEXTAUTH_URL="http://localhost:3000"             # Change for production
NEXTAUTH_URL="https://yourdomain.com"            # Production URL

# Cloudinary (Image Upload Service)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Email Service (Optional - for download notifications)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### How to Get Cloudinary Credentials

1. Sign up at https://cloudinary.com
2. Go to Dashboard → Settings
3. Copy Cloud Name
4. Go to Dashboard → Account → API Keys
5. Get API Key and API Secret

### How to Set Up NextAuth Secret

```bash
# Generate a secure secret
openssl rand -base64 32
```

---

## 📊 Database Schema

### Admin Model
```typescript
model Admin {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String   (hashed with bcryptjs)
  name      String
  avatar    String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  events    Event[]
}
```

### Event Model
```typescript
model Event {
  id                 String     @id @default(cuid())
  name               String     // Event name (e.g., "Wedding Reception")
  coupleNames        String     // "John & Jane"
  date               DateTime
  venue              String?
  description        String?
  code               String     @unique // Event access code
  coverImage         String?
  downloadControl    String     // VIEW_ONLY, LOW_QUALITY, FULL_QUALITY
  watermarkEnabled   Boolean
  watermarkText      String?
  guestUploadEnabled Boolean
  isActive           Boolean
  primaryColor       String     // Hex color (e.g., "#B76E79")
  adminId            String
  photos             Photo[]
  analytics          Analytics?
  downloadRequests   DownloadRequest[]
}
```

### Photo Model
```typescript
model Photo {
  id             String   @id @default(cuid())
  url            String   // Full quality image URL (Cloudinary)
  thumbnailUrl   String?  // Optimized thumbnail
  publicId       String   // Cloudinary public ID (for deletion)
  filename       String
  size           Int
  width          Int?
  height         Int?
  category       String   // WEDDING, RECEPTION, CANDID, etc.
  caption        String?
  likes          Int      @default(0)
  isApproved     Boolean  // For guest uploads
  isGuestUpload  Boolean
  sortOrder      Int      // Custom ordering
  eventId        String
  event          Event    @relation(fields: [eventId])
}
```

### DownloadRequest Model
```typescript
model DownloadRequest {
  id           String    @id @default(cuid())
  photoId      String
  photo        Photo     @relation(fields: [photoId])
  eventId      String
  event        Event     @relation(fields: [eventId])
  email        String
  name         String
  guestEmail   String
  token        String    @unique // Secure download link token
  status       String    // PENDING, APPROVED, REJECTED
  expiresAt    DateTime
  createdAt    DateTime  @default(now())
}
```

### Analytics Model
```typescript
model Analytics {
  id             String  @id @default(cuid())
  eventId        String  @unique
  event          Event   @relation(fields: [eventId])
  totalViews     Int     // Unique gallery views
  totalDownloads Int     // Total downloads approved
  guestCount     Int     // Unique guest visitors
}
```

---

## 🔗 API Routes Reference

### Authentication (`/api/auth/[...nextauth]`)
- **POST** `/login` → Login with email/password
- **POST** `/logout` → Clear session
- **GET** `/session` → Get current session

### Events (`/api/events`)
- **GET** `/events` → List all events (protected)
- **POST** `/events` → Create event (protected)
- **GET** `/events/[id]` → Get event details
- **PUT** `/events/[id]` → Update event (protected)
- **DELETE** `/events/[id]` → Delete event (protected)
- **GET** `/events/code/[code]` → Get event by code (public)
- **GET** `/events/[id]/photos` → Get photos in event

### Photos (`/api/photos`)
- **GET** `/photos/[id]` → Get photo details
- **POST** `/photos/[id]/like` → Like/unlike photo
- **POST** `/upload` → Upload photo to Cloudinary (protected)
- **GET** `/events/[id]/photos` → Get event photos

### Download Requests (`/api/download-requests`)
- **GET** `/download-requests` → List requests (protected)
- **POST** `/download-requests` → Create request (public)
- **PUT** `/download-requests/[id]` → Approve/reject (protected)
- **GET** `/download-requests/[token]` → Download via token (public)

### Analytics (`/api/analytics/[eventId]`)
- **GET** → Get event analytics (protected)
- **POST** → Track view/download (public)

---

## 📦 Component Structure

### Page Components
```
app/
├── page.tsx                          # Home (redirects)
├── login/page.tsx                    # Guest login
├── gallery/[eventCode]/page.tsx      # Guest gallery
├── download/[token]/page.tsx         # Download page
└── admin/
    ├── login/page.tsx                # Admin login
    ├── dashboard/page.tsx            # Dashboard
    ├── events/page.tsx               # Events list
    ├── events/[id]/page.tsx          # Event details
    └── events/new/page.tsx           # Create event
```

### Gallery Components
```
components/gallery/
├── PhotoGrid.tsx                     # Masonry photo layout
├── PhotoModal.tsx                    # Full-screen photo viewer
├── CategoryFilter.tsx                # Filter by category
├── Slideshow.tsx                     # Auto-play slideshow
├── GuestUpload.tsx                   # Guest upload form
├── DownloadRequestModal.tsx          # Download request form
└── PhotoSkeleton.tsx                 # Loading state
```

### Admin Components
```
components/admin/
├── AdminSidebar.tsx                  # Navigation
├── AnalyticsDashboard.tsx            # Stats display
├── EventCard.tsx                     # Event card
├── StorageDashboard.tsx              # Storage info
├── UploadZone.tsx                    # File upload dropzone
├── QRCodeModal.tsx                   # QR code generator
└── RequestApprovalModal.tsx          # Approve downloads
```

### UI Components
```
components/ui/
├── Button.tsx                        # Reusable button
├── Modal.tsx                         # Modal dialog
├── LoadingSpinner.tsx                # Loading animation
├── ThemeToggle.tsx                   # Light/dark mode
└── Toast.tsx                         # Notifications
```

### Providers
```
providers/
├── QueryProvider.tsx                 # React Query setup
├── SessionProvider.tsx               # NextAuth session
└── ThemeProvider.tsx                 # Theme context
```

---

## 🚀 Deployment Guide

### Option 1: Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# Add all .env variables
```

### Option 2: Docker
```dockerfile
# Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install && npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Option 3: Traditional Server (AWS, DigitalOcean, etc.)
1. SSH into server
2. Clone repository
3. Install Node.js
4. Configure environment variables
5. Run `npm install && npm run build && npm start`
6. Set up reverse proxy (Nginx) and SSL

### Pre-Deployment Checklist
- [ ] Database URL set to production database (PostgreSQL recommended)
- [ ] NEXTAUTH_URL changed to production domain
- [ ] NEXTAUTH_SECRET updated
- [ ] Cloudinary credentials verified
- [ ] SMTP settings configured (if sending emails)
- [ ] Database migrations run: `npx prisma migrate deploy`
- [ ] Test login & photo upload
- [ ] Verify CORS settings
- [ ] Enable HTTPS
- [ ] Set up backups for database & images

---

## ⚡ Performance & Optimization

### Image Optimization
- **Cloudinary Integration**
  - Automatic format conversion (WebP for modern browsers)
  - Responsive image sizing
  - Lazy loading
  - CDN delivery for global reach

- **Next.js Image Optimization**
  - Built-in `Image` component
  - Automatic responsive sizing
  - Blur placeholder support

### Database Optimization
- **Indexes**
  - Event code (fast gallery lookup)
  - Admin ID (fast event filtering)
  - Category (fast filtering)

- **Query Optimization**
  - Pagination for large photo sets
  - Selective field loading
  - Relation eager loading

### Frontend Performance
- **React Query**
  - Automatic caching
  - Stale-while-revalidate pattern
  - Background refetching

- **Code Splitting**
  - Dynamic imports for modals
  - Lazy loading of admin routes

- **Bundle Optimization**
  - Tailwind CSS purging
  - Tree-shaking unused code
  - Minification & compression

### Caching Strategy
```
Static: CSS, JS, Fonts (Cache-Control: max-age=31536000)
Images: Photo files from Cloudinary (CDN cache)
API: React Query with 1-minute stale time
HTML: Revalidate on-demand
```

---

## 📝 Usage Examples

### For Admin: Create Event & Upload Photos

1. **Login** → Admin Dashboard
2. **Create Event** → Click "New Event"
   - Fill: Couple names, Event name, Date, Venue
   - Set: Color, Download permissions, Watermark
   - Click "Create"
3. **Upload Photos** → Click event → Upload zone
   - Drag & drop or select files
   - Wait for upload to complete
   - Photos appear in gallery

### For Guest: Access Gallery

1. **Get Event Code** → Admin shares code
2. **Visit Gallery** → `/gallery/EVENT_CODE`
3. **Browse** → Search, filter by category
4. **Interact** → Like, download, request download
5. **Share** → Click share button for individual photos

---

## 🆘 Troubleshooting

### Database Issues
```bash
# Reset database (dev only!)
rm prisma/dev.db

# Regenerate
npm run db:generate
npm run db:push

# View database GUI
npm run db:studio
```

### Upload Issues
- Check Cloudinary credentials
- Verify image format & size
- Check browser console for errors

### Authentication Issues
- Ensure NEXTAUTH_SECRET is set
- Clear browser cookies
- Check session duration settings

### Performance Issues
- Enable Vercel Analytics
- Use Lighthouse in DevTools
- Check Cloudinary image optimization

---

## 📞 Support & Contact

For technical support or questions:
- Review the `PROJECT_OVERVIEW.md` file
- Check component documentation in code
- Review Prisma schema for database structure
- See API route implementations for endpoint details

---

## 📄 License & Terms

This is a professional wedding photo gallery platform. All code is proprietary and for client use only.

---

**Last Updated**: June 24, 2025  
**Version**: 1.0.0  
**Status**: Production Ready ✅

🪷 **WeddingSnaps** - Beautiful Photo Gallery for Every Celebration 🪷
