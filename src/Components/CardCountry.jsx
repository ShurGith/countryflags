


const  CardCountry=({ visibleCountries })=> {
	
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
			{visibleCountries.map((country, i) => (
				<div
					key={country.cca3}
					className="bg-white dark:bg-gray-800 shadow-md dark:shadow-lg rounded-lg p-4 hover:shadow-xl transform transition duration-300 animate-fadeIn"
					style={{ animationDelay: `${i * 10}ms`, animationFillMode: 'both' }}
				>
					<img
						src={country.flags.svg}
						alt={country.name.common}
						className="w-full h-40 object-cover rounded-md mb-4"
					/>
					<h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
						{country.name.common}
					</h3>
					<p className="text-sm text-gray-500 dark:text-gray-400">{country.region}</p>
				</div>
			))}
		</div>
	)
}


export default CardCountry