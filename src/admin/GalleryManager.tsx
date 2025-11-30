import { useState, useEffect } from 'react';
import { Loader2, Plus, Trash2, Eye, EyeOff, RefreshCw, ImageOff } from 'lucide-react';
import { GalleryImage } from '../types';
import {
  fetchAllGalleryImages,
  addGalleryImage,
  deleteGalleryImage,
  toggleGalleryImageActive,
} from '../lib/galleryApi';
import GalleryImageForm from './components/GalleryImageForm';

export default function GalleryManager() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    setLoading(true);
    const data = await fetchAllGalleryImages();
    setImages(data);
    setLoading(false);
  };

  const handleAddImage = async (data: {
    title_en: string;
    title_kn: string;
    image_data: string;
    file_size: number;
    compressed_size: number;
    mime_type: string;
  }) => {
    setIsSubmitting(true);
    const result = await addGalleryImage(data);
    setIsSubmitting(false);

    if (result.success) {
      setShowForm(false);
      loadImages();
    } else {
      alert(result.error || 'Failed to add image');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    setDeletingId(id);
    const success = await deleteGalleryImage(id);
    setDeletingId(null);

    if (success) {
      setImages(images.filter((img) => img.id !== id));
    } else {
      alert('Failed to delete image');
    }
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    setTogglingId(id);
    const success = await toggleGalleryImageActive(id, !currentActive);
    setTogglingId(null);

    if (success) {
      setImages(
        images.map((img) =>
          img.id === id ? { ...img, is_active: !currentActive } : img
        )
      );
    } else {
      alert('Failed to update image status');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Gallery</h1>
          <p className="text-slate-600 mt-1">
            Manage gallery images for the public gallery page
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={loadImages}
            disabled={loading}
            className="p-2 rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw className={`w-5 h-5 text-slate-600 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Image
          </button>
        </div>
      </div>

      {/* Add Image Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4">
              Add Gallery Image
            </h2>
            <GalleryImageForm
              onSubmit={handleAddImage}
              onCancel={() => setShowForm(false)}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      )}

      {/* Image Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : images.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-500 bg-white rounded-xl border border-slate-200">
          <ImageOff className="w-16 h-16 mb-4 opacity-50" />
          <p className="text-lg font-medium">No gallery images yet</p>
          <p className="text-sm mt-1">Click "Add Image" to upload your first photo</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <div
              key={image.id}
              className={`relative group rounded-xl overflow-hidden border-2 transition-all ${
                image.is_active
                  ? 'border-slate-200 bg-white'
                  : 'border-red-200 bg-red-50 opacity-60'
              }`}
            >
              {/* Image */}
              <div className="aspect-square">
                <img
                  src={image.image_data}
                  alt={image.title_en}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Title */}
              <div className="p-3 bg-white">
                <h3 className="text-sm font-medium text-slate-800 line-clamp-1">
                  {image.title_en}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-1">
                  {image.title_kn}
                </p>
              </div>

              {/* Status Badge */}
              {!image.is_active && (
                <div className="absolute top-2 left-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full font-medium">
                  Hidden
                </div>
              )}

              {/* Actions Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => handleToggleActive(image.id, image.is_active)}
                  disabled={togglingId === image.id}
                  className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors disabled:opacity-50"
                  title={image.is_active ? 'Hide from gallery' : 'Show in gallery'}
                >
                  {togglingId === image.id ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : image.is_active ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
                <button
                  onClick={() => handleDelete(image.id)}
                  disabled={deletingId === image.id}
                  className="p-2 rounded-full bg-red-500/80 hover:bg-red-500 text-white transition-colors disabled:opacity-50"
                  title="Delete image"
                >
                  {deletingId === image.id ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Trash2 className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      {images.length > 0 && (
        <div className="text-sm text-slate-500 text-center">
          {images.filter((img) => img.is_active).length} active /{' '}
          {images.length} total images
        </div>
      )}
    </div>
  );
}
