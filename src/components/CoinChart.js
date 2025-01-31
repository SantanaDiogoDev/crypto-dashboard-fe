import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const CoinChart = ({ coinName, chartData }) => {
  const data = {
    labels: chartData.map((entry) => entry.date),
    datasets: [
      {
        label: `${coinName} Value`,
        data: chartData.map((entry) => entry.value),
        borderColor: 'rgba(75,192,192,1)',
        fill: false,
      },
      {
        label: `${coinName} Quantity`,
        data: chartData.map((entry) => entry.quantity),
        borderColor: 'rgba(255,99,132,1)',
        fill: false,
      },
    ],
  };

  return (
    <div>
      <h3 className="text-center">{coinName} Value and Quantity Over Time</h3>
      <Line data={data} />
    </div>
  );
};

export default CoinChart;