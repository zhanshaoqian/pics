import { NextResponse } from "next/server";

// 模拟评论数据
const generateComments = () => {
  const comments = [
    "Beautiful shot! 📸",
    "Love the composition!",
    "Amazing view 😍",
    "This is incredible!",
    "Perfect lighting ✨",
  ];
  
  const endDate = new Date('2025-02-15T00:00:00Z');
  const startDate = new Date('2025-02-14T00:00:00Z');
  
  return Array(Math.floor(Math.random() * 5) + 1)
    .fill(null)
    .map(() => {
      const timestamp = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
      return {
        id: Math.random().toString(36).substr(2, 9),
        username: `user_${Math.random().toString(36).substr(2, 5)}`,
        text: comments[Math.floor(Math.random() * comments.length)],
        timestamp: timestamp.toISOString(),
      };
    });
};

// 为相册生成多张图片
const generateAlbumPhotos = (baseId: number) => {
  const photoCount = Math.floor(Math.random() * 4) + 1; // 1-4张图片
  return Array(photoCount).fill(null).map((_, index) => ({
    id: `${baseId}_${index + 1}`,
    imageUrl: `https://picsum.photos/id/${baseId + index}/800/800`,
    thumbnailUrl: `https://picsum.photos/id/${baseId + index}/400/400`,
  }));
};

// 生成相册数据
const generateAlbums = (page: number, limit: number = 12) => {
  const startId = (page - 1) * limit;
  const endDate = new Date('2025-02-15T00:00:00Z');
  const startDate = new Date('2025-02-14T00:00:00Z');
  
  return Array(limit)
    .fill(null)
    .map((_, index) => {
      const id = startId + index + 1;
      const timestamp = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
      return {
        id,
        photos: generateAlbumPhotos(id * 10), // 使用id*10作为基础id，避免图片重复
        likes: Math.floor(Math.random() * 1000),
        comments: generateComments(),
        username: `photographer_${Math.random().toString(36).substr(2, 5)}`,
        timestamp: timestamp.toISOString(),
        description: "A beautiful collection of photos 📸✨"
      };
    });
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "12");

  const albums = generateAlbums(page, limit);

  return NextResponse.json({
    albums,
    hasMore: page < 10, // 限制最多10页数据
  });
} 