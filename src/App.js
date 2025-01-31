import React, { useState, useEffect, useCallback } from 'react';
import { getAllUniqueCoinNames, addNewCoin, addCoin, getCoinsByCoinName, getEntriesByDateRange } from './services/api';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import 'bootstrap/dist/css/bootstrap.min.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function App() {
  const [selectedCoin, setSelectedCoin] = useState('');
  const [coinNames, setCoinNames] = useState([]);
  const [newCoinName, setNewCoinName] = useState('');
  const [entryData, setEntryData] = useState({
    quantity: '',
    value: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [chartData, setChartData] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: '',
  });

  // Fetch all unique coin names on app load
  useEffect(() => {
    const fetchCoinNames = async () => {
      try {
        const names = await getAllUniqueCoinNames();
        setCoinNames(names);
        if (names.length > 0) {
          setSelectedCoin(names[0]);
        }
      } catch (error) {
        console.error('Failed to fetch coin names:', error);
      }
    };

    fetchCoinNames();
  }, []);

  const fetchChartData = useCallback(async () => {
    try {
      console.log('Fetching data for coins:', coinNames); // Log coin names
  
      const allCoinsData = await Promise.all(
        coinNames.map(async (coinName) => {
          const entries = await getCoinsByCoinName(coinName);
          console.log(`Entries fetched for ${coinName}:`, entries); // Log fetched entries
          return entries.map((entry) => ({
            date: entry.date,
            totalValue: entry.value * entry.quantity,
          }));
        })
      );
  
      console.log('All coins data:', allCoinsData); // Log processed data
  
      // Flatten all entries to find the global date range
      const allEntries = allCoinsData.flat();
      console.log('Flattened entries:', allEntries); // Log flattened entries
  
      if (allEntries.length === 0) {
        console.warn('No entries found for any coin.');
        setChartData(null); // Handle empty data gracefully
        return;
      }
  
      // Extract unique dates
      const allDates = [...new Set(allEntries.map((entry) => entry.date))].sort();
      console.log('Unique dates:', allDates); // Log unique dates
  
      if (allDates.length < 2) {
        console.warn('Not enough dates to generate a range.');
        setChartData(null); // Handle insufficient data
        return;
      }
  
      // Generate full date range
      const startDate = allDates[0];
      const endDate = allDates[allDates.length - 1];
      const fullDateRange = generateDateRange(startDate, endDate);
      console.log('Full date range:', fullDateRange); // Log full date range
  
      // Prepare datasets with filled dates
      const datasets = coinNames.map((coinName, index) => {
        const coinData = allCoinsData[index];
        const filledData = fillMissingDates(coinData, fullDateRange);
        console.log(`Filled data for ${coinName}:`, filledData); // Log filled data
        return {
          label: coinName,
          data: filledData.map((d) => d.totalValue),
          borderColor: getRandomColor(),
          backgroundColor: getRandomColor(),
          fill: false,
        };
      });
  
      console.log('Final chart data:', { labels: fullDateRange, datasets }); // Log final chart data
  
      setChartData({
        labels: fullDateRange,
        datasets,
      });
    } catch (error) {
      console.error('Error fetching chart data:', error);
    }
  }, [coinNames]);

  // Fetch filtered chart data by date range
  const fetchFilteredChartData = useCallback(async () => {
    try {
      const { startDate, endDate } = dateRange;
      if (!startDate || !endDate) {
        alert('Please select both start and end dates.');
        return;
      }

      const filteredData = await Promise.all(
        coinNames.map(async (coinName) => {
          const entries = await getEntriesByDateRange(coinName, startDate, endDate);
          return entries.map((entry) => ({
            date: entry.date,
            totalValue: entry.value * entry.quantity,
          }));
        })
      );

      const labels = [...new Set(filteredData.flat().map((entry) => entry.date))].sort();
      const datasets = coinNames.map((coinName, index) => {
        const coinData = filteredData[index];
        return {
          label: coinName,
          data: labels.map((date) => {
            const entry = coinData.find((e) => e.date === date);
            return entry ? entry.totalValue : null;
          }),
          borderColor: getRandomColor(),
          backgroundColor: getRandomColor(),
          fill: false,
        };
      });

      setChartData({ labels, datasets });
    } catch (error) {
      console.error('Error fetching filtered chart data:', error);
    }
  }, [coinNames, dateRange]);

  // Clear the date filter and reload the chart with full data
  const clearDateFilter = () => {
    setDateRange({
      startDate: '',
      endDate: '',
    });
    fetchChartData(); // Reload the chart with all data
  };

  // Generate a random color
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const handleAddCoin = async () => {
    if (!newCoinName.trim()) {
      alert('Please enter a valid coin name.');
      return;
    }

    try {
      await addNewCoin(newCoinName);

      const updatedNames = [...coinNames, newCoinName];
      setCoinNames(updatedNames);
      setSelectedCoin(newCoinName);
      setNewCoinName('');
    } catch (error) {
      console.error('Error adding new coin:', error);
    }
  };

  const fillMissingDates = (data, allDates) => {
    const filledData = allDates.map((date) => {
      const entry = data.find((d) => d.date === date);
      return {
        date,
        totalValue: entry ? entry.totalValue : null, // Use null for missing dates
      };
    });
  
    console.log('Filled missing dates:', filledData); // Log filled data
    return filledData;
  };

  const generateDateRange = (startDate, endDate) => {
    const dates = [];
    let currentDate = new Date(startDate);
    const lastDate = new Date(endDate);
  
    while (currentDate <= lastDate) {
      dates.push(currentDate.toISOString().split('T')[0]); // Format as YYYY-MM-DD
      currentDate.setDate(currentDate.getDate() + 1); // Increment by one day
    }
  
    console.log('Generated date range:', dates); // Log generated dates
    return dates;
  };

  const handleSubmitEntry = async (e) => {
    e.preventDefault();
  
    if (!selectedCoin || !entryData.quantity || !entryData.value || !entryData.date) {
      alert('Please fill in all fields.');
      return;
    }
  
    try {
      // Prepare the payload
      const entry = {
        coinName: selectedCoin,
        value: parseFloat(entryData.value),
        quantity: parseFloat(entryData.quantity),
        date: entryData.date,
      };
  
      // Add the new entry
      await addCoin(entry);
  
      // Show success message
      setSuccessMessage('Entry added successfully!');
  
      // Reset the form fields
      setEntryData({
        quantity: '',
        value: '',
        date: new Date().toISOString().split('T')[0],
      });
  
      // Reload the chart data
      await fetchChartData();
  
      // Clear the success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error adding new entry:', error);
    }
  };

  const handleEntryChange = (e) => {
    const { name, value } = e.target;
    setEntryData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleApplyFilter = () => {
    fetchFilteredChartData();
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Crypto Dashboard</h1>

      {/* Add New Coin */}
      <div className="mb-4">
        <h3>Add New Coin</h3>
        <input
          type="text"
          className="form-control"
          placeholder="Enter new coin name"
          value={newCoinName}
          onChange={(e) => setNewCoinName(e.target.value)}
        />
        <button className="btn btn-primary mt-2" onClick={handleAddCoin}>
          Add Coin
        </button>
      </div>

      {/* Add New Entry */}
      <div className="mb-4">
        <h3>Add New Entry</h3>
        <form onSubmit={handleSubmitEntry}>
          {/* Coin Selection Dropdown */}
          <div className="mb-3">
            <label htmlFor="coinSelect" className="form-label">
              Select Coin:
            </label>
            <select
              id="coinSelect"
              className="form-select"
              value={selectedCoin}
              onChange={(e) => setSelectedCoin(e.target.value)}
            >
              {coinNames.map((name, index) => (
                <option key={index} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          {/* Horizontal Fields */}
          <div className="row mb-3">
            {/* Quantity Field */}
            <div className="col-md-4">
              <label htmlFor="quantity" className="form-label">
                Quantity:
              </label>
              <input
                type="number"
                step="any"
                className="form-control"
                id="quantity"
                name="quantity"
                value={entryData.quantity}
                onChange={handleEntryChange}
                required
              />
            </div>

            {/* Value Field */}
            <div className="col-md-4">
              <label htmlFor="value" className="form-label">
                Value:
              </label>
              <input
                type="number"
                step="any"
                className="form-control"
                id="value"
                name="value"
                value={entryData.value}
                onChange={handleEntryChange}
                required
              />
            </div>

            {/* Date Field */}
            <div className="col-md-4">
              <label htmlFor="date" className="form-label">
                Date:
              </label>
              <input
                type="date"
                className="form-control"
                id="date"
                name="date"
                value={entryData.date}
                onChange={handleEntryChange}
                required
              />
            </div>
          </div>

          {/* Submit Button and Success Message */}
          <div className="d-flex align-items-center">
            <button type="submit" className="btn btn-success me-3">
              Add Entry
            </button>
            {successMessage && (
              <span className="text-success">{successMessage}</span>
            )}
          </div>
        </form>
      </div>

      {/* Date Range Filter */}
      <div className="mb-4">
        <h3>Date Range Filter</h3>
        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="startDate" className="form-label">
              Start Date:
            </label>
            <input
              type="date"
              className="form-control"
              id="startDate"
              value={dateRange.startDate}
              onChange={(e) =>
                setDateRange({ ...dateRange, startDate: e.target.value })
              }
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="endDate" className="form-label">
              End Date:
            </label>
            <input
              type="date"
              className="form-control"
              id="endDate"
              value={dateRange.endDate}
              onChange={(e) =>
                setDateRange({ ...dateRange, endDate: e.target.value })
              }
            />
          </div>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-primary" onClick={handleApplyFilter}>
            Apply Filter
          </button>
          <button className="btn btn-secondary" onClick={clearDateFilter}>
            Clear Filter
          </button>
        </div>
      </div>

      {/* Line Chart */}
      <div className="mb-4">
        <h3>Crypto Variation Chart</h3>
        {chartData ? (
          <Line
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
                title: {
                  display: true,
                  text: 'Total Value (Value * Quantity) Over Time',
                },
              },
              scales: {
                x: {
                  title: {
                    display: true,
                    text: 'Date',
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: 'Total Value',
                  },
                },
              },
            }}
          />
        ) : (
          <p>Loading chart data...</p>
        )}
      </div>
    </div>
  );
}

export default App;