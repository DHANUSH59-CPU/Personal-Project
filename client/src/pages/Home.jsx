import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/pages/Home.module.css';

// ─── SVG ICONS ────────────────────────────────────────────────────────────────
const IcoCheck = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="7.25" stroke={color} strokeWidth="1.2" />
    <path d="M5 8.2l2 2 4-4" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IcoCross = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="7.25" stroke="#D8D0D4" strokeWidth="1.2" />
    <path d="M5.5 10.5l5-5M10.5 10.5l-5-5" stroke="#D8D0D4" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);
const IcoMinus = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="7.25" stroke="#C4935A" strokeWidth="1.2" />
    <path d="M5 8h6" stroke="#C4935A" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);
const IcoStar = ({ filled }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M7 1.5l1.5 3 3.3.48-2.4 2.34.56 3.3L7 9.1l-2.96 1.52.56-3.3L2.2 4.98l3.3-.48L7 1.5z"
      fill={filled ? '#C4005A' : 'none'} stroke="#C4005A" strokeWidth="1.1" />
  </svg>
);
const IcoShield = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M12 2L4 6v6c0 4.5 3.3 8.7 8 9.7 4.7-1 8-5.2 8-9.7V6L12 2z" stroke="currentColor" strokeWidth="1.4" fill="currentColor" fillOpacity="0.08" />
    <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IcoDroplet = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M12 4C12 4 7 10 7 14a5 5 0 0010 0c0-4-5-10-5-10z" stroke="currentColor" strokeWidth="1.4" fill="currentColor" fillOpacity="0.1" />
    <path d="M9.5 15a2.5 2.5 0 003-2.4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);
const IcoCotton = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="10" r="4" stroke="currentColor" strokeWidth="1.4" fill="currentColor" fillOpacity="0.1" />
    <circle cx="7.5" cy="12" r="2.8" stroke="currentColor" strokeWidth="1.2" fill="currentColor" fillOpacity="0.08" />
    <circle cx="16.5" cy="12" r="2.8" stroke="currentColor" strokeWidth="1.2" fill="currentColor" fillOpacity="0.08" />
    <path d="M12 14v5M10 19h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);
const IcoAnion = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.3" fill="currentColor" fillOpacity="0.07" />
    <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <circle cx="12" cy="12" r="2" fill="currentColor" fillOpacity="0.4" />
  </svg>
);
const IcoChevronDown = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IcoArrow = ({ dir = 'right' }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ transform: dir === 'left' ? 'rotate(180deg)' : 'none' }}>
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroGlow} />

      <div className={styles.heroBadge}>
        <span className={styles.heroBadgeDot} />
        <span className="label-caps" style={{ color: '#2B6840' }}>No. 1 Anion Care</span>
      </div>

      <h1 className={styles.heroTitle}>
        <span>Feel Confident.</span>
        <span className={styles.heroTitleAccent}>Stay Protected.</span>
      </h1>

      <p className={styles.heroSub}>Ultra Thin. Ultimate Comfort. Heavy Flow Protection.</p>

      <div className={styles.heroCtas}>
        <Link to="/shop" className="btn-primary" style={{ flex: 1, textAlign: 'center' }}>Shop Now</Link>
        <Link to="/shop#benefits" className="btn-outline">Discover</Link>
      </div>

      <div className={styles.heroImageWrap}>
        <div className={styles.heroImageGlow} />
        <img
          src="/uploads/hero-product.jpeg"
          alt="NewFeel Ultra Thin – 40 XXL pads"
          className={styles.heroImage}
        />
      </div>

      <div className={styles.trustBar}>
        {[['10,000+', 'Women trust us'], ['4.8 / 5', 'Customer rating'], ['XXL 320mm', 'Full coverage']].map(([val, label], i) => (
          <div key={i} className={styles.trustItem} style={{ borderRight: i < 2 ? '1px solid #F0E4E9' : 'none' }}>
            <div className={styles.trustVal}>{val}</div>
            <div className={styles.trustLabel}>{label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── ADS CAROUSEL ─────────────────────────────────────────────────────────────
const ADS = [
  { src: '/uploads/1st.jpeg',  tag: 'Free Tote Handbag',      sub: '40 pads · ₹499 + shipping' },
  { src: '/uploads/2nd.jpeg',  tag: 'Free Cosmetic Pouch',    sub: '40 pads · ₹499 + shipping' },
  { src: '/uploads/3rd.jpeg',  tag: 'Free Designer Handbag',  sub: '40 pads · ₹499 + shipping' },
  { src: '/uploads/4th.jpeg',  tag: 'Free Structured Bag',    sub: '40 pads · ₹499 + shipping' },
  { src: '/uploads/5th.jpeg',  tag: 'Free Barrel Bag',        sub: '40 pads · ₹499 + shipping' },
  { src: '/uploads/6th.jpeg',  tag: 'Free Quilted Sling',     sub: '40 pads · ₹499 + shipping' },
  { src: '/uploads/7th.jpeg',  tag: 'Free Bucket Bag',        sub: '40 pads · ₹499 + shipping' },
  { src: '/uploads/8th.jpeg',  tag: 'Free Shoulder Bag',      sub: '40 pads · ₹499 + shipping' },
  { src: '/uploads/9th.jpeg',  tag: 'Free Mini Crossbody',    sub: '40 pads · ₹499 + shipping' },
  { src: '/uploads/10th.jpeg', tag: 'Free Sling Bag',         sub: '40 pads · ₹499 + shipping' },
  { src: '/uploads/11th.jpeg', tag: 'Free Structured Tote',   sub: '40 pads · ₹499 + shipping' },
  { src: '/uploads/12th.jpeg', tag: 'Free Designer Bag',      sub: 'Special Sale · ₹499 + shipping' },
  { src: '/uploads/13th.jpeg', tag: 'Free Designer Bangles',  sub: 'Special Sale · ₹499 + shipping' },
  { src: '/uploads/14th.jpeg', tag: 'Free Designer Bangles',  sub: 'Special Sale · ₹499 + shipping' },
  { src: '/uploads/15th.jpeg', tag: 'Free Designer Bangles',  sub: 'Special Sale · ₹499 + shipping' },
  { src: '/uploads/17th.jpeg', tag: 'NewFeel Stylish Maxi',   sub: 'Dry Comfort · XXXL · ₹399' },
];

function AdsCarousel() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef(null);
  const total = ADS.length;
  const navigate = useNavigate();

  const goTo = (i) => setCurrent((i + total) % total);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setCurrent(c => (c + 1) % total), 3200);
    return () => clearInterval(t);
  }, [paused, total]);

  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; setPaused(true); };
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 40) goTo(current + (delta > 0 ? 1 : -1));
    touchStartX.current = null;
    setTimeout(() => setPaused(false), 2500);
  };

  const ad = ADS[current];

  return (
    <section className={styles.adsSection}>
      <div className={styles.adsHeader}>
        <div>
          <div className="section-label">Special Offers</div>
          <h2 className="section-title">Purchase &amp;<br />Receive a Free Gift</h2>
        </div>
        <div className={styles.adsNav}>
          {[
            { dir: 'left', fn: () => { goTo(current - 1); setPaused(true); setTimeout(() => setPaused(false), 3000); } },
            { dir: 'right', fn: () => { goTo(current + 1); setPaused(true); setTimeout(() => setPaused(false), 3000); } },
          ].map(({ dir, fn }) => (
            <button key={dir} onClick={fn} className={`${styles.adsNavBtn} ${dir === 'right' ? styles.adsNavBtnFilled : ''}`}>
              <IcoArrow dir={dir} />
            </button>
          ))}
        </div>
      </div>

      <div
        className={styles.adsImageWrap}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <img key={current} src={ad.src} alt={ad.tag} className={styles.adsImage} />
        <div className={`label-caps ${styles.adsLimitedBadge}`}>Limited Time</div>
        <div className={styles.adsOverlay}>
          <div className={styles.adsOverlayText}>
            <div className={styles.adsOverlayTitle}>{ad.tag}</div>
            <div className={styles.adsOverlaySub}>{ad.sub}</div>
          </div>
          <button onClick={() => navigate('/shop')} className={styles.adsOrderBtn}>Order Now</button>
        </div>
      </div>

      <div className={styles.adsDots}>
        <div className={styles.adsDotsInner}>
          {ADS.map((_, i) => (
            <button key={i} onClick={() => { goTo(i); setPaused(true); setTimeout(() => setPaused(false), 3000); }}
              className={styles.adsDot}
              style={{ width: i === current ? 20 : 5, background: i === current ? '#C4005A' : '#DDD0D5' }}
            />
          ))}
        </div>
        <span className={styles.adsCounter}>{current + 1} / {total}</span>
      </div>
    </section>
  );
}

// ─── BENEFITS ─────────────────────────────────────────────────────────────────
const BENEFITS = [
  { icon: <IcoCotton />, title: 'Ultra Thin Comfort', desc: 'Perforated cotton surface — barely-there sensation all day', color: '#C4005A' },
  { icon: <IcoDroplet />, title: '3× Absorption', desc: 'Day and night heavy flow protection, up to 8 hours', color: '#8B1A5A' },
  { icon: <IcoShield />, title: 'Leak Guard', desc: 'Side wings that hold firm even on your heaviest days', color: '#2B6840' },
  { icon: <IcoAnion />, title: 'Anion Technology', desc: 'Advanced anion chip for lasting freshness and comfort', color: '#5A3080' },
];

function BenefitsCarousel() {
  const [active, setActive] = useState(0);
  const touchStartX = useRef(null);
  const scrollRef = useRef(null);

  const goTo = (i) => setActive(Math.max(0, Math.min(BENEFITS.length - 1, i)));
  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (!touchStartX.current) return;
    const d = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(d) > 40) goTo(active + (d > 0 ? 1 : -1));
    touchStartX.current = null;
  };

  return (
    <section id="benefits" className={styles.benefitsSection}>
      <div className={styles.benefitsHeader}>
        <div className="section-label">Why NewFeel</div>
        <h2 className="section-title">Crafted for<br />every day of you</h2>
      </div>

      <div
        ref={scrollRef}
        className={styles.benefitsScroll}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {BENEFITS.map((b, i) => (
          <div
            key={i}
            onClick={() => setActive(i)}
            className={styles.benefitCard}
            style={{
              background: i === active ? `${b.color}0C` : '#FAFAFA',
              border: `1px solid ${i === active ? b.color + '30' : '#F0EBED'}`,
            }}
          >
            <div style={{ color: b.color, marginBottom: 14, opacity: 0.9 }}>{b.icon}</div>
            <div className={styles.benefitTitle}>{b.title}</div>
            <div className={styles.benefitDesc}>{b.desc}</div>
          </div>
        ))}
      </div>

      <div className={styles.benefitsDots}>
        {BENEFITS.map((_, i) => (
          <button key={i} onClick={() => goTo(i)} className={styles.benefitDot}
            style={{ width: i === active ? 20 : 6, background: i === active ? '#C4005A' : '#E8DDE0' }} />
        ))}
      </div>
    </section>
  );
}

// ─── PRODUCT DETAILS ──────────────────────────────────────────────────────────
const FEATURES = [
  { label: 'Perforated Cotton Surface', sub: 'Gentle, breathable top layer', dot: '#C4005A' },
  { label: 'Anion Chip Technology', sub: 'Advanced odor & freshness control', dot: '#5A3080' },
  { label: 'XXL 320mm Length', sub: 'Full back coverage for heavy flow', dot: '#2B6840' },
  { label: 'Side Leak-Guard Wings', sub: 'Stays secure, no side leaks', dot: '#B5612A' },
  { label: 'Gentle Fragrance', sub: 'Light, natural clean scent', dot: '#8B1A5A' },
];

function ProductDetails() {
  return (
    <section className={styles.detailsSection}>
      <div className="section-label">Product Details</div>
      <h2 className="section-title" style={{ marginBottom: 28 }}>Engineered for<br />her comfort</h2>

      <div className={styles.padDiagramCard}>
        <div className={styles.padDiagram}>
          <div className={styles.padBody}>
            <div className={styles.padWingLeft} />
            <div className={styles.padWingRight} />
            <div className={styles.padCenter}>
              <div className={styles.padCenterDot} />
            </div>
            {[30, 68, 106, 144, 178].map(x => (
              <div key={x} className={styles.padLine} style={{ left: x }} />
            ))}
          </div>
          <div className={styles.padSizeLabel}>320mm XXL</div>
        </div>
        <p className={styles.padCaption}>Perforated soft cover · Side leak-guard wings</p>
        <div className={styles.featureList}>
          {FEATURES.map((f, i) => (
            <div key={i} className={styles.featureItem}>
              <div className={styles.featureDot} style={{ background: f.dot }} />
              <div>
                <span className={styles.featureLabel}>{f.label}</span>
                <span className={styles.featureSub}>{f.sub}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.absorptionCallout}>
        <div className={styles.absorptionNum}>3×</div>
        <div>
          <div className={styles.absorptionTitle}>More Absorption</div>
          <div className={styles.absorptionDesc}>Day and night protection. Trusted during your heaviest days.</div>
        </div>
      </div>
    </section>
  );
}

// ─── REVIEWS ──────────────────────────────────────────────────────────────────
const REVIEWS = [
  { name: 'Priya S.', city: 'Mumbai', rating: 5, text: `Finally a pad that doesn't feel bulky. The anion technology genuinely helps with freshness. Absolutely switched for good.` },
  { name: 'Ananya R.', city: 'Delhi', rating: 5, text: `Was skeptical but after trying once, I won't go back. Ultra thin yet absorbs so well, even overnight.` },
  { name: 'Megha K.', city: 'Bangalore', rating: 4, text: `Super comfortable, no irritation at all. The XXL size is perfect for heavy flow days. Highly recommend.` },
];

function Stars({ rating }) {
  return (
    <div className={styles.stars}>
      {[1, 2, 3, 4, 5].map(i => <IcoStar key={i} filled={i <= rating} />)}
    </div>
  );
}

function TrustSection() {
  return (
    <section className={styles.reviewsSection}>
      <div className="section-label">Reviews</div>
      <h2 className="section-title" style={{ marginBottom: 24 }}>Loved by women<br />across India</h2>

      <div className={styles.ratingSummary}>
        <div className={styles.ratingBig}>
          <div className={styles.ratingNum}>4.8</div>
          <Stars rating={5} />
          <div className={styles.ratingCount}>10,248 ratings</div>
        </div>
        <div className={styles.ratingBars}>
          {[[5, 85], [4, 10], [3, 4], [2, 1], [1, 0]].map(([s, pct]) => (
            <div key={s} className={styles.ratingBarRow}>
              <span className={styles.ratingBarLabel}>{s}</span>
              <div className={styles.ratingBarBg}>
                <div className={styles.ratingBarFill} style={{ width: `${pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.reviewCards}>
        {REVIEWS.map((r, i) => (
          <div key={i} className={styles.reviewCard}>
            <div className={styles.reviewCardHeader}>
              <div className={styles.reviewAuthorRow}>
                <div className={styles.reviewAvatar}>{r.name[0]}</div>
                <div>
                  <div className={styles.reviewName}>{r.name}</div>
                  <div className={styles.reviewCity}>{r.city}</div>
                </div>
              </div>
              <div className={styles.verifiedBadge}>
                <IcoCheck size={13} color="#2B6840" />
                <span>Verified</span>
              </div>
            </div>
            <Stars rating={r.rating} />
            <p className={styles.reviewText}>"{r.text}"</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── COMPARISON ───────────────────────────────────────────────────────────────
const COMPARE_ROWS = [
  { feature: 'Odor Control', us: 'yes', them: 'no' },
  { feature: 'Anion Technology', us: 'yes', them: 'no' },
  { feature: 'Ultra Thin Profile', us: 'yes', them: 'no' },
  { feature: 'Side Leak-Guards', us: 'yes', them: 'partial' },
  { feature: 'Cotton Soft Surface', us: 'yes', them: 'partial' },
  { feature: 'Heavy Flow XXL', us: 'yes', them: 'no' },
];

function ComparisonSection() {
  return (
    <section className={styles.compareSection}>
      <div className="section-label">Why NewFeel</div>
      <h2 className="section-title">Not all pads are<br />created equal</h2>
      <p className={styles.compareDesc}>See why women across India are making the switch.</p>

      <div className={styles.compareTable}>
        <div className={styles.compareHead}>
          <div className={styles.compareHeadFeature}>Feature</div>
          <div className={styles.compareHeadUs}>NewFeel</div>
          <div className={styles.compareHeadThem}>Others</div>
        </div>
        {COMPARE_ROWS.map((row, i) => (
          <div key={i} className={styles.compareRow} style={{ borderBottom: i < COMPARE_ROWS.length - 1 ? '1px solid #F5EEF1' : 'none' }}>
            <div className={styles.compareFeature}>{row.feature}</div>
            <div className={styles.compareUs}><IcoCheck size={16} color="#C4005A" /></div>
            <div className={styles.compareThem}>
              {row.them === 'no' ? <IcoCross size={16} /> : <IcoMinus size={16} />}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── PRICING ──────────────────────────────────────────────────────────────────
const OFFERS = [
  { id: 'premium', title: 'Premium Pack', price: 499, desc: 'Full-size pad pack', gift: 'Free Gift', giftDesc: 'Bag, Bangles & more', highlight: true, badge: 'Best Seller' },
  { id: 'combo',   title: '6 Small Packs Combo', price: 480, desc: '6 small pad packets', gift: 'Free Gift', giftDesc: 'Surprise gift included', highlight: false, badge: 'Value Deal' },
];

function PricingSection() {
  const [selected, setSelected] = useState(0);
  const [added, setAdded] = useState(false);
  const navigate = useNavigate();

  const handleBuy = () => {
    setAdded(true);
    setTimeout(() => { setAdded(false); navigate('/shop'); }, 1200);
  };

  return (
    <section id="packs" className={styles.pricingSection}>
      <div className="section-label">Special Offers</div>
      <h2 className="section-title">Choose your<br />perfect pack</h2>
      <p className={styles.pricingDesc}>Every order includes a free gift. Discreet packaging guaranteed.</p>

      <div className={styles.packList}>
        {OFFERS.map((offer, i) => (
          <div
            key={offer.id}
            onClick={() => setSelected(i)}
            className={styles.packItem}
            style={{
              border: `1.5px solid ${i === selected ? '#C4005A' : '#EEE5E9'}`,
              background: i === selected ? 'rgba(196,0,90,0.05)' : '#FAFAFA',
            }}
          >
            <div className={styles.packRadio} style={{ border: `1.5px solid ${i === selected ? '#C4005A' : '#DDD0D5'}`, background: i === selected ? '#C4005A' : '#fff' }}>
              {i === selected && <div className={styles.packRadioDot} />}
            </div>
            <div className={styles.packInfo}>
              <div className={styles.packNameRow}>
                <span className={styles.packName}>{offer.title}</span>
                <span className={styles.packBadge}>{offer.badge}</span>
              </div>
              <div className={styles.packDesc}>{offer.desc}</div>
              <div className={styles.packPriceRow}>
                <span className={styles.packPrice}>₹{offer.price}</span>
                <span className={styles.packGift}>{offer.gift}: {offer.giftDesc}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button onClick={handleBuy} className={styles.buyBtn} style={{ background: added ? '#2B6840' : '#C4005A' }}>
        {added ? 'Redirecting to Shop...' : `Buy Now — ₹${OFFERS[selected].price}`}
      </button>
      <p className={styles.pricingNote}>Secure checkout · Discreet packaging · Free delivery</p>
    </section>
  );
}

// ─── EMOTIONAL CTA ────────────────────────────────────────────────────────────
function EmotionalCTA() {
  return (
    <section className={styles.ctaSection}>
      <div className={styles.ctaDecor1} />
      <div className={styles.ctaDecor2} />
      <div className="label-caps" style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 16 }}>Our Promise</div>
      <h2 className={styles.ctaQuote}>"Because comfort matters every day of your cycle"</h2>
      <p className={styles.ctaDesc}>Join 10,000+ women who have made the switch to NewFeel Ultra Thin.</p>
      <Link to="/shop" className={styles.ctaBtn}>Try NewFeel Today</Link>
    </section>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────
const FAQS = [
  { q: 'Is it safe to use?', a: 'NewFeel Ultra Thin is dermatologically tested, free from harmful chemicals, and safe for daily use. The anion chip uses internationally certified, proven technology.' },
  { q: 'How is it different from regular pads?', a: 'NewFeel combines an ultra-thin profile with advanced anion chip technology and XXL 320mm coverage — giving you meaningfully better protection with greater comfort than regular pads.' },
  { q: 'Is it suitable for heavy flow?', a: 'Yes. The XXL 320mm size and 3× absorption core make it specifically suited for heavy flow days and overnight use.' },
  { q: 'Will packaging be discreet?', a: 'Always. Your order ships in plain, unmarked packaging. No brand names or product descriptions on the outside.' },
];

function FAQ() {
  const [open, setOpen] = useState(null);
  return (
    <section className={styles.faqSection}>
      <div className="section-label">FAQs</div>
      <h2 className="section-title" style={{ marginBottom: 24 }}>Questions<br />answered.</h2>
      <div className={styles.faqList}>
        {FAQS.map((faq, i) => (
          <div key={i} className={styles.faqItem} onClick={() => setOpen(open === i ? null : i)}>
            <div className={styles.faqQuestion}>
              <span className={styles.faqQText}>{faq.q}</span>
              <div className={styles.faqChevron} style={{ transform: open === i ? 'rotate(180deg)' : 'rotate(0)' }}>
                <IcoChevronDown />
              </div>
            </div>
            {open === i && (
              <div className={styles.faqAnswer}>
                <p>{faq.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── STICKY BAR ───────────────────────────────────────────────────────────────
function StickyBar() {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fn = () => setVisible(window.scrollY > 320);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <div className={styles.stickyBar} style={{ opacity: visible ? 1 : 0, pointerEvents: visible ? 'auto' : 'none' }}>
      <div className={styles.stickyInfo}>
        <div className={styles.stickySubtitle}>NewFeel Ultra Thin</div>
        <div className={styles.stickyTitle}>From ₹89 · Free Delivery</div>
      </div>
      <button onClick={() => navigate('/shop')} className={styles.stickyBtn}>Buy Now</button>
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
const Home = () => (
  <>
    <Hero />
    <AdsCarousel />
    <BenefitsCarousel />
    <ProductDetails />
    <TrustSection />
    <ComparisonSection />
    <PricingSection />
    <EmotionalCTA />
    <FAQ />
    <StickyBar />
  </>
);

export default Home;
