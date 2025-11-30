import { useState, useEffect } from 'react';
import { Loader2, ImageOff } from 'lucide-react';
import { GalleryImage } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { fetchGalleryImages } from '../lib/galleryApi';
import Header from '../components/Header';
import GalleryGrid from '../components/GalleryGrid';
import Lightbox from '../components/Lightbox';

export default function GalleryPage() {
  const { t } = useLanguage();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    setLoading(true);
    const data = await fetchGalleryImages();
    setImages(data);
    setLoading(false);
  };

  const handleImageClick = (index: number) => {
    setSelectedIndex(index);
  };

  const handleCloseLightbox = () => {
    setSelectedIndex(null);
  };

  const handleNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % images.length);
    }
  };

  const handlePrev = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + images.length) % images.length);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header />

      {/* Hero Section */}
      <section className="gradient-hero py-6 px-4 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-2">
            {t({
              en: 'Photo Gallery',
              kn: 'ಫೋಟೋ ಗ್ಯಾಲರಿ',
            })}
          </h2>
          <p className="text-slate-600">
            {t({
              en: 'Moments from our community work',
              kn: 'ನಮ್ಮ ಸಮುದಾಯ ಕಾರ್ಯಗಳ ಕ್ಷಣಗಳು',
            })}
          </p>
        </div>
        <div className="absolute top-4 left-4 w-20 h-20 bg-primary/5 rounded-full blur-2xl animate-float" />
        <div
          className="absolute bottom-4 right-4 w-32 h-32 bg-action/5 rounded-full blur-2xl animate-float"
          style={{ animationDelay: '1s' }}
        />
      </section>

      {/* Gallery Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : images.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <ImageOff className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-lg font-medium">
              {t({
                en: 'No photos yet',
                kn: 'ಇನ್ನೂ ಫೋಟೋಗಳಿಲ್ಲ',
              })}
            </p>
            <p className="text-sm mt-1">
              {t({
                en: 'Check back soon for updates',
                kn: 'ಅಪ್‌ಡೇಟ್‌ಗಳಿಗಾಗಿ ಶೀಘ್ರದಲ್ಲೇ ಹಿಂತಿರುಗಿ',
              })}
            </p>
          </div>
        ) : (
          <GalleryGrid images={images} onImageClick={handleImageClick} />
        )}
      </main>

      {/* Lightbox */}
      <Lightbox
        images={images}
        currentIndex={selectedIndex ?? 0}
        isOpen={selectedIndex !== null}
        onClose={handleCloseLightbox}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </div>
  );
}
