import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useAppContext } from '../context/AppContest';
import './AllProducts.css';

const AllProducts = () => {
  const { Products } = useAppContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState('featured');
  const category = searchParams.get('category') || 'all';
  const categories = [...new Set(Products.map((product) => product.category))].sort((a, b) => a.localeCompare(b));
  const visibleProducts = Products
    .filter((product) => product.inStock !== false)
    .filter((product) => category === 'all' || product.category.toLowerCase() === category.toLowerCase())
    .sort((first, second) => {
      if (sortBy === 'price-low') return first.offerPrice - second.offerPrice;
      if (sortBy === 'price-high') return second.offerPrice - first.offerPrice;
      return first.name.localeCompare(second.name);
    });

  const chooseCategory = (value) => {
    const nextParams = new URLSearchParams(searchParams);
    if (value === 'all') nextParams.delete('category');
    else nextParams.set('category', value);
    setSearchParams(nextParams);
  };

  return (
    <main className="all-products-page">
      <header className="all-products-heading">
        <div>
          <p className="all-products-eyebrow">GREEN CART / THE MARKET</p>
          <h1>All products</h1>
          <p className="all-products-description">Good things for your everyday table.</p>
        </div>
        <span className="all-products-count">{visibleProducts.length} products</span>
      </header>

      <div className="all-products-toolbar">
        <div className="all-products-categories" role="group" aria-label="Filter by category">
          <button
            className={category === 'all' ? 'active' : ''}
            type="button"
            onClick={() => chooseCategory('all')}
          >
            All
          </button>
          {categories.map((item) => (
            <button
              className={category.toLowerCase() === item.toLowerCase() ? 'active' : ''}
              key={item}
              type="button"
              onClick={() => chooseCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <label className="all-products-sort">
          <span>Sort</span>
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
            <option value="featured">Name: A to Z</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
          </select>
        </label>
      </div>

      {visibleProducts.length ? (
        <div className="all-products-grid">
          {visibleProducts.map((product) => <ProductCard key={product._id} product={product} />)}
        </div>
      ) : (
        <section className="all-products-empty">
          <h2>No products in this category yet.</h2>
          <p>Choose another category to keep browsing.</p>
          <button type="button" onClick={() => chooseCategory('all')}>Show all products</button>
        </section>
      )}
    </main>
  );
};

export default AllProducts;