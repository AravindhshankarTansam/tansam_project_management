import { useState, useEffect, useRef } from "react";
import "./CSS/multiSelect.css";

const MultiSelectDropdown = ({
  label,
  options = [],
  selectedValues = [],
  onChange,
  placeholder = "Select options",
  displayKey = "label",
  valueKey = "value",
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", handleClickOutside);

    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
    };
  }, []);


  const toggleValue = (value) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((v) => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  const removeValue = (value) => {
    onChange(selectedValues.filter((v) => v !== value));
  };

  return (
    <div className="multi-select" ref={dropdownRef}>
      {label && <label>{label}</label>}

      <div
        className="dropdown-header"
        onClick={() => setOpen(!open)}
      >
        {selectedValues.length === 0 ? (
          <span className="placeholder">{placeholder}</span>
        ) : (
          <div className="chips-container">
            {selectedValues.map((val) => (
              <div key={val} className="chip">
                {val}
                <span
                  className="chip-close"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeValue(val);
                  }}
                >
                  ×
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {open && (
        <div className="dropdown-list">
          {options.length === 0 ? (
            <div className="dropdown-empty">No options</div>
          ) : (
            options.map((opt, index) => {
              const value = opt[valueKey];
              return (
                <div
                  key={index}
                  className={`dropdown-item ${
                    selectedValues.includes(value) ? "selected" : ""
                  }`}
                  onClick={() => toggleValue(value)}
                >
                  {opt[displayKey]}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;