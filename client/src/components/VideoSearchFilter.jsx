import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { categories, genres } from "../constants/CategoriesAndGenres"; // ✅ Ensure correct path

const VideoSearchFilter = ({ onSearchChange, onCategoryChange, onGenreChange }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");

  // Handle input changes with debounce for better performance
  useEffect(() => {
    const timeout = setTimeout(() => {
      onSearchChange(searchQuery);
    }, 300); // Debounce delay
    return () => clearTimeout(timeout);
  }, [searchQuery, onSearchChange]);

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setSelectedCategory(value);
    onCategoryChange(value);
  };

  const handleGenreChange = (e) => {
    const value = e.target.value;
    setSelectedGenre(value);
    onGenreChange(value);
  };

  return (
    <div className="flex flex-wrap gap-4 bg-gray-900 p-4 rounded-lg shadow-md">
      {/* 🔍 Search Bar */}
      <div className="relative flex-grow">
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search videos..."
          className="pl-10 p-2 w-full rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* 📂 Category Filter */}
      <select
        className="p-2 rounded bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-red-500"
        value={selectedCategory}
        onChange={handleCategoryChange}
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      {/* 🎭 Genre Filter */}
      <select
        className="p-2 rounded bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-red-500"
        value={selectedGenre}
        onChange={handleGenreChange}
      >
        <option value="">All Genres</option>
        {genres.map((gen) => (
          <option key={gen} value={gen}>
            {gen}
          </option>
        ))}
      </select>
    </div>
  );
};

export default VideoSearchFilter;
