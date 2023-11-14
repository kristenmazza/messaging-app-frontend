import './App.css';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import RequireAuth from './components/RequireAuth';
import PersistLogin from './components/PersistLogin';
import Account from './components/Account';
import UsersList from './components/UsersList';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route path='login' element={<Login />} />
        <Route path='register' element={<Register />} />
        {/* <Route path='unauthorized' element={<Unauthorized />} /> */}

        {/* Protected routes */}
        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth />}>
            <Route path='/' element={<Home />} />
            <Route path='/account' element={<Account />} />
            <Route path='/users' element={<UsersList />} />
          </Route>
        </Route>

        {/* catch all
        <Route path='*' element={<Missing />} /> */}
      </Route>
    </Routes>
  );
}

export default App;
