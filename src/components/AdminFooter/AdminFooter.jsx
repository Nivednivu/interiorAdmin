import React from 'react';
import { motion } from 'framer-motion';
import './AdminFooter.css';

const AdminFooter = () => {
  const currentYear = new Date().getFullYear();

  const footerVariants = {
    hidden: { y: 100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        delay: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const staggerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <motion.footer 
      className="admin-footer-premium"
      variants={footerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="footer-container-premium">
        {/* Main Footer Content */}
        <motion.div 
          className="footer-main-premium"
          variants={staggerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Company Info */}
          <motion.div 
            className="footer-section-premium company-info-premium"
            variants={itemVariants}
          >
            <motion.div 
              className="footer-logo-premium"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.span 
                className="logo-icon-premium"
                animate={{ rotate: [0, 5, 0, -5, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                🎨
              </motion.span>
              <div className="logo-text-premium">
                <h3>InteriorDesign Pro</h3>
                <p>Premium Interior Solutions</p>
              </div>
            </motion.div>
            <motion.p 
              className="company-description-premium"
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              Transforming spaces with exceptional interior design. 
              We create beautiful, functional environments that reflect 
              your unique style and personality.
            </motion.p>
            <div className="social-links-premium">
              {['📘', '📷', '💼', '🐦'].map((icon, index) => (
                <motion.a 
                  key={index}
                  href="#" 
                  className="social-link-premium"
                  whileHover={{ 
                    scale: 1.3, 
                    rotate: index % 2 === 0 ? 10 : -10,
                    y: -5
                  }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                >
                  {icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div 
            className="footer-section-premium quick-links-premium"
            variants={itemVariants}
          >
            <motion.h4
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              Quick Links
            </motion.h4>
            <div className="links-grid-premium">
              {[
                { icon: '📊', label: 'Dashboard', path: '/admin/dashboard' },
                { icon: '📦', label: 'Products', path: '/admin/products' },
                { icon: '🏷️', label: 'Categories', path: '/admin/categories' },
                { icon: '👥', label: 'Customers', path: '/admin/customers' },
                { icon: '📈', label: 'Analytics', path: '/admin/analytics' },
                { icon: '⚙️', label: 'Settings', path: '/admin/settings' }
              ].map((link, index) => (
                <motion.a 
                  key={link.label}
                  href={link.path}
                  className="footer-link-premium"
                  whileHover={{ x: 8, color: '#667eea' }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.7 }}
                >
                  <span className="link-icon-premium">{link.icon}</span>
                  {link.label}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Admin Tools */}
          <motion.div 
            className="footer-section-premium admin-tools-premium"
            variants={itemVariants}
          >
            <motion.h4
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              Admin Tools
            </motion.h4>
            <div className="tools-list-premium">
              {[
                { icon: '📊', label: 'Analytics Dashboard' },
                { icon: '🔄', label: 'Data Management' },
                { icon: '🛡️', label: 'Security Center' },
                { icon: '📋', label: 'Reports Generator' }
              ].map((tool, index) => (
                <motion.div 
                  key={tool.label}
                  className="tool-item-premium"
                  whileHover={{ 
                    scale: 1.05, 
                    x: 10,
                    backgroundColor: 'rgba(102, 126, 234, 0.1)'
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.9 }}
                >
                  <motion.span 
                    className="tool-icon-premium"
                    whileHover={{ scale: 1.2, rotate: 5 }}
                  >
                    {tool.icon}
                  </motion.span>
                  <span>{tool.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Contact & Support */}
          <motion.div 
            className="footer-section-premium contact-info-premium"
            variants={itemVariants}
          >
            <motion.h4
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              Support
            </motion.h4>
            <div className="contact-list-premium">
              {[
                { icon: '📧', title: 'Email Support', desc: 'support@interiordesign.com' },
                { icon: '🕒', title: 'Business Hours', desc: 'Mon - Fri: 9AM - 6PM' },
                { 
                  icon: '🚀', 
                  title: 'System Status', 
                  desc: 'All Systems Operational',
                  status: 'online' 
                }
              ].map((contact, index) => (
                <motion.div 
                  key={contact.title}
                  className="contact-item-premium"
                  whileHover={{ scale: 1.02, y: -2 }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 1.1 }}
                >
                  <motion.span 
                    className="contact-icon-premium"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    {contact.icon}
                  </motion.span>
                  <div>
                    <p>{contact.title}</p>
                    <span className={contact.status === 'online' ? 'status-online-premium' : ''}>
                      {contact.desc}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Footer Bottom */}
        <motion.div 
          className="footer-bottom-premium"
          variants={itemVariants}
        >
          <div className="footer-bottom-content-premium">
            <motion.div 
              className="copyright-premium"
              whileHover={{ scale: 1.02 }}
            >
              <p>&copy; {currentYear} InteriorDesign Pro. All rights reserved.</p>
            </motion.div>
            
            <div className="footer-links-premium">
              {['Privacy Policy', 'Terms of Service', 'Help Center'].map((link, index) => (
                <motion.a 
                  key={link}
                  href={`/${link.toLowerCase().replace(' ', '-')}`}
                  className="footer-bottom-link-premium"
                  whileHover={{ scale: 1.1, color: '#667eea' }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 1.3 }}
                >
                  {link}
                </motion.a>
              ))}
            </div>

            <motion.div 
              className="system-info-premium"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6 }}
            >
              <div className="system-status-premium">
                <motion.span 
                  className="status-dot-premium"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.7, 1]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <span>Admin Panel v2.1.4</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Background Elements */}
      <div className="footer-bg-elements">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="footer-bg-shape"
            animate={{
              y: [0, -20, 0],
              rotate: [0, i % 2 === 0 ? 5 : -5, 0],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 1.5
            }}
            style={{
              left: `${20 + i * 30}%`,
              width: `${100 + i * 50}px`,
              height: `${100 + i * 50}px`,
            }}
          />
        ))}
      </div>
    </motion.footer>
  );
};

export default AdminFooter;