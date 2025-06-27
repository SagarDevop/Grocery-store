import React from "react";

const SortBar = ({ sortBy, onSortChange }) => {
  return (
    <div className="mb-4">
      <select
        className="p-2 border rounded"
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
      >
        <option value="default">Sort by Default</option>
        <option value="priceLowHigh">Price: Low to High</option>
        <option value="priceHighLow">Price: High to Low</option>
        <option value="nameAZ">Name: A-Z</option>
        <option value="nameZA">Name: Z-A</option>
      </select>
    </div>
  );
};

export default SortBar;
