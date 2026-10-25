import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Filter,
  Grid,
  List,
  ChevronDown,
  X,
  RefreshCw,
  PackageOpen,
} from 'lucide-react';
import { CATEGORIES } from '../data/seedProducts';
import { fetchProducts } from '../services/productService';
import { ProductCard } from '../components/product/ProductCard';
import { ProductSkeleton } from '../components/product/ProductSkeleton';

export const CatalogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state initialized from URL query params
  const [categoryFilter, setCategoryFilter] = useState(
    searchParams.get('cat') || 'All'
  );
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('min') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('max') || '');
  const [minRating, setMinRating] = useState(Number(searchParams.get('rating')) || 0);
  const [inStockOnly, setInStockOnly] = useState(searchParams.get('instock') === 'true');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'featured');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const ITEMS_PER_PAGE = 12;

  // Load products
  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const data = await fetchProducts();
        if (isMounted) {
          setProducts(data);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching catalog products:', err);
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter and sort computation
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.sku?.toLowerCase().includes(q)
      );
    }

    // Category
    if (categoryFilter && categoryFilter !== 'All') {
      result = result.filter((p) => p.category === categoryFilter);
    }

    // Min price
    if (minPrice !== '' && !isNaN(minPrice)) {
      result = result.filter((p) => p.price >= Number(minPrice));
    }

    // Max price
    if (maxPrice !== '' && !isNaN(maxPrice)) {
      result = result.filter((p) => p.price <= Number(maxPrice));
    }

    // Min rating
    if (minRating > 0) {
      result = result.filter((p) => (p.rating || 0) >= minRating);
    }

    // In stock
    if (inStockOnly) {
      result = result.filter((p) => (p.stock || 0) > 0);
    }

    // Sorting
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // 'featured'
      result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    return result;
  }, [products, searchQuery, categoryFilter, minPrice, maxPrice, minRating, inStockOnly, sortBy]);

  // Pagination slice
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const handleCategoryChange = (newCat) => {
    setCategoryFilter(newCat);
    setCurrentPage(1);
  };

  const handleSearchChange = (newQuery) => {
    setSearchQuery(newQuery);
    setCurrentPage(1);
  };

  // Active filters list for chips
  const activeChips = [];
  if (categoryFilter && categoryFilter !== 'All') {
    activeChips.push({ label: `Category: ${categoryFilter}`, clear: () => handleCategoryChange('All') });
  }
  if (searchQuery) {
    activeChips.push({ label: `Search: "${searchQuery}"`, clear: () => handleSearchChange('') });
  }
  if (minPrice || maxPrice) {
    activeChips.push({
      label: `Price: ${minPrice ? `₹${minPrice}` : '₹0'} - ${maxPrice ? `₹${maxPrice}` : 'Any'}`,
      clear: () => {
        setMinPrice('');
        setMaxPrice('');
        setCurrentPage(1);
      },
    });
  }
  if (minRating > 0) {
    activeChips.push({
      label: `Rating: ${minRating}★ & above`,
      clear: () => {
        setMinRating(0);
        setCurrentPage(1);
      },
    });
  }
  if (inStockOnly) {
    activeChips.push({
      label: 'In Stock Only',
      clear: () => {
        setInStockOnly(false);
        setCurrentPage(1);
      },
    });
  }

  const clearAllFilters = () => {
    setCategoryFilter('All');
    setSearchQuery('');
    setMinPrice('');
    setMaxPrice('');
    setMinRating(0);
    setInStockOnly(false);
    setSortBy('featured');
    setCurrentPage(1);
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Breadcrumb & Operational Hub Pill */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-1.5">
          <Link to="/" className="hover:text-blue-400 transition-colors">
            Catalog
          </Link>
          <span>/</span>
          <span className="text-slate-200 font-semibold">
            {categoryFilter === 'All' ? 'All Consumer Products' : categoryFilter}
          </span>
          {searchQuery && (
            <>
              <span>/</span>
              <span className="text-blue-400">&ldquo;{searchQuery}&rdquo;</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Stock Node: Mumbai Central Hub (Active)</span>
        </div>
      </div>

      {/* Catalog Header Bar */}
      <div className="bg-[#111A2C] border border-[#223049] rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              {categoryFilter === 'All' ? 'Product Catalog' : categoryFilter}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
              {filteredProducts.length} SKUs Available
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Curated selection of certified electronics, fashion, kitchenware, books, beauty, and athletic gear.
          </p>
        </div>

        {/* View Toggle & Sort */}
        <div className="flex items-center gap-3">
          {/* Mobile Filter Button */}
          <button
            type="button"
            onClick={() => setIsMobileFilterOpen(true)}
            className="md:hidden flex items-center gap-1.5 px-3 py-2 bg-[#0B1220] border border-[#223049] text-xs font-semibold text-slate-200 rounded-xl"
          >
            <Filter className="w-4 h-4 text-blue-400" />
            <span>Filters ({activeChips.length})</span>
          </button>

          {/* Grid / List View Toggle */}
          <div className="hidden sm:flex items-center p-1 bg-[#0B1220] border border-[#223049] rounded-xl text-slate-400">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-blue-600 text-white' : 'hover:text-slate-200'
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-blue-600 text-white' : 'hover:text-slate-200'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-xs text-slate-400">Sort:</span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
                className="appearance-none px-3.5 py-2 pr-8 bg-[#0B1220] border border-[#223049] rounded-xl text-xs font-semibold text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="featured">Featured / Best Match</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="name">Product Name (A-Z)</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Active Filter Chips */}
      {activeChips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-semibold mr-1">ACTIVE FILTERS:</span>
          {activeChips.map((chip, index) => (
            <div
              key={index}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#111A2C] border border-[#223049] text-slate-200 text-xs"
            >
              <span>{chip.label}</span>
              <button
                type="button"
                onClick={chip.clear}
                className="text-slate-400 hover:text-rose-400 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={clearAllFilters}
            className="text-xs text-blue-400 hover:text-blue-300 underline font-medium ml-1"
          >
            Clear All ({activeChips.length})
          </button>
        </div>
      )}

      {/* Main Layout: Sidebar Filters + Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* DESKTOP SIDEBAR FILTERS */}
        <aside className="hidden md:block md:col-span-4 lg:col-span-3 space-y-6">
          {/* Price Range Filter */}
          <div className="bg-[#111A2C] border border-[#223049] rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Price Range (INR)
              </h3>
              {(minPrice || maxPrice) && (
                <button
                  type="button"
                  onClick={() => {
                    setMinPrice('');
                    setMaxPrice('');
                    setCurrentPage(1);
                  }}
                  className="text-[11px] text-blue-400 hover:underline"
                >
                  Reset
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold">Min ₹</label>
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => {
                    setMinPrice(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="0"
                  className="w-full mt-1 px-2.5 py-1.5 rounded-lg bg-[#0B1220] border border-[#223049] text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold">Max ₹</label>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="150000"
                  className="w-full mt-1 px-2.5 py-1.5 rounded-lg bg-[#0B1220] border border-[#223049] text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {[
                { label: 'Under ₹1,000', min: '0', max: '1000' },
                { label: '₹1k - ₹10k', min: '1000', max: '10000' },
                { label: '₹10k - ₹50k', min: '10000', max: '50000' },
                { label: '₹50k+', min: '50000', max: '' },
              ].map((bracket) => (
                <button
                  key={bracket.label}
                  type="button"
                  onClick={() => {
                    setMinPrice(bracket.min);
                    setMaxPrice(bracket.max);
                    setCurrentPage(1);
                  }}
                  className="px-2 py-1 rounded bg-[#0B1220] border border-[#223049] text-[10px] text-slate-400 hover:text-slate-200 hover:border-slate-500 transition-colors"
                >
                  {bracket.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div className="bg-[#111A2C] border border-[#223049] rounded-xl p-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Category Domain
            </h3>
            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => handleCategoryChange('All')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                  categoryFilter === 'All'
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-slate-300 hover:bg-[#1A263D]'
                }`}
              >
                <span>All Categories</span>
                <span className="text-[11px] opacity-75">{products.length}</span>
              </button>

              {CATEGORIES.map((cat) => {
                const count = products.filter((p) => p.category === cat).length;
                const isSelected = categoryFilter === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleCategoryChange(cat)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                      isSelected
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'text-slate-300 hover:bg-[#1A263D]'
                    }`}
                  >
                    <span>{cat}</span>
                    <span className="text-[11px] opacity-75">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Customer Rating Filter */}
          <div className="bg-[#111A2C] border border-[#223049] rounded-xl p-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Customer Rating
            </h3>
            <div className="space-y-2 text-xs">
              {[
                { rating: 4.5, label: '4.5 ★ & above' },
                { rating: 4.0, label: '4.0 ★ & above' },
                { rating: 3.5, label: '3.5 ★ & above' },
                { rating: 0, label: 'All Ratings' },
              ].map((opt) => (
                <label
                  key={opt.rating}
                  className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white"
                >
                  <input
                    type="radio"
                    name="rating_filter"
                    checked={minRating === opt.rating}
                    onChange={() => {
                      setMinRating(opt.rating);
                      setCurrentPage(1);
                    }}
                    className="text-blue-600 bg-[#0B1220] border-[#223049] focus:ring-0"
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Availability Filter */}
          <div className="bg-[#111A2C] border border-[#223049] rounded-xl p-4">
            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-slate-300 hover:text-white">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => {
                  setInStockOnly(e.target.checked);
                  setCurrentPage(1);
                }}
                className="rounded border-[#223049] bg-[#0B1220] text-blue-600 focus:ring-0"
              />
              <span>In Stock Only</span>
            </label>
          </div>
        </aside>

        {/* PRODUCTS LISTING / GRID */}
        <main className="md:col-span-8 lg:col-span-9 space-y-6">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : paginatedProducts.length > 0 ? (
            <div
              className={`grid gap-5 ${
                viewMode === 'grid'
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                  : 'grid-cols-1'
              }`}
            >
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="bg-[#111A2C] border border-[#223049] rounded-2xl p-12 text-center shadow-xl">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 mx-auto flex items-center justify-center mb-4">
                <PackageOpen className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">No Matching Products Found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
                We couldn&apos;t find any items matching your current filters. Try relaxing your search criteria or resetting filters.
              </p>
              <button
                type="button"
                onClick={clearAllFilters}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/20 transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reset All Filters</span>
              </button>
            </div>
          )}

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="bg-[#111A2C] border border-[#223049] rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
              <p className="text-slate-400">
                Displaying{' '}
                <strong className="text-slate-200">
                  {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filteredProducts.length)}-
                  {Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)}
                </strong>{' '}
                of <strong className="text-slate-200">{filteredProducts.length}</strong> items
              </p>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg bg-[#0B1220] border border-[#223049] text-slate-300 disabled:opacity-40 hover:text-white transition-colors"
                >
                  Previous
                </button>

                {[...Array(totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded-lg font-semibold transition-colors ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'bg-[#0B1220] border border-[#223049] text-slate-300 hover:text-white'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-lg bg-[#0B1220] border border-[#223049] text-slate-300 disabled:opacity-40 hover:text-white transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MOBILE FILTER MODAL DRAWER */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm md:hidden">
          <div className="bg-[#111A2C] border-l border-[#223049] w-full max-w-xs h-full p-6 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#223049]">
                <h3 className="font-bold text-white text-base">Filter Products</h3>
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Categories */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Category
                </h4>
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => handleCategoryChange('All')}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs ${
                      categoryFilter === 'All' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300'
                    }`}
                  >
                    All Categories
                  </button>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleCategoryChange(cat)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs ${
                        categoryFilter === cat ? 'bg-blue-600 text-white font-bold' : 'text-slate-300'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Price Range
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => {
                      setMinPrice(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Min ₹"
                    className="px-2.5 py-1.5 rounded-lg bg-[#0B1220] border border-[#223049] text-xs text-white"
                  />
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => {
                      setMaxPrice(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Max ₹"
                    className="px-2.5 py-1.5 rounded-lg bg-[#0B1220] border border-[#223049] text-xs text-white"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#223049] flex gap-2">
              <button
                type="button"
                onClick={clearAllFilters}
                className="flex-1 py-2.5 rounded-xl bg-[#0B1220] border border-[#223049] text-xs font-semibold text-slate-300"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 text-xs font-semibold text-white"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
