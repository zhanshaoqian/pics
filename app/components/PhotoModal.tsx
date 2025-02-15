import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect, useCallback } from "react";
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

interface Comment {
  id: string;
  username: string;
  text: string;
  timestamp: string;
}

interface AlbumPhoto {
  id: string;
  imageUrl: string;
  thumbnailUrl: string;
}

interface Album {
  id: number;
  photos: AlbumPhoto[];
  likes: number;
  comments: Comment[];
  username: string;
  timestamp: string;
  description: string;
}

interface PhotoModalProps {
  album: Album | null;
  isOpen: boolean;
  onClose: () => void;
  onPrevAlbum?: () => void;
  onNextAlbum?: () => void;
  hasPrevAlbum?: boolean;
  hasNextAlbum?: boolean;
}

export default function PhotoModal({ 
  album, 
  isOpen, 
  onClose,
  onPrevAlbum,
  onNextAlbum,
  hasPrevAlbum = false,
  hasNextAlbum = false
}: PhotoModalProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // 当相册改变时，重置当前照片索引
  useEffect(() => {
    if (album?.id) {
      setCurrentPhotoIndex(0);
    }
  }, [album?.id]);

  const nextPhoto = useCallback(() => {
    if (!album) return;
    
    if (currentPhotoIndex < album.photos.length - 1) {
      setDirection(1);
      setCurrentPhotoIndex(prev => prev + 1);
    } else if (hasNextAlbum && onNextAlbum) {
      onNextAlbum();
    }
  }, [album, currentPhotoIndex, hasNextAlbum, onNextAlbum]);

  const prevPhoto = useCallback(() => {
    if (!album) return;
    
    if (currentPhotoIndex > 0) {
      setDirection(-1);
      setCurrentPhotoIndex(prev => prev - 1);
    } else if (hasPrevAlbum && onPrevAlbum) {
      onPrevAlbum();
    }
  }, [album, currentPhotoIndex, hasPrevAlbum, onPrevAlbum]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      prevPhoto();
    } else if (e.key === 'ArrowRight') {
      nextPhoto();
    }
  }, [nextPhoto, prevPhoto]);

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  const jumpToPhoto = useCallback((index: number) => {
    setDirection(index > currentPhotoIndex ? 1 : -1);
    setCurrentPhotoIndex(index);
  }, [currentPhotoIndex]);

  if (!album) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-75" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-6xl transform overflow-hidden rounded-xl bg-white shadow-xl transition-all mx-20">
                <div className="absolute right-4 top-4 z-10">
                  <button
                    type="button"
                    className="rounded-full bg-white p-2 text-gray-400 hover:text-gray-500"
                    onClick={onClose}
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
                <div className="flex h-[80vh]">
                  <div className="flex-1 bg-black relative overflow-hidden">
                    <div 
                      className="flex h-full transition-transform duration-500 ease-in-out"
                      style={{ 
                        width: `${album.photos.length * 100}%`,
                        transform: `translateX(-${(100 / album.photos.length) * currentPhotoIndex}%)`
                      }}
                    >
                      {album.photos.map((photo, index) => (
                        <div 
                          key={photo.id}
                          className="relative h-full"
                          style={{ width: `${100 / album.photos.length}%` }}
                        >
                          <img
                            src={photo.imageUrl}
                            alt=""
                            className="absolute inset-0 h-full w-full object-cover"
                            style={{
                              objectFit: 'cover',
                              width: '100%',
                              height: '100%'
                            }}
                          />
                        </div>
                      ))}
                    </div>
                    {album.photos.length > 1 && (
                      <>
                        {currentPhotoIndex > 0 && (
                          <button
                            onClick={prevPhoto}
                            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-gray-800 hover:bg-white transition-all duration-200"
                          >
                            <ChevronLeftIcon className="h-6 w-6" />
                          </button>
                        )}
                        {currentPhotoIndex < album.photos.length - 1 && (
                          <button
                            onClick={nextPhoto}
                            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-gray-800 hover:bg-white transition-all duration-200"
                          >
                            <ChevronRightIcon className="h-6 w-6" />
                          </button>
                        )}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                          {album.photos.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => jumpToPhoto(index)}
                              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                                index === currentPhotoIndex
                                  ? "bg-white scale-125"
                                  : "bg-white/50 hover:bg-white/75"
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                  <div className="w-96 flex flex-col">
                    <div className="border-b p-4">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-200"></div>
                        <div className="ml-3">
                          <p className="font-medium">{album.username}</p>
                          <p className="text-sm text-gray-500">{album.description}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4">
                      {album.comments.map((comment) => (
                        <div key={comment.id} className="mb-4">
                          <div className="flex items-start">
                            <div className="h-8 w-8 rounded-full bg-gray-200"></div>
                            <div className="ml-3">
                              <p className="font-medium">{comment.username}</p>
                              <p className="text-sm text-gray-500">{comment.text}</p>
                              <p className="mt-1 text-xs text-gray-400">
                                {new Date(comment.timestamp).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="border-t p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <span>{album.likes} likes</span>
                          <span className="text-gray-500">•</span>
                          <span className="text-gray-500">{album.photos.length} photos</span>
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(album.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
} 