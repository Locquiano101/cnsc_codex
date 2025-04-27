import React, { useState, useEffect } from "react";

export default function SearchableDropdown({
  options = [],
  value,
  onChange,
  className,
  placeholder = "Select an option",
  required = true,
}) {
  const [query, setQuery] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [error, setError] = useState("");

  // Filter options safely
  const filteredOptions = options.filter((opt) =>
    opt.toLowerCase().includes(query.toLowerCase())
  );

  // Sync external value into query
  useEffect(() => {
    setQuery(value || "");
    setError(""); // clear error when parent value changes
  }, [value]);

  const handleSelect = (option) => {
    setQuery(option);
    onChange(option);
    setShowOptions(false);
    setError("");
  };

  const handleBlur = () => {
    // delay so onMouseDown can still fire
    setTimeout(() => {
      setShowOptions(false);
      if (required && !query) {
        setError("This field is required");
      }
    }, 100);
  };

  return (
    <div className="relative w-full">
      {/* placeholder shows asterisk if required */}
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setShowOptions(true);
          if (error) setError("");
        }}
        onFocus={() => {
          setShowOptions(true);
          if (error) setError("");
        }}
        onBlur={handleBlur}
        placeholder={required ? `${placeholder} *` : placeholder}
        required={required}
        className={`${className}  w-full`}
      />

      {showOptions && (
        <ul className="absolute z-10 w-full bg-white text-black border border-gray-300 rounded-lg max-h-60 overflow-auto mt-1 shadow-lg">
          {filteredOptions.length === 0 ? (
            <li className="px-4 py-2 text-gray-500">No results found</li>
          ) : (
            filteredOptions.map((option) => (
              <li
                key={option}
                onMouseDown={() => handleSelect(option)}
                className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
              >
                {option}
              </li>
            ))
          )}
        </ul>
      )}

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
