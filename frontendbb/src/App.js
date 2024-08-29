import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import UserDashboard from './components/UserDashboard';
import { contractABI, contractAddress } from './config/index';
import './styles/variables.css'

function App() {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const checkIfWalletIsConnected = async () => {
      try {
        if (window.ethereum) {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setCurrentAccount(accounts[0]);
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = provider.getSigner();
            const contractInstance = new ethers.Contract(contractAddress, contractABI, signer);
            setContract(contractInstance);
          }
        }
      } catch (error) {
        console.error('Error connecting to wallet:', error);
      }
    };

    checkIfWalletIsConnected();
  }, []);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert('Metamask is required to connect wallet.');
        return;
      }

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setCurrentAccount(accounts[0]);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = provider.getSigner();
      const contractInstance = new ethers.Contract(contractAddress, contractABI, signer);
      setContract(contractInstance);
    } catch (error) {
      console.error('Error connecting to wallet:', error);
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home connectWallet={connectWallet} />} />
        <Route path="/dashboard" element={<UserDashboard currentAccount={currentAccount} setCurrentAccount={setCurrentAccount} contract={contract} />} />
      </Routes>
    </Router>
  );
}

export default App;

