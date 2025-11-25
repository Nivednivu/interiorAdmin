import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [activeVideo, setActiveVideo] = useState(null);
  const [formData, setFormData] = useState({
    product_name: '',
    price_new: '',
    brand: '',
    category: '',
    description: '',
    image_url: '',
    video_url: ''
  });

  const categories = ['Electronics', 'Footwear', 'Clothing', 'Home', 'Sports', 'Books', 'Other'];
  const brands = ['AudioTech', 'TechWear', 'SportFit', 'HomeEssentials', 'BookWorld', 'Other'];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products');
      // Sort products by creation date (newest first)
      const sortedProducts = response.data.data.sort((a, b) => {
        return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      });
      setProducts(sortedProducts);
      toast.success(`Loaded ${sortedProducts.length} products successfully!`, {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products!', {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // File size validation
    if (file.size > 50 * 1024 * 1024) {
      toast.error('File size too large. Maximum size is 50MB.', {
        position: "top-right",
        autoClose: 4000,
      });
      return;
    }

    // Image type validation
    if (type === 'image') {
      const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validImageTypes.includes(file.type)) {
        toast.error('Invalid image format. Please use JPEG, PNG, GIF, or WebP.', {
          position: "top-right",
          autoClose: 4000,
        });
        return;
      }
    }

    // Video type validation
    if (type === 'video') {
      const validVideoTypes = ['video/mp4', 'video/webm', 'video/ogg'];
      if (!validVideoTypes.includes(file.type)) {
        toast.error('Invalid video format. Please use MP4, WebM, or OGG.', {
          position: "top-right",
          autoClose: 4000,
        });
        return;
      }
    }

    const uploadToast = toast.loading(`Uploading ${type}...`, {
      position: "top-right",
    });

    setUploading(true);
    const uploadData = new FormData();
    uploadData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/api/upload', uploadData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000,
      });
      
      if (response.data.success) {
        const fileUrl = response.data.filePath || response.data.url;
        
        if (!fileUrl) {
          throw new Error('No file URL returned from server');
        }

        setFormData(prev => ({
          ...prev,
          [type === 'image' ? 'image_url' : 'video_url']: fileUrl
        }));
        
        toast.update(uploadToast, {
          render: `${type.charAt(0).toUpperCase() + type.slice(1)} uploaded successfully!`,
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });

        // Test if the uploaded file is accessible
        if (type === 'image') {
          testImageLoad(fileUrl);
        }
      } else {
        throw new Error(response.data.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      
      toast.update(uploadToast, {
        render: `Upload failed: ${error.message}`,
        type: "error",
        isLoading: false,
        autoClose: 4000,
      });
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  // Test if image loads successfully
  const testImageLoad = (url) => {
    const img = new Image();
    img.onload = () => console.log('✅ Image loads successfully:', url);
    img.onerror = () => {
      console.log('❌ Image failed to load:', url);
      toast.warning('Image uploaded but may not be accessible. Check the URL.', {
        position: "top-right",
        autoClose: 4000,
      });
    };
    img.src = url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.product_name || !formData.price_new || !formData.brand || !formData.category) {
      toast.error('Please fill in all required fields!', {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const submitToast = toast.loading(
      editingProduct ? 'Updating product...' : 'Creating product...', 
      {
        position: "top-right",
      }
    );

    try {
      let response;
      if (editingProduct) {
        response = await axios.put(
          `http://localhost:5000/api/products/${editingProduct.product_id}`, 
          formData
        );
      } else {
        response = await axios.post('http://localhost:5000/api/products', formData);
      }
      
      // Fetch products again to get the updated list with new product
      await fetchProducts();
      resetForm();
      
      toast.update(submitToast, {
        render: editingProduct ? 'Product updated successfully! 🎉' : 'Product created successfully! 🎉',
        type: "success",
        isLoading: false,
        autoClose: 4000,
      });
      
    } catch (error) {
      console.error('Error saving product:', error);
      
      toast.update(submitToast, {
        render: `Error: ${error.response?.data?.message || 'Failed to save product'}`,
        type: "error",
        isLoading: false,
        autoClose: 4000,
      });
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      product_name: product.product_name,
      price_new: product.price_new,
      brand: product.brand,
      category: product.category,
      description: product.description || '',
      image_url: product.image_url || '',
      video_url: product.video_url || ''
    });
    setShowForm(true);
    
    toast.info('Editing product...', {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const handleDelete = async (productId) => {
    const productName = products.find(p => p.product_id === productId)?.product_name || 'this product';
    
    toast.warning(
      <div>
        <div>Are you sure you want to delete?</div>
        <div style={{ fontSize: '12px', opacity: 0.8 }}>{productName}</div>
        <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => {
              toast.dismiss();
              confirmDelete(productId);
            }}
            style={{
              padding: '5px 15px',
              background: '#ff6b6b',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Yes, Delete
          </button>
          <button 
            onClick={() => toast.dismiss()}
            style={{
              padding: '5px 15px',
              background: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
      }
    );
  };

  const confirmDelete = async (productId) => {
    const deleteToast = toast.loading('Deleting product...', {
      position: "top-right",
    });

    try {
      await axios.delete(`http://localhost:5000/api/products/${productId}`);
      
      // Update local state immediately for better UX
      setProducts(prev => prev.filter(product => product.product_id !== productId));
      
      toast.update(deleteToast, {
        render: 'Product deleted successfully!',
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      
      // Revert optimistic update on error
      fetchProducts();
      
      toast.update(deleteToast, {
        render: 'Error deleting product!',
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  const resetForm = () => {
    setFormData({
      product_name: '',
      price_new: '',
      brand: '',
      category: '',
      description: '',
      image_url: '',
      video_url: ''
    });
    setEditingProduct(null);
    setShowForm(false);
  };

  const playVideo = (productId, videoUrl) => {
    if (activeVideo === productId) {
      setActiveVideo(null);
      toast.info('Video stopped', {
        position: "bottom-right",
        autoClose: 1500,
      });
    } else {
      setActiveVideo(productId);
      toast.info('Playing video...', {
        position: "bottom-right",
        autoClose: 1500,
      });
    }
  };

  // Function to format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Recently added';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    
    return date.toLocaleDateString();
  };

  // Handle image error in product cards
  const handleImageError = (e) => {
    e.target.style.display = 'none';
    const parent = e.target.parentElement;
    const fallback = parent.querySelector('.image-fallback');
    if (fallback) {
      fallback.style.display = 'flex';
    }
  };

  return (
    <div className="admin-dashboard" style={{marginTop:'100px'}}>
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ marginTop: '80px' }}
      />
      
      <div className="container">
        <div className="admin-header">
          <div className="header-content">
            <h1>Product Dashboard</h1>
            <div className="header-stats">
              <span className="stat-item">
                Total Products: <strong>{products.length}</strong>
              </span>
              {products.length > 0 && (
                <span className="stat-item">
                  Latest: <strong>{formatDate(products[0]?.created_at)}</strong>
                </span>
              )}
            </div>
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => {
              setShowForm(true);
              toast.info('Creating new product...', {
                position: "top-right",
                autoClose: 2000,
              });
            }}
          >
            + Add New Product
          </button>
        </div>

        {/* Product Form Modal */}
        {showForm && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={resetForm}
          >
            <motion.div 
              className="modal-content"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                <button className="close-btn" onClick={resetForm}>×</button>
              </div>
              
              <form onSubmit={handleSubmit} className="product-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Product Name *</label>
                    <input
                      type="text"
                      name="product_name"
                      value={formData.product_name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Price *</label>
                    <input
                      type="number"
                      name="price_new"
                      value={formData.price_new}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Brand *</label>
                    <select
                      name="brand"
                      value={formData.brand}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Brand</option>
                      {brands.map(brand => (
                        <option key={brand} value={brand}>{brand}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Category *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    placeholder="Enter product description..."
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Image URL</label>
                    <input
                      type="text"
                      name="image_url"
                      value={formData.image_url}
                      onChange={handleInputChange}
                      placeholder="Or upload image below"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'image')}
                      className="file-input"
                      disabled={uploading}
                    />
                    {formData.image_url && (
                      <div className="image-preview">
                        <img 
                          src={formData.image_url} 
                          alt="Preview" 
                          onError={(e) => {
                            e.target.style.display = 'none';
                            const fallback = e.target.parentElement.querySelector('.preview-fallback');
                            if (fallback) fallback.style.display = 'block';
                          }}
                        />
                        <div className="preview-fallback" style={{display: 'none'}}>
                          <div className="no-image">📷 Image not accessible</div>
                          <small>URL: {formData.image_url}</small>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="form-group">
                    <label>Video URL</label>
                    <input
                      type="text"
                      name="video_url"
                      value={formData.video_url}
                      onChange={handleInputChange}
                      placeholder="Or upload video below"
                    />
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => handleFileUpload(e, 'video')}
                      className="file-input"
                      disabled={uploading}
                    />
                    {formData.video_url && (
                      <div className="video-preview">
                        <p>Video URL: {formData.video_url}</p>
                        <video 
                          controls 
                          style={{ maxWidth: '200px', maxHeight: '150px' }}
                        >
                          <source src={formData.video_url} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-actions">
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={uploading}
                  >
                    {uploading ? '📤 Uploading...' : (editingProduct ? '🔄 Update' : '✨ Create')} Product
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={resetForm}>
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* Products List */}
        <div className="products-section">
          <div className="section-header">
            <h2>Products ({products.length})</h2>
            {products.length > 0 && (
              <div className="sort-info">
                <span>🕒 Sorted by latest first</span>
              </div>
            )}
          </div>
          
          {loading ? (
            <div className="loading">
              <div className="loading-spinner"></div>
              Loading products...
            </div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📦</div>
              <h3>No Products Found</h3>
              <p>Get started by adding your first product!</p>
              <button 
                className="btn btn-primary"
                onClick={() => setShowForm(true)}
              >
                + Add First Product
              </button>
            </div>
          ) : (
            <div className="products-grid">
              {products.map((product, index) => (
                <motion.div 
                  key={product.product_id} 
                  className="admin-product-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  {/* New product badge for recently added items */}
                  {index < 3 && (
                    <div className="new-badge">
                      {index === 0 ? '🆕 Newest' : index === 1 ? '🔥 Recent' : '⭐ New'}
                    </div>
                  )}
                  
                  <div className="product-media">
                    {product.video_url && activeVideo === product.product_id ? (
                      <div className="video-container">
                        <video 
                          controls 
                          autoPlay
                          style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                        >
                          <source src={product.video_url} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                        <button 
                          className="btn btn-secondary btn-small"
                          onClick={() => setActiveVideo(null)}
                          style={{ marginTop: '10px' }}
                        >
                          ⏹️ Stop Video
                        </button>
                      </div>
                    ) : product.image_url ? (
                      <div className="image-container">
                        <img 
                          src={product.image_url} 
                          alt={product.product_name}
                          className="product-image"
                          onError={handleImageError}
                        />
                        <div className="image-fallback" style={{display: 'none'}}>
                          <div className="no-image">📷 Image not available</div>
                          <small>Failed to load: {product.image_url}</small>
                        </div>
                        {product.video_url && (
                          <button 
                            className="btn btn-primary btn-small video-play-btn"
                            onClick={() => playVideo(product.product_id, product.video_url)}
                          >
                            ▶ Play Video
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="no-media">
                        <div className="no-image">📷 No Image</div>
                        {product.video_url && (
                          <button 
                            className="btn btn-primary btn-small"
                            onClick={() => playVideo(product.product_id, product.video_url)}
                            style={{ marginTop: '10px' }}
                          >
                            ▶ Play Video
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="product-info">
                    <h3 className="product-title">{product.product_name}</h3>
                    <div className="product-meta">
                      <span className="product-brand">{product.brand}</span>
                      <span className="product-category">{product.category}</span>
                    </div>
                    <p className="product-price">${product.price_new}</p>
                    
                    {/* Added date information */}
                    <div className="product-date">
                      <small>Added: {formatDate(product.created_at)}</small>
                    </div>
                    
                    {product.video_url && (
                      <div className="video-info">
                        <small>🎥 Video Available</small>
                      </div>
                    )}
                    
                    {product.description && (
                      <p className="product-description">{product.description}</p>
                    )}
                  </div>
                  
                  <div className="product-actions">
                    <button 
                      className="btn btn-edit"
                      onClick={() => handleEdit(product)}
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      className="btn btn-delete"
                      onClick={() => handleDelete(product.product_id)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
        <h1>hello 742</h1>
      </div>
    </div>
  );
};

export default AdminDashboard;