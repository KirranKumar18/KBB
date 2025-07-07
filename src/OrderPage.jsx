import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './App.css'

function OrderPage() {
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState([])
  const [showCart, setShowCart] = useState(false)

  // Product data
  const products = [
    {
      id: 1,
      name: "Pet Bottle 300ml",
      size: "300ml",
      price: 15,
      image: "🍼",
      description: "Perfect for single servings and on-the-go hydration"
    },
    {
      id: 2,
      name: "Pet Bottle 500ml",
      size: "500ml", 
      price: 25,
      image: "🍼",
      description: "Ideal size for personal use and light activities"
    },
    {
      id: 3,
      name: "Pet Bottle 1L",
      size: "1L",
      price: 40,
      image: "🍼",
      description: "Great for families and extended activities"
    }
  ]

  const addToCart = (product, quantity) => {
    const existingItem = cartItems.find(item => item.id === product.id)
    
    if (existingItem) {
      setCartItems(cartItems.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ))
    } else {
      setCartItems([...cartItems, { ...product, quantity }])
    }
  }

  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(productId)
    } else {
      setCartItems(cartItems.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      ))
    }
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  return (
    <div className="app order-page">
      <header className="header">
        <div className="container">
          <h1 className="logo" onClick={() => navigate('/')}>K B Beveragers</h1>
          <nav className="nav">
            <button 
              className="nav-btn home-btn"
              onClick={() => navigate('/')}
            >
              ← Home
            </button>
            <button 
              className="cart-button"
              onClick={() => setShowCart(!showCart)}
            >
              🛒 My Cart {getTotalItems() > 0 && <span className="cart-count">({getTotalItems()})</span>}
            </button>
          </nav>
        </div>
      </header>

      <main className="main">
        <div className="container">
          {/* Order Header */}
          <section className="order-header">
            <div className="order-breadcrumb">
              <span onClick={() => navigate('/')}>Home</span> / <span>Order</span>
            </div>
            <h2 className="order-title">Order Premium Pet Bottles</h2>
            <p className="order-subtitle">Choose from our range of high-quality, BPA-free bottles</p>
          </section>

          {/* Products Section */}
          <section className="products">
            <div className="section-content">
              <h3 className="section-title">Available Products</h3>
              <div className="product-grid">
                {products.map(product => (
                  <ProductCard 
                    key={product.id}
                    product={product}
                    onAddToCart={addToCart}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Order Benefits */}
          <section className="order-benefits">
            <div className="section-content">
              <h3 className="section-title">Why Order From Us?</h3>
              <div className="benefits-grid">
                <div className="benefit-item">
                  <div className="benefit-icon">🚚</div>
                  <h4>Free Delivery</h4>
                  <p>Free delivery on orders above ₹500</p>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon">⚡</div>
                  <h4>Quick Processing</h4>
                  <p>Orders processed within 24 hours</p>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon">🛡️</div>
                  <h4>Quality Guarantee</h4>
                  <p>100% quality assurance on all products</p>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon">💳</div>
                  <h4>Secure Payment</h4>
                  <p>Multiple secure payment options</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {showCart && (
        <Cart 
          items={cartItems}
          onClose={() => setShowCart(false)}
          onRemove={removeFromCart}
          onUpdateQuantity={updateQuantity}
          totalPrice={getTotalPrice()}
        />
      )}
    </div>
  )
}

function ProductCard({ product, onAddToCart }) {
  const [quantity, setQuantity] = useState(1)

  const handleAddToCart = () => {
    onAddToCart(product, quantity)
    setQuantity(1) // Reset quantity after adding
  }

  return (
    <div className="product-card">
      <div className="product-image">{product.image}</div>
      <div className="product-info">
        <h4 className="product-name">{product.name}</h4>
        <p className="product-description">{product.description}</p>
        <div className="product-price">₹{product.price}</div>
        
        <div className="quantity-selector">
          <label htmlFor={`quantity-${product.id}`}>Quantity:</label>
          <div className="quantity-controls">
            <button 
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="quantity-btn"
            >
              -
            </button>
            <input 
              id={`quantity-${product.id}`}
              type="number" 
              min="1" 
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="quantity-input"
            />
            <button 
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="quantity-btn"
            >
              +
            </button>
          </div>
        </div>
        
        <button className="add-to-cart-btn" onClick={handleAddToCart}>
          Add to Cart
        </button>
      </div>
    </div>
  )
}

function Cart({ items, onClose, onRemove, onUpdateQuantity, totalPrice }) {
  return (
    <div className="cart-overlay">
      <div className="cart">
        <div className="cart-header">
          <h3>Shopping Cart</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        
        <div className="cart-content">
          {items.length === 0 ? (
            <p className="empty-cart">Your cart is empty</p>
          ) : (
            <>
              <div className="cart-items">
                {items.map(item => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-info">
                      <span className="cart-item-image">{item.image}</span>
                      <div>
                        <div className="cart-item-name">{item.name}</div>
                        <div className="cart-item-price">₹{item.price} each</div>
                      </div>
                    </div>
                    
                    <div className="cart-item-controls">
                      <div className="quantity-controls">
                        <button 
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="quantity-btn"
                        >
                          -
                        </button>
                        <span className="quantity-display">{item.quantity}</span>
                        <button 
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="quantity-btn"
                        >
                          +
                        </button>
                      </div>
                      <button 
                        onClick={() => onRemove(item.id)}
                        className="remove-btn"
                      >
                        🗑️
                      </button>
                    </div>
                    
                    <div className="cart-item-total">
                      ₹{item.price * item.quantity}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="cart-footer">
                <div className="cart-total">
                  <strong>Total: ₹{totalPrice}</strong>
                </div>
                <button className="checkout-btn">
                  Proceed to Checkout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default OrderPage
