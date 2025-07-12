import React, { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Clock, Users, Droplet, Award, CheckCircle, Menu, X, ArrowRight, Play, LogIn, LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import heroBackground from "@/assets/hero-background.jpg";
import manufacturing from "@/assets/manufacturing.jpg";
import productLineup from "@/assets/product-lineup.jpg";
import supabase from "../supabase.js";

const Homepage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [user, setUser] = useState(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  // Check for user session on component mount
  useEffect(() => {
    let subscription = { unsubscribe: () => {} };
    
    const setupAuth = async () => {
      try {
        // Set up auth state change listener
        const authResponse = await supabase.auth.onAuthStateChange((_event, session) => {
          setUser(session?.user || null);
        });
        
        subscription = authResponse.data.subscription;
        
        // Get initial session
        const sessionResponse = await supabase.auth.getSession();
        setUser(sessionResponse.data.session?.user || null);
      } catch (error) {
        console.error('Error setting up auth:', error);
      }
    };
    
    setupAuth();
    
    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission here
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  // Handle user sign out
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      // User state will be updated by the onAuthStateChange listener
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Handle navigation to authentication page
  const handleAuthNavigation = () => {
    navigate('/auth');
  };

  // Add smooth scrolling for navigation links
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      // Close mobile menu if open
      if (isMenuOpen) {
        setIsMenuOpen(false);
      }
      
      window.scrollTo({
        top: targetElement.offsetTop - 80, // Offset for the fixed header
        behavior: 'smooth'
      });
    }
  };

  // Add a click outside handler to close the user menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isUserMenuOpen && !event.target.closest('.user-menu-container')) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                <Droplet className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">K B Beverages</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" onClick={(e) => handleSmoothScroll(e, 'home')} className="text-foreground/80 hover:text-primary transition-colors">Home</a>
              <a href="#about" onClick={(e) => handleSmoothScroll(e, 'about')} className="text-foreground/80 hover:text-primary transition-colors">About</a>
              <a href="#products" onClick={(e) => handleSmoothScroll(e, 'products')} className="text-foreground/80 hover:text-primary transition-colors">Products</a>
              <a href="#contact" onClick={(e) => handleSmoothScroll(e, 'contact')} className="text-foreground/80 hover:text-primary transition-colors">Contact</a>
              <Button className="bg-gradient-to-r from-primary to-accent text-white shadow-md hover:shadow-lg transition-all hover:-translate-y-1"
              onClick={() => navigate('/order')}
              >
                
                Order Now
                </Button>
              {user ? (
                <div className="flex items-center gap-4 relative user-menu-container">
                  <div 
                    className="flex items-center gap-2 cursor-pointer hover:bg-card/50 p-1.5 rounded-md transition-colors"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-sm">{user.user_metadata?.name || user.email}</span>
                  </div>
                  
                  {isUserMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 bg-card/95 backdrop-blur-md rounded-lg p-2 space-y-2 border border-border/50 shadow-lg z-50 w-48">
                      <div className="px-3 py-1.5 text-sm text-muted-foreground border-b border-border/50 pb-2 mb-1">
                        Signed in as <span className="font-medium text-foreground">{user.user_metadata?.name || user.email}</span>
                      </div>
                      <button
                        className="w-full flex items-center gap-2 hover:bg-primary/10 rounded px-3 py-2 text-sm text-left transition-colors"
                        onClick={handleSignOut}
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2 border-primary/20 hover:bg-primary/10"
                  onClick={handleAuthNavigation}
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden bg-card/95 backdrop-blur-md rounded-lg mt-2 p-4 space-y-4 border border-border/50">
              <a href="#home" onClick={(e) => handleSmoothScroll(e, 'home')} className="block text-foreground/80 hover:text-primary transition-colors">Home</a>
              <a href="#about" onClick={(e) => handleSmoothScroll(e, 'about')} className="block text-foreground/80 hover:text-primary transition-colors">About</a>
              <a href="#products" onClick={(e) => handleSmoothScroll(e, 'products')} className="block text-foreground/80 hover:text-primary transition-colors">Products</a>
              <a href="#contact" onClick={(e) => handleSmoothScroll(e, 'contact')} className="block text-foreground/80 hover:text-primary transition-colors">Contact</a>
              <Button className="w-full bg-gradient-to-r from-primary to-accent text-white shadow-md hover:shadow-lg transition-all hover:-translate-y-1"  onClick={() => navigate('/order')}>Order Now</Button>
              
              {user ? (
                <div className="pt-2 border-t border-border/50 user-menu-container">
                  <button
                    className="w-full flex items-center justify-between px-4 py-2 rounded hover:bg-primary/10 transition-colors"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <span className="text-sm">{user.user_metadata?.name || user.email}</span>
                    </div>
                    <svg 
                      className={`w-4 h-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {isUserMenuOpen && (
                    <div className="mt-2 bg-card/80 rounded-lg px-2 py-2 border border-border/30">
                      <button
                        className="w-full flex items-center gap-2 hover:bg-primary/10 rounded px-3 py-2 text-sm text-left transition-colors"
                        onClick={handleSignOut}
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-center gap-2 border-primary/20 hover:bg-primary/10"
                  onClick={handleAuthNavigation}
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Button>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section 
        id="home"
        className="relative h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url(${heroBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/30 via-transparent to-background/50"></div>
        
        {/* Parallax Background */}
        <div 
          className="absolute inset-0 parallax"
          style={{
            transform: `translateY(${scrollY * 0.5}px)`
          }}
        ></div>


        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-10 pb-3 leading-tight">
            Pure Water,
            <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Pure Life</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto">
            Experience the ultimate hydration with our premium water bottles. 
            Crafted for purity, designed for life.
          </p>
          
          {/* Dual CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
             <Button className="bg-gradient-to-r from-primary to-accent text-white px-8 py-4 text-lg shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
               Shop Now
               <ArrowRight className="ml-2 w-5 h-5" />
             </Button>
            
          </div>
        </div>
      </section>

      {/* Company Stats */}
      <section className="py-20 bg-gradient-to-b from-background to-secondary/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Our Journey So Far</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Building trust through quality and innovation for over a decade
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-primary mb-2">10K+</h3>
              <p className="text-muted-foreground">Happy Customers</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-accent to-primary flex items-center justify-center">
                <Droplet className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-primary mb-2">50M+</h3>
              <p className="text-muted-foreground">Bottles Delivered</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                <Award className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-primary mb-2">15+</h3>
              <p className="text-muted-foreground">Years Experience</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-accent to-primary flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-primary mb-2">100%</h3>
              <p className="text-muted-foreground">BPA-Free</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
               <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                 Crafting Purity Since 2009
               </h2>
              <p className="text-lg text-muted-foreground mb-8">
                At K B Beverages, we believe that access to clean, pure water is not just a necessity—it's a right. 
                Our state-of-the-art facility ensures every bottle meets the highest standards of quality and purity.
              </p>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Advanced Filtration</h3>
                    <p className="text-muted-foreground">Multi-stage purification process ensuring the highest quality water</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Eco-Friendly Materials</h3>
                    <p className="text-muted-foreground">100% BPA-free bottles made from recycled materials</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Quality Assurance</h3>
                    <p className="text-muted-foreground">Rigorous testing at every stage of production</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-card/20 backdrop-blur-md border border-border/50 rounded-2xl overflow-hidden">
                <img 
                  src={manufacturing} 
                  alt="Manufacturing facility"
                  className="w-full h-96 object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-card/90 backdrop-blur-md border border-border/50 rounded-2xl p-6">
                <div className="text-center">
                  <h4 className="text-2xl font-bold text-primary">ISO 9001</h4>
                  <p className="text-muted-foreground">Certified Quality</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Preview */}
      <section id="products" className="py-20 bg-gradient-to-b from-secondary/30 to-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Our Product Range</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the perfect size for your hydration needs
            </p>
          </div>

          <div className="relative mb-12">
            <img 
              src={productLineup} 
              alt="Product lineup"
              className="w-full max-w-4xl mx-auto rounded-2xl"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
             <Card className="bg-card/50 backdrop-blur-md border border-border/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                  <Droplet className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-2">300ml</h3>
                <p className="text-3xl font-bold text-primary mb-4">₹15</p>
                <p className="text-muted-foreground mb-6">Perfect for on-the-go hydration</p>
                <Button className="w-full bg-gradient-to-r from-primary to-accent text-white shadow-md hover:shadow-lg transition-all hover:-translate-y-1"  onClick={() => navigate('/order')}>Order Now</Button>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-md border border-border/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-2 ring-2 ring-primary">
              <CardContent className="p-6 text-center">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm">
                  Popular
                </div>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                  <Droplet className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-2">500ml</h3>
                <p className="text-3xl font-bold text-primary mb-4">₹25</p>
                <p className="text-muted-foreground mb-6">Ideal for daily hydration needs</p>
                <Button className="w-full bg-gradient-to-r from-primary to-accent text-white shadow-md hover:shadow-lg transition-all hover:-translate-y-1"  onClick={() => navigate('/order')}>Order Now</Button>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-md border border-border/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                  <Droplet className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-2">1L</h3>
                <p className="text-3xl font-bold text-primary mb-4">₹40</p>
                <p className="text-muted-foreground mb-6">Great for sharing and families</p>
                <Button className="w-full bg-gradient-to-r from-primary to-accent text-white shadow-md hover:shadow-lg transition-all hover:-translate-y-1"  onClick={() => navigate('/order')}>Order Now</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Get In Touch</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Information */}
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Phone</h3>
                  <p className="text-muted-foreground">+91 99800 23403</p>
                  <p className="text-muted-foreground">+91 70902 46333</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Email</h3>
                  <p className="text-muted-foreground">vckkn1973@gmail.com</p>
                  
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Address</h3>
                  <p className="text-muted-foreground">SLN minerals</p>
                  <p className="text-muted-foreground">Allur near Achariya collage</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Business Hours</h3>
                  <p className="text-muted-foreground">Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p className="text-muted-foreground">Saturday: 9:00 AM - 4:00 PM</p>
                  <p className="text-muted-foreground">Sunday: Closed</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
             <Card className="bg-card/50 backdrop-blur-md border border-border/50">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">Name</label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="bg-card/50 backdrop-blur-md border border-border/50"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="bg-card/50 backdrop-blur-md border border-border/50"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-2">Phone</label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="bg-card/50 backdrop-blur-md border border-border/50"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">Message</label>
                    <Textarea
                      id="message"
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      className="bg-card/50 backdrop-blur-md border border-border/50"
                    />
                  </div>

                  <Button type="submit" className="w-full bg-gradient-to-r from-primary to-accent text-white shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-20 bg-gradient-to-b from-background to-secondary/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Visit Our Facility</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Come see how we craft the purest water for you and your family
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <Card className="bg-card/50 backdrop-blur-md border border-border/50">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6">Factory Location</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <p className="font-semibold">Address</p>
                      <p className="text-muted-foreground">SLN Minerals allur near Achariya collage</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Clock className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <p className="font-semibold">Operating Hours</p>
                      <p className="text-muted-foreground">Monday - Saturday: 9:00 AM - 6:00 PM</p>
                      <p className="text-muted-foreground">Sunday: Closed</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Phone className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <p className="font-semibold">Factory Direct</p>
                      <p className="text-muted-foreground">+91 99800 23403</p>
                    </div>
                  </div>
                </div>

               
              </CardContent>
            </Card>

            {/* Google Maps Placeholder */}
            <div className="bg-card/50 backdrop-blur-md border border-border/50 rounded-2xl overflow-hidden h-96">
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Interactive Map</h3>
                  <p className="text-muted-foreground">Google Maps integration would go here</p>
                  <Button className="mt-4 bg-card/20 backdrop-blur-md border border-white/30 text-foreground hover:bg-white/30 transition-all hover:-translate-y-1"
                  onClick={()=> window.open("https://maps.app.goo.gl/NCL3vUxMEw6hDi83A","_blank")}
                  >
                    Open in Maps
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <Droplet className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">K B Beverages</span>
              </div>
              <p className="text-background/80 mb-4">
                Delivering pure, clean water to homes and businesses across the nation.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-background/80">
                <li><a href="#home" onClick={(e) => handleSmoothScroll(e, 'home')} className="hover:text-primary transition-colors">Home</a></li>
                <li><a href="#about" onClick={(e) => handleSmoothScroll(e, 'about')} className="hover:text-primary transition-colors">About</a></li>
                <li><a href="#products" onClick={(e) => handleSmoothScroll(e, 'products')} className="hover:text-primary transition-colors">Products</a></li>
                <li><a href="#contact" onClick={(e) => handleSmoothScroll(e, 'contact')} className="hover:text-primary transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Products</h4>
              <ul className="space-y-2 text-background/80">
                <li>300ml Bottles</li>
                <li>500ml Bottles</li>
                <li>1L Bottles</li>
                <li>Bulk Orders</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contact Info</h4>
              <ul className="space-y-2 text-background/80">
                <li>+91 99800 23403</li>
                <li>vckkn1973@gmail.com</li>
                <li>123 Pure Water Street</li>
                <li>Hydration City, HC 12345</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-background/20 mt-8 pt-8 text-center text-background/60">
            <p>&copy; 2024 K B Beverages. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;