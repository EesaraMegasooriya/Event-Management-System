import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import GroupM from './components/GroupM';
import NewGM from './components/NewGM';
import NewEvent from './components/NewEvent';
import GroupView from './components/Groupview';
import Header from './components/Header';
import EventView from './components/EventView';
import Dashboard from './components/Dashboard';
import Home from './components/Home';
import Footer from './components/Footer';
import './App.css';


function App() {
  return (
    <Router>
      <Header />
      <Routes>
      <Route path="/" element={<Home />} />
        <Route path="/group-management" element={<GroupView />} />
        <Route path="/add-group" element={<NewGM />} />
        <Route path="/add-event" element={<NewEvent />} />
        <Route path="/calendar" element={<GroupM />} />
        <Route path="/event" element={<EventView />} />
        <Route path="/dashboard" element={<Dashboard />} />



        {/* <Route path="/about" element={<About />} /> */}
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
