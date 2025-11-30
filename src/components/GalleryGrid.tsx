import { motion } from 'framer-motion';
import { GalleryImage } from '../types';
import { useLanguage } from '../hooks/useLanguage';

interface GalleryGridProps {
  images: GalleryImage[];
  onImageClick: (index: number) => void;
}

export default function GalleryGrid({ images, onImageClick }: GalleryGridProps) {
  const { t } = useLanguage();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 300,
        damping: 24,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 md:grid-cols-3 gap-3"
    >
      {images.map((image, index) => {
        const title = t({ en: image.title_en, kn: image.title_kn });
        const hasTitle = title && title.trim().length > 0;

        return (
          <motion.button
            key={image.id}
            variants={itemVariants}
            onClick={() => onImageClick(index)}
            className="relative aspect-square rounded-xl overflow-hidden group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            {/* Image */}
            <img
              src={image.image_data}
              alt={hasTitle ? title : 'Gallery image'}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />

            {/* Gradient overlay and title - only show if title exists */}
            {hasTitle && (
              <>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <h3 className="text-white text-sm font-medium line-clamp-2 text-left">
                    {title}
                  </h3>
                </div>
              </>
            )}
          </motion.button>
        );
      })}
    </motion.div>
  );
}
