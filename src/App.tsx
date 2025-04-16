import { Routes, Route } from 'react-router';
import Home from './components/Home';
import About from './components/About';
import NotFound from './components/NotFound';
import Header from './components/Header';
import Footer from './components/Footer';
import Users from './components/Users';
import User from './components/User';

const App = () => {
  return(
    <>
      <Header />
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/about' element={<About />}/>
        <Route path='users' element={<Users />}/>
        <Route path='users/:id' element={<User />}/>
        <Route path='*' element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App;