import React, { useEffect, useState } from 'react';
const API = `https://inventorybackend-m1z8.onrender.com/api/product`;

const App = () => {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState('');
  const [error, setError] = useState(false);

  const fetchData = async () => {
    const response = await fetch(API);
    const response_data = await response.json();
    setData(response_data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const urlOpener = () => {
    const product = data.find((curProduct) => curProduct.style_code == query);
    product ? window.open(`https://www.myntra.com/jackets/qurvii%2b/styleNumber=${product.style_code}/${product.style_id}/buy`) : setError(true);
  };

  const viewRackSpace = () => {
    const rackSpace = data.find((curProduct) => curProduct.style_code == query);
    return rackSpace?.rack_space || "Not Available";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    urlOpener();
    setQuery('');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-12 max-w-md">
        <div className="bg-white rounded-xl border-gray-200 border p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              <span className="text-blue-600">Product</span> Searcher
            </h1>
            <div className="w-24 h-1 bg-blue-500 mx-auto mt-3 rounded-full"></div>
          </div>

          {/* Rack Space Display */}
          {query.length === 5 && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100 text-center">
              <p className="text-blue-800 font-medium">
                Rack Space: <span className="font-bold">{viewRackSpace()}</span>
              </p>
            </div>
          )}

          {/* Search Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="text"
                className="w-full px-5 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setError(false);
                }}
                placeholder="Enter style number..."
                maxLength="5"
                pattern="\d{5}"
                title="Please enter a 5-digit style number"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Search Product
            </button>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-center animate-fade-in">
                <p className="text-red-600 font-medium">
                  Style not found. Please try again. 😔
                </p>
              </div>
            )}
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm">
            Copyright © {new Date().getFullYear()} Qurvii | All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
