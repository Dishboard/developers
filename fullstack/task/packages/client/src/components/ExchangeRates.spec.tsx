import React from 'react';
import { act } from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';
import ExchangeRates from './ExchangeRates';
import { useQuery } from '@apollo/client';
import { getRelativeTimeWithSeconds, isDataStale } from '../utils/time';

jest.mock('@apollo/client', () => ({
  ...jest.requireActual('@apollo/client'),
  gql: jest.fn(),
  useQuery: jest.fn(),
}));

jest.mock('../utils/time', () => ({
  getRelativeTimeWithSeconds: jest.fn(),
  isDataStale: jest.fn(),
}));

let container: HTMLDivElement | null = null;
let root: any = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  if (root && container) {
    root.unmount();
    document.body.removeChild(container);
    container = null;
  }
});

describe('ExchangeRates Component', () => {
  const mockData = {
    exchangeRates: [
      {
        id: '1',
        country: 'Czech Republic',
        currency: 'Czech Koruna',
        amount: '1',
        currencyCode: 'CZK',
        rate: '24.50',
        updatedAtUtc: new Date().toISOString(),
      },
    ],
  };

  it('renders loading state', () => {
    (useQuery as jest.Mock).mockReturnValue({
      loading: true,
      error: null,
      data: null,
    });

    act(() => {
      root.render(<ExchangeRates />);
    });

    const loadingMessage = container?.querySelector('p');
    expect(loadingMessage?.textContent).toBe('Loading...');
  });

  it('renders error state', () => {
    (useQuery as jest.Mock).mockReturnValue({
      loading: false,
      error: { message: 'Failed to fetch' },
      data: null,
    });

    act(() => {
      root.render(<ExchangeRates />);
    });

    const errorMessage = container?.querySelector('p');
    expect(errorMessage?.textContent).toBe('Error: Failed to fetch');
  });

  it('renders data correctly', () => {
    (useQuery as jest.Mock).mockReturnValue({
      loading: false,
      error: null,
      data: mockData,
      refetch: jest.fn(),
    });

    (getRelativeTimeWithSeconds as jest.Mock).mockReturnValue('0 seconds ago');

    act(() => {
      root.render(<ExchangeRates />);
    });

    const lastUpdated = container?.querySelector('p');
    expect(lastUpdated?.textContent).toBe('Last Updated: 0 seconds ago');

    const country = container?.querySelector('td:nth-child(1)');
    const currency = container?.querySelector('td:nth-child(2)');
    const amount = container?.querySelector('td:nth-child(3)');
    const currencyCode = container?.querySelector('td:nth-child(4)');
    const rate = container?.querySelector('td:nth-child(5)');

    expect(country?.textContent).toBe('Czech Republic');
    expect(currency?.textContent).toBe('Czech Koruna');
    expect(amount?.textContent).toBe('1');
    expect(currencyCode?.textContent).toBe('CZK');
    expect(rate?.textContent).toBe('24.50');
  });

});
