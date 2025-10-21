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
import { Video, Camera, Layout } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
  showVideoButton?: boolean;
  showPlanButton?: boolean;
}

export const ImageGallery = ({
  images,
  showVideoButton = true,
  showPlanButton = true,
}: ImageGalleryProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  const openLightbox = (index: number) => {
    setSelectedImage(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="relative">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          <div className="h-full cursor-pointer">
            <div
              className="relative h-full min-h-[200px] w-full overflow-hidden rounded-lg md:min-h-[412px]"
              onClick={() => openLightbox(0)}
            >
              <Image
                src={images[0]}
                alt="Main gallery image"
                fill
                className="object-cover transition-transform duration-300 ease-in-out hover:scale-105"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 grid-rows-2 gap-2">
            {images.slice(1, 5).map((image, index) => (
              <div
                key={index}
                className="relative hidden h-full min-h-[200px] w-full cursor-pointer overflow-hidden rounded-lg md:block"
                onClick={() => openLightbox(index + 1)}
              >
                <Image
                  src={image}
                  alt={`Gallery image ${index + 2}`}
                  fill
                  className="object-cover transition-transform duration-300 ease-in-out hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-4 right-4 flex gap-2">
          <Button
            variant="secondary"
            className="flex items-center gap-2"
            onClick={openModal}
          >
            <Camera size={16} />
            Ver todas las fotos
          </Button>
          {showVideoButton && (
            <Button variant="secondary" className="flex items-center gap-2">
              <Video size={16} />
              Ver Video
            </Button>
          )}
          {showPlanButton && (
            <Button variant="secondary" className="flex items-center gap-2">
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
            {images.map((image, index) => (
              <div
                key={index}
                className="relative mb-4 cursor-pointer overflow-hidden rounded-lg"
                onClick={() => openLightbox(index)}
              >
                <Image
                  src={image}
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

      {isLightboxOpen && (
        <Lightbox
          images={images}
          initialIndex={selectedImage}
          onClose={closeLightbox}
        />
      )}
    </>
  );
};
