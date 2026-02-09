import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { pageTransition, fadeUp, staggerContainer, staggerItem } from '@animations/variants';
import { supabase } from '@/lib/supabase';
import type { CommissionSection } from '@/lib/database.types';
import styles from './Commission.module.css';

/* ── Typed content shapes ── */
interface StatusContent { status: string; note: string }
interface IntroContent { text: string; image_url?: string; image_alt?: string }
interface ServicesContent { items: string[] }
interface PricingTier { label: string; price: string }
interface PricingContent { note: string; shipping_note?: string; tiers: PricingTier[]; extras: PricingTier[] }
interface StepItem { step: number; title: string; description: string }
interface StepsContent { items: StepItem[] }
interface FAQItem { question: string; answer: string }
interface FAQContent { items: FAQItem[] }
interface LinksContent { form_url: string; form_label: string; note: string }

/* ── Helpers ── */
function findByType(sections: CommissionSection[], type: string) {
  return sections.find((s) => s.section_type === type) ?? null;
}

/* ── FAQ Accordion ── */
function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  return (
    <div className={styles.faqList}>
      {items.map((item, i) => (
        <div key={i} className={styles.faqItem}>
          <button
            className={styles.faqQuestion}
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

/* ── Check icon ── */
function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--muted-foreground)' }}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

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

  const status = findByType(sections, 'status');
  const intro = findByType(sections, 'intro');
  const services = findByType(sections, 'services');
  const pricing = findByType(sections, 'pricing');
  const steps = findByType(sections, 'steps');
  const faq = findByType(sections, 'faq');
  const links = findByType(sections, 'links');

  const statusC = status?.content as unknown as StatusContent | undefined;
  const introC = intro?.content as unknown as IntroContent | undefined;
  const servicesC = services?.content as unknown as ServicesContent | undefined;
  const pricingC = pricing?.content as unknown as PricingContent | undefined;
  const stepsC = steps?.content as unknown as StepsContent | undefined;
  const faqC = faq?.content as unknown as FAQContent | undefined;
  const linksC = links?.content as unknown as LinksContent | undefined;

  const isOpen = statusC?.status?.toLowerCase() === 'open';

  return (
    <motion.div variants={pageTransition} initial="initial" animate="animate" exit="exit">
      <div className={styles.page}>

        {/* ── Hero ── */}
        {status && (
          <motion.header className={styles.hero} variants={fadeUp} initial="hidden" animate="visible">
            <div className={styles.statusBadge}>
              <span className={`${styles.statusDot} ${isOpen ? styles.statusOpen : styles.statusClosed}`} />
              <span>{status.title}: {statusC?.status}</span>
            </div>
            <h1 className={styles.heroTitle}>Commission</h1>
            {statusC?.note && <p className={styles.heroSubtitle}>{statusC.note}</p>}
          </motion.header>
        )}

        {/* ── About & Services ── */}
        {(intro || services) && (
          <motion.section
            className={styles.section}
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <div className={styles.grid2col}>
              {/* Left — About */}
              {intro && (
                <motion.div className={styles.textBlock} variants={staggerItem}>
                  <span className={styles.sectionLabel}>About</span>
                  <h2 className={styles.sectionTitle}>{intro.title}</h2>
                  <p className={styles.textParagraph}>{introC?.text}</p>
                  {introC?.image_url && (
                    <div className={styles.introImage}>
                      <img
                        src={introC.image_url}
                        alt={introC.image_alt || 'Build process'}
                        loading="lazy"
                      />
                    </div>
                  )}
                </motion.div>
              )}

              {/* Right — Services */}
              {services && (
                <motion.div className={styles.listBlock} variants={staggerItem}>
                  <span className={styles.sectionLabel}>Services</span>
                  <h2 className={styles.sectionTitle}>{services.title}</h2>
                  <ul>
                    {servicesC?.items?.map((item, i) => (
                      <li key={i}>
                        <span>{item}</span>
                        <CheckIcon />
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </div>
          </motion.section>
        )}

        {/* ── Pricing ── */}
        {pricing && (
          <motion.section className={styles.section} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionLabel}>Rates</span>
              <h2 className={styles.sectionTitle}>{pricing.title}</h2>
              {pricingC?.note && <p className={styles.sectionNote}>{pricingC.note}</p>}
            </div>

            <div className={styles.pricingGrid}>
              {/* Assembly column */}
              <div>
                <h3 className={styles.pricingCategoryTitle}>Assembly</h3>
                {pricingC?.tiers?.map((t, i) => (
                  <div key={i} className={styles.priceRow}>
                    <span>{t.label}</span>
                    <span>{t.price}</span>
                  </div>
                ))}
              </div>

              {/* Add-ons column */}
              <div>
                <h3 className={styles.pricingCategoryTitle}>Add-ons &amp; Supplies</h3>
                {pricingC?.extras?.map((e, i) => (
                  <div key={i} className={styles.priceRow}>
                    <span>{e.label}</span>
                    <span>{e.price}</span>
                  </div>
                ))}
                {pricingC?.shipping_note && (
                  <div className={styles.pricingCallout}>
                    <p><strong>Note:</strong> {pricingC.shipping_note}</p>
                  </div>
                )}
              </div>
            </div>
          </motion.section>
        )}

        {/* ── Process + Form ── */}
        {steps && (
          <motion.section className={styles.section} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionLabel}>Process</span>
              <h2 className={styles.sectionTitle}>{steps.title}</h2>
            </div>

            <div className={styles.processGrid}>
              {stepsC?.items?.map((item) => (
                <div key={item.step} className={styles.processStep}>
                  <div className={styles.stepNumber}>{item.step}</div>
                  <h3 className={styles.stepTitle}>{item.title}</h3>
                  <p className={styles.stepDesc}>{item.description}</p>
                </div>
              ))}
            </div>

            {/* Commission Request Form */}
            {links && (
              <div className={styles.formContainer}>
                <h3 className={styles.formTitle}>Commission Request Form</h3>
                {linksC?.form_url ? (
                  <div className={styles.formCta}>
                    {linksC.note && <p className={styles.formNote}>{linksC.note}</p>}
                    <a
                      href={linksC.form_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.btnSubmit}
                    >
                      {linksC.form_label || 'Submit Request'}
                    </a>
                  </div>
                ) : (
                  <>
                    <div className={styles.formGrid}>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Name</label>
                        <div className={styles.formInput}>Your Name</div>
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Email</label>
                        <div className={styles.formInput}>email@example.com</div>
                      </div>
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Project Details</label>
                      <div className={`${styles.formInput} ${styles.formTextarea}`}>
                        Tell me about your build...
                      </div>
                    </div>
                    <button className={styles.btnSubmit} disabled>Submit Request</button>
                    <p className={styles.formPlaceholderNote}>
                      Form coming soon — reach out via Discord or Instagram in the meantime.
                    </p>
                  </>
                )}
              </div>
            )}
          </motion.section>
        )}

        {/* ── FAQ ── */}
        {faq && (
          <motion.section className={styles.section} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionLabel}>Help</span>
              <h2 className={styles.sectionTitle}>{faq.title}</h2>
            </div>
            <FAQAccordion items={faqC?.items ?? []} />
          </motion.section>
        )}

      </div>
    </motion.div>
  );
}
