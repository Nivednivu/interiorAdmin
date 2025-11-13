import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isFocused, setIsFocused] = useState({ username: false, password: false });
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate API call
    setTimeout(() => {
      if (username === 'admin' && password === 'admin@123') {
        // Store authentication token
        localStorage.setItem('adminToken', 'authenticated');
        localStorage.setItem('adminUser', JSON.stringify({ 
          name: 'Admin', 
          email: 'admin@interiordesign.com',
          role: 'administrator' 
        }));
        
        // Navigate to dashboard
        navigate('/admin');
      } else {
        setError('Invalid username or password');
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="admin-login-premium">
      {/* Background */}
      <div className="login-bg-premium">
        <div className="bg-shape shape-1"></div>
        <div className="bg-shape shape-2"></div>
        <div className="bg-shape shape-3"></div>
        
        {/* Gradient Overlays */}
        <div className="bg-gradient-1"></div>
        <div className="bg-gradient-2"></div>
        <div className="bg-gradient-3"></div>
      </div>

      <div className="login-content-premium">
        {/* Left Side - Illustration */}
        <div className="login-illustration-premium">
          <div className="illustration-container-premium">
            <div className="illustration-main-premium">
              <div className="admin-icon-premium">
              
              </div>
              <h2>Welcome to Admin Portal</h2>
              <p>Manage your interior design empire with precision, style, and complete control</p>
              
              {/* Feature List */}
              <div className="feature-list">
                <div className="feature-item">
                  <span className="feature-icon"></span>
                  <span>Advanced Analytics</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon"></span>
                  <span>Enterprise Security</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon"></span>
                  <span>Real-time Dashboard</span>
                </div>
              </div>
            </div>

            {/* Decorations */}
           
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="login-form-container-premium" style={{marginTop:'50px'}}>
          <motion.div 
            className="login-card-premium"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header */}
            <div className="login-header-premium" >
              <div className="logo-premium">
                <span className="logo-icon-premium">
                  🎨
                </span>
                <div className="logo-text-premium">
                  <h1>InteriorDesign Pro</h1>
                  <span className="logo-subtitle-premium">
                    Admin Portal
                  </span>
                </div>
              </div>
              <p className="welcome-text">
                Secure access to your design empire
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="login-form-premium">
              {error && (
                <div className="error-message-premium">
                  <span className="error-icon-premium">⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              {/* Username Field */}
              <div className="form-group-premium">
                <label>Username</label>
                <div className={`input-container-premium ${isFocused.username ? 'focused' : ''}`}>
                  <span className="input-icon-premium">
                    👤
                  </span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onFocus={() => setIsFocused(prev => ({ ...prev, username: true }))}
                    onBlur={() => setIsFocused(prev => ({ ...prev, username: false }))}
                    placeholder="Enter your username"
                    required
                    disabled={loading}
                  />
                  <div className={`input-underline-premium ${isFocused.username ? 'active' : ''}`} />
                </div>
              </div>

              {/* Password Field */}
              <div className="form-group-premium">
                <label>Password</label>
                <div className={`input-container-premium ${isFocused.password ? 'focused' : ''}`}>
                  <span className="input-icon-premium">
                    🔒
                  </span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setIsFocused(prev => ({ ...prev, password: true }))}
                    onBlur={() => setIsFocused(prev => ({ ...prev, password: false }))}
                    placeholder="Enter your password"
                    required
                    disabled={loading}
                  />
                  <div className={`input-underline-premium ${isFocused.password ? 'active' : ''}`} />
                </div>
              </div>

              {/* Login Button */}
              <motion.button
                type="submit"
                className="login-button-premium"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
              >
                {loading ? (
                  <div className="button-loading-premium">
                    <div className="loading-spinner-premium"></div>
                    <span>Authenticating...</span>
                  </div>
                ) : (
                  <div className="button-content-premium">
                    <span className="button-icon-premium">🚀</span>
                    <span>Access Dashboard</span>
                  </div>
                )}
              </motion.button>
            </form>

            {/* Demo Credentials */}
            {/* <div className="demo-credentials-premium">
              <div className="credentials-card-premium">
                <h4>Demo Credentials</h4>
                <div className="credential-list">
                  <div className="credential-item-premium">
                    <span className="credential-icon-premium">👤</span>
                    <span>Username: <strong>admin</strong></span>
                  </div>
                  <div className="credential-item-premium">
                    <span className="credential-icon-premium">🔑</span>
                    <span>Password: <strong>admin@123</strong></span>
                  </div>
                </div>
              </div>
            </div> */}

            {/* Security Badge */}
            <div className="security-badge-premium">
              <div className="security-content-premium">
                <span className="security-icon-premium">🛡️</span>
                <span>Enterprise-grade Security & Encryption</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;