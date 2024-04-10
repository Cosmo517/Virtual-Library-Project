import React, {useState, useEffect} from 'react';
import api from './api';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AddBooks/>}/>
      </Routes>
    </Router>
  );
};

export default App;