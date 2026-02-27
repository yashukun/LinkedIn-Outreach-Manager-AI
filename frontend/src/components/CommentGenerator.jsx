import React, { useState, useEffect } from 'react';
import { MessageSquare, Copy, Check, Sparkles } from 'lucide-react';
import api from '../services/api';

function CommentGenerator() {
  const [postUrl, setPostUrl] = useState('');
  const [selectedContact, setSelectedContact] = useState('');
  const [contacts, setContacts] = useState([]);
  const [provider, setProvider] = useState('openai');
  const [apiToken, setApiToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchContacts();
    loadSavedPreferences();
  }, []);

  const fetchContacts = async () => {
    try {
      const data = await api.getContacts();
      setContacts(data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  const loadSavedPreferences = async () => {
    try {
      const prefs = await api.getAIPreferences();
      const defaultPref = prefs.find((p) => p.is_default === 'true');
      if (defaultPref) {
        setProvider(defaultPref.provider);
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const handleGenerate = async () => {
    if (!postUrl) {
      alert('Please enter a LinkedIn post URL');
      return;
    }

    try {
      setLoading(true);
      setResult(null);
      setCopied(false);

      const requestData = {
        post_url: postUrl,
        provider: provider,
        token: apiToken || undefined,
        contact_id: selectedContact ? parseInt(selectedContact) : undefined,
      };

      const response = await fetch('http://localhost:8000/api/generate-comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data);
      } else {
        const error = await response.json();
        alert(`Error: ${error.detail}`);
      }
    } catch (error) {
      alert('Failed to generate comment. Make sure the backend is running.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (result?.suggested_comment) {
      navigator.clipboard.writeText(result.suggested_comment);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-600" />
          AI-Powered Comment Generator
        </h2>

        {/* LinkedIn Post URL */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            LinkedIn Post URL *
          </label>
          <input
            type="url"
            placeholder="https://www.linkedin.com/posts/..."
            value={postUrl}
            onChange={(e) => setPostUrl(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Contact Selection (Optional) */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Contact (Optional - for personalization)
          </label>
          <select
            value={selectedContact}
            onChange={(e) => setSelectedContact(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">None - Generate generic comment</option>
            {contacts.map((contact) => (
              <option key={contact.id} value={contact.id}>
                {contact.first_name} {contact.last_name}
                {contact.company ? ` - ${contact.company}` : ''}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Selecting a contact will generate a personalized comment based on their profile
          </p>
        </div>

        {/* AI Provider Selection */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              AI Provider
            </label>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="openai">OpenAI (GPT-4o-mini)</option>
              <option value="hf">HuggingFace (Mixtral-8x7B)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              API Token (Optional)
            </label>
            <input
              type="password"
              placeholder="Leave empty to use saved token"
              value={apiToken}
              onChange={(e) => setApiToken(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={loading || !postUrl}
          className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 font-medium flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Generating...
            </>
          ) : (
            <>
              <MessageSquare className="w-5 h-5" />
              Generate Comment
            </>
          )}
        </button>
      </div>

      {/* Result Section */}
      {result && (
        <div className="bg-white p-6 rounded-lg shadow-md animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Generated Comment</h3>
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy
                </>
              )}
            </button>
          </div>

          {/* Generated Comment */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-gray-800 text-lg leading-relaxed">{result.suggested_comment}</p>
          </div>

          {/* Context Info */}
          {result.contact_context && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-1">Contact Context Used:</p>
              <p className="text-sm text-gray-600">{result.contact_context}</p>
            </div>
          )}

          {/* Post Caption */}
          {result.post_caption && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">Original Post:</p>
              <p className="text-sm text-gray-600 line-clamp-3">{result.post_caption}</p>
            </div>
          )}
        </div>
      )}

      {/* Tips Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200">
        <h3 className="text-lg font-bold text-gray-900 mb-3">💡 Tips for Best Results</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>Select a contact for more personalized and relevant comments</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>Make sure contact profiles have complete information (company, job title, industry)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>Use OpenAI for more natural language, HuggingFace for free alternative</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>Review and customize the generated comment before posting</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default CommentGenerator;
