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
  const [content, setContent] = useState<ContentMap>({
    hero_meta: 'Keyboards',
    hero_title: "Slowwwy's commission",
    gallery_label: 'Gallery',
  });
  const [items, setItems] = useState<GalleryItem[]>([]);

  useEffect(() => {
    // Fetch site content
    supabase
      .from('site_content')
      .select('key, value')
      .returns<{ key: string; value: string }[]>()
      .then(({ data }) => {
        if (data) {
          const map: Record<string, string> = {};
          data.forEach((row) => (map[row.key] = row.value));
          setContent((prev) => ({ ...prev, ...map }));
        }
      });

    // Fetch gallery items
    supabase
      .from('gallery_items')
      .select('*')
      .order('display_order', { ascending: true })
      .returns<GalleryItem[]>()
      .then(({ data }) => {
        if (data) setItems(data);
      });
  }, []);

  // Group items by column_index
  const columns: GalleryItem[][] = [[], [], []];
  items.forEach((item) => {
    const col = Math.min(Math.max(item.column_index, 0), 2);
    columns[col].push(item);
  });

  const hasGallery = items.length > 0;

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
              <>
                {/* Placeholders when no Supabase data */}
                <div className={styles.galleryColumn}>
                  <motion.div className={`${styles.galleryItem} ${styles.galleryItemLarge}`} variants={staggerItem}>
                    <div className={styles.placeholder}>Board 01</div>
                  </motion.div>
                  <motion.div className={`${styles.galleryItem} ${styles.galleryItemSmall}`} variants={staggerItem}>
                    <div className={styles.placeholder}>Board 02</div>
                  </motion.div>
                </div>
                <div className={styles.galleryColumn}>
                  <motion.div className={`${styles.galleryItem} ${styles.galleryItemMedium}`} variants={staggerItem}>
                    <div className={styles.placeholder}>Board 03</div>
                  </motion.div>
                  <motion.div className={`${styles.galleryItem} ${styles.galleryItemMedium}`} variants={staggerItem}>
                    <div className={styles.placeholder}>Board 04</div>
                  </motion.div>
                </div>
                <div className={styles.galleryColumn}>
                  <motion.div className={`${styles.galleryItem} ${styles.galleryItemSmall}`} variants={staggerItem}>
                    <div className={styles.placeholder}>Board 05</div>
                  </motion.div>
                  <motion.div className={`${styles.galleryItem} ${styles.galleryItemLarge}`} variants={staggerItem}>
                    <div className={styles.placeholder}>Board 06</div>
                  </motion.div>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}
