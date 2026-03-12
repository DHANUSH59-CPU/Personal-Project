import { Link } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';
import {
  useGetCartQuery,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useClearCartMutation,
} from '../api/cartApi';
import useAuth from '../hooks/useAuth';
import styles from '../styles/pages/Cart.module.css';

const Cart = () => {
  const { user } = useAuth();
  const { data, isLoading } = useGetCartQuery(undefined, { skip: !user });
  const [updateCartItem] = useUpdateCartItemMutation();
  const [removeCartItem] = useRemoveCartItemMutation();
  const [clearCart] = useClearCartMutation();

  const cart = data?.data;
  const items = cart?.items || [];
  const validItems = items.filter((item) => item.product?.isActive);

  // ── Calculations ──────────────────────────
  const subtotal = validItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const mrpTotal = validItems.reduce(
    (sum, item) => sum + (item.product.mrp || item.product.price) * item.quantity,
    0
  );
  const savings = mrpTotal - subtotal;
  const shipping = subtotal >= 499 ? 0 : 49;
  const total = subtotal + shipping;
  const totalItems = validItems.reduce((sum, item) => sum + item.quantity, 0);

  // ── Handlers ──────────────────────────────
  const handleUpdateQty = async (itemId, newQty) => {
    if (newQty < 1) return;
    try {
      await updateCartItem({ itemId, quantity: newQty }).unwrap();
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to update quantity');
    }
  };

  const handleRemove = async (itemId) => {
    try {
      await removeCartItem(itemId).unwrap();
      toast.success('Item removed from cart');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to remove item');
    }
  };

  const handleClear = async () => {
    try {
      await clearCart().unwrap();
      toast.success('Cart cleared');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to clear cart');
    }
  };

  // ── Not logged in ─────────────────────────
  if (!user) {
    return (
      <section className={`container ${styles.cartPage}`}>
        <div className={styles.emptyCart}>
          <div className={styles.emptyIcon}>🛒</div>
          <h2 className={styles.emptyTitle}>Please log in to view your cart</h2>
          <p className={styles.emptyDesc}>You need to be logged in to add items to your cart.</p>
          <Link to="/login" className={styles.emptyBtn}>
            Log In <FiArrowRight size={18} />
          </Link>
        </div>
      </section>
    );
  }

  // ── Loading ───────────────────────────────
  if (isLoading) {
    return (
      <section className={`container ${styles.cartPage}`}>
        <div className={styles.loading}>Loading your cart...</div>
      </section>
    );
  }

  // ── Empty cart ────────────────────────────
  if (validItems.length === 0) {
    return (
      <section className={`container ${styles.cartPage}`}>
        <div className={styles.emptyCart}>
          <div className={styles.emptyIcon}>🛒</div>
          <h2 className={styles.emptyTitle}>Your cart is empty</h2>
          <p className={styles.emptyDesc}>
            Looks like you haven't added any products yet. Browse our collection and find something you love!
          </p>
          <Link to="/shop" className={styles.emptyBtn}>
            <FiShoppingBag size={18} /> Start Shopping
          </Link>
        </div>
      </section>
    );
  }

  // ── Cart with items ───────────────────────
  return (
    <section className={`container ${styles.cartPage}`}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          Your Cart <span className={styles.itemCount}>({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
        </h1>
        <button className={styles.clearBtn} onClick={handleClear}>
          <FiTrash2 size={14} /> Clear Cart
        </button>
      </div>

      <div className={styles.cartLayout}>
        {/* ─── Cart Items ──────────────────── */}
        <div className={styles.cartItems}>
          {validItems.map((item) => {
            const product = item.product;
            const hasDiscount = product.mrp && product.mrp > product.price;
            const discountPercent = hasDiscount
              ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
              : 0;

            return (
              <div key={item._id} className={styles.cartItem}>
                <Link to={`/product/${product.slug}`} className={styles.itemImage}>
                  <img
                    src={product.images?.[0]?.url || '/placeholder.png'}
                    alt={product.name}
                  />
                </Link>

                <div className={styles.itemDetails}>
                  <p className={styles.itemName}>
                    <Link to={`/product/${product.slug}`}>{product.name}</Link>
                  </p>

                  <div className={styles.itemPrice}>
                    <span className={styles.currentPrice}>₹{product.price}</span>
                    {hasDiscount && (
                      <>
                        <span className={styles.originalPrice}>₹{product.mrp}</span>
                        <span className={styles.discount}>{discountPercent}% off</span>
                      </>
                    )}
                  </div>

                  <div className={styles.itemActions}>
                    <div className={styles.qtySelector}>
                      <button
                        className={styles.qtyBtn}
                        onClick={() => handleUpdateQty(item._id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <FiMinus size={14} />
                      </button>
                      <span className={styles.qtyValue}>{item.quantity}</span>
                      <button
                        className={styles.qtyBtn}
                        onClick={() => handleUpdateQty(item._id, item.quantity + 1)}
                        disabled={item.quantity >= product.stock}
                      >
                        <FiPlus size={14} />
                      </button>
                    </div>

                    <button className={styles.removeBtn} onClick={() => handleRemove(item._id)}>
                      <FiTrash2 size={14} /> Remove
                    </button>

                    <span className={styles.itemSubtotal}>
                      ₹{(product.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ─── Order Summary ───────────────── */}
        <aside className={styles.summary}>
          <h2 className={styles.summaryTitle}>Order Summary</h2>

          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>Subtotal ({totalItems} items)</span>
            <span className={styles.summaryValue}>₹{mrpTotal.toLocaleString('en-IN')}</span>
          </div>

          {savings > 0 && (
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Discount</span>
              <span className={styles.savingsValue}>-₹{savings.toLocaleString('en-IN')}</span>
            </div>
          )}

          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>Shipping</span>
            <span className={styles.summaryValue}>
              {shipping === 0 ? (
                <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>FREE</span>
              ) : (
                `₹${shipping}`
              )}
            </span>
          </div>

          {shipping > 0 && (
            <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: 4 }}>
              Free shipping on orders above ₹499
            </p>
          )}

          <div className={styles.summaryTotal}>
            <span className={styles.totalLabel}>Total</span>
            <span className={styles.totalValue}>₹{total.toLocaleString('en-IN')}</span>
          </div>

          <Link to="/checkout" className={styles.checkoutBtn}>
            Proceed to Checkout <FiArrowRight size={18} />
          </Link>

          <Link to="/shop" className={styles.continueShopping}>
            <FiArrowLeft size={16} /> Continue Shopping
          </Link>
        </aside>
      </div>
    </section>
  );
};

export default Cart;
