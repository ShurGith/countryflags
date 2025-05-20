import Header from "./Components/partials/Header.jsx";
import FilterFinder from "./Components/partials/FilterFinder.jsx";
import { useEffect, useRef, useState } from "react";
import InfiniteScroll from 'react-infinite-scroll-component';
import LoadingSpinner from "./Components/partials/LoadingSpinner.jsx";
import CardCountry from "./Components/CardCountry.jsx";
import { useFilterContext } from './context/FilterContext'



const ListingMain = () => {
	const [countries, setCountries] = useState([]);
	const [visibleCountries, setVisibleCountries] = useState([]);
	const [hasMore, setHasMore] = useState(true);
	const [isLoading, setIsLoading] = useState(true);
	const {search, setSearch, continent, setContinent, continents} = useFilterContext();
	const [selectedCountry, setSelectedCountry] = useState(null);
	
	const loaderRef = useRef(null);
	
	const ITEMS_PER_LOAD = 21;
	
	
	useEffect(() => {
		fetch('https://restcountries.com/v3.1/all')
			.then((res) => res.json())
			.then((data) => {
				const sorted = data.sort((a, b) =>
					a.name.common.localeCompare(b.name.common)
				);
				setCountries(sorted);
				const initial = sorted.slice(0, ITEMS_PER_LOAD);
				setVisibleCountries(initial);
				setHasMore(sorted.length > ITEMS_PER_LOAD);
				setIsLoading(false);
				
					const doc = document.documentElement;
					const stillShort = doc.scrollHeight <= window.innerHeight;
					
					if (stillShort && sorted.length > initial.length) {
						const newItems = sorted.slice(initial.length, initial.length + ITEMS_PER_LOAD);
						setVisibleCountries([...initial, ...newItems]);
					}
			});
	}, []);
	
	
	useEffect(() => {
		const observer = new IntersectionObserver(
			entries => {
				if (entries[0].isIntersecting && hasMore) {
					loadMore();
				}
			},
			{ threshold: 1.0 }
		);
		
		const loader = loaderRef.current;
		if (loader) observer.observe(loader);
		
		return () => {
			if (loader) observer.unobserve(loader);
			observer.disconnect();
		};
	}, [hasMore, visibleCountries]);
	
	const loadMore = () => {
		const filtered = getFilteredCountries();
		const currentLength = visibleCountries.length;
		const nextItems = filtered.slice(currentLength, currentLength + ITEMS_PER_LOAD);
		setVisibleCountries(prev => [...prev, ...nextItems]);
		if (currentLength + ITEMS_PER_LOAD >= filtered.length) {
			setHasMore(false);
		}
	};

	
	const getFilteredCountries = () => {
		return countries.filter((country) => {
			const nameMatch = country.name.common.toLowerCase().includes(search.toLowerCase());
			const regionMatch = continent === 'All' || country.region === continent;
			return nameMatch && regionMatch;
		});
	};
	
	useEffect(() => {
		const filtered = getFilteredCountries();
		setVisibleCountries(filtered.slice(0, ITEMS_PER_LOAD));
		setHasMore(filtered.length > ITEMS_PER_LOAD);
	}, [search, continent]);
	
	const formatNumber = (num) => num?.toLocaleString('es-ES');
	
	const getLanguages = (langs) => langs ? Object.values(langs).join(', ') : '—';
	const getCurrencies = (curr) =>
		curr ? Object.values(curr).map(c => `${c.name} (${c.symbol})`).join(', ') : '—';
	
	
	return (
		<div className="p-4 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
			<Header />
			<FilterFinder />
			
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
				{visibleCountries.map((country) => (
					<div
						key={country.cca3}
						className="bg-white dark:bg-gray-800 shadow-md dark:shadow-lg rounded-lg p-4 hover:shadow-xl transition duration-300 flex flex-col justify-between"
					>
						<div>
							<img
								src={country.flags.svg}
								alt={country.name.common}
								className="w-full h-40 object-cover rounded-md mb-4"
							/>
							<h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
								{country.name.common}
							</h3>
							<p className="text-sm text-gray-500 dark:text-gray-400">
								🌍 <strong>Región:</strong> {country.region || '—'}
							</p>
							<p className="text-sm text-gray-500 dark:text-gray-400">
								🏙️ <strong>Capital:</strong> {country.capital?.[0] || '—'}
							</p>
							<p className="text-sm text-gray-500 dark:text-gray-400">
								👥 <strong>Población:</strong> {formatNumber(country.population) || '—'}
							</p>
						</div>
						<button
							onClick={() => setSelectedCountry(country)}
							className="mt-4 px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
						>
							Ver más
						</button>
					</div>
				))}
			</div>
			
			{/* MODAL */}
			{selectedCountry && (
				<div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
					<div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full relative">
						<button
							onClick={() => setSelectedCountry(null)}
							className="absolute top-2 right-2 text-gray-500 dark:text-gray-300 hover:text-red-500"
						>
							✕
						</button>
						<img
							src={selectedCountry.flags.svg}
							alt={selectedCountry.name.common}
							className="w-full h-48 object-contain rounded mb-4"
						/>
						<h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
							{selectedCountry.name.common}
						</h2>
						<p className="text-sm text-gray-600 dark:text-gray-300">
							<strong>Región:</strong> {selectedCountry.region || '—'}<br />
							<strong>Subregión:</strong> {selectedCountry.subregion || '—'}<br />
							<strong>Capital:</strong> {selectedCountry.capital?.[0] || '—'}<br />
							<strong>Población:</strong> {formatNumber(selectedCountry.population)}<br />
							<strong>Idiomas:</strong> {getLanguages(selectedCountry.languages)}<br />
							<strong>Monedas:</strong> {getCurrencies(selectedCountry.currencies)}
						</p>
					</div>
				</div>
			)}
		</div>
	);
};

export default ListingMain;