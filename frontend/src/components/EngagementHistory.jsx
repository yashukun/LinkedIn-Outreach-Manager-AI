import React, { useState, useEffect } from 'react';
import { History, ExternalLink, Calendar, User } from 'lucide-react';
import api from '../services/api';

function EngagementHistory() {
  const [engagements, setEngagements] = useState([]);
  const [contacts, setContacts] = useState({});
  const [loading, setLoading] = useState(false);
  const [filterContact, setFilterContact] = useState('');

  useEffect(() => {
    fetchEngagements();
  }, [filterContact]);

  const fetchEngagements = async () => {
    try {
      setLoading(true);
      const data = await api.getEngagements(filterContact || null);
      setEngagements(data);

      // Fetch contact details for each engagement
      const contactIds = [...new Set(data.map((e) => e.contact_id))];
      const contactsData = {};
      
      await Promise.all(
        contactIds.map(async (id) => {
          try {
            const contact = await api.getContact(id);
            contactsData[id] = contact;
          } catch (error) {
            console.error(`Error fetching contact ${id}:`, error);
          }
        })
      );
      
      setContacts(contactsData);
    } catch (error) {
      console.error('Error fetching engagements:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      posted: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
    };

    return (
      <span className={`px-2 py-1 text-xs rounded-full ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <History className="w-5 h-5 text-blue-600" />
            Engagement History
          </h2>
          <button
            onClick={fetchEngagements}
            className="px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50"
          >
            Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{engagements.length}</div>
            <div className="text-sm text-gray-600">Total Engagements</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {engagements.filter((e) => e.comment_posted === 'posted').length}
            </div>
            <div className="text-sm text-gray-600">Posted</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {engagements.filter((e) => e.comment_posted === 'pending').length}
            </div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
        </div>

        {/* Engagements List */}
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : engagements.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No engagements yet. Start generating comments!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {engagements.map((engagement) => {
              const contact = contacts[engagement.contact_id];
              return (
                <div
                  key={engagement.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {contact ? (
                        <div>
                          <div className="font-medium text-gray-900 flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            {contact.first_name} {contact.last_name}
                          </div>
                          {contact.company && (
                            <div className="text-sm text-gray-600">
                              {contact.job_title} at {contact.company}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-gray-500">Loading contact...</div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(engagement.comment_posted)}
                      <a
                        href={engagement.post_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        title="View Post"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <p className="text-sm text-gray-700 italic">"{engagement.generated_comment}"</p>
                  </div>

                  {engagement.post_caption && (
                    <details className="mb-2">
                      <summary className="text-sm text-gray-600 cursor-pointer hover:text-gray-900">
                        View original post
                      </summary>
                      <p className="text-sm text-gray-600 mt-2 pl-4 border-l-2 border-gray-200">
                        {engagement.post_caption}
                      </p>
                    </details>
                  )}

                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(engagement.engagement_date)}
                    </span>
                    {engagement.ai_provider && (
                      <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded">
                        {engagement.ai_provider.toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default EngagementHistory;
