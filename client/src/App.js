import './App.css';
import Home from './pages/home/Home';
import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Auth from './pages/auth/Auth';
import ProfileDetails from './pages/profileDetails/ProfileDetails';
import UpdateProfile from './pages/updateProfile/UpdateProfile';

function App() {
  const {user} = useSelector((state) => state.auth)

  return (
    <div>
      <Routes>
        <Route path='/' element={user ? <Home /> : <Navigate to='/auth' />} />
        <Route path='/profile/:id' element={user ? <ProfileDetails /> : <Navigate to='/auth' />} />
        <Route path='/updateProfile/:id' element={user ? <UpdateProfile /> : <Navigate to='/auth' />} />
        <Route path='/auth' element={!user ? <Auth /> : <Navigate to='/' />} />
      </Routes>
    </div>
  );
}

export default App;
