import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiShoppingCart, FiStar, FiMinus, FiPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useGetProductQuery } from '../api/productApi';
import { useAddToCartMutation } from '../api/cartApi';
import useAuth from '../hooks/useAuth';
import { formatPrice, getDiscountPercent } from '../utils/formatters';
import styles from '../styles/pages/ProductDetail.module.css';

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [selectedImage, setSelectedImage] = useState(0);
  const [qty, setQty] = useState(1);

  const { data, isLoading, error } = useGetProductQuery(slug);
  const [addToCart, { isLoading: addingToCart }] = useAddToCartMutation();

  const product = data?.data;

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }
    try {
      await addToCart({ productId: product._id, quantity: qty }).unwrap();
      toast.success(`${product.name} added to cart!`);
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to add to cart');
    }
  };

  if (isLoading) {
    return (
      <section className={`container ${styles.detailPage}`}>
        <div className={styles.loadingState}>Loading product...</div>
      </section>
    );
  }

  if (error || !product) {
    return (
      <section className={`container ${styles.detailPage}`}>
        <div className={styles.loadingState}>
          Product not found.{' '}
          <Link to="/shop" style={{ color: 'var(--color-primary)' }}>Back to shop</Link>
        </div>
      </section>
    );
  }

  const discount = getDiscountPercent(product.mrp, product.price);
  const images = product.images?.length > 0 ? product.images : [{ url: '/favicon.svg' }];

  return (
    <section className={`container ${styles.detailPage}`}>
      <Link to="/shop" className={styles.back}>
        <FiArrowLeft size={16} /> Back to Shop
      </Link>

      <div className={styles.content}>
        {/* Image Gallery */}
        <div className={styles.gallery}>
          <div className={styles.mainImage}>
            <img src={images[selectedImage]?.url} alt={product.name} />
          </div>
          {images.length > 1 && (
            <div className={styles.thumbs}>
              {images.map((img, i) => (
                <button
                  key={i}
                  className={`${styles.thumb} ${i === selectedImage ? styles.thumbActive : ''}`}
                  onClick={() => setSelectedImage(i)}
                >
                  <img src={img.url} alt={`${product.name} ${i + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className={styles.info}>
          <span className={styles.categoryLabel}>
            {product.category?.name || 'Uncategorized'}
          </span>
          <h1 className={styles.productName}>{product.name}</h1>

          {product.numReviews > 0 && (
            <div className={styles.ratingRow}>
              <div className={styles.stars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <FiStar
                    key={star}
                    size={16}
                    fill={star <= Math.round(product.avgRating) ? '#FFC107' : 'none'}
                  />
                ))}
              </div>
              <span className={styles.ratingText}>
                {product.avgRating} ({product.numReviews} review{product.numReviews !== 1 ? 's' : ''})
              </span>
            </div>
          )}

          <div className={styles.priceBlock}>
            <span className={styles.priceCurrent}>{formatPrice(product.price)}</span>
            {discount > 0 && (
              <>
                <span className={styles.priceOriginal}>{formatPrice(product.mrp)}</span>
                <span className={styles.discountLabel}>{discount}% OFF</span>
              </>
            )}
          </div>

          <p className={styles.desc}>{product.description}</p>

          {/* Specs */}
          <div className={styles.specGrid}>
            <div className={styles.specItem}>
              <span className={styles.specLabel}>Size</span>
              <span className={styles.specValue}>{product.size}</span>
            </div>
            <div className={styles.specItem}>
              <span className={styles.specLabel}>Absorbency</span>
              <span className={styles.specValue}>{product.absorbency}</span>
            </div>
            <div className={styles.specItem}>
              <span className={styles.specLabel}>Material</span>
              <span className={styles.specValue}>{product.material || 'Cotton'}</span>
            </div>
            <div className={styles.specItem}>
              <span className={styles.specLabel}>Pack Count</span>
              <span className={styles.specValue}>{product.packCount || 1} pads</span>
            </div>
          </div>

          {/* Features */}
          {product.features?.length > 0 && (
            <div className={styles.features}>
              {product.features.map((f, i) => (
                <span key={i} className={styles.featureTag}>{f}</span>
              ))}
            </div>
          )}

          {/* Stock */}
          <p className={styles.stockInfo}>
            {product.stock > 0 ? (
              <span className={styles.inStock}>✓ In Stock ({product.stock} available)</span>
            ) : (
              <span className={styles.outOfStock}>✗ Out of Stock</span>
            )}
          </p>

          {/* Add to Cart */}
          <div className={styles.actions}>
            <div className={styles.qtySelector}>
              <button
                type="button"
                className={styles.qtyBtn}
                onClick={() => setQty(Math.max(1, qty - 1))}
                disabled={qty <= 1}
              >
                <FiMinus size={16} />
              </button>
              <span className={styles.qtyValue}>{qty}</span>
              <button
                type="button"
                className={styles.qtyBtn}
                onClick={() => setQty(Math.min(product.stock, qty + 1))}
                disabled={qty >= product.stock}
              >
                <FiPlus size={16} />
              </button>
            </div>

            <button
              className={styles.addToCartBtn}
              onClick={handleAddToCart}
              disabled={product.stock === 0 || addingToCart}
              id="add-to-cart-btn"
            >
              <FiShoppingCart size={18} />
              {addingToCart ? 'Adding...' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetail;
