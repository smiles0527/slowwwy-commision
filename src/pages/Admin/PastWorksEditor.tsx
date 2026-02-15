import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { PastWork } from '@/lib/database.types';
import styles from './PastWorksEditor.module.css';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function PastWorksEditor() {
  const [works, setWorks] = useState<PastWork[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<PastWork | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [specsJson, setSpecsJson] = useState('{}');
  const [tagsInput, setTagsInput] = useState('');
  const [visible, setVisible] = useState(true);
  const [completedAt, setCompletedAt] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState('');
  const [extraFiles, setExtraFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  const fetchWorks = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('past_works')
      .select('*')
      .order('display_order', { ascending: true })
      .returns<PastWork[]>();

    if (error) {
      setError('Failed to load past works');
      console.error(error);
    } else {
      setWorks(data ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchWorks();
  }, [fetchWorks]);

  const flash = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 3000);
  };

  const clearForm = () => {
    setTitle('');
    setSlug('');
    setDescription('');
    setSpecsJson('{}');
    setTagsInput('');
    setVisible(true);
    setCompletedAt('');
    setDisplayOrder(works.length);
    setCoverFile(null);
    setCoverPreview('');
    setExtraFiles([]);
    setExistingImages([]);
    setEditing(null);
    setShowForm(false);
    setError('');
  };

  const uploadImage = async (file: File, folder: string): Promise<string> => {
    const ext = file.name.split('.').pop();
    const name = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error } = await supabase.storage.from('past-works').upload(name, file, {
      cacheControl: '3600',
      upsert: false,
    });
    if (error) throw error;

    const { data } = supabase.storage.from('past-works').getPublicUrl(name);
    return data.publicUrl;
  };

  const deleteStorageImage = async (url: string) => {
    const match = url.match(/\/storage\/v1\/object\/public\/past-works\/(.+)$/);
    if (match) {
      await supabase.storage.from('past-works').remove([match[1]]);
    }
  };

  const handleAdd = () => {
    setEditing(null);
    setTitle('');
    setSlug('');
    setDescription('');
    setSpecsJson('{\n  "keyboard": "",\n  "switches": "",\n  "keycaps": "",\n  "plate": "",\n  "mods": ""\n}');
    setTagsInput('');
    setVisible(true);
    setCompletedAt('');
    setDisplayOrder(works.length);
    setCoverFile(null);
    setCoverPreview('');
    setExtraFiles([]);
    setExistingImages([]);
    setShowForm(true);
    setError('');
  };

  const handleEdit = (work: PastWork) => {
    setEditing(work);
    setTitle(work.title);
    setSlug(work.slug);
    setDescription(work.description);
    setSpecsJson(JSON.stringify(work.specs ?? {}, null, 2));
    setTagsInput((work.tags ?? []).join(', '));
    setVisible(work.visible);
    setCompletedAt(work.completed_at ?? '');
    setDisplayOrder(work.display_order);
    setCoverFile(null);
    setCoverPreview(work.cover_image);
    setExtraFiles([]);
    setExistingImages((work.images ?? []) as string[]);
    setShowForm(true);
    setError('');
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setCoverFile(f);
    setCoverPreview(URL.createObjectURL(f));
  };

  const handleExtraFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setExtraFiles((prev) => [...prev, ...Array.from(files)]);
  };

  const removeExistingImage = (idx: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const removeExtraFile = (idx: number) => {
    setExtraFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    let specs: Record<string, string>;
    try {
      specs = JSON.parse(specsJson);
    } catch {
      setError('Invalid specs JSON');
      return;
    }

    const finalSlug = slug.trim() || slugify(title);
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    setSaving(true);
    try {
      // Cover image
      let coverUrl = editing?.cover_image ?? '';
      if (coverFile) {
        if (editing?.cover_image) await deleteStorageImage(editing.cover_image);
        coverUrl = await uploadImage(coverFile, 'covers');
      }

      // Upload new extra images
      const newImageUrls: string[] = [];
      for (const file of extraFiles) {
        const url = await uploadImage(file, 'gallery');
        newImageUrls.push(url);
      }

      // Delete removed existing images from storage
      if (editing) {
        const oldImages = (editing.images ?? []) as string[];
        for (const url of oldImages) {
          if (!existingImages.includes(url)) {
            await deleteStorageImage(url);
          }
        }
      }

      const allImages = [...existingImages, ...newImageUrls];

      const payload = {
        title: title.trim(),
        slug: finalSlug,
        description: description.trim(),
        cover_image: coverUrl,
        images: allImages,
        specs,
        tags,
        visible,
        display_order: displayOrder,
        completed_at: completedAt || null,
      };

      if (editing) {
        const { error } = await supabase
          .from('past_works')
          .update(payload as any)
          .eq('id', editing.id);
        if (error) throw error;
        flash('Work updated');
      } else {
        const { error } = await supabase
          .from('past_works')
          .insert(payload as any);
        if (error) throw error;
        flash('Work added');
      }

      clearForm();
      await fetchWorks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (work: PastWork) => {
    if (!confirm(`Delete "${work.title}"?`)) return;

    try {
      // Clean up storage
      if (work.cover_image) await deleteStorageImage(work.cover_image);
      for (const url of ((work.images ?? []) as string[])) {
        await deleteStorageImage(url);
      }

      const { error } = await supabase
        .from('past_works')
        .delete()
        .eq('id', work.id);
      if (error) throw error;

      flash('Work deleted');
      await fetchWorks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  const moveOrder = async (work: PastWork, direction: -1 | 1) => {
    const idx = works.findIndex((w) => w.id === work.id);
    const swapIdx = idx + direction;
    if (swapIdx < 0 || swapIdx >= works.length) return;
    const other = works[swapIdx];

    await Promise.all([
      supabase
        .from('past_works')
        .update({ display_order: other.display_order } as any)
        .eq('id', work.id),
      supabase
        .from('past_works')
        .update({ display_order: work.display_order } as any)
        .eq('id', other.id),
    ]);

    await fetchWorks();
  };

  if (loading) {
    return <div className={styles.loading}>Loading past works...</div>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Past Works</h1>
          <p className={styles.subtitle}>
            Manage your portfolio of completed keyboard builds.
          </p>
        </div>
        {!showForm && (
          <button className={styles.addBtn} onClick={handleAdd}>
            + Add Build
          </button>
        )}
      </div>

      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>{success}</div>}

      {showForm && (
        <form className={styles.form} onSubmit={handleSubmit}>
          <h2 className={styles.formTitle}>
            {editing ? 'Edit Build' : 'New Build'}
          </h2>

          {/* Title & Slug */}
          <div className={styles.formRow}>
            <div className={styles.field}>
              <label className={styles.label}>Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (!editing) setSlug(slugify(e.target.value));
                }}
                className={styles.input}
                placeholder="e.g. Iron165 Build"
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Slug</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className={styles.input}
                placeholder="auto-generated"
              />
            </div>
          </div>

          {/* Description */}
          <div className={styles.field}>
            <label className={styles.label}>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={styles.textarea}
              rows={4}
              placeholder="Details about this build..."
            />
          </div>

          {/* Cover Image */}
          <div className={styles.field}>
            <label className={styles.label}>Cover Image</label>
            {coverPreview && (
              <img src={coverPreview} alt="Cover preview" className={styles.preview} />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverChange}
              className={styles.fileInput}
            />
            {editing && !coverFile && coverPreview && (
              <p className={styles.hint}>Leave empty to keep current cover</p>
            )}
          </div>

          {/* Additional Images */}
          <div className={styles.field}>
            <label className={styles.label}>Additional Images</label>

            {/* Existing images */}
            {existingImages.length > 0 && (
              <div className={styles.imageList}>
                {existingImages.map((url, i) => (
                  <div key={i} className={styles.imageThumb}>
                    <img src={url} alt={`Image ${i + 1}`} />
                    <button
                      type="button"
                      className={styles.removeThumb}
                      onClick={() => removeExistingImage(i)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* New files to upload */}
            {extraFiles.length > 0 && (
              <div className={styles.imageList}>
                {extraFiles.map((f, i) => (
                  <div key={i} className={styles.imageThumb}>
                    <img src={URL.createObjectURL(f)} alt={f.name} />
                    <button
                      type="button"
                      className={styles.removeThumb}
                      onClick={() => removeExtraFile(i)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleExtraFiles}
              className={styles.fileInput}
            />
          </div>

          {/* Specs JSON */}
          <div className={styles.field}>
            <label className={styles.label}>Specs (JSON)</label>
            <textarea
              value={specsJson}
              onChange={(e) => setSpecsJson(e.target.value)}
              className={styles.jsonEditor}
              rows={8}
              spellCheck={false}
            />
            <p className={styles.hint}>
              Key-value pairs, e.g. {`{ "keyboard": "Iron165", "switches": "Gateron Oil King" }`}
            </p>
          </div>

          {/* Tags, Date, Visible, Order */}
          <div className={styles.formRow}>
            <div className={styles.field}>
              <label className={styles.label}>Tags (comma-separated)</label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className={styles.input}
                placeholder="e.g. 65%, lubed, commission"
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Completed Date</label>
              <input
                type="date"
                value={completedAt}
                onChange={(e) => setCompletedAt(e.target.value)}
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.field}>
              <label className={styles.label}>Visible</label>
              <select
                value={visible ? 'yes' : 'no'}
                onChange={(e) => setVisible(e.target.value === 'yes')}
                className={styles.select}
              >
                <option value="yes">Yes — shown on page</option>
                <option value="no">No — hidden (draft)</option>
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Display Order</label>
              <input
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(+e.target.value)}
                className={styles.input}
              />
            </div>
          </div>

          {/* Actions */}
          <div className={styles.formActions}>
            <button type="button" className={styles.cancelBtn} onClick={clearForm}>
              Cancel
            </button>
            <button type="submit" className={styles.saveBtn} disabled={saving}>
              {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      )}

      {/* Works List */}
      <div className={styles.list}>
        {works.map((work, idx) => (
          <div
            key={work.id}
            className={`${styles.card} ${!work.visible ? styles.cardHidden : ''}`}
          >
            <div className={styles.cardLeft}>
              {work.cover_image ? (
                <img src={work.cover_image} alt={work.title} className={styles.cardThumb} />
              ) : (
                <div className={styles.cardThumbEmpty} />
              )}
              <div className={styles.cardInfo}>
                <span className={styles.cardTitle}>{work.title}</span>
                <span className={styles.cardMeta}>
                  {work.tags?.length ? work.tags.join(', ') : 'No tags'}
                  {!work.visible && <span className={styles.hiddenBadge}>Hidden</span>}
                </span>
              </div>
            </div>
            <div className={styles.cardActions}>
              <button
                className={styles.orderBtn}
                onClick={() => moveOrder(work, -1)}
                disabled={idx === 0}
              >
                ↑
              </button>
              <button
                className={styles.orderBtn}
                onClick={() => moveOrder(work, 1)}
                disabled={idx === works.length - 1}
              >
                ↓
              </button>
              <button className={styles.editBtn} onClick={() => handleEdit(work)}>
                Edit
              </button>
              <button className={styles.deleteBtn} onClick={() => handleDelete(work)}>
                Delete
              </button>
            </div>
          </div>
        ))}
        {works.length === 0 && (
          <p className={styles.emptyList}>No builds yet. Click "+ Add Build" to get started.</p>
        )}
      </div>
    </div>
  );
}
