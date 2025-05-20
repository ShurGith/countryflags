import { useState, useEffect } from 'react';
import { Icon } from '@iconify-icon/react';
function Header() {
	const MoonIcon = () => (
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
			<path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
		</svg>
	);
	
	const SunIcon = () => (
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
			<path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
		</svg>
	);
	// Estado para el modo oscuro
	const [isDarkMode, setIsDarkMode] = useState(() => {
		if (typeof window !== 'undefined') {
			if (localStorage.theme === 'dark') {
				return true;
			}
			if (localStorage.theme === 'light') {
				return false;
			}
			return document.documentElement.classList.contains('dark');
		}
		return false;
	});
	
	useEffect(() => {
		if (typeof window !== 'undefined') {
			if (isDarkMode) {
				document.documentElement.classList.add('dark');
				localStorage.theme = 'dark';
			} else {
				document.documentElement.classList.remove('dark');
				localStorage.theme = 'light';
			}
		}
	}, [isDarkMode]);
	
	const toggleDarkMode = () => {
		setIsDarkMode(prevMode => !prevMode);
	};
	
	return (
		<header className="bg-white text-black/80 dark:text-white/60 dark:bg-gray-800 shadow-md py-6 w-full sticky top-0 z-20 transition-colors duration-300">
			<div className="container mx-auto px-4 flex justify-between items-center">
				<h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Country Explorer</h1>
				<button
					onClick={toggleDarkMode}
					className="cursor-pointer p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors flex items-center"
					aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
				>
					{isDarkMode ?
						<Icon icon="noto:sun" width="24" height="24" /> : <Icon icon="line-md:moon-loop" width="24" height="24" />}
					<span className="ml-2 text-sm font-medium hidden sm:inline">
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </span>
				</button>
			</div>
		</header>
	)
}

export default Header