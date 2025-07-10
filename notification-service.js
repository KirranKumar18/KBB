// Notification Service
// This script listens for new orders in Supabase and sends notifications via ntfy
import { createClient } from '@supabase/supabase-js'
import fetch from 'node-fetch'
// import { supabase } from './src/database/supabase.js'

// Supabase configuration (using the same config from your app)
const supabaseUrl = 'https://cypdviizsrdrirfqujss.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5cGR2aWl6c3JkcmlyZnF1anNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwNDcxOTgsImV4cCI6MjA2NzYyMzE5OH0.26qQGdq26fEkJOTxgrTBOdyxoKyfMyjNgbG3csF3h6c'
const supabase = createClient(supabaseUrl, supabaseKey)

// ntfy configuration
const NTFY_TOPIC = 'new-orders' // You can choose any topic name you want
const NTFY_URL = `https://ntfy.sh/${NTFY_TOPIC}`

console.log('🚀 K B Beveragers Notification Service')
console.log(`📱 Notifications will be sent to: ${NTFY_URL}`)
console.log('⏳ Waiting for new orders...')

// Subscribe to realtime changes on the orders table
const subscription = supabase
  .channel('schema-db-changes')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'orders',
    },
    async (payload) => {
      try {
        const orderId = payload.new.id
        console.log('📦 New order received:', orderId)
        
        // Skip if we've already notified about this order
        if (notifiedOrderIds.has(orderId)) {
          console.log(`⏭️ Skipping notification for order #${orderId} (already sent)`)
          return
        }
        
        // Get order details
        const orderData = payload.new.Order
        const customerName = payload.new["Customer name"]
        const total = payload.new.Total
        
        // Prepare notification content
        const title = `New Order #${orderId}`
        const message = `Customer: ${customerName}\nTotal: ₹${total}\nItems: ${orderData.item_count}`
        
        // Send notification to ntfy
        await sendNotification(title, message, orderData)
        
        // Mark this order as notified
        notifiedOrderIds.add(orderId)
        
        console.log('✅ Notification sent!')
      } catch (error) {
        console.error('❌ Error sending notification:', error)
      }
    }
  )
  .subscribe()

// Function to send notification to ntfy
async function sendNotification(title, message, orderData) {
  try {
    // Create a detailed message with order items
    let detailedMessage = message + '\n\nOrder Items:\n'
    
    // Add each item to the message
    orderData.items.forEach(item => {
      detailedMessage += `- ${item.bottle_type}: ${item.quantity} x ₹${item.unit_price} = ₹${item.total_price}\n`
    })
    
    // Send POST request to ntfy
    const response = await fetch(NTFY_URL, {
      method: 'POST',
      headers: {
        'Title': title,
        'Priority': 'high',
        'Tags': 'shopping_cart,money',
        'Content-Type': 'text/plain',
      },
      body: detailedMessage
    })
    
    if (!response.ok) {
      throw new Error(`ntfy responded with ${response.status}: ${response.statusText}`)
    }
  } catch (error) {
    console.error('Error sending ntfy notification:', error)
    throw error
  }
}

// Fallback: Check for new orders every 2 minutes
let lastCheckedId = 0
// Track which orders we've already sent notifications for
const notifiedOrderIds = new Set()

async function checkForNewOrders() {
  try {
    console.log('🔍 Checking for new orders...')
    
    // Query for new orders
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .gt('id', lastCheckedId)
      .order('id', { ascending: true })
    
    if (error) {
      console.error('❌ Error querying orders:', error)
      return
    }
    
    // Process any new orders
    if (data && data.length > 0) {
      console.log(`📋 Found ${data.length} new order(s)`)
      
      for (const order of data) {
        const orderId = order.id
        
        // Update last checked ID
        if (orderId > lastCheckedId) {
          lastCheckedId = orderId
        }
        
        // Skip if we've already notified about this order
        if (notifiedOrderIds.has(orderId)) {
          console.log(`⏭️ Skipping notification for order #${orderId} (already sent)`)
          continue
        }
        
        // Get order details
        const orderData = order.Order
        const customerName = order["Customer name"]
        const total = order.Total
        
        // Prepare notification content
        const title = `New Order #${orderId}`
        const message = `Customer: ${customerName}\nTotal: ₹${total}\nItems: ${orderData.item_count}`
        
        // Send notification
        await sendNotification(title, message, orderData)
        
        // Mark this order as notified
        notifiedOrderIds.add(orderId)
        
        console.log(`✅ Notification sent for order #${orderId}`)
      }
    } else {
      console.log('😴 No new orders found')
    }
  } catch (error) {
    console.error('❌ Error in checkForNewOrders:', error)
  }
}

// Initialize: Get the latest order ID first
async function initialize() {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('id')
      .order('id', { ascending: false })
      .limit(1)
    
    if (!error && data && data.length > 0) {
      lastCheckedId = data[0].id
      console.log(`🏁 Starting with last order ID: ${lastCheckedId}`)
    }
  } catch (error) {
    console.error('❌ Error initializing:', error)
  }
  
  // Start the periodic check
  setInterval(checkForNewOrders, 2 * 60 * 1000) // Check every 2 minutes
}

// Initialize the system
initialize()

// Keep the script running
process.on('SIGINT', () => {
  console.log('📴 Shutting down notification service...')
  subscription.unsubscribe()
  process.exit(0)
})
