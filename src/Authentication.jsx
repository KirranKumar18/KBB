
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import supabase from './supabase'
import './Authentication.css'

export function Authentication() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('') // 'success' or 'error'
  const [showResendButton, setShowResendButton] = useState(false)
  const navigate = useNavigate()

  const showMessage = (text, type) => {
    setMessage(text)
    setMessageType(type)
    // Show resend button if email not confirmed
    setShowResendButton(type === 'error' && text.includes('Email not confirmed'))
    setTimeout(() => {
      setMessage('')
      setMessageType('')
      setShowResendButton(false)
    }, 10000) // Increased timeout for email confirmation messages
  }

  const handleResendVerification = async () => {
    if (!email) {
      showMessage('Please enter your email address first.', 'error')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      })

      if (error) {
        showMessage(error.message, 'error')
      } else {
        showMessage('Verification email sent! Please check your inbox and spam folder.', 'success')
      }
    } catch (error) {
      showMessage('Failed to resend verification email. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
            display_name: name, // Use full name as display name
            full_name: name     // Also set full_name for compatibility
          }
        }
      })

      if (error) {
        showMessage(error.message, 'error')
      } else {
        showMessage('Account created successfully! Please check your email to verify your account.', 'success')
        // Clear form
        setEmail('')
        setPassword('')
        setName('')
        // Switch to login after successful signup
        setTimeout(() => setIsLogin(true), 2000)
      }
    } catch (error) {
      showMessage('An unexpected error occurred. Please try again.', 'error')
      console.error('Sign up error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignIn = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        // Handle specific error cases
        if (error.message.includes('Email not confirmed')) {
          showMessage('Please check your email and click the verification link before signing in. Check your spam folder if you don\'t see it.', 'error')
        } else if (error.message.includes('Invalid login credentials')) {
          showMessage('Invalid email or password. Please check your credentials and try again.', 'error')
        } else {
          showMessage(error.message, 'error')
        }
      } else {
        showMessage('Login successful! Welcome back.', 'success')
        // Navigate to homepage after successful login
        setTimeout(() => navigate('/'), 1500)
      }
    } catch (error) {
      showMessage('An unexpected error occurred. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setEmail('')
    setPassword('')
    setName('')
    setMessage('')
    setMessageType('')
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    resetForm()
  }

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
          <div className="shape shape-5"></div>
        </div>
      </div>
      
      <div className="auth-content">
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title">
              {isLogin ? 'Welcome Back' : 'Join Us'}
            </h1>
            <p className="auth-subtitle">
              {isLogin 
                ? 'Sign in to your K B Beveragers account' 
                : 'Create your K B Beveragers account'
              }
            </p>
          </div>

          {message && (
            <div className={`auth-message ${messageType}`}>
              <span className="message-icon">
                {messageType === 'success' ? '✓' : '⚠'}
              </span>
              <div className="message-content">
                <p>{message}</p>
                {showResendButton && (
                  <button
                    type="button"
                    className="resend-button"
                    onClick={handleResendVerification}
                    disabled={loading}
                  >
                    {loading ? 'Sending...' : 'Resend Verification Email'}
                  </button>
                )}
              </div>
            </div>
          )}

          <form className="auth-form" onSubmit={isLogin ? handleSignIn : handleSignUp}>
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin}
                  placeholder="Enter your full name"
                  className="form-input"
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                className="form-input"
                minLength="6"
              />
            </div>

            <button
              type="submit"
              className="auth-button primary"
              disabled={loading}
            >
              {loading ? (
                <span className="loading-spinner"></span>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                type="button"
                className="auth-link"
                onClick={toggleMode}
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>

          <div className="auth-back">
            <button
              type="button"
              className="back-button"
              onClick={() => navigate('/')}
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Authentication
