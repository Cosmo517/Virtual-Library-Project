import React, {useState, useEffect} from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

import { Dashboard } from './pages/dashboard';
import { AddingBooks } from './pages/AddingBooks'
import { Browse } from './pages/browse';
import { Login } from './pages/login';
import { Register } from './pages/register';
import { Search } from './pages/search'
import { PrivateRoutes } from '../Components/PrivateRoutes';




const App = () => {
  return (
    <Router>
      <Routes>
            <Route path='/Login' element={<Login />} />
            <Route path='/Register' element={<Register />} />

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