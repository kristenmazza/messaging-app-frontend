import './App.css';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import RequireAuth from './components/RequireAuth';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route path='login' element={<Login />} />
        <Route path='register' element={<Register />} />
        {/* <Route path='unauthorized' element={<Unauthorized />} /> */}

        {/* protected */}
        <Route element={<RequireAuth />}>
          <Route path='/' element={<Home />} />
        </Route>

        {/* catch all
        <Route path='*' element={<Missing />} /> */}
      </Route>
    </Routes>
  );
}

export default App;
