# 🎯 WeddingSnaps - Quick Start Guide

**Get started in 5 minutes!**

---

## ⚡ 5-Minute Setup

### Step 1: Install & Run
```bash
cd f:\App
npm install
npm run dev
```
→ Open http://localhost:3000

### Step 2: Create Admin Account
1. Click "Login" → "Admin"
2. Register with email & password
3. Set your name

### Step 3: Create First Event
1. Dashboard → Click "New Event"
2. Fill in:
   - Couple Names: *e.g., "John & Jane"*
   - Event Name: *e.g., "Wedding Reception"*
   - Date: *Date of event*
   - Code: *Auto-generated (e.g., ABC123)*
3. Click "Create Event"

### Step 4: Upload Photos
1. Click on the event you created
2. Drag & drop photos into upload zone
3. Wait for upload (shows progress)
4. Photos appear in gallery!

### Step 5: Share with Guests
1. Copy event code or QR code
2. Send to guests via email/WhatsApp
3. Guests visit: `https://yoursite.com/gallery/EVENT_CODE`
4. Done! ✅

---

## 🔑 Key Features at a Glance

### 👥 For Guests
| Feature | What It Does | How To Use |
|---------|-----------|-----------|
| 🖼️ **Browse Gallery** | View all photos in beautiful grid | Click on any photo to expand |
| ❤️ **Like Photos** | Add to favorites (saved locally) | Click heart icon |
| 🔍 **Search** | Find photos by caption | Use search box at top |
| 🏷️ **Filter** | View by category (Wedding, Reception, etc.) | Click category tabs |
| 📺 **Slideshow** | Auto-play all photos | Click "Slideshow" button |
| 🔗 **Share** | Send individual photos | Click "Share" in photo view |
| ⬇️ **Download** | Save photos (if allowed) | Click download button |
| 📝 **Request Download** | Request approval for download | Fill form → Admin approves |
| 📤 **Upload Photos** | Add your photos (if enabled) | Click "Add Photos" button |

### 👨‍💼 For Admin
| Feature | What It Does | How To Use |
|---------|-----------|-----------|
| 📊 **Dashboard** | See overview of all events | Visit `/admin/dashboard` |
| 🎥 **Create Event** | Set up new wedding gallery | Dashboard → "New Event" |
| 📸 **Upload Photos** | Add photos to gallery | Event page → Upload zone |
| ⚙️ **Event Settings** | Customize colors, permissions, watermark | Edit event → Settings |
| 📥 **Download Requests** | Review & approve download requests | Dashboard → Download Requests |
| 📈 **Analytics** | See views, downloads, likes | Event page → Analytics tab |
| 💾 **Storage** | Check storage usage | Dashboard → Storage |
| 🤝 **Guest Uploads** | Enable/disable guests uploading photos | Event settings → Toggle |
| 🎯 **Event Code** | Share gallery link with guests | Event details → Copy code |

---

## 🎨 Gallery Features Showcase

### Hero Section
```
┌─────────────────────────────────────────┐
│         ✦ 🪷 ✦                          │
│                                          │
│      John & Jane                         │
│   (beautiful script font)                │
│                                          │
│   Wedding Reception · June 15, 2024     │
│   📍 Grand Ballroom, Mumbai              │
│                                          │
│   125 photos · Live · Slideshow         │
│                                          │
│   (Gradient background)                  │
└─────────────────────────────────────────┘
```

### Search & Filter
```
[🔍 Photos search करा...]  [Light/Dark Mode]

[ALL] [WEDDING] [RECEPTION] [CANDID] [DECOR]
 125    45        38        20       22
```

### Photo Grid (Masonry Layout)
```
┌──────┬─────────┬──────┐
│      │         │      │
│ Photo│  Photo  │ Photo│
│ 1    │    2    │  3   │
│      │         │      │
├──────┼─────────┼──────┤
│      │         │      │
│ Photo│  Photo  │ Photo│
│ 4    │    5    │  6   │
│      │         │      │
└──────┴─────────┴──────┘
```

### Photo Modal
```
┌──────────────────────────────────────────┐
│ [X]              IMG COUNTER         [🔆] │
│   [◄]                                    │
│          ┌──────────────┐                │
│          │              │                │
│          │   FULL-SIZE  │                │
│          │    PHOTO     │                │
│          │              │                │
│          └──────────────┘                │
│   [►]                                    │
│                                          │
│  [❤️] [⬇️] [📤] [🔍]   Photo Caption   │
│                                          │
│  1 of 125                                │
└──────────────────────────────────────────┘
```

---

## 🔒 Security Features

### Admin Access
- ✅ Email + Password login
- ✅ Secure session management
- ✅ Password hashing (bcryptjs)
- ✅ Protected API routes

### Guest Access
- ✅ Event code-based (like a PIN)
- ✅ No personal data required
- ✅ Time-limited download links
- ✅ Download request approval workflow

### Data Protection
- ✅ HTTPS recommended
- ✅ CORS protection
- ✅ SQL injection protection (Prisma)
- ✅ Cloudinary secure image storage

---

## 🎛️ Admin Control Options

### Download Control Settings
```
┌────────────────────────────────────┐
│ SELECT HOW GUESTS CAN DOWNLOAD     │
├────────────────────────────────────┤
│                                    │
│ ⭕ VIEW_ONLY                       │
│    Photos visible, but request      │
│    approval needed for download     │
│    ➜ Best for: Full control        │
│                                    │
│ ⭕ LOW_QUALITY                     │
│    Guests can download low-res     │
│    version instantly                │
│    ➜ Best for: Sharing preview     │
│                                    │
│ ⭕ FULL_QUALITY                    │
│    Guests can download full-res    │
│    photos instantly                 │
│    ➜ Best for: Self-service        │
│                                    │
└────────────────────────────────────┘
```

### Customization Options
- **Colors** - Set primary color for theme
- **Watermark** - Optional watermark text on photos
- **Guest Upload** - Allow guests to contribute photos
- **Event Status** - Active/Inactive toggle
- **Event Code** - Custom access code

---

## 📊 Understanding Analytics

### Metrics Tracked
```
Total Views       → How many times guests visited
Total Downloads   → How many approved downloads
Guest Count       → How many unique visitors
Most Liked        → Which photos got most likes
Request Status    → Pending/Approved/Rejected downloads
```

### Where to See Analytics
1. Dashboard → Click event
2. Scroll to "Analytics" section
3. See all metrics with dates

---

## 🚨 Common Issues & Solutions

| Problem | Solution |
|---------|----------|
| Photos not uploading | Check internet connection, file size < 50MB |
| Gallery not loading | Verify event code is correct |
| Forgotten password | Use "Forgot Password" link on login |
| Download link expired | Request download again (24-hour links) |
| Theme not saving | Clear browser cache, try incognito mode |
| Guests can't see photos | Verify event is "Active" and code is shared |

---

## 🎓 Best Practices

### For Photographers
1. **Upload regularly** - Upload photos soon after event
2. **Organize by category** - Use categories for easy filtering
3. **Add captions** - Describe important moments
4. **Check analytics** - Understand guest engagement
5. **Approve requests promptly** - Guests waiting for downloads

### For Event Hosts
1. **Share event code widely** - Email, WhatsApp, social media
2. **Use QR code** - Easy for guests to access
3. **Set appropriate download control** - Balance privacy & sharing
4. **Remind guests** - Send reminder email with gallery link
5. **Share feedback** - Let photographer know guest response

### For Guests
1. **Like favorite photos** - Photographer sees engagement
2. **Request downloads respectfully** - Provide accurate info
3. **Share with friends** - Use share buttons
4. **Upload your photos** - If enabled, contribute your shots
5. **Check regularly** - New photos added often

---

## 📱 Mobile Experience

### Fully Responsive
- ✅ Works perfectly on all devices
- ✅ Touch-friendly buttons
- ✅ Optimized for slow connections
- ✅ Smooth animations on mobile
- ✅ Native share functionality

### Screen Sizes
```
Mobile (320px)    → 1 column
Tablet (768px)    → 2-3 columns
Desktop (1024px)  → 3-4 columns
```

---

## 🌙 Theme Support

### Light Theme
- Soft cream background (#FDF5E6)
- Maroon text (#5D3E3B)
- Gold accents (#D4AF37)
- Easy on eyes during day

### Dark Theme
- Deep maroon background (#5C3A39)
- Gold text (#D4AF37)
- Subtle highlights
- Easy on eyes during night

### Auto Toggle
- Click theme icon (top right)
- Preference saved to browser
- Remembers choice on return visit

---

## 🌍 Language Support

### Languages Supported
- **English** - Default
- **Marathi** - हिंदी भाषा support

### RTL Languages
- Can be added (Arabic, Hebrew, etc.)
- Contact support for customization

---

## 📞 Getting Help

### Resources
1. **This Guide** - Quick answers
2. **CLIENT_IMPLEMENTATION_GUIDE.md** - Detailed documentation
3. **Code Comments** - Read function descriptions
4. **Prisma Studio** - Visual database browser (`npm run db:studio`)

### Commands Reference
```bash
npm run dev              # Start development server
npm run build            # Build for production
npm start                # Start production server
npm run db:push          # Sync database
npm run db:studio        # Open database GUI
npm run db:seed          # Load sample data (dev)
npm run lint             # Check code quality
```

---

## 🎯 Next Steps

### Phase 1: Setup (30 min)
- [ ] Install project
- [ ] Create admin account
- [ ] Create first event
- [ ] Upload sample photos

### Phase 2: Testing (30 min)
- [ ] Visit gallery as guest
- [ ] Test liking, downloading
- [ ] Test slideshow
- [ ] Test mobile view

### Phase 3: Customization (Optional)
- [ ] Set custom colors
- [ ] Enable watermark
- [ ] Enable guest uploads
- [ ] Configure download controls

### Phase 4: Production
- [ ] Set up database (PostgreSQL)
- [ ] Configure Cloudinary
- [ ] Deploy to server/Vercel
- [ ] Add custom domain
- [ ] Enable HTTPS

---

## ✅ Ready to Go!

Your WeddingSnaps gallery is ready to share beautiful moments with your clients.

**Questions?** Check CLIENT_IMPLEMENTATION_GUIDE.md for detailed docs.

🪷 **Happy Photo Sharing!** 🪷

---

**Quick Links**
- View Gallery: `/gallery/[EVENT_CODE]`
- Admin Login: `/admin/login`
- Admin Dashboard: `/admin/dashboard`
- Create Event: `/admin/events/new`

---

*Last Updated: June 24, 2025*
