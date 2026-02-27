# LinkedIn Outreach Manager 🚀

**Build meaningful professional relationships with AI-powered engagement and smart contact management.**

LinkedIn Outreach Manager is a unified platform that combines contact relationship management (CRM) with AI-powered LinkedIn comment generation. Perfect for recruiters, sales professionals, marketers, and anyone looking to build authentic professional relationships at scale.

---

## 🌟 Key Features

### 📊 Contact Management

- **Bulk CSV Import**: Upload hundreds of contacts instantly
- **Rich Profiles**: Store name, company, job title, LinkedIn URL, industry, location, tags, and notes
- **Smart Filtering**: Filter by status (Active, Hot Lead, Candidate, Partner, Archived)
- **Search**: Quick search across all contact fields

### 💬 AI-Powered Comment Generation

- **Context-Aware**: Generate personalized comments based on contact profile data
- **Dual AI Support**: OpenAI (GPT-4o-mini) or HuggingFace (Mixtral-8x7B)
- **Post Scraping**: Automatically extract LinkedIn post content
- **Smart Personalization**: Comments reference contact's industry, role, and company

### 📈 Engagement Tracking

- **Full History**: Track every generated comment with timestamp
- **Contact Association**: Link engagements to specific contacts
- **Status Tracking**: Pending, Posted, or Failed status for each engagement
- **Analytics Dashboard**: View engagement rates and performance metrics

### 🔧 Chrome Extension

- **Quick Access**: Generate comments directly from LinkedIn
- **Auto-Detection**: Automatically detect contacts from LinkedIn profiles
- **One-Click Generation**: Generate and copy comments instantly
- **Current Page Integration**: Use current LinkedIn page URL automatically

### 🎯 Campaign Management

- **Organize Outreach**: Group contacts into campaigns
- **Track Progress**: Monitor campaign status and engagement
- **Bulk Operations**: Manage multiple contacts together

---

## 🏗️ Architecture

```
LinkedIn-Outreach-Manager/
├── backend/                    # FastAPI Python Backend
│   ├── main.py                # Main API application
│   ├── database.py            # SQLAlchemy models & DB setup
│   ├── models.py              # Pydantic request/response models
│   └── utils/
│       ├── linkedin_scraper.py  # Selenium-based post scraper
│       └── ai_generator.py      # OpenAI/HF comment generation
│
├── frontend/                   # React + Vite Frontend
│   ├── src/
│   │   ├── App.jsx            # Main application
│   │   ├── components/
│   │   │   ├── ContactManager.jsx
│   │   │   ├── CommentGenerator.jsx
│   │   │   ├── EngagementHistory.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── AISettings.jsx
│   │   └── services/
│   │       └── api.js         # Backend API client
│   └── package.json
│
└── extension/                  # Chrome Extension
    ├── manifest.json
    ├── popup.html/js          # Extension popup UI
    ├── background.js          # Background service worker
    └── content.js             # LinkedIn page integration
```

---

## 🚀 Quick Start

### Prerequisites

- **Python 3.8+**
- **Node.js 16+**
- **PostgreSQL 12+**
- **Google Chrome** (for extension)

### 1. Database Setup

```bash
# Install PostgreSQL (macOS)
brew install postgresql
brew services start postgresql

# Create database
createdb linkedin_outreach

# Or use psql
psql postgres
CREATE DATABASE linkedin_outreach;
\q
```

Update the connection string in `backend/database.py`:

```python
URL_DATABASE = 'postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/linkedin_outreach'
```

### 2. Backend Setup

```bash
cd LinkedIn-Outreach-Manager/backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the server
uvicorn main:app --reload
```

Backend will run on **http://localhost:8000**

### 3. Frontend Setup

```bash
cd LinkedIn-Outreach-Manager/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on **http://localhost:3000**

### 4. Chrome Extension Setup

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (top right)
3. Click "Load unpacked"
4. Select the `LinkedIn-Outreach-Manager/extension` folder
5. The extension icon will appear in your toolbar

---

## 📖 Usage Guide

### Adding Contacts

**Method 1: CSV Upload**

1. Prepare a CSV file with columns: `first_name, last_name, email, phone_number, company, job_title, linkedin_url, industry, location`
2. Go to "Contacts" tab
3. Click "Upload CSV" and select your file

**Method 2: Manual Entry**

1. Go to "Contacts" tab
2. Click "Add Contact"
3. Fill in the form and save

### Generating Comments

**From Web Interface:**

1. Go to "Comment Generator" tab
2. Enter LinkedIn post URL (or paste)
3. Optionally select a contact for personalization
4. Choose AI provider (OpenAI recommended)
5. Click "Generate Comment"
6. Review and copy the comment

**From Chrome Extension:**

1. Navigate to a LinkedIn post
2. Click the extension icon
3. Click "Get Current Page URL"
4. Optionally detect contact if on their profile
5. Click "Generate Comment"
6. Comment is auto-copied to clipboard

### Setting Up AI Providers

**OpenAI (Recommended):**

1. Visit [platform.openai.com](https://platform.openai.com/)
2. Create an account and add billing
3. Go to API Keys → Create new
4. Copy your API key (starts with `sk-...`)
5. In the app, go to "AI Settings"
6. Add OpenAI provider with your key
7. Check "Set as default"

**HuggingFace (Free):**

1. Visit [huggingface.co](https://huggingface.co/)
2. Create an account
3. Go to Settings → Access Tokens
4. Create a new token with read permissions
5. Copy your token (starts with `hf_...`)
6. In the app, add HuggingFace provider with your token

### Viewing Engagement History

1. Go to "Engagement History" tab
2. See all generated comments with:
   - Contact information
   - Post URL
   - Generated comment
   - Status (Pending/Posted)
   - Timestamp
   - AI provider used

---

## 🎯 Use Cases

### For Recruiters

- Upload candidate database
- Track engagement with each candidate
- Generate personalized comments on candidates' posts
- Warm up relationships before reaching out

### For Sales Teams

- Manage prospect contacts
- Engage with prospects' content authentically
- Track touchpoints and engagement history
- Build relationships before cold outreach

### For Marketing/PR

- Track influencers and partners
- Consistent, thoughtful engagement
- Measure engagement rates
- Build authentic relationships at scale

### For Job Seekers

- Manage target companies and hiring managers
- Strategic engagement with decision makers
- Stand out with thoughtful, personalized comments
- Track networking progress

---

## 🔒 Security & Privacy

- ✅ API tokens stored locally and encrypted
- ✅ No data sent to third parties (except chosen AI provider)
- ✅ Your database, your data
- ✅ Open source - audit the code yourself
- ✅ Extension only accesses LinkedIn with your permission

---

## 🛠️ Configuration

### Database Connection

Edit `backend/database.py`:

```python
URL_DATABASE = 'postgresql://user:password@localhost:5432/linkedin_outreach'
```

### API Configuration

Edit `frontend/src/services/api.js` if backend runs on different port:

```javascript
const API_BASE_URL = "http://localhost:8000/api";
```

### Extension Backend URL

Edit `extension/popup.js` if backend runs elsewhere:

```javascript
const API_BASE = "http://localhost:8000/api";
```

---

## 📊 API Documentation

Once the backend is running, visit:

- **API Docs**: http://localhost:8000/docs
- **Alternative Docs**: http://localhost:8000/redoc

### Key Endpoints

- `GET /api/contacts` - List all contacts
- `POST /api/contacts` - Create new contact
- `POST /api/contacts/upload-csv` - Bulk upload contacts
- `POST /api/generate-comment` - Generate AI comment
- `GET /api/engagements` - Get engagement history
- `GET /api/stats` - Get dashboard statistics

---

## 🤝 Contributing

This is a personal project, but contributions are welcome! Feel free to:

- Report bugs
- Suggest features
- Submit pull requests
- Improve documentation

---

## 📝 License

MIT License - feel free to use and modify for your needs.

---

## 🆘 Troubleshooting

### Backend won't start

- Check PostgreSQL is running: `brew services list`
- Verify database connection string in `database.py`
- Ensure all dependencies installed: `pip install -r requirements.txt`

### Frontend won't start

- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Check Node version: `node --version` (needs 16+)

### Extension not working

- Check backend is running on http://localhost:8000
- Reload extension in `chrome://extensions/`
- Check console for errors (right-click extension → Inspect)

### Selenium/Scraping errors

- Install ChromeDriver: `brew install chromedriver`
- Ensure Chrome browser is installed
- LinkedIn may block automated access - use API token

### Comment generation fails

- Verify API token is correct
- Check API provider has credits/quota
- Review backend logs for detailed errors

---

## 🎓 Tips for Best Results

1. **Keep profiles updated** - More contact data = better personalization
2. **Review before posting** - Always review AI-generated comments
3. **Be authentic** - Use generated comments as inspiration, add your voice
4. **Engage consistently** - 5-10 meaningful comments daily
5. **Use tags** - Organize contacts by campaign, priority, etc.
6. **Track what works** - Monitor engagement rates in dashboard

---

## 🚦 Roadmap

Future enhancements being considered:

- [ ] Automated scheduled engagement campaigns
- [ ] LinkedIn message generation
- [ ] Email integration and templates
- [ ] Advanced analytics and insights
- [ ] Multi-user team support
- [ ] Mobile app
- [ ] Integration with CRM systems (HubSpot, Salesforce)

---

## 📧 Support

For questions or issues:

- Check the troubleshooting section above
- Review API docs at http://localhost:8000/docs
- Check browser console for errors
- Review backend logs

---

**Built with ❤️ for meaningful professional relationships**

Stop spamming. Start building real connections. 🤝
