import { useEffect, useRef, useState } from "react";
import { useFilterContext } from "./context/FilterContext.jsx";
import { useMainContext } from "./context/MainContext.jsx";
import { Link } from "react-router-dom";
import FilterFinder from "./Components/partials/FilterFinder.jsx";

const ListingMain = () => {
	//const [countries, setCountries] = useState([]);
	//const [visibleCountries, setVisibleCountries] = useState([]);
	const { search, continent } = useFilterContext();
	const { formatNumber, countries, theBadges, nameCountry, visibleCountries, setVisibleCountries, getLanguages, getCurrencies } = useMainContext();
	const [selectedCountry, setSelectedCountry] = useState(null);

	const getFilteredCountries = () => {
		return countries.filter((country) => {
			const nameMatch = country.name.common.toLowerCase().includes(search.toLowerCase());
			const regionMatch = continent === 'All' || country.region === continent;
			return nameMatch && regionMatch;
		});
	};

	useEffect(() => {
		setVisibleCountries(getFilteredCountries());
	}, [search, continent]);


	//const formatNumber = (num) => num?.toLocaleString('es-ES');
	//const getLanguages = (langs) => langs ? Object.values(langs).join(', ') : '—';
	/*const getCurrencies = (curr) =>
		curr ? Object.values(curr).map(c => `${c.name} (${c.symbol})`).join(', ') : '—';
*/
	const bkgColors = theBadges()
	return (

		<>
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
							</h3>
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

				{/* MODAL */}
				{selectedCountry && (
					<div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
						<div className="bg-white dark:bg-gray-800 py-6 rounded-lg shadow-xl max-w-md w-full relative">
							<button
								onClick={() => setSelectedCountry(null)}
								className="absolute top-2 right-2 text-gray-500 dark:text-gray-300 hover:text-red-500
								cursor-pointer transition duration-300"
							>
								✕
							</button>
							<img
								src={selectedCountry.flags.svg}
								alt={selectedCountry.flags.alt}
								className="w-full h-48 object-contain rounded mb-4"
							/>
							<div className="pb-6 w-full text-start pl-20">
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
							</div>
							{selectedCountry.borders && selectedCountry.borders.length > 0 && (
								<div>
									<h3 className="text-xl font-semibold mb-3">Countries Borders:</h3>
									<div className="flex justify-center flex-wrap gap-2">
										{selectedCountry.borders.map((borderCode, index) => (
											<Link
												to={`/country/${borderCode}`}
												key={borderCode}
												className={`${bkgColors[index]}`}
											>{ }
												{nameCountry(borderCode)}
											</Link>
										))}
									</div>
								</div>
							)}
						</div>
					</div>
				)}
			</div>
		</>
	);
};

export default ListingMain;