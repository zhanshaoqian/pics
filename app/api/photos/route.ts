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
  const startDate = new Date('2025-02-14T00:00:00Z'); // 从前一天开始
  
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

// 生成图片数据
const generatePhotos = (page: number, limit: number = 12) => {
  const startId = (page - 1) * limit;
  const endDate = new Date('2025-02-15T00:00:00Z');
  const startDate = new Date('2025-02-14T00:00:00Z'); // 从前一天开始
  
  return Array(limit)
    .fill(null)
    .map((_, index) => {
      const id = startId + index + 1;
      const timestamp = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
      return {
        id,
        imageUrl: `https://picsum.photos/id/${id}/800/800`,
        thumbnailUrl: `https://picsum.photos/id/${id}/400/400`,
        likes: Math.floor(Math.random() * 1000),
        comments: generateComments(),
        username: `photographer_${Math.random().toString(36).substr(2, 5)}`,
        timestamp: timestamp.toISOString(),
      };
    });
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "12");

  const photos = generatePhotos(page, limit);

  return NextResponse.json({
    photos,
    hasMore: page < 10, // 限制最多10页数据
  });
} 