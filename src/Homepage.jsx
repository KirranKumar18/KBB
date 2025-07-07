import { useNavigate } from 'react-router-dom'
import './App.css'

function Homepage() {
  const navigate = useNavigate()

  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <h1 className="logo">K B Beveragers</h1>
          <nav className="nav">
            <button 
              className="nav-btn"
              onClick={() => navigate('/order')}
            >
              Order Now
            </button>
          </nav>
        </div>
      </header>

      <main className="main">
        <div className="container">
          {/* Hero Section */}
          <section className="hero">
            <div className="hero-content">
              <h2 className="hero-title">Premium Pet Bottles for All Your Needs</h2>
              <p className="hero-subtitle">High-quality, BPA-free bottles that meet the highest standards of quality and safety</p>
              <div className="hero-buttons">
                <button 
                  className="cta-button primary"
                  onClick={() => navigate('/order')}
                >
                  Order Now
                </button>
                <button 
                  className="cta-button secondary"
                  onClick={() => document.getElementById('about').scrollIntoView({ behavior: 'smooth' })}
                >
                  Learn More
                </button>
              </div>
            </div>
            <div className="hero-animation">
              <div className="floating-bottles">
                <div className="bottle bottle-1">🍼</div>
                <div className="bottle bottle-2">🍼</div>
                <div className="bottle bottle-3">🍼</div>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="stats">
            <div className="section-content">
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-number">10K+</div>
                  <div className="stat-label">Happy Customers</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">50M+</div>
                  <div className="stat-label">Bottles Sold</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">15+</div>
                  <div className="stat-label">Years Experience</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">100%</div>
                  <div className="stat-label">BPA Free</div>
                </div>
              </div>
            </div>
          </section>

          {/* About Us Section */}
          <section id="about" className="about-us">
            <div className="section-content">
              <h3 className="section-title">About K B Beveragers</h3>
              <div className="about-grid">
                <div className="about-text">
                  <p className="about-intro">Welcome to K B Beveragers, your trusted partner for premium quality pet bottles. We specialize in providing high-grade, BPA-free bottles that meet the highest standards of quality and safety.</p>
                  <p>With years of experience in the beverage packaging industry, we understand the importance of reliable, durable, and eco-friendly packaging solutions for your business needs.</p>
                  
                  <div className="features">
                    <div className="feature-item">
                      <span className="feature-icon">✓</span>
                      <span>100% BPA-Free Materials</span>
                    </div>
                    <div className="feature-item">
                      <span className="feature-icon">✓</span>
                      <span>Food Grade Quality</span>
                    </div>
                    <div className="feature-item">
                      <span className="feature-icon">✓</span>
                      <span>Eco-Friendly Manufacturing</span>
                    </div>
                    <div className="feature-item">
                      <span className="feature-icon">✓</span>
                      <span>ISO Certified Production</span>
                    </div>
                  </div>

                 
                </div>
                <div className="about-image">
                  <div className="image-placeholder">
                    <div className="factory-icon">🏭</div>
                    <div className="image-text">Modern Manufacturing Facility</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Products Preview */}
          <section className="products-preview">
            <div className="section-content">
              <h3 className="section-title">Our Product Range</h3>
              <div className="preview-grid">
                <div className="preview-card">
                  <div className="preview-icon">🍼</div>
                  <h4>300ml Bottles</h4>
                  <p>Perfect for single servings and on-the-go hydration</p>
                  <div className="preview-price">Starting at ₹15</div>
                </div>
                <div className="preview-card">
                  <div className="preview-icon">🍼</div>
                  <h4>500ml Bottles</h4>
                  <p>Ideal size for personal use and light activities</p>
                  <div className="preview-price">Starting at ₹25</div>
                </div>
                <div className="preview-card">
                  <div className="preview-icon">🍼</div>
                  <h4>1L Bottles</h4>
                  <p>Great for families and extended activities</p>
                  <div className="preview-price">Starting at ₹40</div>
                </div>
              </div>
              <div className="preview-cta">
                <button 
                  className="order-now-btn"
                  onClick={() => navigate('/order')}
                >
                  Order Now - Free Delivery
                </button>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section className="contact">
            <div className="section-content">
              <h3 className="section-title">Get In Touch</h3>
              <div className="contact-grid">
                <div className="contact-info">
                  <div className="contact-item">
                    <div className="contact-icon">📞</div>
                    <div className="contact-details">
                      <h4>Call Us</h4>
                      <p>+91 99800 23403</p>
                      <p>+91 70902 46333</p>
                      <small>Mon-Fri 9AM-6PM, Sat 9AM-2PM</small>
                    </div>
                  </div>
                  <div className="contact-item">
                    <div className="contact-icon">✉️</div>
                    <div className="contact-details">
                      <h4>Email Us</h4>
                      <p>vckkn1973@gmail.com</p>
                      <small>We reply within 24 hours</small>
                    </div>
                  </div>
                  <div className="contact-item">
                    <div className="contact-icon">📍</div>
                    <div className="contact-details">
                      <h4>Visit Us</h4>
                      <p>123 Industrial Area, Phase 2</p>
                      <p>Manufacturing District</p>
                      <p>City - 110001</p>
                    </div>
                  </div>
                </div>
                <div className="contact-form">
                  <h4>Send us a message</h4>
                  <form className="form">
                    <div className="form-row">
                      <input type="text" placeholder="Your Name" className="form-input" required />
                      <input type="email" placeholder="Your Email" className="form-input" required />
                    </div>
                    <input type="tel" placeholder="Your Phone" className="form-input" />
                    <textarea placeholder="Your Message" className="form-textarea" rows="4" required></textarea>
                    <button type="submit" className="form-submit">Send Message</button>
                  </form>
                </div>
              </div>
            </div>
          </section>

          {/* Location Section */}
          <section className="location">
            <div className="section-content">
              <h3 className="section-title">Our Locations</h3>
              <div className="location-grid">
                <div className="location-info">
                  <div className="location-item">
                    <div className="location-icon">🏭</div>
                    <div className="location-details">
                      <h4>Manufacturing Unit</h4>
                      <p>456 Production Lane</p>
                      <p>Industrial Zone, City - 110002</p>
                      <div className="location-features">
                        <span>• Production Facility</span>
                        <span>• Quality Control</span>
                        <span>• R&D Center</span>
                      </div>
                    </div>
                  </div>
                  <div className="location-item">
                    <div className="location-icon">🚚</div>
                    <div className="location-details">
                      <h4>Distribution Network</h4>
                      <p>Pan India Coverage</p>
                      <p>Express Delivery Available</p>
                      <div className="location-features">
                        <span>• 24/7 Logistics</span>
                        <span>• Same Day Delivery*</span>
                        <span>• Bulk Orders</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="map-placeholder">
                  <div className="map-content">
                    <h4>Find Us</h4>
                    <div className="map-icon">🗺️</div>
                    <p>Interactive map and directions</p>
                    <button className="directions-btn">Get Directions</button>
                    <button 
                      className="order-location-btn"
                      onClick={() => navigate('/order')}
                    >
                      Order From Your Location
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h4>K B Beveragers</h4>
              <p>Premium quality pet bottles for all your beverage packaging needs.</p>
              <div className="social-links">
                <span>Follow us:</span>
                <button className="social-btn">📘</button>
                <button className="social-btn">📷</button>
                <button className="social-btn">🐦</button>
              </div>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li><button onClick={() => navigate('/order')}>Order Now</button></li>
                <li><button onClick={() => document.getElementById('about').scrollIntoView({ behavior: 'smooth' })}>About Us</button></li>
                <li><button>Quality Standards</button></li>
                <li><button>Bulk Orders</button></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Contact Info</h4>
              <p>📞 +91 99800 23403</p>
              <p>✉️ vckkn1973@gmail.com</p>
              <p>📍 Allur village near some hall</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 K B Beveragers. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Homepage
