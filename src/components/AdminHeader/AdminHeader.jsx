import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import './AdminHeader.css';

const AdminHeader = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Get user data from localStorage
  const getUserData = () => {
    try {
      const userData = localStorage.getItem('adminUser');
      return userData ? JSON.parse(userData) : { 
        name: 'Admin', 
        email: 'admin@interiordesign.com',
        role: 'Administrator'
      };
    } catch {
      return { 
        name: 'Admin', 
        email: 'admin@interiordesign.com',
        role: 'Administrator'
      };
    }
  };

  const user = getUserData();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  const menuItems = [
    { icon: '📊', label: 'Dashboard', path: '/admin/dashboard' },
    { icon: '📦', label: 'Products', path: '/admin/products' },
    { icon: '🏷️', label: 'Categories', path: '/admin/categories' },
    { icon: '👥', label: 'Customers', path: '/admin/customers' },
    { icon: '📈', label: 'Analytics', path: '/admin/analytics' },
    { icon: '⚙️', label: 'Settings', path: '/admin/settings' }
  ];

  const headerVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    },
    scrolled: {
      background: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(20px)",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
      borderBottom: "1px solid rgba(255, 255, 255, 0.2)"
    }
  };

  const menuVariants = {
    hidden: { opacity: 0, scale: 0.9, y: -10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: -10,
      transition: {
        duration: 0.2,
        ease: "easeIn"
      }
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
    setIsProfileOpen(false);
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  return (
    <motion.header 
      className={`admin-header-premium ${scrolled ? 'scrolled' : ''}`}
      variants={headerVariants}
      initial="hidden"
      animate={["visible", scrolled ? "scrolled" : ""]}
    >
      <div className="header-container-premium">
        {/* Logo Section */}
        <motion.div 
          className="logo-section-premium"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleNavigation('/admin')}
        >
          <div className="logo-premium">
            <motion.span 
              className="logo-icon-premium"
              animate={{ rotate: [0, 5, 0, -5, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              🎨
            </motion.span>
            <div className="logo-text-premium">
              <motion.span 
                className="logo-subtitle-premium"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
              <h2>InteriorDesign Pro</h2>
              </motion.span>
            </div>
          </div>
        </motion.div>

     

        {/* Header Actions */}
      
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="mobile-nav-premium"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="mobile-nav-content-premium">
              {menuItems.map((item, index) => (
                <motion.button
                  key={item.label}
                  className={`mobile-nav-item-premium ${isActivePath(item.path) ? 'active' : ''}`}
                  onClick={() => handleNavigation(item.path)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 5, backgroundColor: 'rgba(102, 126, 234, 0.1)' }}
                >
                  <span className="mobile-nav-icon-premium">{item.icon}</span>
                  <span className="mobile-nav-label-premium">{item.label}</span>
                  {isActivePath(item.path) && (
                    <motion.div 
                      className="mobile-nav-indicator"
                      layoutId="mobileNavIndicator"
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default AdminHeader;