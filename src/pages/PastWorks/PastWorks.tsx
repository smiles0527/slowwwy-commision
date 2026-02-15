import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { pageTransition, fadeUp, staggerContainer, staggerItem } from '@animations/variants';
import { supabase } from '@/lib/supabase';
import type { PastWork } from '@/lib/database.types';
import styles from './PastWorks.module.css';

/* ── Detail Modal ── */
function WorkDetail({ work, onClose }: { work: PastWork; onClose: () => void }) {
  const specs = (work.specs ?? {}) as Record<string, string>;
  const images = (work.images ?? []) as string[];
  const allImages = work.cover_image ? [work.cover_image, ...images] : images;

  return (
    <motion.div
      className={styles.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className={styles.modal}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button className={styles.closeBtn} onClick={onClose}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Images */}
        {allImages.length > 0 && (
          <div className={styles.detailImages}>
            {allImages.map((url, i) => (
              <div key={i} className={styles.detailImageWrap}>
                <img src={url} alt={`${work.title} — ${i + 1}`} loading="lazy" />
              </div>
            ))}
          </div>
        )}

        {/* Info */}
        <div className={styles.detailInfo}>
          <div className={styles.detailHeader}>
            {work.tags.length > 0 && (
              <div className={styles.detailTags}>
                {work.tags.map((tag, i) => (
                  <span key={i} className={styles.tag}>{tag}</span>
                ))}
              </div>
            )}
            <h2 className={styles.detailTitle}>{work.title}</h2>
            {work.completed_at && (
              <span className={styles.detailDate}>
                {new Date(work.completed_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                })}
              </span>
            )}
          </div>

          {work.description && (
            <p className={styles.detailDesc}>{work.description}</p>
          )}

          {/* Specs */}
          {Object.keys(specs).length > 0 && (
            <div className={styles.specsList}>
              <h3 className={styles.specsHeading}>Specs</h3>
              {Object.entries(specs).map(([key, value]) => (
                <div key={key} className={styles.specRow}>
                  <span className={styles.specKey}>{key}</span>
                  <span className={styles.specValue}>{value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Main Page ── */
export function PastWorks() {
  const [works, setWorks] = useState<PastWork[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<PastWork | null>(null);

  useEffect(() => {
    supabase
      .from('past_works')
      .select('*')
      .eq('visible', true)
      .order('display_order', { ascending: true })
      .returns<PastWork[]>()
      .then(({ data }) => {
        if (data) setWorks(data);
        setLoading(false);
      });
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selected) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [selected]);

  if (loading) {
    return <div style={{ minHeight: '60vh' }} />;
  }

  return (
    <motion.div variants={pageTransition} initial="initial" animate="animate" exit="exit">
      <div className={styles.page}>

        {/* Hero */}
        <motion.header className={styles.hero} variants={fadeUp} initial="hidden" animate="visible">
          <h1 className={styles.heroTitle}>Past Works</h1>
          <p className={styles.heroSubtitle}>A collection of builds completed with care.</p>
        </motion.header>

        {/* Grid */}
        {works.length === 0 ? (
          <div className={styles.empty}>
            <p>No builds to show yet — check back soon.</p>
          </div>
        ) : (
          <motion.div
            className={styles.grid}
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {works.map((work) => (
              <motion.button
                key={work.id}
                className={styles.card}
                variants={staggerItem}
                onClick={() => setSelected(work)}
              >
                <div className={styles.cardImage}>
                  {work.cover_image ? (
                    <img src={work.cover_image} alt={work.title} loading="lazy" />
                  ) : (
                    <div className={styles.cardPlaceholder}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                        style={{ color: 'var(--muted-foreground)', opacity: 0.3 }}>
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                        <path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M8 12h.01M12 12h.01M16 12h.01M6 16h8" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className={styles.cardBody}>
                  <h3 className={styles.cardTitle}>{work.title}</h3>
                  {work.tags.length > 0 && (
                    <div className={styles.cardTags}>
                      {work.tags.slice(0, 3).map((tag, i) => (
                        <span key={i} className={styles.tag}>{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* Detail Modal */}
        <AnimatePresence>
          {selected && (
            <WorkDetail work={selected} onClose={() => setSelected(null)} />
          )}
        </AnimatePresence>

      </div>
    </motion.div>
  );
}
