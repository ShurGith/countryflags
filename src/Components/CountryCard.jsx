import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useMainContext } from '../context/MainContext';

const CountryCard = () => {
	const [country, setcountry] = useState(null);
	const [error, setError] = useState(null);
	const { formatNumber, theBadges, nameCountry, getLanguages, getCurrencies } = useMainContext();
	const params = useParams();
	const codigo = params.name;

	useEffect(() => {
		async function fetchcountry() {
			try {
				const respuesta = await fetch(`https://restcountries.com/v3.1/alpha/${codigo}`);
				if (!respuesta.ok) {
					throw new Error(`Error al obtener el país: ${respuesta.status}`);
				}
				const datos = await respuesta.json();
				setcountry(datos[0]); // Guardamos el objeto tal como viene
			} catch (err) {
				setError(err.message);
			}
		}

		if (codigo) {
			fetchcountry();
		}
	}, [codigo]);

	if (error) return <p>Error: {error}</p>;
	if (!country) return <p>Cargando...</p>;


	const bkgColors = theBadges()

	return (
		<div className="container items-center mx-auto mt-10">
			<div
				className="bg-gray-200 dark:bg-gray-800 shadow-md dark:shadow-lg rounded-lg hover:shadow-xl transition duration-300 flex flex-col pt-12">
				<div className="flex flex-col items-center w-19/20 lg:w-1/2 h-[300px] lg:h-[400px] mx-auto bg-contain bg-no-repeat text-sm text-gray-500 dark:text-gray-400" style={{ backgroundImage: `url(${country.flags.svg})` }} >
				</div>
				<div className="flex flex-col items-start w-19/20 lg:w-1/2 mx-auto pt-8 pb-22 text-sm text-gray-500 dark:text-gray-400">
					<div className="flex pl-24 items-center gap-6 mt-2 mb-12 w-full">
						<img src={country.coatOfArms.svg}
							alt={`Coat of Arms ${country.name.common}`}
							className="w-16 h-16 " />
						<h3 className="text-5xl font-semibold text-gray-800 dark:text-gray-300">
							{country.name.common}
						</h3>
					</div>
					<p className='flex items-center font-bold gap-2 py-0 text-xl text-gray-800 dark:text-gray-300'><span className='text-sm px-0'>Official Name:</span>{country.name.official || '—'}</p>
					<p><strong>Population:</strong> {formatNumber(country.population) || '—'}</p>
					<p><strong>Area:</strong> {formatNumber(country.area) || '—'}</p>
					<p><strong>Region:</strong> {country.region || '—'}</p>
					<p><strong>Subregion:</strong> {country.subregion || '—'}</p>
					<p><strong>Capital:</strong> {country.capital?.[0] || '—'}</p>
					<p><strong>Subregion:</strong> {country.subregion || '—'}</p>
					<p className=""><strong>Languages:</strong> {getLanguages(country.languages)}</p>
					<p><strong>Currencies:</strong> {getCurrencies(country.currencies)}</p>
					<p><strong>Timezones:</strong> {country.timezones.join(', ') || '—'}</p>
					<p><strong>Independent:</strong> {country.independent ? 'Yes' : 'No'}</p>
					<div className="flex flex-wrap gap-2 mt-4">
						<a href={country.maps.googleMaps} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View on Google Maps</a>
						<a href={country.maps.openStreetMaps} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View on OpenStreetMap</a>
					</div>



					<div className='mt-8 w-full'>
						{country.borders && country.borders.length > 0 && (
							<div>
								<h3 className="text-xl font-semibold mb-3">Countries Borders:</h3>
								<div className="flex justify-center items-center gap-1">
									{country.borders.map((borderCode, index) => (
										<Link
											to={`/country/${borderCode}`}
											key={borderCode}
											className={`${bkgColors[index]}`}>
											{nameCountry(borderCode)}
										</Link>
									))}
								</div>
							</div>
						)}
					</div>
				</div>

			</div>
		</div >
	);
}

export default CountryCard;