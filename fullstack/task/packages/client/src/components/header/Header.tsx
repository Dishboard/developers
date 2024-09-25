import { useCallback, useEffect, useState } from 'react';
import { Switch } from '../ui/switch';

type Theme = 'dark' | 'light';

export const Header: React.FC = () => {
    const [theme, setTheme] = useState<Theme>((localStorage.getItem('theme') ?? 'light') as Theme);

    const handleSwitchTheme = useCallback(() => {
        document?.body.classList.remove(theme);
        const newTheme: Theme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document?.body.classList.add(newTheme);
    }, [theme, setTheme]);

    useEffect(() => {
        document?.body.classList.add(theme);
    }, []);

    return (
        <div className="text-xl xl:text-3xl mb-3 flex items-center justify-between">
            <div className="flex">
                <h1 className="text-gray-400 text-6xl mr-2 font-medium">CNB</h1>
                <span className="leading-7">
                    <small>Czech National Bank </small>
                    <small className="uppercase text-sm xl:text-lg block">Excange rates</small>
                </span>
            </div>

            <div className="flex items-center text-xs gap-3">
                <Switch id="theme" checked={theme === 'dark'} onClick={handleSwitchTheme} />
                <label htmlFor="theme">{theme} mode</label>
            </div>
        </div>
    );
};
