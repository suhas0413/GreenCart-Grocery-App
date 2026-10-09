import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useAppContext } from '../context/AppContest';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const { Products, navigate } = useAppContext();
  const query = (searchParams.get('q') || '').trim();
  const normalizedQuery = query.toLowerCase();
  const results = normalizedQuery
    ? Products.filter((product) => {
        const searchableText = [
          product.name,
          product.category,
          ...(Array.isArray(product.description) ? product.description : [product.description || '']),
        ].join(' ').toLowerCase();
        return searchableText.includes(normalizedQuery);
      })
    : [];

  return (
    <main className="mx-auto min-h-[58vh] max-w-6xl py-10 md:py-14">
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-green-700">GreenCart / Search</p>
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-green-100 pb-6">
        <div>
          <h1 className="font-serif text-3xl text-green-950 md:text-4xl">
            {query ? `Results for “${query}”` : 'Search the market'}
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            {query ? `${results.length} ${results.length === 1 ? 'product' : 'products'} found` : 'Enter a product or category above.'}
          </p>
        </div>
        <button
          type="button"
          className="text-sm font-semibold text-green-700 underline underline-offset-4"
          onClick={() => navigate('/')}
        >
          Back to shopping
        </button>
      </div>

      {results.length ? (
        <div className="mt-8 grid grid-cols-1 justify-items-center gap-5 sm:grid-cols-2 sm:justify-items-stretch md:grid-cols-3 lg:grid-cols-4">
          {results.map((product) => <ProductCard key={product._id} product={product} />)}
        </div>
      ) : query ? (
        <section className="flex min-h-64 flex-col items-center justify-center text-center">
          <h2 className="font-serif text-2xl text-green-950">No matches this time.</h2>
          <p className="mt-2 max-w-md text-sm text-gray-500">Try a broader product name or browse the market for another fresh find.</p>
          <button
            type="button"
            className="mt-5 bg-green-800 px-5 py-3 text-sm font-semibold text-white hover:bg-green-900"
            onClick={() => navigate('/')}
          >
            Browse products
          </button>
        </section>
      ) : null}
    </main>
  );
};

export default SearchResults;