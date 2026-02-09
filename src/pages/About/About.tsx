import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { pageTransition, fadeUp, staggerContainer, staggerItem } from '@animations/variants';
import { supabase } from '@/lib/supabase';
import type { AboutSection } from '@/lib/database.types';
import styles from './About.module.css';

/* ── Typed content shapes ── */
interface HeroContent { subtitle: string }
interface BioContent { text: string; image_url?: string; image_alt?: string }
interface PhilosophyContent { text: string; items?: string[] }
interface DiscordContent { discord_ids: string[]; discord_invite?: string; note?: string }
interface LinkItem { label: string; url: string }
interface LinksContent { items: LinkItem[] }

/* ── Helpers ── */
function findByType(sections: AboutSection[], type: string) {
  return sections.find((s) => s.section_type === type) ?? null;
}

/* ── Discord Profile Card (lanyard) ── */
function DiscordProfile({ userId }: { userId: string }) {
  return (
    <div className={styles.discordCard}>
      <img
        src={`https://lanyard.cnrad.dev/api/${userId}`}
        alt="Discord profile"
        className={styles.discordWidget}
        loading="lazy"
      />
    </div>
  );
}

/* ── Main Page ── */
export function About() {
  const [sections, setSections] = useState<AboutSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('about_sections')
      .select('*')
      .eq('visible', true)
      .order('display_order', { ascending: true })
      .returns<AboutSection[]>()
      .then(({ data }) => {
        if (data) setSections(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div style={{ minHeight: '60vh' }} />;
  }

  const hero = findByType(sections, 'hero');
  const bio = findByType(sections, 'bio');
  const philosophy = findByType(sections, 'philosophy');
  const discord = findByType(sections, 'discord');
  const links = findByType(sections, 'links');

  const heroC = hero?.content as unknown as HeroContent | undefined;
  const bioC = bio?.content as unknown as BioContent | undefined;
  const philC = philosophy?.content as unknown as PhilosophyContent | undefined;
  const discordC = discord?.content as unknown as DiscordContent | undefined;
  const linksC = links?.content as unknown as LinksContent | undefined;

  return (
    <motion.div variants={pageTransition} initial="initial" animate="animate" exit="exit">
      <div className={styles.page}>

        {/* ── Hero ── */}
        {hero && (
          <motion.header className={styles.hero} variants={fadeUp} initial="hidden" animate="visible">
            <h1 className={styles.heroTitle}>{hero.title}</h1>
            {heroC?.subtitle && <p className={styles.heroSubtitle}>{heroC.subtitle}</p>}
          </motion.header>
        )}

        {/* ── Bio ── */}
        {bio && (
          <motion.section
            className={styles.section}
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <div className={styles.bioGrid}>
              {/* Photo */}
              <motion.div className={styles.bioImageWrap} variants={staggerItem}>
                {bioC?.image_url ? (
                  <img
                    src={bioC.image_url}
                    alt={bioC.image_alt || 'Profile photo'}
                    className={styles.bioImage}
                    loading="lazy"
                  />
                ) : (
                  <div className={styles.bioImagePlaceholder}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                      style={{ color: 'var(--muted-foreground)', opacity: 0.4 }}>
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                )}
              </motion.div>

              {/* Text */}
              <motion.div className={styles.bioText} variants={staggerItem}>
                <span className={styles.sectionLabel}>About</span>
                <h2 className={styles.sectionTitle}>{bio.title}</h2>
                <p>{bioC?.text}</p>
              </motion.div>
            </div>
          </motion.section>
        )}

        {/* ── Philosophy ── */}
        {philosophy && (
          <motion.section className={styles.section} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionLabel}>Philosophy</span>
              <h2 className={styles.sectionTitle}>{philosophy.title}</h2>
            </div>
            <div className={styles.philosophyGrid}>
              <p className={styles.philosophyText}>{philC?.text}</p>
              {philC?.items && philC.items.length > 0 && (
                <ul className={styles.philosophyList}>
                  {philC.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          </motion.section>
        )}

        {/* ── Discord ── */}
        {discord && (
          <motion.section className={styles.section} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionLabel}>Community</span>
              <h2 className={styles.sectionTitle}>{discord.title}</h2>
            </div>
            {discordC?.note && <p className={styles.discordNote}>{discordC.note}</p>}

            {/* Discord profile cards via Lanyard */}
            {discordC?.discord_ids && discordC.discord_ids.length > 0 && (
              <div className={styles.discordGrid}>
                {discordC.discord_ids.map((id) => (
                  <DiscordProfile key={id} userId={id} />
                ))}
              </div>
            )}

            {/* Discord server invite widget */}
            {discordC?.discord_invite && (
              <div className={styles.discordInvite}>
                <iframe
                  src={`https://discord.com/widget?id=${discordC.discord_invite}&theme=light`}
                  width="100%"
                  height="300"
                  sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
                  title="Discord server widget"
                  style={{ border: 'none', borderRadius: 'var(--radius-lg)' }}
                />
              </div>
            )}
          </motion.section>
        )}

        {/* ── Links ── */}
        {links && linksC?.items && linksC.items.some((l) => l.url) && (
          <motion.section className={styles.section} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionLabel}>Connect</span>
              <h2 className={styles.sectionTitle}>{links.title}</h2>
            </div>
            <div className={styles.linksGrid}>
              {linksC.items
                .filter((l) => l.url)
                .map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.linkCard}
                  >
                    <span className={styles.linkLabel}>{link.label}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="7" y1="17" x2="17" y2="7" />
                      <polyline points="7 7 17 7 17 17" />
                    </svg>
                  </a>
                ))}
            </div>
          </motion.section>
        )}

      </div>
    </motion.div>
  );
}
