import React from "react";

const FilterBar = ({ categories, selected, onSelect }) => {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {["All", ...categories].map((cat) => (
        <button
          key={cat}
          className={`px-4 py-1 rounded-full text-sm border ${
            selected === cat ? "bg-green-500 text-white" : "bg-white"
          }`}
          onClick={() => onSelect(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default FilterBar;
