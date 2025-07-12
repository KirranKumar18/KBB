import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Homepage from './Homepage'
import OrderPage from './OrderPage'
import Authentication from './Authentication'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/order" element={<OrderPage />} />
        <Route path="/auth" element={<Authentication />} />
      </Routes>
    </Router>
  )
}

export default App
