import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import GroupM from './components/GroupM';
import NewGM from './components/NewGM';
import NewEvent from './components/NewEvent';
import GroupView from './components/Groupview';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GroupView />} />
        {/* <Route path="/about" element={<About />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
