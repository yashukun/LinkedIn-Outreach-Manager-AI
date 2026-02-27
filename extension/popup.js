const API_BASE = 'http://localhost:8000/api';

// Load saved settings
chrome.storage.sync.get(['provider', 'token'], (data) => {
  if (data.provider) document.getElementById('provider').value = data.provider;
  if (data.token) document.getElementById('token').value = data.token;
});

// Load contacts from backend
async function loadContacts() {
  try {
    const response = await fetch(`${API_BASE}/contacts`);
    const contacts = await response.json();
    
    const select = document.getElementById('contactSelect');
    select.innerHTML = '<option value="">None - Generic comment</option>';
    
    contacts.forEach(contact => {
      const option = document.createElement('option');
      option.value = contact.id;
      option.textContent = `${contact.first_name} ${contact.last_name}${contact.company ? ` - ${contact.company}` : ''}`;
      select.appendChild(option);
    });
  } catch (error) {
    console.error('Error loading contacts:', error);
    document.getElementById('contactSelect').innerHTML = '<option value="">Error loading contacts</option>';
  }
}

// Show status message
function showStatus(message, type = 'success') {
  const statusEl = document.getElementById('status');
  statusEl.textContent = message;
  statusEl.className = `status show ${type}`;
  
  if (type === 'success') {
    setTimeout(() => {
      statusEl.classList.remove('show');
    }, 3000);
  }
}

// Get current page URL
document.getElementById('getCurrentPage').addEventListener('click', async () => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab.url && tab.url.includes('linkedin.com')) {
      document.getElementById('postUrl').value = tab.url;
      showStatus('✓ Current page URL captured', 'success');
    } else {
      showStatus('Please navigate to a LinkedIn page', 'error');
    }
  } catch (error) {
    showStatus('Error getting current page', 'error');
  }
});

// Detect contact from LinkedIn profile
document.getElementById('detectContact').addEventListener('click', async () => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab.url || !tab.url.includes('linkedin.com')) {
      showStatus('Please navigate to a LinkedIn profile or post', 'error');
      return;
    }

    // Extract LinkedIn username from URL
    const urlMatch = tab.url.match(/linkedin\.com\/in\/([^\/\?]+)/);
    if (!urlMatch) {
      showStatus('Not a LinkedIn profile page', 'error');
      return;
    }

    const linkedinUsername = urlMatch[1];
    
    // Search for contact by LinkedIn URL
    const response = await fetch(`${API_BASE}/contacts?search=${linkedinUsername}`);
    const contacts = await response.json();
    
    if (contacts.length > 0) {
      const contact = contacts[0];
      document.getElementById('contactDetails').innerHTML = `
        <strong>${contact.first_name} ${contact.last_name}</strong><br>
        ${contact.job_title ? `${contact.job_title}${contact.company ? ` at ${contact.company}` : ''}<br>` : ''}
        ${contact.status ? `<span style="background: #dbeafe; padding: 2px 6px; border-radius: 4px; font-size: 10px;">${contact.status}</span>` : ''}
      `;
      document.getElementById('contactInfo').style.display = 'block';
      
      // Auto-select this contact
      document.getElementById('contactSelect').value = contact.id;
      showStatus('✓ Contact found and selected', 'success');
    } else {
      showStatus('Contact not found in database', 'error');
      document.getElementById('contactInfo').style.display = 'none';
    }
  } catch (error) {
    console.error('Error detecting contact:', error);
    showStatus('Error detecting contact', 'error');
  }
});

// Generate comment
document.getElementById('generate').addEventListener('click', async () => {
  const postUrl = document.getElementById('postUrl').value;
  const provider = document.getElementById('provider').value;
  const token = document.getElementById('token').value;
  const contactId = document.getElementById('contactSelect').value;

  if (!postUrl) {
    showStatus('Please enter a LinkedIn post URL', 'error');
    return;
  }

  // Save preferences
  chrome.storage.sync.set({ provider, token });

  const generateBtn = document.getElementById('generate');
  generateBtn.disabled = true;
  generateBtn.innerHTML = '<span class="spinner"></span><span>Generating...</span>';

  try {
    const requestData = {
      post_url: postUrl,
      provider: provider,
      token: token || undefined,
      contact_id: contactId ? parseInt(contactId) : undefined
    };

    const response = await fetch('http://localhost:8000/api/generate-comment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to generate comment');
    }

    const data = await response.json();
    
    // Show output
    document.getElementById('output').value = data.suggested_comment;
    document.getElementById('outputSection').style.display = 'block';
    
    // Auto-copy to clipboard
    navigator.clipboard.writeText(data.suggested_comment);
    
    showStatus('✓ Comment generated and copied!', 'success');
  } catch (error) {
    console.error('Error:', error);
    showStatus(error.message || 'Failed to generate comment', 'error');
  } finally {
    generateBtn.disabled = false;
    generateBtn.innerHTML = '<span>✨</span><span>Generate Comment</span>';
  }
});

// Copy to clipboard
document.getElementById('copy').addEventListener('click', () => {
  const output = document.getElementById('output').value;
  navigator.clipboard.writeText(output);
  
  const copyBtn = document.getElementById('copy');
  const originalText = copyBtn.textContent;
  copyBtn.textContent = '✓ Copied!';
  copyBtn.style.background = '#059669';
  
  setTimeout(() => {
    copyBtn.textContent = originalText;
    copyBtn.style.background = '#10b981';
  }, 2000);
});

// Initialize
loadContacts();
