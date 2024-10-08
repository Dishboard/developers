import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Root from './pages/Root';

const App = () => {
    const router = createBrowserRouter([
        {
            path: '/',
            element: <Root />,
            children: [
                {
                    index: true,
                    element: <HomePage />,
                },
            ],
        },
    ]);

    return <RouterProvider router={router} />;
};

export default App;
