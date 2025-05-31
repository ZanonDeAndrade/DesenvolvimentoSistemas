import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Start from './components/Start/Start';
import CreateAccount from './components/CreateAccount/CreateAccount';
import Login from './components/Login/Login';
import Shop from './components/Product/Shop';

function App() {
  return (
    <Router>
      <div className="App">
        <div className="container">
          <Routes>
            <Route path="/" element={<Start />} /> 
            <Route path="/CreateAccount/CreateAccount" element={<CreateAccount />} />
            <Route path="/Login/Login" element={<Login />} />
            <Route path="/Shop/Shop" element={<Shop />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;