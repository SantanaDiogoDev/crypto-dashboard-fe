import { render, screen, fireEvent } from '@testing-library/react';
import CoinInput from './CoinInput';

test('renders CoinInput and submits form', async () => {
  render(<CoinInput />);
  fireEvent.change(screen.getByPlaceholderText('Coin Name'), { target: { value: 'Bitcoin' } });
  fireEvent.change(screen.getByPlaceholderText('Value'), { target: { value: '50000' } });
  fireEvent.change(screen.getByLabelText('Date'), { target: { value: '2023-10-01' } });
  fireEvent.click(screen.getByText('Submit'));
  // Add assertions here
});