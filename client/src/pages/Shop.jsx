import { useState, useMemo } from 'react';
import { FiSearch, FiFilter } from 'react-icons/fi';
import { useGetProductsQuery } from '../api/productApi';
import { useGetCategoriesQuery } from '../api/categoryApi';
import ProductCard from '../components/product/ProductCard';
import useDebounce from '../hooks/useDebounce';
import { PRODUCT_SIZES, ABSORBENCY_LEVELS, SORT_OPTIONS } from '../utils/constants';
import styles from '../styles/pages/Shop.module.css';

const Shop = () => {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    category: '',
    size: '',
    absorbency: '',
    minPrice: '',
    maxPrice: '',
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const debouncedSearch = useDebounce(search, 400);

  // Build query params
  const queryParams = useMemo(() => {
    const params = { page, limit: 12 };
    if (debouncedSearch) params.search = debouncedSearch;
    if (filters.category) params.category = filters.category;
    if (filters.size) params.size = filters.size;
    if (filters.absorbency) params.absorbency = filters.absorbency;
    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;

    // Pass sort key directly — backend helper accepts these
    params.sort = sort;
    return params;
  }, [page, debouncedSearch, filters, sort]);

  const { data, isLoading, isFetching } = useGetProductsQuery(queryParams);
  const { data: categoriesData } = useGetCategoriesQuery();

  const products = data?.data?.products || [];
  const pagination = data?.data?.pagination || {};
  const categories = categoriesData?.data || [];

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key] === value ? '' : value,
    }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({ category: '', size: '', absorbency: '', minPrice: '', maxPrice: '' });
    setSearch('');
    setSort('newest');
    setPage(1);
  };

  const hasActiveFilters = Object.values(filters).some(Boolean) || search;

  return (
    <section className={styles.shopPage}>
      <div className={`container ${styles.shopInner}`}>
        {/* Top Bar */}
        <div className={styles.topBar}>
          <div>
            <h1 className={styles.title}>Shop</h1>
            {pagination.totalDocs > 0 && (
              <span className={styles.resultCount}>
                {pagination.totalDocs} product{pagination.totalDocs !== 1 ? 's' : ''} found
              </span>
            )}
          </div>

          <div className={styles.topActions}>
            <button
              className={styles.mobileFilterBtn}
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            >
              <FiFilter size={16} /> Filters
            </button>

            <div className={styles.searchWrap}>
              <FiSearch size={16} className={styles.searchIcon} />
              <input
                id="shop-search"
                className={styles.searchInput}
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>

            <select
              id="shop-sort"
              className={styles.sortSelect}
              value={sort}
              onChange={(e) => { setSort(e.target.value); setPage(1); }}
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Sidebar Filters */}
        <aside className={`${styles.sidebar} ${mobileFiltersOpen ? styles.sidebarOpen : ''}`}>
          <div className={styles.filterCard}>
            <div className={styles.filterTitle}>
              <span>Filters</span>
              {hasActiveFilters && (
                <button className={styles.clearBtn} onClick={clearFilters}>Clear All</button>
              )}
            </div>

            {/* Category Filter */}
            <div className={styles.filterGroup}>
              <h4>Category</h4>
              {categories.map((cat) => (
                <label key={cat._id} className={styles.filterOption}>
                  <input
                    type="radio"
                    name="category"
                    checked={filters.category === cat._id}
                    onChange={() => handleFilterChange('category', cat._id)}
                  />
                  {cat.name}
                </label>
              ))}
            </div>

            {/* Size Filter */}
            <div className={styles.filterGroup}>
              <h4>Size</h4>
              {PRODUCT_SIZES.map((size) => (
                <label key={size} className={styles.filterOption}>
                  <input
                    type="radio"
                    name="size"
                    checked={filters.size === size}
                    onChange={() => handleFilterChange('size', size)}
                  />
                  {size}
                </label>
              ))}
            </div>

            {/* Absorbency Filter */}
            <div className={styles.filterGroup}>
              <h4>Absorbency</h4>
              {ABSORBENCY_LEVELS.map((level) => (
                <label key={level} className={styles.filterOption}>
                  <input
                    type="radio"
                    name="absorbency"
                    checked={filters.absorbency === level}
                    onChange={() => handleFilterChange('absorbency', level)}
                  />
                  {level}
                </label>
              ))}
            </div>

            {/* Price Range */}
            <div className={styles.filterGroup}>
              <h4>Price Range (₹)</h4>
              <div className={styles.priceInputs}>
                <input
                  className={styles.priceInput}
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => { setFilters((p) => ({ ...p, minPrice: e.target.value })); setPage(1); }}
                />
                <span className={styles.priceDash}>–</span>
                <input
                  className={styles.priceInput}
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => { setFilters((p) => ({ ...p, maxPrice: e.target.value })); setPage(1); }}
                />
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className={styles.grid}>
          {isLoading ? (
            <div className={styles.loading}>Loading products...</div>
          ) : products.length === 0 ? (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>🔍</div>
              <p>No products found. Try adjusting your filters.</p>
            </div>
          ) : (
            products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className={styles.pagination}>
              {Array.from({ length: pagination.totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  className={`${styles.pageBtn} ${page === i + 1 ? styles.pageBtnActive : ''}`}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Shop;
