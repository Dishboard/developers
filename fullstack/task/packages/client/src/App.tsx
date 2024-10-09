import React from 'react';
import { ApolloProvider } from '@apollo/client';
import client from './graphql/ApolloClient';
import ExchangeRates from './components/ExchangeRates';

const App: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <h1>Exchange Rates</h1>
        <ExchangeRates />
      </div>
    </ApolloProvider>
  );
};

export default App;
