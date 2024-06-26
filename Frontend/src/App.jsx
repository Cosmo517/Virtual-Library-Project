import React, {useState, useEffect} from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

import { Dashboard } from './pages/Dashboard';
import { AddingBooks } from './pages/AddingBooks'
import { Browse } from './pages/Browse';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { PrivateRoutes } from './Components/PrivateRoutes';
import { RemovingBooks } from './pages/RemovingBooks';
import { UserSettings } from './pages/UserSettings';
import { AdminRoutes } from './Components/AdminRoutes';


const App = () => {
  return (
    <Router>
      <Routes>
            <Route path='/Login' element={<Login />} />
            <Route path='/Register' element={<Register />} />

          <Route element={<PrivateRoutes />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/Browse" element={<Browse />} />
              <Route path='/UserSettings' element={<UserSettings />} />

              <Route element={<AdminRoutes />}>
                <Route path="/AddingBooks" element={<AddingBooks />} />
                <Route path='/RemovingBooks' element={<RemovingBooks />} />
              </Route>
          </Route>
        </Routes>
    </Router>
  );
};

export default App;