import { Link } from 'react-router-dom';
import { FiArrowRight, FiShoppingBag, FiShield, FiHeart, FiTruck, FiAward, FiStar } from 'react-icons/fi';
import { useGetProductsQuery } from '../api/productApi';
import styles from '../styles/pages/Home.module.css';

const Home = () => {
  const { data: productsData } = useGetProductsQuery({ limit: 30 });
  const products = productsData?.data?.products || [];

  // Extract first image from each product
  const productImages = products
    .filter((p) => p.images?.length > 0)
    .map((p) => ({ slug: p.slug, image: p.images[0].url }));

  // Split into two rows for the marquee
  const mid = Math.ceil(productImages.length / 2);
  const row1 = productImages.slice(0, mid);
  const row2 = productImages.slice(mid);

  return (
    <>
      {/* ═══ HERO ═══════════════════════════════ */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          {/* Left — Text */}
          <div className={styles.heroContent}>
            <div className={styles.heroBadge}>
              <span>✨</span> Trusted by 50,000+ Women Across India
            </div>

            <h1 className={styles.heroTitle}>
              Feel the{' '}
              <span className={styles.highlight}>Comfort</span>
              <br />
              You{' '}
              <span className={styles.highlightLine}>Deserve</span>
            </h1>

            <p className={styles.heroDesc}>
              Premium ultra-thin sanitary pads made with organic cotton &amp; anion technology.
              3X more absorption, zero irritation — because your comfort matters.
            </p>

            <div className={styles.heroActions}>
              <Link to="/shop" className={styles.heroBtn} id="hero-shop-btn">
                Shop Now <FiArrowRight size={18} />
              </Link>
              <Link to="/shop" className={styles.heroBtnSecondary}>
                <FiShoppingBag size={18} /> View Collection
              </Link>
            </div>

            <div className={styles.heroStats}>
              <div className={styles.stat}>
                <div className={styles.statNumber}>50K+</div>
                <div className={styles.statLabel}>Happy Customers</div>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.stat}>
                <div className={styles.statNumber}>4.8</div>
                <div className={styles.statLabel}>Average Rating</div>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.stat}>
                <div className={styles.statNumber}>100%</div>
                <div className={styles.statLabel}>Organic Cotton</div>
              </div>
            </div>
          </div>

          {/* Right — Image */}
          <div className={styles.heroImageWrap}>
            <img
              src="/hero-banner.jpeg"
              alt="NewFeel Ultra Thin Sanitary Pads — Ultimate Soft"
              className={styles.heroImage}
            />

            {/* Floating Cards */}
            <div className={`${styles.floatingCard} ${styles.floatingCard1}`}>
              <div className={styles.floatingIcon} style={{ background: 'rgba(76, 175, 80, 0.1)' }}>
                🌿
              </div>
              <div className={styles.floatingCardText}>
                <span className={styles.floatingCardTitle}>100% Organic</span>
                <span className={styles.floatingCardSub}>Pure cotton comfort</span>
              </div>
            </div>

            <div className={`${styles.floatingCard} ${styles.floatingCard2}`}>
              <div className={styles.floatingIcon} style={{ background: 'rgba(233, 30, 99, 0.08)' }}>
                💧
              </div>
              <div className={styles.floatingCardText}>
                <span className={styles.floatingCardTitle}>3X Absorption</span>
                <span className={styles.floatingCardSub}>Stay dry all day</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ PRODUCT SHOWCASE MARQUEE ═══════════ */}
      {productImages.length >= 4 && (
        <section className={styles.showcase}>
          <div className={styles.showcaseHeader}>
            <span className={styles.showcaseTag}>Our Products</span>
            <h2 className={styles.showcaseTitle}>Explore Our Collection</h2>
          </div>

          <div className={styles.marqueeWrap}>
            {/* Row 1 — scrolls left */}
            <div className={`${styles.marqueeRow} ${styles.marqueeRowLeft}`}>
              {[...row1, ...row1].map((item, i) => (
                <Link key={`r1-${i}`} to={`/product/${item.slug}`} className={styles.marqueeItem}>
                  <img src={item.image} alt="Product" loading="lazy" />
                </Link>
              ))}
            </div>

            {/* Row 2 — scrolls right */}
            <div className={`${styles.marqueeRow} ${styles.marqueeRowRight}`}>
              {[...row2, ...row2].map((item, i) => (
                <Link key={`r2-${i}`} to={`/product/${item.slug}`} className={styles.marqueeItem}>
                  <img src={item.image} alt="Product" loading="lazy" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ TRUST FEATURES ═════════════════════ */}
      <section className={styles.features}>
        <div className={`container ${styles.featuresGrid}`}>
          <div className={styles.featureCard}>
            <div className={styles.featureIconWrap} style={{ background: 'rgba(233, 30, 99, 0.08)' }}>
              <FiTruck />
            </div>
            <h3 className={styles.featureTitle}>Free Delivery</h3>
            <p className={styles.featureDesc}>Free shipping on orders above ₹499</p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIconWrap} style={{ background: 'rgba(76, 175, 80, 0.08)' }}>
              <FiShield />
            </div>
            <h3 className={styles.featureTitle}>100% Organic</h3>
            <p className={styles.featureDesc}>Certified organic cotton material</p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIconWrap} style={{ background: 'rgba(255, 152, 0, 0.08)' }}>
              <FiAward />
            </div>
            <h3 className={styles.featureTitle}>Clinically Tested</h3>
            <p className={styles.featureDesc}>Dermatologist approved &amp; safe</p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIconWrap} style={{ background: 'rgba(103, 58, 183, 0.08)' }}>
              <FiHeart />
            </div>
            <h3 className={styles.featureTitle}>Eco-Friendly</h3>
            <p className={styles.featureDesc}>Biodegradable, planet-friendly</p>
          </div>
        </div>
      </section>

      {/* ═══ WHY CHOOSE US ══════════════════════ */}
      <section className={styles.whySection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Why Choose Us</span>
            <h2 className={styles.sectionTitle}>Designed for Your Well-Being</h2>
            <p className={styles.sectionDesc}>
              Every pad is crafted with care and backed by science to give you confidence all day.
            </p>
          </div>

          <div className={styles.whyGrid}>
            <div className={styles.whyCard}>
              <div className={styles.whyCardIcon}>🌱</div>
              <h3 className={styles.whyCardTitle}>Organic Cotton Top Sheet</h3>
              <p className={styles.whyCardDesc}>
                Made with 100% certified organic cotton that's gentle on your skin.
                No chemicals, no bleach — just pure softness.
              </p>
            </div>

            <div className={styles.whyCard}>
              <div className={styles.whyCardIcon}>⚡</div>
              <h3 className={styles.whyCardTitle}>Anion Chip Technology</h3>
              <p className={styles.whyCardDesc}>
                Our pads feature anion chips that help neutralize odor and
                keep you feeling fresh throughout the day.
              </p>
            </div>

            <div className={styles.whyCard}>
              <div className={styles.whyCardIcon}>🛡️</div>
              <h3 className={styles.whyCardTitle}>Side Leak Guard</h3>
              <p className={styles.whyCardDesc}>
                Advanced leak guard technology prevents leaks from every side,
                giving you worry-free protection even at night.
              </p>
            </div>

            <div className={styles.whyCard}>
              <div className={styles.whyCardIcon}>☁️</div>
              <h3 className={styles.whyCardTitle}>Ultra-Thin Design</h3>
              <p className={styles.whyCardDesc}>
                So thin you'll forget you're wearing it. Perfect for active
                lifestyles — yoga, gym, or everyday confidence.
              </p>
            </div>

            <div className={styles.whyCard}>
              <div className={styles.whyCardIcon}>🌍</div>
              <h3 className={styles.whyCardTitle}>Eco-Responsible</h3>
              <p className={styles.whyCardDesc}>
                Biodegradable packaging and materials that break down naturally.
                Good for you, good for the planet.
              </p>
            </div>

            <div className={styles.whyCard}>
              <div className={styles.whyCardIcon}>💰</div>
              <h3 className={styles.whyCardTitle}>Affordable Premium</h3>
              <p className={styles.whyCardDesc}>
                Premium quality doesn't have to cost premium prices.
                Subscribe &amp; save up to 20% on every order.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CTA BANNER ═════════════════════════ */}
      <section className={styles.ctaBanner}>
        <div className="container">
          <div className={styles.ctaCard}>
            <h2 className={styles.ctaTitle}>
              Ready to Experience the Difference?
            </h2>
            <p className={styles.ctaDesc}>
              Join 50,000+ women who switched to a better, softer, more comfortable pad.
            </p>
            <Link to="/shop" className={styles.ctaBtn}>
              <FiShoppingBag size={18} /> Start Shopping
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
