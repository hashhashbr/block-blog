import React from 'react';
import '../components/ConnectWalletButton.css';

function ConnectWalletButton({ onClick }) {
  return (
    <button className="connect-wallet-button" onClick={onClick}>
      Connect Wallet
    </button>
  );
}

export default ConnectWalletButton;
