import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Homepage from './Homepage'
import OrderPage from './OrderPage'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/order" element={<OrderPage />} />
      </Routes>
    </Router>
  )
}

export default App
