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

  const subtotal = validItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const mrpTotal = validItems.reduce((sum, item) => sum + (item.product.mrp || item.product.price) * item.quantity, 0);
  const savings = mrpTotal - subtotal;
  const shipping = subtotal >= 480 ? 0 : 49;
  const total = subtotal + shipping;
  const totalItems = validItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleUpdateQty = async (itemId, newQty) => {
    if (newQty < 1) return;
    try { await updateCartItem({ itemId, quantity: newQty }).unwrap(); }
    catch (err) { toast.error(err?.data?.message || 'Failed to update quantity'); }
  };

  const handleRemove = async (itemId) => {
    try { await removeCartItem(itemId).unwrap(); toast.success('Item removed'); }
    catch (err) { toast.error(err?.data?.message || 'Failed to remove item'); }
  };

  const handleClear = async () => {
    try { await clearCart().unwrap(); toast.success('Cart cleared'); }
    catch (err) { toast.error(err?.data?.message || 'Failed to clear cart'); }
  };

  if (!user) return (
    <section className={styles.cartPage}>
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}><FiShoppingBag size={28} /></div>
        <h2 className={styles.emptyTitle}>Please log in</h2>
        <p className={styles.emptyDesc}>Sign in to view your cart and checkout.</p>
        <Link to="/login" className={styles.emptyBtn}>Sign In <FiArrowRight size={16} /></Link>
      </div>
    </section>
  );

  if (isLoading) return (
    <section className={styles.cartPage}>
      <div className="spinner" />
    </section>
  );

  if (validItems.length === 0) return (
    <section className={styles.cartPage}>
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}><FiShoppingBag size={28} /></div>
        <h2 className={styles.emptyTitle}>Your cart is empty</h2>
        <p className={styles.emptyDesc}>Browse our collection and find something you love!</p>
        <Link to="/shop" className={styles.emptyBtn}><FiShoppingBag size={16} /> Start Shopping</Link>
      </div>
    </section>
  );

  return (
    <section className={styles.cartPage}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>
          Your Cart <span className={styles.itemCountBadge}>({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
        </h1>
        <button className={styles.clearBtn} onClick={handleClear}>
          <FiTrash2 size={13} /> Clear
        </button>
      </div>

      {/* Items */}
      <div className={styles.cartItems}>
        {validItems.map((item) => {
          const product = item.product;
          const hasDiscount = product.mrp && product.mrp > product.price;
          const discountPercent = hasDiscount ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;

          return (
            <div key={item._id} className={styles.cartItem}>
              <Link to={`/product/${product.slug}`} className={styles.itemImage}>
                <img src={product.images?.[0]?.url || '/favicon.svg'} alt={product.name} />
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
                      <span className={styles.discountTag}>{discountPercent}% off</span>
                    </>
                  )}
                </div>
                <div className={styles.itemActions}>
                  <div className={styles.qtySelector}>
                    <button className={styles.qtyBtn} onClick={() => handleUpdateQty(item._id, item.quantity - 1)} disabled={item.quantity <= 1}>
                      <FiMinus size={13} />
                    </button>
                    <span className={styles.qtyValue}>{item.quantity}</span>
                    <button className={styles.qtyBtn} onClick={() => handleUpdateQty(item._id, item.quantity + 1)} disabled={item.quantity >= product.stock}>
                      <FiPlus size={13} />
                    </button>
                  </div>
                  <button className={styles.removeBtn} onClick={() => handleRemove(item._id)}>
                    <FiTrash2 size={13} /> Remove
                  </button>
                  <span className={styles.itemSubtotal}>₹{(product.price * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className={styles.summary}>
        <h2 className={styles.summaryTitle}>Order Summary</h2>

        <div className={styles.summaryRow}>
          <span className={styles.summaryLabel}>Subtotal ({totalItems} items)</span>
          <span className={styles.summaryValue}>₹{mrpTotal.toLocaleString('en-IN')}</span>
        </div>
        {savings > 0 && (
          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>Discount</span>
            <span className={styles.savingsValue}>−₹{savings.toLocaleString('en-IN')}</span>
          </div>
        )}
        <div className={styles.summaryRow}>
          <span className={styles.summaryLabel}>Shipping</span>
          <span className={shipping === 0 ? styles.freeShipping : styles.summaryValue}>
            {shipping === 0 ? 'FREE' : `₹${shipping}`}
          </span>
        </div>
        {shipping > 0 && <p className={styles.shippingNote}>Free shipping on orders of ₹480 or more</p>}

        <div className={styles.summaryTotal}>
          <span className={styles.totalLabel}>Total</span>
          <span className={styles.totalValue}>₹{total.toLocaleString('en-IN')}</span>
        </div>

        <Link to="/checkout" className={styles.checkoutBtn}>
          Proceed to Checkout <FiArrowRight size={16} />
        </Link>
        <Link to="/shop" className={styles.continueShopping}>
          <FiArrowLeft size={14} /> Continue Shopping
        </Link>
      </div>
    </section>
  );
};

export default Cart;
