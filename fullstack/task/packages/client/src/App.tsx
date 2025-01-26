import styled from 'styled-components';
import { ExchangeRateTable } from './components/ExchangeRateTable';

const StyledApp = styled.div`
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
        'Open Sans', 'Helvetica Neue', sans-serif;
`;

export const App = () => {
    return (
        <StyledApp>
            <h1>Exchange Rates</h1>
            <ExchangeRateTable />
        </StyledApp>
    );
};

export default App;
