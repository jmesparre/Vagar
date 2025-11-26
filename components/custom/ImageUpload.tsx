"use client";

import { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { UploadCloud, X } from 'lucide-react';
import Image from 'next/image';


interface ImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_error) {
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

  const handleRemove = async (urlToRemove: string) => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/upload?url=${encodeURIComponent(urlToRemove)}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar la imagen.');
      }

      onChange(value.filter(url => url !== urlToRemove));
      toast({
        title: 'Imagen eliminada',
        description: 'La imagen se ha eliminado correctamente.',
      });
    } catch (error) {
      console.error('Error deleting image:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar la imagen.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
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
      </div>

      {isUploading && <p className="mt-4 text-sm text-gray-500">Subiendo imágenes...</p>}
      {isDeleting && <p className="mt-4 text-sm text-gray-500">Eliminando imagen...</p>}

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
