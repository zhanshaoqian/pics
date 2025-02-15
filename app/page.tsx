"use client";

import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Masonry from "react-masonry-css";
import { HeartIcon, ChatBubbleOvalLeftIcon, PhotoIcon } from "@heroicons/react/24/solid";
import PhotoModal from "./components/PhotoModal";
import AuthModal from "./components/AuthModal";
import Notification from "./components/Notification";

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

export default function Home() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [notification, setNotification] = useState<{
    show: boolean;
    type: "success" | "error";
    message: string;
  }>({ show: false, type: "success", message: "" });

  const breakpointColumns = {
    default: 4,
    1280: 3,
    1024: 3,
    768: 2,
    640: 1
  };

  const fetchAlbums = async () => {
    try {
      const response = await fetch(`/api/photos?page=${page}&limit=12`);
      const data = await response.json();
      setAlbums((prevAlbums) => [...prevAlbums, ...data.albums]);
      setHasMore(data.hasMore);
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error("Error fetching albums:", error);
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handlePrevAlbum = () => {
    if (selectedAlbum) {
      const currentIndex = albums.findIndex(album => album.id === selectedAlbum.id);
      if (currentIndex > 0) {
        setSelectedAlbum(albums[currentIndex - 1]);
      }
    }
  };

  const handleNextAlbum = () => {
    if (selectedAlbum) {
      const currentIndex = albums.findIndex(album => album.id === selectedAlbum.id);
      if (currentIndex < albums.length - 1) {
        setSelectedAlbum(albums[currentIndex + 1]);
      } else if (hasMore) {
        // 如果是最后一个相册，且还有更多数据，则加载下一页
        fetchAlbums();
      }
    }
  };

  const getAlbumNavigationState = () => {
    if (!selectedAlbum) return { hasPrev: false, hasNext: false };
    const currentIndex = albums.findIndex(album => album.id === selectedAlbum.id);
    return {
      hasPrev: currentIndex > 0,
      hasNext: currentIndex < albums.length - 1 || hasMore
    };
  };

  const { hasPrev, hasNext } = getAlbumNavigationState();

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  const handleAuthSuccess = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    showNotification("success", "Login successful!");
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    showNotification("success", "Logged out successfully");
  };

  const handleLike = (albumId: number) => {
    const updatedAlbums = albums.map(album => {
      if (album.id === albumId) {
        return {
          ...album,
          likes: album.likes + 1
        };
      }
      return album;
    });
    setAlbums(updatedAlbums);
  };

  const handleComment = (albumId: number, commentText: string) => {
    const updatedAlbums = albums.map(album => {
      if (album.id === albumId) {
        const newComment = {
          id: Math.random().toString(36).substr(2, 9),
          username: user!.name,
          text: commentText,
          timestamp: new Date().toISOString()
        };
        return {
          ...album,
          comments: [...album.comments, newComment]
        };
      }
      return album;
    });
    setAlbums(updatedAlbums);
    
    // Update the selected album if it's the one being commented on
    if (selectedAlbum?.id === albumId) {
      setSelectedAlbum(updatedAlbums.find(album => album.id === albumId) || null);
    }

    // Show success notification
    showNotification("success", "Comment posted successfully!");
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="relative mb-8">
        <div className="absolute right-0 top-0 space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-indigo-600 font-medium">
                    {user.name[0].toUpperCase()}
                  </span>
                </div>
                <span className="ml-2 text-gray-700">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign In
            </button>
          )}
        </div>
        <div className="text-center">
          <h1 className="text-4xl font-bold">#zhansq</h1>
          <p className="mt-2 text-gray-600">Explore beautiful plant photos</p>
        </div>
      </div>

      <InfiniteScroll
        dataLength={albums.length}
        next={fetchAlbums}
        hasMore={hasMore}
        loader={<div className="text-center py-4">Loading...</div>}
        endMessage={
          <div className="text-center py-4 text-gray-500">
            No more photos to load.
          </div>
        }
      >
        <Masonry
          breakpointCols={breakpointColumns}
          className="flex -ml-4 w-auto"
          columnClassName="pl-4 bg-clip-padding"
        >
          {albums.map((album) => (
            <div
              key={album.id}
              className="mb-4 relative group cursor-pointer"
              onClick={() => setSelectedAlbum(album)}
            >
              <div className="relative overflow-hidden rounded-lg">
                <img
                  src={album.photos[0].thumbnailUrl}
                  alt=""
                  className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {album.photos.length > 1 && (
                  <div className="absolute top-4 right-4">
                    <div className="flex items-center gap-1 bg-black/50 text-white px-2 py-1 rounded-lg">
                      <PhotoIcon className="w-4 h-4" />
                      <span className="text-sm">{album.photos.length}</span>
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                  <div className="flex gap-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center gap-2">
                      <HeartIcon className="w-6 h-6" />
                      <span className="text-sm font-medium">{album.likes}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ChatBubbleOvalLeftIcon className="w-6 h-6" />
                      <span className="text-sm font-medium">{album.comments.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Masonry>
      </InfiniteScroll>

      <PhotoModal
        album={selectedAlbum}
        isOpen={!!selectedAlbum}
        onClose={() => setSelectedAlbum(null)}
        onPrevAlbum={handlePrevAlbum}
        onNextAlbum={handleNextAlbum}
        hasPrevAlbum={hasPrev}
        hasNextAlbum={hasNext}
        user={user}
        onLike={handleLike}
        onComment={handleComment}
        onSignInClick={() => setIsAuthModalOpen(true)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      <Notification
        show={notification.show}
        type={notification.type}
        message={notification.message}
        onClose={() => setNotification(prev => ({ ...prev, show: false }))}
      />
    </main>
  );
} 