import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CoinInput from './CoinInput';

// Mock the API service
jest.mock('../services/api', () => ({
  addCoin: jest.fn(),
}));

test('renders CoinInput and submits form', async () => {
  const mockAddCoin = require('../services/api').addCoin;

  render(<CoinInput />);

  // Fill out the form
  fireEvent.change(screen.getByPlaceholderText('Coin Name'), { target: { value: 'Solana' } });
  fireEvent.change(screen.getByPlaceholderText('Value'), { target: { value: '50' } });
  fireEvent.change(screen.getByPlaceholderText('Quantity'), { target: { value: '3.5' } });
  fireEvent.change(screen.getByLabelText('Date'), { target: { value: '2023-10-01' } });

  // Submit the form
  fireEvent.click(screen.getByText('Submit'));

  // Verify that the API was called with the correct data
  expect(mockAddCoin).toHaveBeenCalledWith({
    coinName: 'Solana',
    value: 50,
    quantity: 3.5,
    date: '2023-10-01',
  });
});