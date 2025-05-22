import { createContext, useContext, useEffect, useState, useRef } from "react";
import { badgeCommon, badgesColors } from "../Components/partials/Badges";
const MainContext = createContext();

export const MainProvider = ({ children }) => {
  const countryCodeMap = useRef({});
  const [countries, setCountries] = useState([]);
  const [visibleCountries, setVisibleCountries] = useState([]);

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
        setVisibleCountries(sorted);
      });
  }, []);

  const nameCountry = (code) => {
    return countryCodeMap.current[code] || 'Unknown';
  };



  const formatNumber = (num) => num?.toLocaleString('es-ES')
  const getLanguages = (langs) => langs ? Object.values(langs).join(', ') : '—';
  const getCurrencies = (curr) =>
    curr ? Object.values(curr).map(c => `${c.name} (${c.symbol})`).join(', ') : '—';


  const theBadges = () => {
    let numArr = [];
    let bgColors = []
    for (let i = 0; i < badgesColors.length; i++) {
      numArr.push(i);
    }
    for (let i = badgesColors.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numArr[i], numArr[j]] = [numArr[j], numArr[i]];
      //bgColors.push(badgeCommon + ' ' + badgesColors[j]);
    }
    for (let i = 0; i < numArr.length; i++) {
      bgColors.push(badgeCommon + ' ' + badgesColors[numArr[i]])
    }
    console.log(bgColors)
    console.log(numArr)
    return bgColors;
  }

  return (
    <MainContext.Provider
      value={{
        formatNumber, getLanguages, getCurrencies,
        theBadges, badgeCommon,
        countries, setCountries, nameCountry, countryCodeMap,
        visibleCountries, setVisibleCountries
      }}
    >
      {children}
    </MainContext.Provider>
  );
};
export const useMainContext = () => {
  const context = useContext(MainContext);
  if (!context) {
    throw new Error("useMainContext must be used within a MainProvider");
  }
  return context;

};