import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { pageTransition, fadeUp, staggerContainer, staggerItem } from '@animations/variants';
import { supabase } from '@/lib/supabase';
import type { GalleryItem } from '@/lib/database.types';
import styles from './Home.module.css';

interface ContentMap {
  hero_meta: string;
  hero_title: string;
  gallery_label: string;
  [key: string]: string;
}

const SIZE_CLASS: Record<string, string> = {
  large: 'galleryItemLarge',
  medium: 'galleryItemMedium',
  small: 'galleryItemSmall',
};

export function Home() {
  const [content, setContent] = useState<ContentMap | null>(null);
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [contentRes, galleryRes] = await Promise.all([
        supabase
          .from('site_content')
          .select('key, value')
          .returns<{ key: string; value: string }[]>(),
        supabase
          .from('gallery_items')
          .select('*')
          .order('display_order', { ascending: true })
          .returns<GalleryItem[]>(),
      ]);

      if (contentRes.data) {
        const map = {} as ContentMap;
        contentRes.data.forEach((row) => (map[row.key] = row.value));
        setContent(map);
      }

      if (galleryRes.data) {
        setItems(galleryRes.data);
      }

      setLoading(false);
    }

    load();
  }, []);

  // Group items by column_index
  const columns: GalleryItem[][] = [[], [], []];
  items.forEach((item) => {
    const col = Math.min(Math.max(item.column_index, 0), 2);
    columns[col].push(item);
  });

  const hasGallery = items.length > 0;

  if (loading || !content) {
    return <div className={styles.loading} />;
  }

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.15 }}
          >
            <p className={styles.heroMeta}>{content.hero_meta}</p>
            <h1 className={styles.heroTitle}>{content.hero_title}</h1>
          </motion.div>

          <motion.div
            className={styles.heroMediaStrip}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.35 }}
          >
            <div className={styles.heroMainImage}>
              <div className={styles.placeholder}>Hero Image</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Gallery ── */}
      <section className={styles.gallery}>
        <div className="container">
          <motion.div
            className={styles.galleryHeader}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <h2 className={styles.galleryTitle}>{content.gallery_label}</h2>
          </motion.div>

          <motion.div
            className={styles.galleryGrid}
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {hasGallery ? (
              columns.map((col, colIdx) => (
                <div key={colIdx} className={styles.galleryColumn}>
                  {col.map((item) => (
                    <motion.div
                      key={item.id}
                      className={`${styles.galleryItem} ${styles[SIZE_CLASS[item.size]] ?? styles.galleryItemMedium}`}
                      variants={staggerItem}
                    >
                      <img
                        src={item.image_url}
                        alt={item.title ?? ''}
                        loading="lazy"
                      />
                    </motion.div>
                  ))}
                </div>
              ))
            ) : (
              <div className={styles.galleryEmpty}>
                <p>No images yet — add some from the admin panel.</p>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}
