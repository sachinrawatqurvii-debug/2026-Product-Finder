import axios from 'axios';
import React, { useEffect, useState } from 'react';

const BASE_URL = 'https://pattern-tracker-backend.onrender.com/api/v1/products';

const App = () => {
  const [data, setData] = useState(null);
  const [query, setQuery] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchMarketPlaceData = async (style_number) => {
    if (!style_number) return;

    setLoading(true);
    setError(false);
    try {
      const response = await axios.get(`${BASE_URL}/${style_number}`);
      const responseData = response.data.data;
      setData(responseData);
    } catch (error) {
      console.log('Failed to fetch style id error ::', error);
      setError(true);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  // Trigger search when query length is 5 or 6 digits
  useEffect(() => {
    const trimmedQuery = query?.toString().trim();
    if (trimmedQuery?.length === 5 || trimmedQuery?.length === 6) {
      fetchMarketPlaceData(trimmedQuery);
    }
  }, [query]);

  const openPageUrl = (channel, id) => {
    if (!channel || !id) {
      // If no channel/id provided (default button), open Shopify first, then Myntra
      const shopifyProduct = data?.marketPlaceDetails?.find(
        (p) => p.channel?.toLowerCase() === 'shopify'
      );
      const myntraProduct = data?.marketPlaceDetails?.find(
        (p) => p.channel?.toLowerCase() === 'myntra'
      );

      if (shopifyProduct?.product_id) {
        window.open(
          `https://qurvii.com/products/${shopifyProduct.product_id}`,
          '_blank',
          'noopener,noreferrer'
        );
      } else if (myntraProduct?.product_id) {
        window.open(
          `https://www.myntra.com/${myntraProduct.product_id}`,
          '_blank',
          'noopener,noreferrer'
        );
      }
      return;
    }

    // If specific channel clicked, open that channel
    const finalChannel = channel?.toLowerCase();
    let url = '';

    const mappedUrl = {
      ajio: `https://www.ajio.com/qurvii-women-regular-fit-top/p/${id}`,
      tatacliq: `https://www.tatacliq.com/qurvii-black-plain-jacket/p-${id?.toLowerCase()}`,
      shopify: `https://qurvii.com/products/${id}`,
      nykaa: `https://www.nykaafashion.com/qurvii/p/${id}`,
      myntra: id?.includes('/') ? `https://www.myntra.com/${id}` : `https://www.myntra.com/${id}`,
    };

    if (mappedUrl[finalChannel]) {
      url = mappedUrl[finalChannel];
    }

    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query?.toString().trim()) {
      fetchMarketPlaceData(query.toString().trim());
    }
  };

  const handleDefaultOpen = (e) => {
    e.preventDefault();
    if (data?.marketPlaceDetails?.length > 0) {
      openPageUrl('', '');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-12 max-w-md">
        <div className="bg-white rounded-xl border-gray-200 border p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800">
              <span className="text-blue-600">Product</span> Searcher
            </h1>
            <div className="w-24 h-1 bg-blue-500 mx-auto mt-3 rounded-full"></div>
          </div>

          {/* Search Form */}
          <form onSubmit={handleDefaultOpen} className="space-y-6">
            <div>
              <input
                type="text"
                className="w-full px-5 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value.replace(/\D/g, '')); // Only allow digits
                  setError(false);
                }}
                placeholder="Enter style number..."
                maxLength="6"
                pattern="\d*"
                title="Please enter a 5-6 digit style number"
              />
            </div>

            <button
              type="submit"
              disabled={loading || (data?.marketPlaceDetails?.length || 0) === 0}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              Search Product
            </button>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-center animate-fade-in">
                <p className="text-red-600 font-medium">Style not found. Please try again. 😔</p>
              </div>
            )}
          </form>
        </div>

        {/* Marketplace Buttons */}
        <div className="mt-6">
          {loading ? (
            <p className="text-center text-gray-600 animate-pulse">Loading...</p>
          ) : data?.marketPlaceDetails?.length > 0 ? (
            <>
              <p className="text-center mt-4 font-semibold text-xl text-red-600 mb-4">
                View On Another Portal
              </p>
              <div className="container mx-auto flex gap-2 justify-center mt-4 items-center flex-col">
                {/* Individual Channel Buttons */}
                {data.marketPlaceDetails.map((portal) => (
                  <button
                    className="w-full max-w-xs py-2 px-4 bg-white border border-red-400 rounded-xl font-semibold hover:bg-red-400 hover:text-white duration-75 cursor-pointer ease-in transition-colors"
                    key={portal.channel}
                    onClick={() => openPageUrl(portal.channel, portal.product_id)}
                  >
                    {portal.channel?.toUpperCase()}
                  </button>
                ))}
              </div>
            </>
          ) : null}
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
