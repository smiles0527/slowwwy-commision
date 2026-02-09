import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { pageTransition, fadeUp, staggerContainer, staggerItem } from '@animations/variants';
import { supabase } from '@/lib/supabase';
import type { CommissionSection } from '@/lib/database.types';
import styles from './Commission.module.css';

/* ── Typed content shapes ── */
interface StatusContent { status: string; note: string }
interface IntroContent { text: string }
interface ServicesContent { items: string[] }
interface PricingTier { label: string; price: string }
interface PricingContent { note: string; tiers: PricingTier[]; extras: PricingTier[] }
interface StepItem { step: number; title: string; description: string }
interface StepsContent { items: StepItem[] }
interface FAQItem { question: string; answer: string }
interface FAQContent { items: FAQItem[] }
interface LinksContent { form_url: string; form_label: string; note: string }

/* ── FAQ Accordion ── */
function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  return (
    <div className={styles.faqList}>
      {items.map((item, i) => (
        <div key={i} className={styles.faqItem}>
          <button
            className={`${styles.faqQuestion} ${openIdx === i ? styles.faqOpen : ''}`}
            onClick={() => setOpenIdx(openIdx === i ? null : i)}
          >
            <span>{item.question}</span>
            <span className={styles.faqIcon}>{openIdx === i ? '−' : '+'}</span>
          </button>
          {openIdx === i && (
            <motion.div
              className={styles.faqAnswer}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.2 }}
            >
              {item.answer}
            </motion.div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ── Section renderers ── */
function StatusBlock({ section }: { section: CommissionSection }) {
  const c = section.content as unknown as StatusContent;
  const isOpen = c.status?.toLowerCase() === 'open';
  return (
    <div className={styles.statusBar}>
      <span className={`${styles.statusDot} ${isOpen ? styles.statusOpen : styles.statusClosed}`} />
      <span className={styles.statusLabel}>
        {section.title}: <strong>{c.status}</strong>
      </span>
      {c.note && <span className={styles.statusNote}>{c.note}</span>}
    </div>
  );
}

function IntroBlock({ section }: { section: CommissionSection }) {
  const c = section.content as unknown as IntroContent;
  return (
    <div className={styles.block}>
      <h2 className={styles.blockTitle}>{section.title}</h2>
      <p className={styles.introText}>{c.text}</p>
    </div>
  );
}

function ServicesBlock({ section }: { section: CommissionSection }) {
  const c = section.content as unknown as ServicesContent;
  return (
    <div className={styles.block}>
      <h2 className={styles.blockTitle}>{section.title}</h2>
      <ul className={styles.servicesList}>
        {c.items?.map((item, i) => <li key={i}>{item}</li>)}
      </ul>
    </div>
  );
}

function PricingBlock({ section }: { section: CommissionSection }) {
  const c = section.content as unknown as PricingContent;
  return (
    <div className={styles.block}>
      <h2 className={styles.blockTitle}>{section.title}</h2>
      {c.note && <p className={styles.pricingNote}>{c.note}</p>}
      <div className={styles.pricingGroup}>
        <h3 className={styles.pricingSubhead}>Assembly</h3>
        <div className={styles.pricingGrid}>
          {c.tiers?.map((t, i) => (
            <div key={i} className={styles.pricingCard}>
              <span className={styles.pricingLabel}>{t.label}</span>
              <span className={styles.pricingPrice}>{t.price}</span>
            </div>
          ))}
        </div>
      </div>
      {c.extras?.length > 0 && (
        <div className={styles.pricingGroup}>
          <h3 className={styles.pricingSubhead}>Add-ons &amp; Supplies</h3>
          <div className={styles.pricingGrid}>
            {c.extras.map((e, i) => (
              <div key={i} className={styles.pricingCard}>
                <span className={styles.pricingLabel}>{e.label}</span>
                <span className={styles.pricingPrice}>{e.price}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StepsBlock({ section }: { section: CommissionSection }) {
  const c = section.content as unknown as StepsContent;
  return (
    <div className={styles.block}>
      <h2 className={styles.blockTitle}>{section.title}</h2>
      <div className={styles.stepsGrid}>
        {c.items?.map((item) => (
          <div key={item.step} className={styles.stepCard}>
            <span className={styles.stepNumber}>{item.step}</span>
            <h3 className={styles.stepTitle}>{item.title}</h3>
            <p className={styles.stepDesc}>{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function FAQBlock({ section }: { section: CommissionSection }) {
  const c = section.content as unknown as FAQContent;
  return (
    <div className={styles.block}>
      <h2 className={styles.blockTitle}>{section.title}</h2>
      <FAQAccordion items={c.items ?? []} />
    </div>
  );
}

function LinksBlock({ section }: { section: CommissionSection }) {
  const c = section.content as unknown as LinksContent;
  if (!c.form_url) return null;
  return (
    <div className={`${styles.block} ${styles.ctaBlock}`}>
      {c.note && <p className={styles.ctaNote}>{c.note}</p>}
      <a href={c.form_url} target="_blank" rel="noopener noreferrer" className={styles.ctaButton}>
        {c.form_label || 'Request a Commission'}
      </a>
    </div>
  );
}

const RENDERERS: Record<string, React.FC<{ section: CommissionSection }>> = {
  status: StatusBlock,
  intro: IntroBlock,
  services: ServicesBlock,
  pricing: PricingBlock,
  steps: StepsBlock,
  faq: FAQBlock,
  links: LinksBlock,
};

/* ── Main Page ── */
export function Commission() {
  const [sections, setSections] = useState<CommissionSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('commission_sections')
      .select('*')
      .eq('visible', true)
      .order('display_order', { ascending: true })
      .returns<CommissionSection[]>()
      .then(({ data }) => {
        if (data) setSections(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div style={{ minHeight: '60vh' }} />;
  }

  return (
    <motion.div variants={pageTransition} initial="initial" animate="animate" exit="exit">
      <div className={`container ${styles.page}`}>
        <motion.div variants={fadeUp} initial="hidden" animate="visible">
          <p className={styles.meta}>Commissions</p>
          <h1 className={styles.pageTitle}>Build Service</h1>
        </motion.div>

        <motion.div
          className={styles.sections}
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {sections.map((section) => {
            const Renderer = RENDERERS[section.section_type];
            if (!Renderer) return null;
            return (
              <motion.div key={section.id} variants={staggerItem}>
                <Renderer section={section} />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </motion.div>
  );
}
