import React from 'react';
import './Home.css';
import ConnectWalletButton from '../components/ConnectWalletButton';
import { useNavigate } from 'react-router-dom';

function Home({ connectWallet }) {
  const navigate = useNavigate();

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
      navigate('/dashboard');
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  return (
    <div className="home-container">
      <ConnectWalletButton onClick={handleConnectWallet} />
      <h1 className="home-title">BlockBlog</h1>
      <h2 className="home-subtitle">Decentralized Blog Platform</h2>
      <footer className="home-footer">© 2024 BlockBlog. All rights reserved. github.com/hashhashbr</footer>
    </div>
  );
}

export default Home;
