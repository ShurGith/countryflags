import Header from "./Components/partials/Header.jsx";
import FilterFinder from "./Components/partials/FilterFinder.jsx";
import { useEffect, useRef, useState } from "react";
import LoadingSpinner from "./Components/partials/LoadingSpinner.jsx";
import CardCountry from "./Components/CardCountry.jsx";
import { useFilterContext } from './context/FilterContext'
import { badgeCommon, badgesColors } from "./Components/partials/Badges.jsx";




const ListingMain = () => {
	const [countries, setCountries] = useState([]);
	const [visibleCountries, setVisibleCountries] = useState([]);
	const [hasMore, setHasMore] = useState(true);
	const [isLoading, setIsLoading] = useState(true);
	const { search, setSearch, continent, setContinent, continents, ITEMS_PER_LOAD } = useFilterContext();
	const [selectedCountry, setSelectedCountry] = useState(null);

	const loaderRef = useRef(null);
	const countryCodeMap = useRef({});



	useEffect(() => {
		fetch('https://restcountries.com/v3.1/all')
			.then((res) => res.json())
			.then((data) => {
				const sorted = data.sort((a, b) =>
					a.name.common.localeCompare(b.name.common)
				);
				setCountries(sorted);

				const codeMap = {};
				data.forEach(country => {
					codeMap[country.cca3] = country.name.common;
				});
				countryCodeMap.current = codeMap;

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
	const nameCountry = (code) => {
		return countryCodeMap.current[code] || 'Desconocido';
	};

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

	let numArr = [];
	for (let i = 0; i < badgesColors.length; i++) {
		numArr.push(i);
	}
	for (let i = badgesColors.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[numArr[i], numArr[j]] = [numArr[j], numArr[i]];
	}


	return (
		<div className="bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
			<Header />
			<FilterFinder />
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 xl:gap-32 lg:24 px-4 lg:px-24">
				{visibleCountries.map((country) => (
					<div
						key={country.cca3}
						onClick={() => setSelectedCountry(country)}
						className="bg-white dark:bg-gray-800 shadow-md dark:shadow-lg rounded-lg hover:shadow-xl transition duration-300 flex flex-col"
					>
						<div>
							<img
								src={country.flags.svg}
								alt={country.name.common}
								className="w-full h-60 object-cover rounded-md mb-4"
							/>
						</div>
						<div className="flex flex-col items-start px-10 py-14">
							<h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
								{country.name.common}
							</h3>º
							<p className="text-sm text-gray-500 dark:text-gray-400">
								<strong>Población:</strong> {formatNumber(country.population) || '—'}
							</p>
							<p className="text-sm text-gray-500 dark:text-gray-400">
								<strong>Región:</strong> {country.region || '—'}
							</p>
							<p className="text-sm text-gray-500 dark:text-gray-400">
								<strong>Capital:</strong> {country.capital?.[0] || '—'}
							</p>

						</div>
					</div>
				))}
			</div>

			{/* MODAL */}
			{selectedCountry && (
				<div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
					<div className="bg-white dark:bg-gray-800 py-6 rounded-lg shadow-xl max-w-md w-full relative">
						<button
							onClick={() => setSelectedCountry(null)}
							className="absolute top-2 right-2 text-gray-500 dark:text-gray-300 hover:text-red-500"
						>
							✕
						</button>
						<img
							src={selectedCountry.flags.svg}
							alt={selectedCountry.flags.alt}
							className="w-full h-48 object-contain rounded mb-4"
						/>
						<h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
							{selectedCountry.name.common}
						</h2>
						<p className="text-sm text-gray-600 dark:text-gray-300">
							<strong>Region:</strong> {selectedCountry.region || '—'}<br />
							<strong>Subregion:</strong> {selectedCountry.subregion || '—'}<br />
							<strong>Capital:</strong> {selectedCountry.capital?.[0] || '—'}<br />
							<strong>Population:</strong> {formatNumber(selectedCountry.population)}<br />
							<strong>Languages:</strong> {getLanguages(selectedCountry.languages)}<br />
							<strong>Currencies:</strong> {getCurrencies(selectedCountry.currencies)}
						</p>
						{selectedCountry.borders.length > 0 && (
							<div>
								<h3 className="text-xl font-semibold mb-3">Countries Borders:</h3>
								<div className="flex justify-center flex-wrap gap-2">
									{selectedCountry.borders.map((borderCode, index) => (
										<h2
											key={borderCode}
											className={`${badgeCommon} ${badgesColors[numArr[index]]} shadow transition-colors duration-200`}
										>{ }
											{nameCountry(borderCode)}
										</h2>
									))}
								</div>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default ListingMain;