import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './components/Cart/CartContext';
import Start from './components/Start/Start';
import CreateAccount from './components/CreateAccount/CreateAccount';
import Login from './components/Login/Login';
import Shop from './components/Product/Shop';
import Cart from './components/Cart/Cart';
import Checkout from './components/Payment/Checkout';

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="App">
          <div className="container">
            <Routes>
              <Route path="/" element={<Start />} />
              <Route path="/CreateAccount/CreateAccount" element={<CreateAccount />} />
              <Route path="/Login/Login" element={<Login />} />
              <Route path="/Shop/Shop" element={<Shop />} />
              <Route path="/Cart/Cart" element={<Cart />} />
              <Route path="/Checkout/Checkout" element={<Checkout />} />
            </Routes>
          </div>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;