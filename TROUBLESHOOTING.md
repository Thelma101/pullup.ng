# Troubleshooting "Create my account" Issue

## Problem
The "Create my account" button hangs, lags, or shows "load failed" error after filling the application form.

## Root Cause
This is almost always caused by **missing or incorrect MongoDB configuration**.

## Quick Fix

### Step 1: Check if MongoDB is configured

Look in your `.env.local` file (or environment variables on the server). You should have:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pullup?retryWrites=true&w=majority
```

**If this is missing or incorrect, the form will fail.**

### Step 2: Set up MongoDB (if not already done)

1. **Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)**
2. **Create a free account** (or sign in)
3. **Create a new cluster** (Free tier is fine)
4. **Create a database user:**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Choose username and password
   - Save the password securely
5. **Allow network access:**
   - Go to "Network Access"
   - Click "Add IP Address"
   - For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
   - For production: Add your server's IP
6. **Get connection string:**
   - Go back to "Database"
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password
   - Replace `<username>` with your database username

### Step 3: Add to your environment

**For local development:**
Create or edit `.env.local` in the project root:
```env
MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/pullup?retryWrites=true&w=majority
```

**For production (cPanel, Vercel, etc.):**
Add the same variable in your hosting environment's environment variables section.

### Step 4: Restart the application

```bash
# Stop the server (Ctrl+C)
npm run dev
# Or for production:
npm run build
npm start
```

## Still Not Working?

### Check these common issues:

#### 1. Wrong password in connection string
- Make sure you replaced `<password>` with the actual password
- Password should NOT be in angle brackets `<>`

#### 2. IP not whitelisted
- Go to MongoDB Atlas → Network Access
- Make sure your IP address is listed
- For testing, temporarily allow all IPs (0.0.0.0/0)

#### 3. Connection string format
Your connection string should look like:
```
mongodb+srv://username:password@cluster0.abcde.mongodb.net/pullup?retryWrites=true&w=majority
```

**Common mistakes:**
- Missing `mongodb+srv://` at the start
- Missing database name (`pullup`)
- Missing `?retryWrites=true&w=majority` at the end
- Spaces in the connection string

#### 4. Special characters in password
If your password has special characters like `@`, `#`, `%`, etc., you need to URL-encode them:
- `@` becomes `%40`
- `#` becomes `%23`
- `%` becomes `%25`

Or regenerate a password without special characters.

#### 5. Check server logs

Look for error messages that say:
- `"Missing MONGODB_URI in environment variables"`
- `"MongoDB connection failed"`
- `"Database not configured"`

These confirm it's a MongoDB issue.

### Test MongoDB connection

You can test your connection string with **MongoDB Compass** (free tool):
1. Download from https://www.mongodb.com/try/download/compass
2. Paste your connection string
3. Click "Connect"
4. If it connects, your string is correct

## Other Possible Issues

### Browser Console Errors

1. Open browser DevTools (F12)
2. Go to Console tab
3. Try submitting the form
4. Look for red error messages
5. Take a screenshot and share it

### Network Tab

1. Open DevTools (F12)
2. Go to Network tab
3. Try submitting the form
4. Look for `/api/apply` request
5. Click on it and check the "Response" tab
6. The error message will be there

## Production Deployment Issues

If it works locally but not in production:

1. **Environment variables not set on server**
   - Verify MONGODB_URI is set in production environment
   - Check it's exactly the same as local (copy-paste)

2. **Server IP not whitelisted**
   - Go to MongoDB Atlas → Network Access
   - Add your production server's IP address
   - Or temporarily use 0.0.0.0/0 to test

3. **Build cache issue**
   - Clear build cache
   - Rebuild the application
   - Restart the server

## Get More Help

If none of this works, check:

1. **Terminal/Server logs** - Look for detailed error messages
2. **Browser console** - Check for JavaScript errors
3. **Network tab** - See the actual API error response

The error message will usually tell you exactly what's wrong:
- "Database not configured" → Set MONGODB_URI
- "Connection failed" → Check IP whitelist
- "Authentication failed" → Wrong username/password
- "Network timeout" → Server can't reach MongoDB

## Quick Checklist

- [ ] MONGODB_URI is set in `.env.local` or environment
- [ ] Connection string format is correct
- [ ] Password doesn't have `<>` brackets
- [ ] Special characters in password are URL-encoded
- [ ] IP address is whitelisted in MongoDB Atlas
- [ ] MongoDB cluster is running (not paused)
- [ ] Application has been restarted after adding MONGODB_URI
- [ ] No firewall blocking port 27017

## Working Example

```env
# .env.local
MONGODB_URI=mongodb+srv://pullup:MySecureP@ss123@cluster0.abc123.mongodb.net/pullup?retryWrites=true&w=majority
NEXT_PUBLIC_SITE_URL=http://localhost:3000
RESEND_API_KEY=re_123456789
EMAIL_FROM=PullUp <hello@gopullup.ng>
PAYSTACK_SECRET_KEY=sk_test_123456789
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_123456789
OPS_DASHBOARD_SECRET=my-secret-key-12345
```

After setting this up, restart your dev server and the form should work!
