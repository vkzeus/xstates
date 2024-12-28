import React, { useState, useEffect } from "react";
import axios from "axios";

function LocationSelector() {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [message, setMessage] = useState("");

  // Fetch all countries on initial render
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get(
          "https://crio-location-selector.onrender.com/countries"
        );
        setCountries(response.data);
      } catch (error) {
        console.error("Error fetching countries:", error);
        alert("Failed to fetch countries.");
      }
    };
    fetchCountries();
  }, []);

  // Fetch states of the selected country
  const fetchStates = async (countryName) => {
    try {
      const response = await axios.get(
        `https://crio-location-selector.onrender.com/country=${encodeURIComponent(
          countryName
        )}/states`
      );
      if (response.data && Array.isArray(response.data)) {
        setStates(response.data);
        setCities([]); // Clear cities on country change
      } else {
        console.error("Unexpected states data format:", response.data);
        alert("Failed to fetch states. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching states:", error);
      alert("Failed to fetch states.");
    }
  };

  // Fetch cities of the selected state
  const fetchCities = async (countryName, stateName) => {
    try {
      const response = await axios.get(
        `https://crio-location-selector.onrender.com/country=${encodeURIComponent(
          countryName
        )}/state=${encodeURIComponent(stateName)}/cities`
      );
      if (response.data && Array.isArray(response.data)) {
        setCities(response.data);
      } else {
        console.error("Unexpected cities data format:", response.data);
        alert("Failed to fetch cities. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
      alert("Failed to fetch cities.");
    }
  };

  // Handle country selection
  const handleCountryChange = (e) => {
    const country = e.target.value;
    setSelectedCountry(country);
    setSelectedState("");
    setSelectedCity("");
    setMessage("");
    if (country) {
      fetchStates(country);
    }
  };

  // Handle state selection
  const handleStateChange = (e) => {
    const state = e.target.value;
    setSelectedState(state);
    setSelectedCity("");
    setMessage("");
    if (state) {
      fetchCities(selectedCountry, state);
    }
  };

  // Handle city selection
  const handleCityChange = (e) => {
    const city = e.target.value;
    setSelectedCity(city);
    if (city) {
      setMessage(`You Selected ${city}, ${selectedState}, ${selectedCountry}`);
    }
  };

  return (
    <div className="location-selector">
      <h1>Location Selector</h1>

      {/* Country Dropdown */}
      <div>
        <label htmlFor="country">Select Country: </label>
        <select
          id="country"
          value={selectedCountry}
          onChange={handleCountryChange}
        >
          <option value="">-- Select Country --</option>
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
      </div>

      {/* State Dropdown */}
      <div>
        <label htmlFor="state">Select State: </label>
        <select
          id="state"
          value={selectedState}
          onChange={handleStateChange}
          disabled={!selectedCountry}
        >
          <option value="">-- Select State --</option>
          {states.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
      </div>

      {/* City Dropdown */}
      <div>
        <label htmlFor="city">Select City: </label>
        <select
          id="city"
          value={selectedCity}
          onChange={handleCityChange}
          disabled={!selectedState}
        >
          <option value="">-- Select City --</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {/* Message */}
      {message ? (
  <p className="message">{message}</p>
) : (
  <p className="message placeholder">Please select your location details.</p>
)}

    </div>
  );
}

export default LocationSelector;
