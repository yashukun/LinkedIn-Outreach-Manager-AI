import React from 'react';
import { TrendingUp, Users, MessageSquare, Target, Activity } from 'lucide-react';

function Dashboard({ stats, onRefresh }) {
  if (!stats) {
    return <div className="text-center py-8">Loading dashboard...</div>;
  }

  const cards = [
    {
      title: 'Total Contacts',
      value: stats.total_contacts,
      icon: Users,
      color: 'blue',
      description: 'People in your network',
    },
    {
      title: 'Active Contacts',
      value: stats.active_contacts,
      icon: Activity,
      color: 'green',
      description: 'Currently engaged contacts',
    },
    {
      title: 'Hot Leads',
      value: stats.hot_leads,
      icon: TrendingUp,
      color: 'red',
      description: 'High priority contacts',
    },
    {
      title: 'Total Engagements',
      value: stats.total_engagements,
      icon: MessageSquare,
      color: 'purple',
      description: 'Comments generated',
    },
    {
      title: 'Pending Comments',
      value: stats.pending_engagements,
      icon: Target,
      color: 'yellow',
      description: 'Ready to post',
    },
    {
      title: 'Posted Comments',
      value: stats.posted_engagements,
      icon: MessageSquare,
      color: 'green',
      description: 'Successfully published',
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600 border-blue-200',
      green: 'bg-green-50 text-green-600 border-green-200',
      red: 'bg-red-50 text-red-600 border-red-200',
      purple: 'bg-purple-50 text-purple-600 border-purple-200',
      yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200',
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Welcome to LinkedIn Outreach Manager</h1>
        <p className="text-blue-100">
          Build meaningful professional relationships with AI-powered engagement
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className={`card-hover bg-white p-6 rounded-lg shadow-md border-2 ${getColorClasses(
                card.color
              )}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${getColorClasses(card.color)}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-3xl font-bold text-gray-900">{card.value}</div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{card.title}</h3>
              <p className="text-sm text-gray-600">{card.description}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => window.location.hash = '#contacts'}
            className="p-4 border-2 border-blue-200 rounded-lg hover:bg-blue-50 transition-colors text-left"
          >
            <Users className="w-6 h-6 text-blue-600 mb-2" />
            <h3 className="font-semibold text-gray-900">Add Contacts</h3>
            <p className="text-sm text-gray-600">Upload CSV or add manually</p>
          </button>
          <button
            onClick={() => window.location.hash = '#generator'}
            className="p-4 border-2 border-green-200 rounded-lg hover:bg-green-50 transition-colors text-left"
          >
            <MessageSquare className="w-6 h-6 text-green-600 mb-2" />
            <h3 className="font-semibold text-gray-900">Generate Comment</h3>
            <p className="text-sm text-gray-600">AI-powered engagement</p>
          </button>
          <button
            onClick={onRefresh}
            className="p-4 border-2 border-purple-200 rounded-lg hover:bg-purple-50 transition-colors text-left"
          >
            <TrendingUp className="w-6 h-6 text-purple-600 mb-2" />
            <h3 className="font-semibold text-gray-900">View Analytics</h3>
            <p className="text-sm text-gray-600">Track your progress</p>
          </button>
        </div>
      </div>

      {/* Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            Engagement Rate
          </h3>
          <div className="space-y-3">
            {stats.total_contacts > 0 && (
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Contacts Engaged</span>
                  <span className="font-medium">
                    {Math.round((stats.total_engagements / stats.total_contacts) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${Math.min(
                        (stats.total_engagements / stats.total_contacts) * 100,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>
            )}
            {stats.total_engagements > 0 && (
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Comments Posted</span>
                  <span className="font-medium">
                    {Math.round((stats.posted_engagements / stats.total_engagements) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{
                      width: `${(stats.posted_engagements / stats.total_engagements) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-lg border-2 border-purple-200">
          <h3 className="text-lg font-bold mb-3">💡 Pro Tips</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-purple-600 font-bold">•</span>
              <span>Keep contact profiles updated for better AI personalization</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 font-bold">•</span>
              <span>Engage consistently - aim for 5-10 meaningful comments daily</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 font-bold">•</span>
              <span>Use tags to organize contacts by campaigns or categories</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 font-bold">•</span>
              <span>Review generated comments before posting for authenticity</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
