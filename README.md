# MiniHub - Community Platform Demo

A high-performance community platform built with modern web technologies to demonstrate full-stack development capabilities. This project showcases the ability to ship a production-ready application with clean architecture, proper security, and excellent user experience.

## 🚀 What It Does

MiniHub is a small but real community web app that allows users to:
- **Sign up and log in** with email and password
- **Create, edit, and delete posts** with rich content
- **Comment on posts** and engage in discussions
- **View posts** in a clean, real-time feed
- **Moderate content** through admin controls

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router for optimal performance
- **TypeScript** - Strong typing throughout for reliability
- **Tailwind CSS v4** - Utility-first CSS with custom red+black theme
- **Lucide React** - Minimal, consistent icon library
- **date-fns** - Lightweight date formatting

### Backend & Infrastructure
- **Firebase** - Serverless backend with zero cold starts
  - **Firebase Authentication** - Secure email/password auth
  - **Firestore** - NoSQL database with real-time updates
- **Vercel** - Deployment platform for edge performance

### Key Architecture Decisions
- **Serverless Functions** - No infrastructure to manage
- **Real-time Updates** - Firestore listeners for instant UI updates
- **Type Safety** - End-to-end TypeScript for reliability
- **Security Rules** - Firestore rules for data access control
- **Performance First** - Optimized for instant loading

## 📁 Project Structure

```
minihub/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Landing page
│   │   ├── auth/              # Authentication pages
│   │   ├── feed/              # Main feed page
│   │   ├── post/              # Post detail pages
│   │   └── admin/             # Admin dashboard
│   ├── components/            # Reusable UI components
│   │   └── Navbar.tsx
│   ├── context/               # React contexts
│   │   └── AuthContext.tsx
│   ├── lib/                   # Utility libraries
│   │   ├── firebase/          # Firebase configuration
│   │   └── utils.ts
│   └── types/                 # TypeScript type definitions
├── firestore.rules            # Firestore security rules
├── package.json              # Dependencies and scripts
└── README.md                 # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase project (create at [firebase.google.com](https://firebase.google.com))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd minihub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a new project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password provider)
   - Create a Firestore database
   - Get your Firebase configuration from Project Settings

4. **Configure environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Firebase Setup

### Firestore Security Rules
The project includes comprehensive security rules in `firestore.rules`:
- Users can only edit their own content
- Admins can moderate any post or comment
- All authenticated users can read public content

To deploy these rules:
```bash
# Deploy Firestore rules
firebase deploy --only firestore:rules
```

### Firestore Indexes
For optimal performance, create these indexes in your Firestore console:

**Posts Collection:**
```json
{
  "fields": [
    { "fieldPath": "createdAt", "order": "desc" }
  ]
}
```

**Comments Collection:**
```json
{
  "fields": [
    { "fieldPath": "postId", "order": "asc" },
    { "fieldPath": "createdAt", "order": "desc" }
  ]
}
```

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel
   - Add environment variables in Vercel dashboard
   - Deploy automatically on every push

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🎨 Design System

### Color Palette
- **Background**: `#0a0a0a` (Near-black)
- **Primary**: `#c41e3a` (Deep red - used sparingly)
- **Text**: `#ededed` (White/light gray)
- **Secondary**: `#1a1a1a` (Dark gray)
- **Border**: `#262626` (Gray)

### UI Principles
- **Clean & Minimal** - No clutter, focus on content
- **Mobile-First** - Responsive design that works on all devices
- **Accessibility** - Proper contrast and keyboard navigation
- **Performance** - Fast loading and smooth interactions

## 🔒 Security Features

### Authentication
- Email/password authentication with Firebase Auth
- Secure session management
- Protected routes with authentication checks

### Data Security
- Firestore security rules prevent unauthorized access
- Input validation on both client and server
- Protection against empty posts and comments
- Admin moderation capabilities

### Privacy
- User data stored securely in Firestore
- No unnecessary data collection
- Proper error handling without exposing sensitive information

## 📊 Data Models

### User
```typescript
interface UserProfile {
  id: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: number;
}
```

### Post
```typescript
interface Post {
  id: string;
  authorId: string;
  authorEmail: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}
```

### Comment
```typescript
interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorEmail: string;
  content: string;
  createdAt: number;
}
```

## 🚀 Performance Optimizations

### Loading States
- Skeleton loaders for better perceived performance
- Loading indicators for async operations
- Error boundaries to prevent crashes

### Caching Strategy
- Firestore real-time listeners for instant updates
- Efficient data fetching with proper indexing
- Optimized re-renders with React state management

### Bundle Optimization
- Dynamic imports for heavy components
- Tree-shaking for unused code
- Optimized images and assets

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration and login
- [ ] Post creation, editing, and deletion
- [ ] Comment functionality
- [ ] Admin moderation features
- [ ] Mobile responsiveness
- [ ] Error handling
- [ ] Performance under load

### Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🚨 Known Issues & Limitations

### Current Limitations
- No image upload functionality
- No user profiles beyond email
- No search functionality
- No notifications system
- No rate limiting

### Production Considerations
- Consider adding email verification
- Implement proper logging and monitoring
- Add backup and disaster recovery
- Consider CDN for static assets

## 🤝 Contributing

This is a demo project designed to showcase development capabilities. For production use, consider:

1. **Adding comprehensive testing**
2. **Implementing proper monitoring**
3. **Adding more security features**
4. **Optimizing for scale**
5. **Improving accessibility**

## 📄 License

This project is for demonstration purposes. Feel free to use it as inspiration for your own projects.

## 🙏 Acknowledgments

- **Next.js** - The React framework
- **Firebase** - Backend-as-a-Service
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide** - Beautiful & consistent icons

---

**Built with ❤️ using modern web technologies**

For questions or feedback, please refer to the project documentation or open an issue.
