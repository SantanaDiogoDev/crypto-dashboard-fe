import React, { useState, useEffect } from 'react';
import { getAllCoins, getCoinsByCoinName } from './services/api';
import CoinInput from './components/CoinInput';
import CoinChart from './components/CoinChart';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [selectedCoin, setSelectedCoin] = useState('Bitcoin'); // Default selected coin
  const [chartData, setChartData] = useState([]);

  // Fetch coins when the selected coin changes
  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const coins = await getCoinsByCoinName(selectedCoin);
        setChartData(coins);
      } catch (error) {
        console.error('Failed to fetch coins:', error);
      }
    };

    fetchCoins();
  }, [selectedCoin]);

  // Handle coin selection change
  const handleCoinChange = (event) => {
    setSelectedCoin(event.target.value);
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Crypto Dashboard</h1>

      {/* Coin Selection Dropdown */}
      <div className="mb-4">
        <label htmlFor="coinSelect" className="form-label">
          Select Coin:
        </label>
        <select
          id="coinSelect"
          className="form-select"
          value={selectedCoin}
          onChange={handleCoinChange}
        >
          <option value="Bitcoin">Bitcoin</option>
          <option value="Ethereum">Ethereum</option>
          <option value="Solana">Solana</option>
          {/* Add more options as needed */}
        </select>
      </div>

      {/* Coin Input Form */}
      <CoinInput />

      {/* Coin Chart */}
      <CoinChart coinName={selectedCoin} chartData={chartData} />
    </div>
  );
}

export default App;