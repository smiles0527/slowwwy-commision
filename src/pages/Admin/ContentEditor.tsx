import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { SiteContent } from '@/lib/database.types';
import styles from './ContentEditor.module.css';

const CONTENT_LABELS: Record<string, { label: string; hint: string; multiline?: boolean }> = {
  hero_meta: { label: 'Hero Meta Label', hint: 'Small text above the title (e.g. "Keyboards")' },
  hero_title: { label: 'Hero Title', hint: 'Main hero heading' },
  gallery_label: { label: 'Gallery Section Label', hint: 'Label above the gallery grid' },
  commission_meta: { label: 'Commission Meta Label', hint: 'Small text on commission page' },
  commission_title: { label: 'Commission Title', hint: 'Commission page heading' },
  commission_description: {
    label: 'Commission Description',
    hint: 'Commission page description text',
    multiline: true,
  },
};

export function ContentEditor() {
  const [items, setItems] = useState<SiteContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchContent = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('site_content')
      .select('*')
      .order('key')
      .returns<SiteContent[]>();

    if (error) {
      setError('Failed to load content');
      console.error(error);
    } else {
      setItems(data ?? []);
      const d: Record<string, string> = {};
      data?.forEach((item) => {
        d[item.key] = item.value;
      });
      setDrafts(d);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const flash = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleChange = (key: string, value: string) => {
    setDrafts((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (item: SiteContent) => {
    const newValue = drafts[item.key];
    if (newValue === item.value) return; // No change

    setSaving(item.key);
    setError('');

    try {
      const { error } = await supabase
        .from('site_content')
        .update({ value: newValue } as any)
        .eq('id', item.id);

      if (error) throw error;

      flash(`"${CONTENT_LABELS[item.key]?.label ?? item.key}" updated`);
      await fetchContent();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(null);
    }
  };

  const isDirty = (item: SiteContent) => drafts[item.key] !== item.value;

  if (loading) {
    return <div className={styles.loading}>Loading content...</div>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Content Editor</h1>
        <p className={styles.subtitle}>
          Edit your website copy. Changes appear instantly after saving.
        </p>
      </div>

      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>{success}</div>}

      <div className={styles.list}>
        {items.map((item) => {
          const meta = CONTENT_LABELS[item.key];
          return (
            <div key={item.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <label className={styles.label}>
                  {meta?.label ?? item.key}
                </label>
                {meta?.hint && (
                  <span className={styles.hint}>{meta.hint}</span>
                )}
              </div>

              {meta?.multiline ? (
                <textarea
                  className={styles.textarea}
                  value={drafts[item.key] ?? ''}
                  onChange={(e) => handleChange(item.key, e.target.value)}
                  rows={4}
                />
              ) : (
                <input
                  type="text"
                  className={styles.input}
                  value={drafts[item.key] ?? ''}
                  onChange={(e) => handleChange(item.key, e.target.value)}
                />
              )}

              <div className={styles.cardFooter}>
                <span className={styles.key}>key: {item.key}</span>
                {isDirty(item) && (
                  <button
                    className={styles.saveBtn}
                    onClick={() => handleSave(item)}
                    disabled={saving === item.key}
                  >
                    {saving === item.key ? 'Saving...' : 'Save'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
