import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ListingMain from "./ListingMain.jsx";
import { FilterProvider } from "./context/FilterContext.jsx";
import CountryCard from './Components/CountryCard.jsx';
import CardCountry from './Components/CardCountry.jsx';
import { MainProvider } from './context/MainContext.jsx';
import Header from './Components/partials/Header.jsx';
import FilterFinder from './Components/partials/FilterFinder.jsx';

function App() {
  return (

    <BrowserRouter>
      <MainProvider>
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
          <FilterProvider>
            <Header />
            <Routes>
              <Route path="/" element={<ListingMain />} />
              <Route path="/country/:name" element={<CountryCard />} />
              <Route path="*" element={<div className="text-center text-2xl">404 - Page Not Found</div>} />
            </Routes>
          </FilterProvider>
        </div>
      </MainProvider>
    </BrowserRouter>
  );
}

export default App;