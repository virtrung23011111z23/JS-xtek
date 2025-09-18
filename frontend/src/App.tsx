import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './compoment/Header';
import Cart from './pages/Cart';
import Home from './pages/Home';
import Order from "./pages/Order"
import '../public/css/main.css'
import { LocalStrongeUp } from "../lib/data/dataProduct"

function App() {
  LocalStrongeUp();
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/order' element={<Order />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
