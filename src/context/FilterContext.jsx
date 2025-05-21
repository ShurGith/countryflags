import { createContext, useContext, useEffect, useState } from "react";
const FilterContext = createContext();

export const FilterProvider = ({ children }) => {
	const [search, setSearch] = useState("");
	const [continent, setContinent] = useState("All");
	const [filteredCountries, setFilteredCountries] = useState([]);
	const [allCountries, setAllCountries] = useState([]);
	const [selectedCountry, setSelectedCountry] = useState(null);
	const continents = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania', 'Antarctic'];
	const ITEMS_PER_LOAD = 21;

	return (
		<FilterContext.Provider
			value={{
				search, setSearch,
				continent, setContinent, continents,
				filteredCountries, setFilteredCountries,
				allCountries, setAllCountries,
				selectedCountry, setSelectedCountry
			}}
		>
			{children}
		</FilterContext.Provider>
	);
};
export const useFilterContext = () => {
	const context = useContext(FilterContext);
	if (!context) {
		throw new Error("useFilterContext must be used within a FilterProvider");
	}
	return context;

};