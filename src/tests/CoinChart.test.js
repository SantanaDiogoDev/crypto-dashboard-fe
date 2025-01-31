import React from 'react';
import { render } from '@testing-library/react';
import CoinChart from './CoinChart';

test('renders CoinChart with data', () => {
  const mockData = [
    { id: 1, value: 50, quantity: 3.5, date: '2023-10-01' },
    { id: 2, value: 55, quantity: 4.0, date: '2023-10-02' },
  ];

  render(<CoinChart coinName="Solana" chartData={mockData} />);

  // Check if the chart title is rendered
  expect(screen.getByText('Solana Value and Quantity Over Time')).toBeInTheDocument();
});