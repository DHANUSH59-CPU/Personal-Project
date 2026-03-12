import { Link } from 'react-router-dom';
import { FiStar } from 'react-icons/fi';
import { formatPrice, getDiscountPercent } from '../../utils/formatters';
import styles from '../../styles/components/ProductCard.module.css';

const ProductCard = ({ product }) => {
  const discount = getDiscountPercent(product.mrp, product.price);

  return (
    <Link to={`/product/${product.slug}`} className={styles.card}>
      <div className={styles.imageWrap}>
        <img
          src={product.images?.[0]?.url || '/favicon.svg'}
          alt={product.name}
          loading="lazy"
        />
        {discount > 0 && (
          <span className={styles.discountBadge}>{discount}% OFF</span>
        )}
      </div>

      <div className={styles.info}>
        <span className={styles.category}>
          {product.category?.name || 'Uncategorized'}
        </span>
        <h3 className={styles.name}>{product.name}</h3>

        <div className={styles.meta}>
          <span>{product.size}</span>
          <span className={styles.metaDot} />
          <span>{product.absorbency}</span>
        </div>

        {product.numReviews > 0 && (
          <div className={styles.rating}>
            <FiStar className={styles.star} size={14} />
            <span>{product.avgRating}</span>
            <span>({product.numReviews})</span>
          </div>
        )}

        {product.stock > 0 ? (
          <div className={styles.priceRow}>
            <span className={styles.price}>{formatPrice(product.price)}</span>
            {discount > 0 && (
              <span className={styles.mrp}>{formatPrice(product.mrp)}</span>
            )}
          </div>
        ) : (
          <span className={styles.outOfStock}>Out of Stock</span>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
