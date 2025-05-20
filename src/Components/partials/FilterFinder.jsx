import { useFilterContext } from '../../context/FilterContext'
import { useEffect } from "react";

function FilterFinder() {
	const { search, setSearch, continent, setContinent, continents } = useFilterContext()
	

	
	return (
		<div className="px-6 lg:px-24 flex flex-col md:flex-row justify-between mb-8 gap-10 mt-6 items-start">
			<input
				type="text"
				placeholder="Buscar por nombre o región..."
				className="w-full text-black/50 sm:w-1/2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
				value={search}
				onChange={(e) => setSearch(e.target.value)}
			/>
			<select
				value={continent}
				onChange={(e) => setContinent(e.target.value)}
				className="cursor-pointer text-black/50 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
			>
				<option value="All">Filter by Region (All)</option>
				{continents.map((c) => (
					<option key={c} value={c}>
						{c}
					</option>
				))}
			</select>
		</div>
	)
}

export default FilterFinder