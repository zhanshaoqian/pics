"use client";

import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Masonry from "react-masonry-css";
import { HeartIcon, ChatBubbleOvalLeftIcon, PhotoIcon } from "@heroicons/react/24/solid";
import PhotoModal from "./components/PhotoModal";

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

export default function Home() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);

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

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold">#zhansq</h1>
        <p className="mt-2 text-gray-600">Explore beautiful plant photos</p>
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
      />
    </main>
  );
} 