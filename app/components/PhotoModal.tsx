import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect, useCallback, useRef } from "react";
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon, HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";

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

interface User {
  name: string;
  email: string;
}

interface PhotoModalProps {
  album: Album | null;
  isOpen: boolean;
  onClose: () => void;
  onPrevAlbum?: () => void;
  onNextAlbum?: () => void;
  hasPrevAlbum?: boolean;
  hasNextAlbum?: boolean;
  user: User | null;
  onLike?: (albumId: number) => void;
  onComment?: (albumId: number, comment: string) => void;
}

export default function PhotoModal({ 
  album, 
  isOpen, 
  onClose,
  onPrevAlbum,
  onNextAlbum,
  hasPrevAlbum = false,
  hasNextAlbum = false,
  user,
  onLike,
  onComment
}: PhotoModalProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [localComments, setLocalComments] = useState<Comment[]>([]);
  const commentsEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (album?.id) {
      setCurrentPhotoIndex(0);
      setLocalComments(album.comments);
    }
  }, [album?.id, album?.comments]);

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

  const handleLike = () => {
    if (!user) return;
    setIsLiked(!isLiked);
    onLike?.(album!.id);
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;
    
    const comment = {
      id: Math.random().toString(36).substr(2, 9),
      username: user.name,
      text: newComment.trim(),
      timestamp: new Date().toISOString()
    };

    setLocalComments(prev => [...prev, comment]);
    onComment?.(album!.id, newComment.trim());
    setNewComment("");
    
    setTimeout(scrollToBottom, 100);
  };

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
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-gray-200"></div>
                          <div className="ml-3">
                            <p className="font-medium">{album.username}</p>
                            <p className="text-sm text-gray-500">{album.description}</p>
                          </div>
                        </div>
                        {user && (
                          <button
                            onClick={handleLike}
                            className="focus:outline-none"
                          >
                            {isLiked ? (
                              <HeartIconSolid className="h-6 w-6 text-red-500" />
                            ) : (
                              <HeartIcon className="h-6 w-6 text-gray-400 hover:text-red-500" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                      {localComments.map((comment) => (
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
                      <div ref={commentsEndRef} />
                    </div>
                    <div className="border-t p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <span>{album.likes} likes</span>
                          <span className="text-gray-500">•</span>
                          <span className="text-gray-500">{album.photos.length} photos</span>
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(album.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                      {user ? (
                        <form onSubmit={handleSubmitComment} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add a comment..."
                            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                          <button
                            type="submit"
                            disabled={!newComment.trim()}
                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-indigo-300"
                          >
                            Post
                          </button>
                        </form>
                      ) : (
                        <p className="text-sm text-gray-500 text-center">
                          Please <button onClick={onClose} className="text-indigo-600 hover:text-indigo-500">sign in</button> to like or comment
                        </p>
                      )}
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