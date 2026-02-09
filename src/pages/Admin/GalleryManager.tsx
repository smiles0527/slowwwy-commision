import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { GalleryItem, GalleryItemInsert } from '@/lib/database.types';
import styles from './GalleryManager.module.css';

type EditingItem = GalleryItem | null;

const SIZE_OPTIONS: GalleryItem['size'][] = ['large', 'medium', 'small'];

export function GalleryManager() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState<EditingItem>(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [size, setSize] = useState<GalleryItem['size']>('medium');
  const [columnIndex, setColumnIndex] = useState(0);
  const [displayOrder, setDisplayOrder] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');

  const fetchItems = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('gallery_items')
      .select('*')
      .order('display_order', { ascending: true })
      .returns<GalleryItem[]>();

    if (error) {
      setError('Failed to load gallery items');
      console.error(error);
    } else {
      setItems(data ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const clearForm = () => {
    setTitle('');
    setDescription('');
    setSize('medium');
    setColumnIndex(0);
    setDisplayOrder(items.length);
    setFile(null);
    setPreview('');
    setEditing(null);
    setShowForm(false);
  };

  const flash = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const uploadImage = async (file: File): Promise<string> => {
    const ext = file.name.split('.').pop();
    const name = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const path = `gallery/${name}`;

    const { error } = await supabase.storage.from('gallery').upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    });

    if (error) throw error;

    const { data } = supabase.storage.from('gallery').getPublicUrl(path);
    return data.publicUrl;
  };

  const deleteImage = async (url: string) => {
    // Extract path from public URL
    const match = url.match(/\/storage\/v1\/object\/public\/gallery\/(.+)$/);
    if (match) {
      await supabase.storage.from('gallery').remove([match[1]]);
    }
  };

  const handleAdd = () => {
    setEditing(null);
    setTitle('');
    setDescription('');
    setSize('medium');
    setColumnIndex(0);
    setDisplayOrder(items.length);
    setFile(null);
    setPreview('');
    setShowForm(true);
    setError('');
  };

  const handleEdit = (item: GalleryItem) => {
    setEditing(item);
    setTitle(item.title ?? '');
    setDescription(item.description ?? '');
    setSize(item.size);
    setColumnIndex(item.column_index);
    setDisplayOrder(item.display_order);
    setFile(null);
    setPreview(item.image_url);
    setShowForm(true);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setUploading(true);

    try {
      let imageUrl = editing?.image_url ?? '';

      // Upload new image if selected
      if (file) {
        // Delete old image if replacing
        if (editing?.image_url) {
          await deleteImage(editing.image_url);
        }
        imageUrl = await uploadImage(file);
      }

      if (!imageUrl) {
        setError('Please select an image');
        setUploading(false);
        return;
      }

      const payload: GalleryItemInsert = {
        title: title || null,
        description: description || null,
        image_url: imageUrl,
        size,
        column_index: columnIndex,
        display_order: displayOrder,
      };

      if (editing) {
        const { error } = await supabase
          .from('gallery_items')
          .update(payload as any)
          .eq('id', editing.id);
        if (error) throw error;
        flash('Item updated');
      } else {
        const { error } = await supabase
          .from('gallery_items')
          .insert(payload as any);
        if (error) throw error;
        flash('Item added');
      }

      clearForm();
      await fetchItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (item: GalleryItem) => {
    if (!confirm(`Delete "${item.title || 'Untitled'}"?`)) return;

    try {
      if (item.image_url) await deleteImage(item.image_url);

      const { error } = await supabase
        .from('gallery_items')
        .delete()
        .eq('id', item.id);
      if (error) throw error;

      flash('Item deleted');
      await fetchItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  const moveOrder = async (item: GalleryItem, direction: -1 | 1) => {
    const idx = items.findIndex((i) => i.id === item.id);
    const swapIdx = idx + direction;
    if (swapIdx < 0 || swapIdx >= items.length) return;

    const other = items[swapIdx];

    await Promise.all([
      supabase
        .from('gallery_items')
        .update({ display_order: other.display_order } as any)
        .eq('id', item.id),
      supabase
        .from('gallery_items')
        .update({ display_order: item.display_order } as any)
        .eq('id', other.id),
    ]);

    await fetchItems();
  };

  if (loading) {
    return <div className={styles.loading}>Loading gallery...</div>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Gallery Manager</h1>
        {!showForm && (
          <button className={styles.addBtn} onClick={handleAdd}>
            + Add Image
          </button>
        )}
      </div>

      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>{success}</div>}

      {showForm && (
        <form className={styles.form} onSubmit={handleSubmit}>
          <h2 className={styles.formTitle}>
            {editing ? 'Edit Image' : 'Add New Image'}
          </h2>

          <div className={styles.formGrid}>
            <div className={styles.imageSection}>
              <label className={styles.label}>Image</label>
              {preview && (
                <img src={preview} alt="Preview" className={styles.preview} />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className={styles.fileInput}
              />
              {editing && !file && (
                <p className={styles.hint}>Leave empty to keep current image</p>
              )}
            </div>

            <div className={styles.fieldsSection}>
              <div className={styles.field}>
                <label className={styles.label}>Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={styles.input}
                  placeholder="Optional title"
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={styles.textarea}
                  placeholder="Optional description"
                  rows={3}
                />
              </div>

              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label className={styles.label}>Size</label>
                  <select
                    value={size}
                    onChange={(e) => setSize(e.target.value as GalleryItem['size'])}
                    className={styles.select}
                  >
                    {SIZE_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Column (0-2)</label>
                  <select
                    value={columnIndex}
                    onChange={(e) => setColumnIndex(Number(e.target.value))}
                    className={styles.select}
                  >
                    <option value={0}>Column 1</option>
                    <option value={1}>Column 2</option>
                    <option value={2}>Column 3</option>
                  </select>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Order</label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(Number(e.target.value))}
                    className={styles.input}
                    min={0}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={styles.formActions}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={clearForm}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={uploading}
            >
              {uploading ? 'Saving...' : editing ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      )}

      {items.length === 0 && !showForm ? (
        <div className={styles.empty}>
          <p>No gallery items yet.</p>
          <p>Click "Add Image" to get started.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {items.map((item, idx) => (
            <div key={item.id} className={styles.card}>
              <div className={styles.cardImage}>
                <img src={item.image_url} alt={item.title ?? ''} />
              </div>
              <div className={styles.cardBody}>
                <span className={styles.cardTitle}>
                  {item.title || 'Untitled'}
                </span>
                <div className={styles.cardMeta}>
                  <span className={styles.tag}>{item.size}</span>
                  <span className={styles.tag}>Col {item.column_index + 1}</span>
                  <span className={styles.tag}>#{item.display_order}</span>
                </div>
              </div>
              <div className={styles.cardActions}>
                <button
                  className={styles.orderBtn}
                  onClick={() => moveOrder(item, -1)}
                  disabled={idx === 0}
                  title="Move up"
                >
                  ↑
                </button>
                <button
                  className={styles.orderBtn}
                  onClick={() => moveOrder(item, 1)}
                  disabled={idx === items.length - 1}
                  title="Move down"
                >
                  ↓
                </button>
                <button
                  className={styles.editBtn}
                  onClick={() => handleEdit(item)}
                >
                  Edit
                </button>
                <button
                  className={styles.deleteBtn}
                  onClick={() => handleDelete(item)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
