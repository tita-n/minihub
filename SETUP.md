# MiniHub Setup Guide

This guide will help you set up MiniHub locally and deploy it to production.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication → Email/Password
4. Create Firestore Database
5. Get config from Project Settings

### 3. Environment Variables
Create `.env.local`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:3000`

## 🔧 Detailed Setup

### Firebase Configuration

#### Authentication Setup
1. In Firebase Console → Authentication
2. Sign-in method → Email/Password → Enable
3. Optional: Enable Email verification

#### Firestore Setup
1. Create Database → Start in test mode
2. Security Rules location: `firestore.rules`
3. Create indexes for performance:
   - Posts: `createdAt` descending
   - Comments: `postId` ascending, `createdAt` descending

#### Deploy Security Rules
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Deploy rules
firebase deploy --only firestore:rules
```

### Environment Variables Explained

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase Web API Key | ✅ |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain | ✅ |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase Project ID | ✅ |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket | ❌ |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase Messaging Sender ID | ❌ |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase App ID | ✅ |

### Development Workflow

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import GitHub repository
   - Add environment variables
   - Deploy automatically

### Manual Deployment

```bash
# Build the application
npm run build

# Test production build
npm start

# Deploy to your hosting service
```

### Firebase Hosting (Alternative)

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Build for production
npm run build

# Deploy to Firebase Hosting
firebase deploy
```

## 📋 Production Checklist

### Before Launch
- [ ] Set up proper Firebase project
- [ ] Configure environment variables
- [ ] Deploy Firestore security rules
- [ ] Create Firestore indexes
- [ ] Test all user flows
- [ ] Check mobile responsiveness
- [ ] Verify performance

### Security Checks
- [ ] Firebase Authentication configured
- [ ] Firestore rules deployed
- [ ] Environment variables secured
- [ ] No hardcoded secrets
- [ ] Input validation working
- [ ] Error handling implemented

### Performance Checks
- [ ] Fast loading times
- [ ] Mobile-friendly design
- [ ] Proper image optimization
- [ ] Efficient data fetching
- [ ] Minimal bundle size

## 🔍 Troubleshooting

### Common Issues

#### Firebase Connection Issues
```bash
# Check if environment variables are set
echo $NEXT_PUBLIC_FIREBASE_API_KEY

# Verify Firebase config in browser console
# Open dev tools → Console → Check for errors
```

#### Build Errors
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check TypeScript errors
npm run lint
```

#### Firestore Rules Not Working
```bash
# Redeploy security rules
firebase deploy --only firestore:rules

# Check rules syntax in Firebase console
```

### Performance Issues

#### Slow Loading
- Check network tab in browser dev tools
- Verify Firebase initialization
- Reduce bundle size with dynamic imports

#### Real-time Updates Not Working
- Check Firestore listeners
- Verify security rules allow reads
- Check internet connection

## 📊 Monitoring

### Firebase Analytics
1. Enable Analytics in Firebase Console
2. Add monitoring to your app
3. Track user engagement metrics

### Error Tracking
```javascript
// Add error tracking in your components
try {
  // Your code here
} catch (error) {
  console.error('MiniHub Error:', error);
  // Send to error tracking service
}
```

### Performance Monitoring
- Use Firebase Performance Monitoring
- Track page load times
- Monitor API response times

## 🔄 Maintenance

### Regular Updates
- Update dependencies regularly
- Monitor Firebase deprecations
- Keep security patches current

### Backup Strategy
- Enable Firestore backups
- Regular exports of user data
- Version control for security rules

### Scaling Considerations
- Monitor read/write operations
- Plan for increased traffic
- Consider database indexing improvements

---

## 🆘 Need Help?

1. Check the [main README](README.md) for detailed documentation
2. Review Firebase documentation for specific issues
3. Check browser console for JavaScript errors
4. Verify all environment variables are correctly set

For production support, consider:
- Firebase support plans
- Vercel Pro tier
- Monitoring and analytics services