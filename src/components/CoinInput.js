import React, { useState } from 'react';
import { addCoin } from '../services/api';

const CoinInput = () => {
  const [coinData, setCoinData] = useState({
    coinName: '',
    value: '',
    quantity: '',
    date: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addCoin({
        coinName: coinData.coinName,
        value: parseFloat(coinData.value),
        quantity: parseFloat(coinData.quantity),
        date: coinData.date,
      });
      alert('Coin added successfully!');
      setCoinData({ coinName: '', value: '', quantity: '', date: '' });
    } catch (error) {
      console.error('Error adding coin:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="row">
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Coin Name"
            value={coinData.coinName}
            onChange={(e) => setCoinData({ ...coinData, coinName: e.target.value })}
            required
          />
        </div>
        <div className="col-md-3">
          <input
            type="number"
            className="form-control"
            placeholder="Value"
            value={coinData.value}
            onChange={(e) => setCoinData({ ...coinData, value: e.target.value })}
            required
          />
        </div>
        <div className="col-md-3">
          <input
            type="number"
            className="form-control"
            placeholder="Quantity"
            value={coinData.quantity}
            onChange={(e) => setCoinData({ ...coinData, quantity: e.target.value })}
            required
          />
        </div>
        <div className="col-md-3">
          <input
            type="date"
            className="form-control"
            value={coinData.date}
            onChange={(e) => setCoinData({ ...coinData, date: e.target.value })}
            required
          />
        </div>
      </div>
      <button type="submit" className="btn btn-primary mt-3">
        Submit
      </button>
    </form>
  );
};

export default CoinInput;