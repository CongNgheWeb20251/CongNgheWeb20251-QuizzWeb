import React from 'react'
import './StudentDashboard.css'

function StudentDashboard() {
  // Mock data
  const stats = [
    { label: 'Quizzes Taken', value: 12, icon: '📝', color: '#4f46e5' },
    { label: 'Avg. Score', value: '85%', icon: '🎯', color: '#10b981' },
    { label: 'Pending', value: 3, icon: '⏳', color: '#f59e0b' }
  ]

  const upcomingTests = [
    { id: 1, title: 'Advanced Mathematics', date: 'Tomorrow, 10:00 AM', duration: '60 min', status: 'upcoming' },
    { id: 2, title: 'Physics Mid-term', date: 'Dec 5, 09:00 AM', duration: '90 min', status: 'upcoming' }
  ]

  const recentResults = [
    { id: 101, title: 'History of Art', score: 92, date: 'Yesterday', status: 'passed' },
    { id: 102, title: 'Basic Chemistry', score: 78, date: '2 days ago', status: 'passed' },
    { id: 103, title: 'English Literature', score: 65, date: 'Last week', status: 'average' }
  ]

  return (
    <div className="student-dashboard">
      <div className="welcome-section">
        <h1>Welcome back, Student! 👋</h1>
        <p>You have <strong>3 pending quizzes</strong> to complete this week.</p>
      </div>

      <div className="stats-row">
        {stats.map((stat, index) => (
          <div key={index} className="std-stat-card">
            <div className="std-stat-icon" style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>
              {stat.icon}
            </div>
            <div className="std-stat-info">
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-col">
          <div className="section-header">
            <h2>📅 Upcoming Tests</h2>
            <button className="view-all-btn">View All</button>
          </div>
          <div className="card-list">
            {upcomingTests.map(test => (
              <div key={test.id} className="std-card upcoming-card">
                <div className="card-icon">⏰</div>
                <div className="card-content">
                  <h3>{test.title}</h3>
                  <p>{test.date} • {test.duration}</p>
                </div>
                <button className="start-btn">Start</button>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-col">
          <div className="section-header">
            <h2>🏆 Recent Results</h2>
            <button className="view-all-btn">View History</button>
          </div>
          <div className="card-list">
            {recentResults.map(result => (
              <div key={result.id} className="std-card result-card">
                <div className="result-score" style={{ 
                  color: result.score >= 80 ? '#10b981' : result.score >= 60 ? '#f59e0b' : '#ef4444' 
                }}>
                  {result.score}
                </div>
                <div className="card-content">
                  <h3>{result.title}</h3>
                  <p>{result.date}</p>
                </div>
                <div className="result-badge">{result.status}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard
