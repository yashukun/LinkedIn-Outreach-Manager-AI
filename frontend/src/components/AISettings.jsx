import React, { useState, useEffect } from 'react';
import { Settings, Save, Key } from 'lucide-react';
import api from '../services/api';

function AISettings() {
  const [preferences, setPreferences] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    provider: 'openai',
    api_token: '',
    model_name: '',
    is_default: 'false',
  });

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      setLoading(true);
      const data = await api.getAIPreferences();
      setPreferences(data);
    } catch (error) {
      console.error('Error fetching preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createAIPreference(formData);
      alert('AI preference saved successfully!');
      setFormData({
        provider: 'openai',
        api_token: '',
        model_name: '',
        is_default: 'false',
      });
      setShowForm(false);
      fetchPreferences();
    } catch (error) {
      alert('Failed to save preference');
      console.error(error);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-600" />
            AI Settings
          </h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {showForm ? 'Cancel' : 'Add API Token'}
          </button>
        </div>

        {/* Add Preference Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-4">Add New AI Provider</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Provider *
                </label>
                <select
                  value={formData.provider}
                  onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="openai">OpenAI</option>
                  <option value="hf">HuggingFace</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  API Token *
                </label>
                <input
                  type="password"
                  required
                  value={formData.api_token}
                  onChange={(e) => setFormData({ ...formData, api_token: e.target.value })}
                  placeholder="sk-... or hf_..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Model Name (Optional)
                </label>
                <input
                  type="text"
                  value={formData.model_name}
                  onChange={(e) => setFormData({ ...formData, model_name: e.target.value })}
                  placeholder="gpt-4o-mini or mistralai/Mixtral-8x7B-Instruct-v0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_default"
                  checked={formData.is_default === 'true'}
                  onChange={(e) =>
                    setFormData({ ...formData, is_default: e.target.checked ? 'true' : 'false' })
                  }
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="is_default" className="text-sm text-gray-700">
                  Set as default provider
                </label>
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Preference
              </button>
            </div>
          </form>
        )}

        {/* Saved Preferences */}
        <div>
          <h3 className="font-semibold mb-4">Saved API Tokens</h3>
          {loading ? (
            <div className="text-center py-4">Loading...</div>
          ) : preferences.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Key className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No saved API tokens yet</p>
              <p className="text-sm">Add your OpenAI or HuggingFace API token to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {preferences.map((pref) => (
                <div
                  key={pref.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        pref.provider === 'openai'
                          ? 'bg-green-100 text-green-600'
                          : 'bg-yellow-100 text-yellow-600'
                      }`}
                    >
                      <Key className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 flex items-center gap-2">
                        {pref.provider === 'openai' ? 'OpenAI' : 'HuggingFace'}
                        {pref.is_default === 'true' && (
                          <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded">
                            Default
                          </span>
                        )}
                      </div>
                      {pref.model_name && (
                        <div className="text-sm text-gray-600">{pref.model_name}</div>
                      )}
                      <div className="text-xs text-gray-500">
                        Added {new Date(pref.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border-2 border-blue-200 p-6 rounded-lg">
        <h3 className="font-bold text-lg mb-3">🔑 How to Get Your API Keys</h3>
        <div className="space-y-4 text-sm text-gray-700">
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">OpenAI (Recommended)</h4>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>Visit <a href="https://platform.openai.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">platform.openai.com</a></li>
              <li>Sign up or log in to your account</li>
              <li>Go to API Keys section</li>
              <li>Click "Create new secret key"</li>
              <li>Copy the key (starts with sk-...)</li>
            </ol>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">HuggingFace (Free Alternative)</h4>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>Visit <a href="https://huggingface.co/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">huggingface.co</a></li>
              <li>Create an account or log in</li>
              <li>Go to Settings → Access Tokens</li>
              <li>Create a new token with read permissions</li>
              <li>Copy the token (starts with hf_...)</li>
            </ol>
          </div>
        </div>
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-sm text-yellow-800">
            <strong>⚠️ Security Note:</strong> Your API tokens are stored securely and are never exposed in the UI. Keep them confidential.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AISettings;
