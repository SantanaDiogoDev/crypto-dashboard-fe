import React, { useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register the required components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const CoinChart = ({ coinName, chartData }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  const data = {
    labels: chartData.map((entry) => entry.date),
    datasets: [
      {
        label: coinName,
        data: chartData.map((entry) => entry.value),
        borderColor: 'rgba(75,192,192,1)',
        fill: false,
      },
    ],
  };

  return (
    <div>
      <h3 className="text-center">{coinName} Value Over Time</h3>
      <Line ref={chartRef} data={data} />
    </div>
  );
};

export default CoinChart;