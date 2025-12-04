import './Home.css'
import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()

  const handleStarted = () => {
    navigate('/signin')
  }

  const handleSignIn = () => {
    navigate('/signin')
  }

  const handleRegister = () => {
    navigate('/signup')
  }

  return (
    <>
      <header className="header">
        <div className="container">
          <div className="nav-wrapper">
            <div className="logo">Quizzy</div>
            <nav className="nav-links">
              <a href="#quiz">Quiz</a>
              <a href="#weekly">Weekly Quiz</a>
              <a href="#rewards">Rewards</a>
              <a href="#about">About</a>
            </nav>
            <div className="nav-buttons">
              <button className="btn-signin" onClick={handleSignIn}>Sign In</button>
              <button className="btn-register" onClick={handleRegister}>Register</button>
            </div>
          </div>
        </div>
      </header>

      <section className="hero-section">
        <div className="hero-background">
          <div className="grid-pattern"></div>
          <div className="glow-effect glow-purple"></div>
          <div className="glow-effect glow-orange"></div>
        </div>
        <div className="">
          <div className="hero-content">
            <p className="tagline">The ultimate quiz experience</p>
            <h1 className="hero-heading">
                      Learn, <span className="gradient-text">Quiz</span>, Earn <span className="gradient-text">Rewards</span>
            </h1>
            <p className="hero-subtext">
                      Join thousands of students and teachers on the ultimate quiz platform.
                      Test your knowledge, compete with peers, and win exciting rewards.
            </p>
            <div className="hero-buttons">
              <button className="btn-primary" onClick={handleStarted}>Get Started</button>
              <button className="btn-outline">Explore Quizzes</button>
            </div>
          </div>
        </div>
      </section>

      <section className="categories-section" id="quiz">
        <div className="container">
          <div className="section-header">
            <h2>Explore <span className="purple-text">Quiz Categories</span></h2>
            <p className="section-subtext">
                      Discover quizzes across various subjects to test and expand your knowledge.
            </p>
          </div>
          <div className="categories-grid">
            <div className="category-card border-purple">
              <div className="card-icon">🔬</div>
              <h3>Science & Tech</h3>
              <p>Explore cutting-edge topics in science and technology with engaging quizzes.</p>
              <a href="#" className="card-link purple">Explore Quizzes →</a>
            </div>
            <div className="category-card border-orange">
              <div className="card-icon">📐</div>
              <h3>Mathematics</h3>
              <p>Challenge your problem-solving skills with math quizzes from basic to advanced.</p>
              <a href="#" className="card-link orange">Explore Quizzes →</a>
            </div>
            <div className="category-card border-green">
              <div className="card-icon">⚗️</div>
              <h3>Chemistry</h3>
              <p>Dive into the world of elements, compounds, and chemical reactions.</p>
              <a href="#" className="card-link green">Explore Quizzes →</a>
            </div>
            <div className="category-card border-pink">
              <div className="card-icon">🧬</div>
              <h3>Biology</h3>
              <p>Discover the fascinating world of living organisms and life sciences.</p>
              <a href="#" className="card-link pink">Explore Quizzes →</a>
            </div>
            <div className="category-card border-blue">
              <div className="card-icon">🌍</div>
              <h3>General Knowledge</h3>
              <p>Test your awareness of world facts, history, geography, and culture.</p>
              <a href="#" className="card-link blue">Explore Quizzes →</a>
            </div>
            <div className="category-card border-red">
              <div className="card-icon">📰</div>
              <h3>Current Affairs</h3>
              <p>Stay updated with the latest news and global events through our quizzes.</p>
              <a href="#" className="card-link red">Explore Quizzes →</a>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section" id="about">
        <div className="container">
          <div className="section-header">
            <h2>Why <span className="purple-text">Quizzy</span></h2>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Personalized Learning</h3>
              <p>Get customized quiz recommendations based on your interests and skill level.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🏆</div>
              <h3>Reward System</h3>
              <p>Earn points, badges, and rewards as you complete quizzes and improve your scores.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👨‍🏫</div>
              <h3>Teacher Dashboard</h3>
              <p>Create and manage quizzes, track student progress, and analyze performance data.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Progress Tracking</h3>
              <p>Monitor your learning journey with detailed analytics and performance insights.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🥇</div>
              <h3>Competitive Leaderboards</h3>
              <p>Compete with peers globally and climb the rankings to showcase your knowledge.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Mobile Friendly</h3>
              <p>Access quizzes anytime, anywhere on any device with our responsive platform.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-column">
              <h3 className="footer-brand">Quizzy</h3>
              <p>The ultimate quiz platform for students and teachers to learn, compete, and earn rewards.</p>
              <div className="social-icons">
                <span className="social-icon">📘</span>
                <span className="social-icon">🐦</span>
                <span className="social-icon">📷</span>
                <span className="social-icon">💼</span>
              </div>
            </div>
            <div className="footer-column">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="#">Home</a></li>
                <li><a href="#">About Us</a></li>
                <li><a href="#">Features</a></li>
                <li><a href="#">Contact</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>For Teachers</h4>
              <ul>
                <li><a href="#">About</a></li>
                <li><a href="#">Contact Us</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Culture</a></li>
                <li><a href="#">Blog</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>Contact Us</h4>
              <ul className="contact-info">
                <li>📧 example@sis.hust.edu.vn</li>
                <li>📞 0123456789</li>
                <li>📍 Số 1 Đại Cồ Việt,<br/>Hà Nội</li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2025 StuQuiz</p>
            <p>All Rights Reserved | Terms and Conditions | Privacy Policy</p>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Home