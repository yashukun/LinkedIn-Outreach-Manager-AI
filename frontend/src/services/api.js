const API_BASE_URL = 'http://localhost:8000/api';

const api = {
  // Contacts
  async getContacts(search = '', status = '') {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (status) params.append('status', status);
    
    const response = await fetch(`${API_BASE_URL}/contacts?${params}`);
    return response.json();
  },

  async getContact(id) {
    const response = await fetch(`${API_BASE_URL}/contacts/${id}`);
    return response.json();
  },

  async createContact(data) {
    const response = await fetch(`${API_BASE_URL}/contacts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async updateContact(id, data) {
    const response = await fetch(`${API_BASE_URL}/contacts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async deleteContact(id) {
    const response = await fetch(`${API_BASE_URL}/contacts/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },

  // Engagements
  async getEngagements(contactId = null) {
    const params = new URLSearchParams();
    if (contactId) params.append('contact_id', contactId);
    
    const response = await fetch(`${API_BASE_URL}/engagements?${params}`);
    return response.json();
  },

  async createEngagement(data) {
    const response = await fetch(`${API_BASE_URL}/engagements`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async getContactEngagements(contactId) {
    const response = await fetch(`${API_BASE_URL}/contacts/${contactId}/engagements`);
    return response.json();
  },

  // AI Preferences
  async getAIPreferences() {
    const response = await fetch(`${API_BASE_URL}/ai-preferences`);
    return response.json();
  },

  async createAIPreference(data) {
    const response = await fetch(`${API_BASE_URL}/ai-preferences`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // Campaigns
  async getCampaigns() {
    const response = await fetch(`${API_BASE_URL}/campaigns`);
    return response.json();
  },

  async createCampaign(data) {
    const response = await fetch(`${API_BASE_URL}/campaigns`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // Stats
  async getStats() {
    const response = await fetch(`${API_BASE_URL}/stats`);
    return response.json();
  },
};

export default api;
