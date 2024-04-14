import React, {useState, useEffect} from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

import { Dashboard } from './pages/Dashboard';
import { AddingBooks } from './pages/AddingBooks'
import { Browse } from './pages/Browse';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Search } from './pages/Search'
import { PrivateRoutes } from '../Components/PrivateRoutes';




const App = () => {
  return (
    <Router>
      <Routes>
            <Route path='/Register' element={<Register />} />
            <Route path='/Login' element={<Login />} />

          <Route element={<PrivateRoutes />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/AddingBooks" element={<AddingBooks />} />
              <Route path="/Browse" element={<Browse />} />
              <Route path="/Search" element={<Search />} />
          </Route>
        </Routes>
    </Router>
  );
};

export default App;