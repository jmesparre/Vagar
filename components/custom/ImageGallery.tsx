'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog-custom';
import { Lightbox } from '@/components/custom/Lightbox';
import { Camera, Layout } from 'lucide-react';
import { Image as ImageType } from '@/lib/types';
import { VideoDialog } from './VideoDialog';

interface ImageGalleryProps {
  galleryImages: ImageType[];
  blueprintImages?: ImageType[];
  videoUrl?: string;
}

export const ImageGallery = ({
  galleryImages,
  blueprintImages = [],
  videoUrl,
}: ImageGalleryProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGalleryLightboxOpen, setIsGalleryLightboxOpen] = useState(false);
  const [isBlueprintLightboxOpen, setIsBlueprintLightboxOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  const galleryImageUrls = galleryImages.map(img => img.url);
  const blueprintImageUrls = blueprintImages.map(img => img.url);

  if (!galleryImageUrls || galleryImageUrls.length === 0) {
    return (
      <div className="relative h-[412px] w-full overflow-hidden rounded-lg bg-slate-200">
        <Image
          src="https://images.unsplash.com/photo-1588557132643-ff9f8a442332?q=80&w=2574&auto=format&fit=crop"
          alt="Placeholder image"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
          <span className="text-white text-lg font-semibold">No hay imágenes disponibles</span>
        </div>
      </div>
    );
  }

  const openGalleryLightbox = (index: number) => {
    setSelectedImage(index);
    setIsGalleryLightboxOpen(true);
  };

  const closeGalleryLightbox = () => {
    setIsGalleryLightboxOpen(false);
  };

  const openBlueprintLightbox = () => {
    setIsBlueprintLightboxOpen(true);
  };

  const closeBlueprintLightbox = () => {
    setIsBlueprintLightboxOpen(false);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };


  return (
    <>
      <div className="relative">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          <div className="h-full cursor-pointer">
            <div
              className="relative h-full min-h-[200px] w-full overflow-hidden rounded-lg md:min-h-[412px]"
              onClick={() => openGalleryLightbox(0)}
            >
              <Image
                src={galleryImageUrls[0]}
                alt="Main gallery image"
                fill
                className="object-cover transition-transform duration-300 ease-in-out hover:scale-105"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 grid-rows-2 gap-2">
            {galleryImageUrls.slice(1, 5).map((imageUrl, index) => (
              <div
                key={index}
                className="relative hidden h-full min-h-[200px] w-full cursor-pointer overflow-hidden rounded-lg md:block"
                onClick={() => openGalleryLightbox(index + 1)}
              >
                <Image
                  src={imageUrl}
                  alt={`Gallery image ${index + 2}`}
                  fill
                  className="object-cover transition-transform duration-300 ease-in-out hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="absolute sm:bottom-6 md:bottom-4 right-4 flex flex-col items-end gap-1.5 md:flex-row">
          <Button
            variant="secondary"
            size="sm"
            className="flex items-center gap-2 text-xs"
            onClick={openModal}
          >
            <Camera size={16} />
            Ver todas las fotos
          </Button>
          {videoUrl && <VideoDialog videoUrl={videoUrl} />}
          {blueprintImageUrls.length > 0 && (
            <Button
              variant="secondary"
               size="sm"
              className="flex items-center gap-2 text-xs"
              onClick={openBlueprintLightbox}
            >
              <Layout size={16} />
              Ver Plano
            </Button>
          )}
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="h-screen max-w-full bg-white p-4">
          <DialogTitle className="sr-only">Image Gallery</DialogTitle>
          <div className="columns-1 gap-4 sm:columns-2 md:columns-3 lg:columns-4">
            {galleryImageUrls.map((imageUrl, index) => (
              <div
                key={index}
                className="relative mb-4 cursor-pointer overflow-hidden rounded-lg"
                onClick={() => openGalleryLightbox(index)}
              >
                <Image
                  src={imageUrl}
                  alt={`Gallery image ${index + 1}`}
                  width={500}
                  height={300}
                  className="h-auto w-full object-cover"
                />
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {isGalleryLightboxOpen && (
        <Lightbox
          images={galleryImageUrls}
          initialIndex={selectedImage}
          onClose={closeGalleryLightbox}
        />
      )}

      {isBlueprintLightboxOpen && (
        <Lightbox
          images={blueprintImageUrls}
          initialIndex={0}
          onClose={closeBlueprintLightbox}
        />
      )}
    </>
  );
};
