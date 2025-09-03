import React, { useState, useEffect } from 'react';
import './App.css';
import TarryIcon from './tarry-icon.png';
import playIcon from './play.png';
import menuIcon from './menu-icon.png';
import walletIcon from './wallet-icon.png';

// Import sneak peak images explicitly
import sneakPeak1 from './sneakpeak1.png';
import sneakPeak2 from './sneakpeak2.png';
import sneakPeak3 from './sneakpeak3.png';
import sneakPeak4 from './sneakpeak4.png';
import sneakPeak5 from './sneakpeak5.png';

// Array of imported images
const sneakPeakImages = [sneakPeak1, sneakPeak2, sneakPeak3, sneakPeak4, sneakPeak5];

// API base (use REACT_APP_API_URL to override in environment)
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [isWhitelisted, setIsWhitelisted] = useState(null);
  const [message, setMessage] = useState('');
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [showWalletPopup, setShowWalletPopup] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [activeTab, setActiveTab] = useState('about');
  const [currentSlide, setCurrentSlide] = useState(0); // For slideshow
  const [fade, setFade] = useState(true); // For smooth transition

  const checkWhitelist = async () => {
    if (!walletAddress) {
      setMessage('Please enter a wallet address.');
      return;
    }
    try {
  const response = await fetch(`${API_BASE}/check_wallet?address=${walletAddress}`);
      const data = await response.json();
      setIsWhitelisted(data.whitelisted);
      setMessage(data.whitelisted ? 'Congratulations! You are on the whitelist!' : 'Sorry, you are not on the whitelist.');
    } catch (error) {
      setMessage('Error checking whitelist: ' + error.message);
    }
    setShowWalletPopup(false);
  };

  const toggleMenu = () => {
    setShowMenuModal(true);
  };

  const handlePlayClick = () => {
    setShowComingSoon(true);
  };

  const closeComingSoon = () => {
    setShowComingSoon(false);
  };

  const openWalletPopup = () => {
    setShowWalletPopup(true);
    setWalletAddress('');
    setMessage('');
  };

  const closeWalletPopup = () => {
    setShowWalletPopup(false);
  };

  const closeMenuModal = () => {
    setShowMenuModal(false);
    setCurrentSlide(0); // Reset slide on close
  };

  // Slideshow effect triggered when SNEAK PEAKS is active
  useEffect(() => {
    let interval;
    if (showMenuModal && activeTab === 'sneakPeaks') {
      interval = setInterval(() => {
        setFade(false); // Start fade out
        setTimeout(() => {
          setCurrentSlide((prev) => (prev + 1) % sneakPeakImages.length);
          setFade(true); // Fade in new image
        }, 500); // Match with CSS transition duration
      }, 5000); // 5 seconds interval
    } else {
      setCurrentSlide(0); // Reset when not on SNEAK PEAKS
    }
    return () => {
      clearInterval(interval);
    };
  }, [showMenuModal, activeTab]);

  return (
    <div className="app">
      <div className="menu-tab" onClick={toggleMenu}>
        <img src={menuIcon} alt="Menu" className="menu-icon" />
      </div>
      <div className="wallet-tab" onClick={openWalletPopup}>
        <img src={walletIcon} alt="Wallet" className="wallet-icon" />
      </div>
      <div className="title">
        <img src={TarryIcon} alt="Tarry Games" className="title-icon" />
      </div>
      <button className="play-button" onClick={handlePlayClick}>
        <img src={playIcon} alt="Play" className="play-icon" />
      </button>
      {message && <p className="message">{message}</p>}
      {showComingSoon && (
        <div className="coming-soon-overlay" onClick={closeComingSoon}>
          <div className="coming-soon-modal">
            <h2>Coming Soon!</h2>
            <p>Get ready for an epic adventure!</p>
            <button className="close-btn" onClick={closeComingSoon}>
              Close
            </button>
          </div>
        </div>
      )}
      {showWalletPopup && (
        <div className="wallet-overlay" onClick={closeWalletPopup}>
          <div className="wallet-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Check Wallet Eligibility</h2>
            <input
              type="text"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="Enter wallet address"
              className="wallet-input"
            />
            <button className="check-btn" onClick={checkWhitelist}>
              Check
            </button>
            {message && <p className="wallet-message">{message}</p>}
            <button className="close-btn" onClick={closeWalletPopup}>
              Close
            </button>
          </div>
        </div>
      )}
      {showMenuModal && (
        <div className="menu-overlay" onClick={closeMenuModal}>
          <div className={`menu-modal ${activeTab === 'sneakPeaks' ? 'sneak-peaks-tab' : ''}`} onClick={(e) => e.stopPropagation()}>
            <div className="tab-buttons">
              <button
                className={`tab-btn ${activeTab === 'about' ? 'active' : ''}`}
                onClick={() => setActiveTab('about')}
              >
                ABOUT
              </button>
              <button
                className={`tab-btn ${activeTab === 'sneakPeaks' ? 'active' : ''}`}
                onClick={() => setActiveTab('sneakPeaks')}
              >
                SNEAK PEAKS
              </button>
              <button
                className={`tab-btn ${activeTab === 'officialLinks' ? 'active' : ''}`}
                onClick={() => setActiveTab('officialLinks')}
              >
                OFFICIAL LINKS
              </button>
            </div>
            <div className="tab-content">
              {activeTab === 'about' && (
                <div className="tab-panel">
                  {/* <h3>About Tarry Games</h3> */}
                  <p type='fuck'> Tarry Games is an innovative collectible card game built on the Ethereum blockchain. Each card in the collection is uniquely designed, featuring distinct abilities and powers that set it apart from all others. Players can collect, trade, and strategize using their cards, bringing a new dimension of gameplay and ownership to blockchain.
                    We're a team passionate about creating monetized gaming experience. </p>
                </div>
              )}
              {activeTab === 'sneakPeaks' && (
                <div className="tab-panel">
                  {/* <h3>Sneak Peaks</h3> */}
                  <div className="slideshow">
                    <img
                      src={sneakPeakImages[currentSlide] || './placeholder.jpg'}
                      alt={`Sneak Peak ${currentSlide + 1}`}
                      className={`slide-image ${fade ? 'fade-in' : 'fade-out'}`}
                      onError={(e) => { e.target.src = './placeholder.jpg'; }}
                    />
                  </div>
                  <p type='describe'>Check out exclusive previews of our upcoming games! More details coming soon...</p>
                </div>
              )}
              {activeTab === 'officialLinks' && (
                <div className="tab-panel">
                  {/* <h3>Official Links</h3> */}
                  <p><a href="https://x.com/tarriesnft?s=21" target="_blank" rel="noopener noreferrer">Twitter</a></p>
                  <p><a href="https://discord.gg/tarrygames" target="_blank" rel="noopener noreferrer">Discord</a></p>
                </div>
              )}
            </div>
            <button className="close-btn" onClick={closeMenuModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;