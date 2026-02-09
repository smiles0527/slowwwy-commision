import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { AboutSection } from '@/lib/database.types';
import styles from './CommissionEditor.module.css'; // reuse same admin styles

const TYPE_LABELS: Record<string, string> = {
  hero: 'Hero',
  bio: 'Bio / About Me',
  philosophy: 'Philosophy',
  discord: 'Discord Profiles',
  links: 'Social Links',
};

export function AboutEditor() {
  const [sections, setSections] = useState<AboutSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<AboutSection | null>(null);
  const [jsonDraft, setJsonDraft] = useState('');
  const [titleDraft, setTitleDraft] = useState('');
  const [visibleDraft, setVisibleDraft] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchSections = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('about_sections')
      .select('*')
      .order('display_order', { ascending: true })
      .returns<AboutSection[]>();

    if (error) {
      setError('Failed to load sections');
      console.error(error);
    } else {
      setSections(data ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  const flash = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 3000);
  };

  const startEdit = (section: AboutSection) => {
    setEditing(section);
    setTitleDraft(section.title);
    setVisibleDraft(section.visible);
    setJsonDraft(JSON.stringify(section.content, null, 2));
    setError('');
  };

  const cancelEdit = () => {
    setEditing(null);
    setJsonDraft('');
    setTitleDraft('');
    setError('');
  };

  const handleSave = async () => {
    if (!editing) return;
    setError('');

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(jsonDraft);
    } catch {
      setError('Invalid JSON — please fix the syntax.');
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from('about_sections')
        .update({
          title: titleDraft,
          content: parsed,
          visible: visibleDraft,
        } as any)
        .eq('id', editing.id);

      if (error) throw error;
      flash(`"${TYPE_LABELS[editing.section_type]}" updated`);
      cancelEdit();
      await fetchSections();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const moveOrder = async (section: AboutSection, direction: -1 | 1) => {
    const idx = sections.findIndex((s) => s.id === section.id);
    const swapIdx = idx + direction;
    if (swapIdx < 0 || swapIdx >= sections.length) return;
    const other = sections[swapIdx];

    await Promise.all([
      supabase
        .from('about_sections')
        .update({ display_order: other.display_order } as any)
        .eq('id', section.id),
      supabase
        .from('about_sections')
        .update({ display_order: section.display_order } as any)
        .eq('id', other.id),
    ]);

    await fetchSections();
  };

  if (loading) {
    return <div className={styles.loading}>Loading about sections...</div>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>About Page Editor</h1>
        <p className={styles.subtitle}>
          Edit sections of the About page. Content is stored as JSON.
        </p>
      </div>

      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>{success}</div>}

      {editing && (
        <div className={styles.editPanel}>
          <h2 className={styles.editTitle}>
            Editing: {TYPE_LABELS[editing.section_type]}
          </h2>

          <div className={styles.field}>
            <label className={styles.label}>Section Title</label>
            <input
              type="text"
              value={titleDraft}
              onChange={(e) => setTitleDraft(e.target.value)}
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Visible</label>
            <select
              value={visibleDraft ? 'yes' : 'no'}
              onChange={(e) => setVisibleDraft(e.target.value === 'yes')}
              className={styles.select}
            >
              <option value="yes">Yes — shown on page</option>
              <option value="no">No — hidden</option>
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Content (JSON)</label>
            <textarea
              className={styles.jsonEditor}
              value={jsonDraft}
              onChange={(e) => setJsonDraft(e.target.value)}
              rows={16}
              spellCheck={false}
            />
          </div>

          <AboutContentHelper type={editing.section_type} />

          <div className={styles.editActions}>
            <button className={styles.cancelBtn} onClick={cancelEdit}>
              Cancel
            </button>
            <button
              className={styles.saveBtn}
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      )}

      <div className={styles.list}>
        {sections.map((section, idx) => (
          <div
            key={section.id}
            className={`${styles.card} ${!section.visible ? styles.cardHidden : ''}`}
          >
            <div className={styles.cardBody}>
              <span className={styles.cardType}>
                {TYPE_LABELS[section.section_type] ?? section.section_type}
              </span>
              <span className={styles.cardTitle}>{section.title}</span>
              {!section.visible && <span className={styles.hiddenBadge}>Hidden</span>}
            </div>
            <div className={styles.cardActions}>
              <button
                className={styles.orderBtn}
                onClick={() => moveOrder(section, -1)}
                disabled={idx === 0}
              >
                ↑
              </button>
              <button
                className={styles.orderBtn}
                onClick={() => moveOrder(section, 1)}
                disabled={idx === sections.length - 1}
              >
                ↓
              </button>
              <button className={styles.editBtn} onClick={() => startEdit(section)}>
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Inline helper showing JSON structure for each type ── */
function AboutContentHelper({ type }: { type: string }) {
  const hints: Record<string, string> = {
    hero: '{ "subtitle": "The person behind the builds." }',
    bio: '{ "text": "Your bio...", "image_url": "https://... (optional)", "image_alt": "alt text (optional)" }',
    philosophy: '{ "text": "Your philosophy...", "items": ["Value 1", "Value 2", ...] }',
    discord: '{ "discord_ids": ["123456789012345678"], "discord_invite": "server_id (optional)", "note": "..." }',
    links: '{ "items": [{ "label": "Instagram", "url": "https://..." }, ...] }',
  };

  return (
    <div className={styles.helper}>
      <strong>Expected format:</strong>
      <code>{hints[type] ?? 'JSON object'}</code>
    </div>
  );
}
