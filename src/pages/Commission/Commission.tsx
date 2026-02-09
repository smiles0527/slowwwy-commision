import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { pageTransition, fadeUp } from '@animations/variants';
import { supabase } from '@/lib/supabase';
import styles from './Commission.module.css';

interface ContentMap {
  commission_meta: string;
  commission_title: string;
  commission_description: string;
  [key: string]: string;
}

export function Commission() {
  const [content, setContent] = useState<ContentMap | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('site_content')
      .select('key, value')
      .like('key', 'commission_%')
      .returns<{ key: string; value: string }[]>()
      .then(({ data }) => {
        if (data) {
          const map = {} as ContentMap;
          data.forEach((row) => (map[row.key] = row.value));
          setContent(map);
        }
        setLoading(false);
      });
  }, []);

  if (loading || !content) {
    return <div style={{ minHeight: '60vh' }} />;
  }

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <section className={styles.section}>
        <div className="container">
          <motion.div
            className={styles.content}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            <p className={styles.label}>{content.commission_meta}</p>
            <h1 className={styles.title}>{content.commission_title}</h1>
            <p className={styles.description}>{content.commission_description}</p>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}
