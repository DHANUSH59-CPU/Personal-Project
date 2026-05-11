import { useState, useMemo } from 'react';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';
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
  const [filters, setFilters] = useState({ category: '', size: '', absorbency: '', minPrice: '', maxPrice: '' });
  const [filtersOpen, setFiltersOpen] = useState(false);

  const debouncedSearch = useDebounce(search, 400);

  const queryParams = useMemo(() => {
    const params = { page, limit: 12, sort };
    if (debouncedSearch) params.search = debouncedSearch;
    if (filters.category) params.category = filters.category;
    if (filters.size) params.size = filters.size;
    if (filters.absorbency) params.absorbency = filters.absorbency;
    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    return params;
  }, [page, debouncedSearch, filters, sort]);

  const { data, isLoading } = useGetProductsQuery(queryParams);
  const { data: categoriesData } = useGetCategoriesQuery();

  const products = data?.data?.products || [];
  const pagination = data?.data?.pagination || {};
  const categories = categoriesData?.data || [];

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: prev[key] === value ? '' : value }));
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
      {/* ── TOP BAR ── */}
      <div className={styles.topBar}>
        <h1 className={styles.pageTitle}>Our Products</h1>
        <div className={styles.topControls}>
          <div className={styles.searchWrap}>
            <FiSearch size={15} className={styles.searchIcon} />
            <input
              id="shop-search"
              className={styles.searchInput}
              type="text"
              placeholder="Search…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>

          <button
            className={`${styles.filterToggleBtn} ${filtersOpen ? styles.filterToggleBtnActive : ''}`}
            onClick={() => setFiltersOpen(!filtersOpen)}
          >
            <FiFilter size={14} />
            {hasActiveFilters ? 'Filters •' : 'Filter'}
          </button>

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
        {pagination.totalDocs > 0 && (
          <span className={styles.resultCount}>
            {pagination.totalDocs} product{pagination.totalDocs !== 1 ? 's' : ''} found
          </span>
        )}
      </div>

      {/* ── FILTER PANEL ── */}
      {filtersOpen && (
        <div className={styles.filterPanel}>
          <div className={styles.filterPanelInner}>
            <div className={styles.filterPanelHeader}>
              <span className={styles.filterPanelTitle}>Filters</span>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                {hasActiveFilters && (
                  <button className={styles.clearBtn} onClick={clearFilters}>Clear All</button>
                )}
                <button onClick={() => setFiltersOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9A8088' }}>
                  <FiX size={18} />
                </button>
              </div>
            </div>

            {/* Category */}
            {categories.length > 0 && (
              <div className={styles.filterGroup}>
                <div className={styles.filterGroupTitle}>Category</div>
                <div className={styles.filterChips}>
                  {categories.map((cat) => (
                    <button
                      key={cat._id}
                      className={`${styles.filterChip} ${filters.category === cat._id ? styles.filterChipActive : ''}`}
                      onClick={() => handleFilterChange('category', cat._id)}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size */}
            <div className={styles.filterGroup}>
              <div className={styles.filterGroupTitle}>Size</div>
              <div className={styles.filterChips}>
                {PRODUCT_SIZES.map((size) => (
                  <button
                    key={size}
                    className={`${styles.filterChip} ${filters.size === size ? styles.filterChipActive : ''}`}
                    onClick={() => handleFilterChange('size', size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Absorbency */}
            <div className={styles.filterGroup}>
              <div className={styles.filterGroupTitle}>Absorbency</div>
              <div className={styles.filterChips}>
                {ABSORBENCY_LEVELS.map((level) => (
                  <button
                    key={level}
                    className={`${styles.filterChip} ${filters.absorbency === level ? styles.filterChipActive : ''}`}
                    onClick={() => handleFilterChange('absorbency', level)}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className={styles.filterGroup}>
              <div className={styles.filterGroupTitle}>Price Range (₹)</div>
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
        </div>
      )}

      {/* ── PRODUCT GRID ── */}
      <div className={styles.grid}>
        {isLoading ? (
          <div className={styles.loadingWrap}>
            <div className="spinner" />
          </div>
        ) : products.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>
              <FiSearch size={24} />
            </div>
            <p className={styles.emptyText}>No products found</p>
            <p className={styles.emptySub}>Try adjusting your search or filters</p>
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
    </section>
  );
};

export default Shop;
