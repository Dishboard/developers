import { Outlet } from 'react-router-dom';

const Root = () => {
    return (
        <div data-testid="root-div-id" className="font-quicksand">
            <Outlet />
        </div>
    );
};

export default Root;
