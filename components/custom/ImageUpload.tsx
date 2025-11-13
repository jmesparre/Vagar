"use client";

import { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { UploadCloud, X, Images } from 'lucide-react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { BlobImageGallery } from './BlobImageGallery';

interface ImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [gallerySelectedUrls, setGallerySelectedUrls] = useState<string[]>([]);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    await handleUpload(files);
  };

  const handleUpload = async (files: FileList) => {
    setIsUploading(true);
    const uploadedUrls: string[] = [];

    for (const file of Array.from(files)) {
      try {
        const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
          method: 'POST',
          body: file,
        });

        if (!response.ok) {
          throw new Error('Error al subir el archivo.');
        }

        const newBlob = await response.json();
        uploadedUrls.push(newBlob.url);
      } catch (error) {
        toast({
          title: 'Error',
          description: `No se pudo subir el archivo ${file.name}.`,
          variant: 'destructive',
        });
      }
    }

    onChange([...value, ...uploadedUrls]);
    setIsUploading(false);
  };

  const handleRemove = (urlToRemove: string) => {
    onChange(value.filter(url => url !== urlToRemove));
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      handleUpload(files);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleConfirmSelection = () => {
    // Añadir solo las URLs que no estén ya en el `value` para evitar duplicados
    const newUrls = gallerySelectedUrls.filter(url => !value.includes(url));
    onChange([...value, ...newUrls]);
    setIsGalleryOpen(false);
  };

  const handleOpenGallery = () => {
    // Sincronizar la selección de la galería con el valor actual del formulario
    setGallerySelectedUrls(value);
    setIsGalleryOpen(true);
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <div
          className="flex-grow border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            Arrastra y suelta tus imágenes aquí, o haz clic para seleccionarlas.
          </p>
          <Input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFileChange}
            accept="image/*"
          />
        </div>
        <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
          <DialogTrigger asChild>
            <Button type="button" variant="outline" onClick={handleOpenGallery}>
              <Images className="mr-2 h-4 w-4" />
              Seleccionar de la Galería
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-full w-full h-full flex flex-col">
            <DialogHeader className="flex-row items-center justify-between">
              <DialogTitle>Seleccionar Imágenes Existentes</DialogTitle>
              <Input
                placeholder="Buscar por nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-1/3"
              />
            </DialogHeader>
            <div className="flex-grow overflow-hidden">
              <BlobImageGallery 
                selectedUrls={gallerySelectedUrls}
                onSelectionChange={setGallerySelectedUrls}
                searchTerm={searchTerm}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsGalleryOpen(false)}>Cancelar</Button>
              <Button onClick={handleConfirmSelection}>Confirmar Selección</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isUploading && <p className="mt-4 text-sm text-gray-500">Subiendo imágenes...</p>}

      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {value.map((url) => (
          <div key={url} className="relative group">
            <Image
              src={url}
              alt="Vista previa de la imagen"
              width={150}
              height={150}
              className="rounded-lg object-cover w-full h-full"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => handleRemove(url)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
