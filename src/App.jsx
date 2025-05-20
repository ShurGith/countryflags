import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ListingMain from "./ListingMain.jsx";
import { FilterProvider } from "./context/FilterContext.jsx";
function App() {
  return (
    
    <BrowserRouter>
      <FilterProvider>
      <Routes>
        <Route path="/" element={<ListingMain />} />
        <Route path="*" element={<div className="text-center text-2xl">404 - Page Not Found</div>} />
      </Routes>
      </FilterProvider>
    </BrowserRouter>
  );
}

export default App;