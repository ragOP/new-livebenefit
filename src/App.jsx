import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Chatbot from './Chatbot';
import ChatbotTwo from './Chatbottwo';
import ChatbotThree from './ChatbotThree';
import ChatbotFour from './ChatbotFour';
import Chatbotdq from './Chatbotdq';
import Chatbotdq2 from './Chatbotdq2';
import Home from './Home';
import FastChat from './FastChat';
import Raghib from './Raghib';

const App = () => {
  // sdss
  return (
    <Router>
      <Routes>
      {/* <Route path="/" element={<Home />} /> */}
        <Route path="/" element={<Chatbotdq />} />
        {/* <Route path="/engsfdq" element={<Chatbotdq2 />} />
        <Route path="/engsf2200" element={<ChatbotTwo />} />
        <Route path="/engsf1dup" element={<Chatbotdq2 />} />
        <Route path="/engsffast" element={<FastChat />} />
        <Route path="/engsf2200dup" element={<ChatbotFour />} />
          <Route path="/engimg" element={<Raghib />} /> */}
      </Routes>
    </Router>
  );
};

export default App;
