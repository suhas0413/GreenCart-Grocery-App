import { useEffect, useId, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { assets } from '../assets/assets';
import { useAppContext } from '../context/AppContest';
import './ProductSearch.css';

const ProductSearch = ({ variant = 'desktop' }) => {
  const { Products, navigate } = useAppContext();
  const location = useLocation();
  const listId = useId();
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const normalizedSearch = search.trim().toLowerCase();
  const suggestions = normalizedSearch
    ? Products.filter((product) =>
        `${product.name} ${product.category}`.toLowerCase().includes(normalizedSearch),
      ).slice(0, 5)
    : [];

  useEffect(() => {
    setSearch(new URLSearchParams(location.search).get('q') || '');
  }, [location.search]);

  const submitSearch = (term = search) => {
    const query = term.trim();
    if (!query) return;
    setSearch(query);
    setIsOpen(false);
    setActiveIndex(-1);
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
      setActiveIndex(-1);
    } else if (event.key === 'ArrowDown' && suggestions.length) {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((index) => (index + 1) % suggestions.length);
    } else if (event.key === 'ArrowUp' && suggestions.length) {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((index) => (index <= 0 ? suggestions.length - 1 : index - 1));
    } else if (event.key === 'Enter' && activeIndex >= 0) {
      event.preventDefault();
      submitSearch(suggestions[activeIndex].name);
    }
  };

  return (
    <form
      className={`product-search product-search--${variant}`}
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        submitSearch();
      }}
    >
      <img className="product-search-icon" src={assets.search_icon} alt="" aria-hidden="true" />
      <input
        aria-label="Search products"
        aria-autocomplete="list"
        aria-controls={listId}
        aria-expanded={isOpen && normalizedSearch.length > 0}
        autoComplete="off"
        onBlur={() => setTimeout(() => setIsOpen(false), 120)}
        onChange={(event) => {
          setSearch(event.target.value);
          setIsOpen(true);
          setActiveIndex(-1);
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder="Search fresh finds"
        role="combobox"
        value={search}
      />
      {search && (
        <button
          aria-label="Clear search"
          className="product-search-clear"
          type="button"
          onClick={() => {
            setSearch('');
            setIsOpen(false);
          }}
        >
          &times;
        </button>
      )}
      <button className="product-search-submit" type="submit" aria-label="Submit product search">
        <img src={assets.search_icon} alt="" aria-hidden="true" />
      </button>

      {isOpen && normalizedSearch && (
        <div className="product-search-results" id={listId} role="listbox">
          {suggestions.length ? suggestions.map((product, index) => (
            <button
              key={product._id}
              className={`product-search-option ${index === activeIndex ? 'active' : ''}`}
              type="button"
              role="option"
              aria-selected={index === activeIndex}
              onMouseDown={(event) => event.preventDefault()}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => submitSearch(product.name)}
            >
              <img src={product.image[0]} alt="" aria-hidden="true" />
              <span className="product-search-option-copy">
                <strong>{product.name}</strong>
                <small>{product.category}</small>
              </span>
              <span className="product-search-option-price">${product.offerPrice}</span>
            </button>
          )) : (
            <p className="product-search-empty">No matching products. Press Enter to search all items.</p>
          )}
          {suggestions.length > 0 && (
            <button className="product-search-all" type="submit">
              See all results for “{search.trim()}”
              <span aria-hidden="true">&rarr;</span>
            </button>
          )}
        </div>
      )}
    </form>
  );
};

export default ProductSearch;