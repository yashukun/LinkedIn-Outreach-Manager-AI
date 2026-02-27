# 🚀 Quick Start Guide

Get LinkedIn Outreach Manager running in under 5 minutes!

## Prerequisites Check

Before starting, ensure you have:

- ✅ Python 3.8+ installed (`python3 --version`)
- ✅ Node.js 16+ installed (`node --version`)
- ✅ PostgreSQL installed (`psql --version`)
- ✅ Google Chrome browser

## One-Command Setup

```bash
cd "/Users/yash/Desktop/The Folder💀/LinkedIn-Outreach-Manager"
./setup.sh
```

## Manual Setup (If script fails)

### Step 1: Database Setup (2 minutes)

```bash
# Create the database
createdb linkedin_outreach

# Verify it was created
psql -l | grep linkedin_outreach
```

If you need to set a password:

```bash
psql postgres
ALTER USER postgres WITH PASSWORD 'admin';
\q
```

### Step 2: Backend Setup (2 minutes)

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the server
uvicorn main:app --reload
```

**Backend will be running at:** http://localhost:8000

### Step 3: Frontend Setup (2 minutes)

Open a **new terminal**:

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

**Frontend will be running at:** http://localhost:3000

### Step 4: Chrome Extension (1 minute)

1. Open Chrome and navigate to `chrome://extensions/`
2. Toggle "Developer mode" ON (top-right corner)
3. Click "Load unpacked"
4. Navigate to and select the `extension` folder
5. The extension icon should appear in your toolbar

### Step 5: Get Your API Keys (2 minutes)

**Option 1: OpenAI (Recommended, Paid)**

1. Go to https://platform.openai.com/
2. Sign up or login
3. Click your profile → "View API keys"
4. "Create new secret key" → Copy it (starts with `sk-`)

**Option 2: HuggingFace (Free)**

1. Go to https://huggingface.co/
2. Sign up or login
3. Settings → Access Tokens
4. "New token" → Read permission → Copy it (starts with `hf_`)

### Step 6: Configure the App (1 minute)

1. Open http://localhost:3000
2. Go to "AI Settings" tab
3. Click "Add API Token"
4. Select your provider (OpenAI or HuggingFace)
5. Paste your API token
6. Check "Set as default"
7. Click "Save"

---

## 🎉 You're Ready!

### Test the System

1. **Add a test contact:**
   - Go to "Contacts" tab
   - Click "Add Contact"
   - Fill in: First Name, Last Name, Company
   - Save

2. **Generate your first comment:**
   - Go to "Comment Generator" tab
   - Paste any LinkedIn post URL
   - Select your test contact (optional)
   - Click "Generate Comment"
   - Review the result!

3. **Try the extension:**
   - Go to LinkedIn.com
   - Navigate to any post
   - Click the extension icon
   - Click "Get Current Page URL"
   - Click "Generate Comment"

---

## 🔧 Quick Troubleshooting

### Backend won't start?

```bash
# Check PostgreSQL is running
brew services list | grep postgresql

# If not running:
brew services start postgresql
```

### Frontend shows errors?

```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Extension not connecting?

1. Make sure backend is running on http://localhost:8000
2. Reload the extension in `chrome://extensions/`
3. Right-click extension → "Inspect" to see console errors

### Database connection failed?

Update `backend/database.py` line 7:

```python
URL_DATABASE = 'postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/linkedin_outreach'
```

---

## 📚 Next Steps

- **Import contacts:** Use the sample CSV template in `contacts_template.csv`
- **Read full docs:** See `README.md` for complete documentation
- **Customize:** Edit API base URLs in `frontend/src/services/api.js`

---

## 🆘 Still Having Issues?

1. Check if all services are running:
   - Backend: http://localhost:8000 (should show JSON)
   - Frontend: http://localhost:3000 (should show dashboard)
   - Database: `psql linkedin_outreach` (should connect)

2. Check the logs:
   - Backend: Terminal where uvicorn is running
   - Frontend: Browser console (F12)
   - Extension: Right-click extension → Inspect

3. Verify API docs are accessible:
   - http://localhost:8000/docs

---

**Happy networking! 🤝**
