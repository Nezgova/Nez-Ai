import React from 'react';
import './Home.css';
import Sidebar from '../components/Sidebar/Sidebar';
import Header from '../components/Header/Header';
import ChatWindow from '../components/Chat/ChatWindow';
import ChatInput from '../components/Input/ChatInput';

const Home: React.FC = () => {
  return (
    <div className="home-layout">
      <Sidebar />
      <div className="home-main">
        <Header />
        <ChatWindow />
        <ChatInput />
      </div>
    </div>
  );
};

export default Home;