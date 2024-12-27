import React, { useState, useEffect } from 'react';
import lightImage from "../../assets/images/light.svg";
import darkImage from "../../assets/images/dark.svg";

const ToggleTheme = () => {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setDarkMode(savedTheme === 'dark');
        }
    }, []);

    const toggleTheme = () => {
        setDarkMode((prevMode) => !prevMode);
    };

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    return (
        <button
            onClick={toggleTheme}
            className="home-btn mx-1"
        >
            {darkMode ? <img src={darkImage} alt="Dark" className='p-[1px] h-[15px] w-[15px] md:h-[26px] md:w-[26px] invert' /> : <img src={lightImage} alt="Light" className='p-[1px] h-[16px] w-[16px] md:h-[26px] md:w-[26px] ' />}
        </button>
    );
};

export default ToggleTheme;