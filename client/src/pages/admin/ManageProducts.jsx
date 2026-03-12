import { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiUploadCloud } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useGetProductsQuery, useCreateProductMutation, useUpdateProductMutation, useDeleteProductMutation } from '../../api/productApi';
import { useGetCategoriesQuery } from '../../api/categoryApi';
import { useUploadImagesMutation, useDeleteImageMutation } from '../../api/uploadApi';
import { formatPrice, getDiscountPercent } from '../../utils/formatters';
import { PRODUCT_SIZES, ABSORBENCY_LEVELS, MATERIALS } from '../../utils/constants';
import styles from '../../styles/pages/ManageProducts.module.css';

const emptyForm = {
  name: '', description: '', price: '', mrp: '', stock: '',
  category: '', size: 'Regular', absorbency: 'Medium', material: 'Cotton',
  features: '',
};

const ManageProducts = () => {
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [images, setImages] = useState([]); // { url, publicId }
  const [uploading, setUploading] = useState(false);

  const { data: productsData, isLoading } = useGetProductsQuery({ page, limit: 20 });
  const { data: categoriesData } = useGetCategoriesQuery();
  const [createProduct, { isLoading: creating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: updating }] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();
  const [uploadImages] = useUploadImagesMutation();
  const [deleteImage] = useDeleteImageMutation();

  const products = productsData?.data?.products || [];
  const pagination = productsData?.data?.pagination || {};
  const categories = categoriesData?.data || [];

  // Open modal for new product
  const handleAdd = () => {
    setEditingId(null);
    setForm({ ...emptyForm, category: categories[0]?._id || '' });
    setImages([]);
    setShowModal(true);
  };

  // Open modal for editing
  const handleEdit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      mrp: product.mrp,
      stock: product.stock,
      category: product.category?._id || product.category,
      size: product.size,
      absorbency: product.absorbency,
      material: product.material || 'Cotton',
      features: product.features?.join(', ') || '',
    });
    setImages(product.images || []);
    setShowModal(true);
  };

  // Handle image upload to Cloudinary
  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files.length) return;

    if (images.length + files.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => formData.append('images', file));

      const result = await uploadImages(formData).unwrap();
      setImages((prev) => [...prev, ...result.data]);
      toast.success(`${result.data.length} image(s) uploaded`);
    } catch (err) {
      toast.error(err?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  // Remove image
  const handleRemoveImage = async (index) => {
    const img = images[index];
    if (img.publicId) {
      try {
        await deleteImage(img.publicId).unwrap();
      } catch {
        // Continue removing from UI even if Cloudinary delete fails
      }
    }
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (images.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    const payload = {
      ...form,
      price: Number(form.price),
      mrp: Number(form.mrp),
      stock: Number(form.stock),
      features: form.features ? form.features.split(',').map((f) => f.trim()).filter(Boolean) : [],
      images,
    };

    try {
      if (editingId) {
        await updateProduct({ id: editingId, ...payload }).unwrap();
        toast.success('Product updated!');
      } else {
        await createProduct(payload).unwrap();
        toast.success('Product created!');
      }
      setShowModal(false);
      setForm(emptyForm);
      setImages([]);
      setEditingId(null);
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to save product');
    }
  };

  // Delete product
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await deleteProduct(id).unwrap();
      toast.success('Product deleted');
    } catch (err) {
      toast.error(err?.data?.message || 'Delete failed');
    }
  };

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Manage Products</h1>
        <button className={styles.addBtn} onClick={handleAdd} id="add-product-btn">
          <FiPlus size={18} /> Add Product
        </button>
      </div>

      {/* Products Table */}
      <div className={styles.tableWrap}>
        {isLoading ? (
          <div className={styles.empty}>Loading products...</div>
        ) : products.length === 0 ? (
          <div className={styles.empty}>
            No products yet. Click "Add Product" to create your first product.
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Category</th>
                <th>Size</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td>
                    <div className={styles.productCell}>
                      <img
                        src={p.images?.[0]?.url || '/favicon.svg'}
                        alt={p.name}
                        className={styles.productThumb}
                      />
                      <span>{p.name}</span>
                    </div>
                  </td>
                  <td>
                    <strong>{formatPrice(p.price)}</strong>
                    {p.mrp > p.price && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-success)', marginLeft: 6 }}>
                        {getDiscountPercent(p.mrp, p.price)}% off
                      </span>
                    )}
                  </td>
                  <td className={p.stock <= 5 ? styles.stockLow : ''}>
                    {p.stock}
                  </td>
                  <td>{p.category?.name || '—'}</td>
                  <td>{p.size}</td>
                  <td>
                    <span className={`${styles.badge} ${p.isActive ? styles.badgeActive : styles.badgeInactive}`}>
                      {p.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actionBtns}>
                      <button className={styles.editBtn} onClick={() => handleEdit(p)} title="Edit">
                        <FiEdit2 size={15} />
                      </button>
                      <button className={styles.deleteBtn} onClick={() => handleDelete(p._id, p.name)} title="Delete">
                        <FiTrash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 'var(--space-lg)' }}>
          {Array.from({ length: pagination.totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setPage(i + 1)}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-sm)',
                border: page === i + 1 ? 'none' : '1px solid var(--color-border)',
                background: page === i + 1 ? 'var(--color-primary)' : 'var(--color-surface)',
                color: page === i + 1 ? 'white' : 'var(--color-text)',
                cursor: 'pointer',
                fontWeight: 500,
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* ─── Add/Edit Modal ─────────────────── */}
      {showModal && (
        <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>{editingId ? 'Edit Product' : 'Add New Product'}</h2>
              <button className={styles.closeBtn} onClick={() => setShowModal(false)}>
                <FiX size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className={styles.modalBody}>
                <div className={styles.form}>
                  {/* Name */}
                  <div className={styles.field}>
                    <label>Product Name *</label>
                    <input
                      id="product-name" required value={form.name}
                      onChange={handleChange('name')}
                      placeholder="e.g. Ultra Comfort Cotton Pad"
                    />
                  </div>

                  {/* Description */}
                  <div className={styles.field}>
                    <label>Description *</label>
                    <textarea
                      id="product-desc" required value={form.description}
                      onChange={handleChange('description')}
                      placeholder="Describe the product features, benefits..."
                      rows={3}
                    />
                  </div>

                  {/* Price & MRP */}
                  <div className={styles.row}>
                    <div className={styles.field}>
                      <label>Selling Price (₹) *</label>
                      <input
                        id="product-price" type="number" required min="0"
                        value={form.price} onChange={handleChange('price')}
                        placeholder="199"
                      />
                    </div>
                    <div className={styles.field}>
                      <label>MRP (₹) *</label>
                      <input
                        id="product-mrp" type="number" required min="0"
                        value={form.mrp} onChange={handleChange('mrp')}
                        placeholder="299"
                      />
                    </div>
                  </div>

                  {/* Stock & Category */}
                  <div className={styles.row}>
                    <div className={styles.field}>
                      <label>Stock *</label>
                      <input
                        id="product-stock" type="number" required min="0"
                        value={form.stock} onChange={handleChange('stock')}
                        placeholder="100"
                      />
                    </div>
                    <div className={styles.field}>
                      <label>Category *</label>
                      <select id="product-category" required value={form.category} onChange={handleChange('category')}>
                        <option value="">Select category</option>
                        {categories.map((c) => (
                          <option key={c._id} value={c._id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Size & Absorbency */}
                  <div className={styles.row}>
                    <div className={styles.field}>
                      <label>Size *</label>
                      <select id="product-size" value={form.size} onChange={handleChange('size')}>
                        {PRODUCT_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div className={styles.field}>
                      <label>Absorbency *</label>
                      <select id="product-absorbency" value={form.absorbency} onChange={handleChange('absorbency')}>
                        {ABSORBENCY_LEVELS.map((a) => <option key={a} value={a}>{a}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Material & Features */}
                  <div className={styles.row}>
                    <div className={styles.field}>
                      <label>Material</label>
                      <select id="product-material" value={form.material} onChange={handleChange('material')}>
                        {MATERIALS.map((m) => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                    <div className={styles.field}>
                      <label>Features (comma-separated)</label>
                      <input
                        id="product-features" value={form.features}
                        onChange={handleChange('features')}
                        placeholder="Wings, Leak Guard, Odor Control"
                      />
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div className={styles.imageSection}>
                    <label>Product Images * (max 5)</label>
                    <label className={styles.uploadArea} htmlFor="image-upload">
                      <FiUploadCloud size={28} className={styles.uploadIcon} />
                      <p>Click to upload images (JPEG, PNG, WebP)</p>
                    </label>
                    <input
                      id="image-upload" type="file" accept="image/jpeg,image/png,image/webp"
                      multiple style={{ display: 'none' }}
                      onChange={handleImageUpload}
                    />

                    {uploading && <p className={styles.uploading}>⏳ Uploading to Cloudinary...</p>}

                    {images.length > 0 && (
                      <div className={styles.imageGrid}>
                        {images.map((img, i) => (
                          <div key={i} className={styles.imagePreview}>
                            <img src={img.url} alt={`Product ${i + 1}`} />
                            <button
                              type="button"
                              className={styles.removeImg}
                              onClick={() => handleRemoveImage(i)}
                              title="Remove image"
                            >
                              <FiX size={10} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button type="button" className={styles.cancelBtn} onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.saveBtn}
                  disabled={creating || updating || uploading}
                  id="save-product-btn"
                >
                  {creating || updating ? 'Saving...' : editingId ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProducts;
