import { Link } from 'react-router-dom';
import { FiArrowRight, FiShoppingBag, FiShield, FiHeart, FiTruck, FiAward, FiStar, FiSun, FiZap, FiWind, FiGlobe, FiTag } from 'react-icons/fi';
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

      {/* ═══ FEATURED PRODUCT ════════════════════ */}
      <section className={styles.featuredProduct}>
        <div className={`container ${styles.featuredInner}`}>
          {/* Glass card with product image */}
          <div className={styles.glassCard}>
            <div className={styles.glassCardGlow} />
            <div className={styles.glassImageWrap}>
              <img
                src="/newfeel-product.png"
                alt="NewFeel Ultra Thin XXL — 40 Pads"
                className={styles.glassProductImg}
              />
            </div>

            {/* Floating feature chips */}
            <div className={`${styles.glassChip} ${styles.glassChip1}`}>
              <FiZap size={14} /> Anion Chip
            </div>
            <div className={`${styles.glassChip} ${styles.glassChip2}`}>
              <FiShield size={14} /> 3X Absorption
            </div>
            <div className={`${styles.glassChip} ${styles.glassChip3}`}>
              <FiWind size={14} /> Ultra Thin
            </div>
          </div>

          {/* Right — Text info */}
          <div className={styles.featuredInfo}>
            <span className={styles.featuredTag}>⭐ Best Seller</span>
            <h2 className={styles.featuredTitle}>
              NewFeel Ultra Thin
              <span className={styles.featuredHighlight}> XXL</span>
            </h2>
            <p className={styles.featuredSubtitle}>Ultimate Soft · 40 Pads · 320mm</p>
            <p className={styles.featuredDesc}>
              Experience next-level comfort with our ultra-thin sanitary pads. Made with
              organic cotton and enhanced with anion chip technology — offering 3X more
              absorption, silky-soft feel, and up to 100% leakage protection.
            </p>

            <div className={styles.featuredFeatures}>
              <div className={styles.featuredFeatureItem}>
                <FiSun size={18} />
                <span>Organic Cotton</span>
              </div>
              <div className={styles.featuredFeatureItem}>
                <FiShield size={18} />
                <span>Leak Guard</span>
              </div>
              <div className={styles.featuredFeatureItem}>
                <FiGlobe size={18} />
                <span>Eco-Friendly</span>
              </div>
            </div>

            <div className={styles.featuredActions}>
              <Link to="/shop" className={styles.featuredBtn} id="featured-shop-btn">
                <FiShoppingBag size={18} /> Shop Now
              </Link>
              <Link to="/shop" className={styles.featuredBtnOutline}>
                View All Products <FiArrowRight size={16} />
              </Link>
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
              <div className={styles.whyCardIcon}><FiSun size={26} /></div>
              <h3 className={styles.whyCardTitle}>Organic Cotton Top Sheet</h3>
              <p className={styles.whyCardDesc}>
                Made with 100% certified organic cotton that's gentle on your skin.
                No chemicals, no bleach — just pure softness.
              </p>
            </div>

            <div className={styles.whyCard}>
              <div className={styles.whyCardIcon}><FiZap size={26} /></div>
              <h3 className={styles.whyCardTitle}>Anion Chip Technology</h3>
              <p className={styles.whyCardDesc}>
                Our pads feature anion chips that help neutralize odor and
                keep you feeling fresh throughout the day.
              </p>
            </div>

            <div className={styles.whyCard}>
              <div className={styles.whyCardIcon}><FiShield size={26} /></div>
              <h3 className={styles.whyCardTitle}>Side Leak Guard</h3>
              <p className={styles.whyCardDesc}>
                Advanced leak guard technology prevents leaks from every side,
                giving you worry-free protection even at night.
              </p>
            </div>

            <div className={styles.whyCard}>
              <div className={styles.whyCardIcon}><FiWind size={26} /></div>
              <h3 className={styles.whyCardTitle}>Ultra-Thin Design</h3>
              <p className={styles.whyCardDesc}>
                So thin you'll forget you're wearing it. Perfect for active
                lifestyles — yoga, gym, or everyday confidence.
              </p>
            </div>

            <div className={styles.whyCard}>
              <div className={styles.whyCardIcon}><FiGlobe size={26} /></div>
              <h3 className={styles.whyCardTitle}>Eco-Responsible</h3>
              <p className={styles.whyCardDesc}>
                Biodegradable packaging and materials that break down naturally.
                Good for you, good for the planet.
              </p>
            </div>

            <div className={styles.whyCard}>
              <div className={styles.whyCardIcon}><FiTag size={26} /></div>
              <h3 className={styles.whyCardTitle}>Affordable Premium</h3>
              <p className={styles.whyCardDesc}>
                Premium quality doesn't have to cost premium prices.
                Subscribe &amp; save up to 20% on every order.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ════════════════════════ */}
      <section className={styles.testimonials}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Real Reviews</span>
            <h2 className={styles.sectionTitle}>Women Love NewFeel</h2>
            <p className={styles.sectionDesc}>
              Hear what thousands of happy customers have to say about their experience.
            </p>
          </div>

          <div className={styles.testimonialGrid}>
            {/* Card 1 */}
            <div className={styles.testimonialCard}>
              <div className={styles.testimonialStars}>
                {[...Array(5)].map((_, i) => <FiStar key={i} fill="#F59E0B" strokeWidth={0} />)}
              </div>
              <p className={styles.testimonialText}>
                "I've tried so many brands but NewFeel is truly on another level. The ultra-thin design is unreal — I completely forget I'm wearing it during my yoga sessions. Never going back!"
              </p>
              <div className={styles.testimonialAuthor}>
                <div className={styles.testimonialAvatar}>P</div>
                <div>
                  <div className={styles.testimonialName}>Priya Sharma</div>
                  <div className={styles.testimonialLocation}>Mumbai, Maharashtra</div>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className={styles.testimonialCard}>
              <div className={styles.testimonialStars}>
                {[...Array(5)].map((_, i) => <FiStar key={i} fill="#F59E0B" strokeWidth={0} />)}
              </div>
              <p className={styles.testimonialText}>
                "As someone with sensitive skin, finding the right pad was always a struggle. NewFeel's organic cotton changed everything. Zero rashes, zero discomfort. A game changer!"
              </p>
              <div className={styles.testimonialAuthor}>
                <div className={styles.testimonialAvatar}>A</div>
                <div>
                  <div className={styles.testimonialName}>Ananya Reddy</div>
                  <div className={styles.testimonialLocation}>Bengaluru, Karnataka</div>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className={styles.testimonialCard}>
              <div className={styles.testimonialStars}>
                {[...Array(5)].map((_, i) => <FiStar key={i} fill="#F59E0B" strokeWidth={0} />)}
              </div>
              <p className={styles.testimonialText}>
                "The anion chip technology is the real deal. No more odor anxiety at work or college. Plus the packaging is so eco-friendly. I've gifted it to all my friends too!"
              </p>
              <div className={styles.testimonialAuthor}>
                <div className={styles.testimonialAvatar}>M</div>
                <div>
                  <div className={styles.testimonialName}>Meera Iyer</div>
                  <div className={styles.testimonialLocation}>Chennai, Tamil Nadu</div>
                </div>
              </div>
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
