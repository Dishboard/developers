import { useQuery } from '@apollo/client';
import { FC, useState } from 'react';
import { GET_EXCHANGE_RATES } from '../queries/queries';
import ErrorMessage from './components/ErrorMessage';
import ExchangeRatesTable from './components/ExchangeRatesTable';
import LastUpdated from './components/LastUpdated';
import { ExchangeRate } from '../interfaces';
import LanguageSwitcher from './components/LanguageSwitcher';


interface QueryData {
  exchangeRates: {
    value: ExchangeRate[];
    createdAt: string;
  }
}


const ExchangeRates: FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<"EN" | "CZ">('EN');
  const { error, data } = useQuery<QueryData>(GET_EXCHANGE_RATES, {
    variables: { lang: selectedLanguage }
  });

  if (error) return <ErrorMessage error={error} />

  return (
    <>
      <h1 className='my-10 text-center'>CNB Exchange Rates</h1>
      <LanguageSwitcher selectedLanguage={selectedLanguage} setSelectedLanguage={setSelectedLanguage} />
      {data && data.exchangeRates.createdAt && <LastUpdated timestamp={data.exchangeRates.createdAt} />}
      {data?.exchangeRates.value && <ExchangeRatesTable exchangeRates={data?.exchangeRates.value} />}
    </>
  );

};

export default ExchangeRates;