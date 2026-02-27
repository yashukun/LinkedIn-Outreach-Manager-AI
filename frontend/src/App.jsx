import React, { useState, useEffect } from 'react';
import { Users, MessageSquare, Target, TrendingUp, Plus } from 'lucide-react';
import ContactManager from './components/ContactManager';
import CommentGenerator from './components/CommentGenerator';
import EngagementHistory from './components/EngagementHistory';
import Dashboard from './components/Dashboard';
import AISettings from './components/AISettings';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'generator', label: 'Comment Generator', icon: MessageSquare },
    { id: 'engagements', label: 'Engagement History', icon: Target },
    { id: 'settings', label: 'AI Settings', icon: Plus },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <MessageSquare className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">
                LinkedIn Outreach Manager
              </h1>
            </div>
            {stats && (
              <div className="flex gap-6 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.total_contacts}</div>
                  <div className="text-gray-600">Contacts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.total_engagements}</div>
                  <div className="text-gray-600">Engagements</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{stats.hot_leads}</div>
                  <div className="text-gray-600">Hot Leads</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && <Dashboard stats={stats} onRefresh={fetchStats} />}
        {activeTab === 'contacts' && <ContactManager onUpdate={fetchStats} />}
        {activeTab === 'generator' && <CommentGenerator />}
        {activeTab === 'engagements' && <EngagementHistory />}
        {activeTab === 'settings' && <AISettings />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-gray-500 text-sm">
            LinkedIn Outreach Manager v1.0 - Build meaningful professional relationships
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
