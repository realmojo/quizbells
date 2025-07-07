"use client";

import { useEffect, useState } from "react";
import { getPost, getPostsList } from "@/utils/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import ImageComponents from "./ImageComponets";
import Link from "next/link";

interface Post {
  id: number;
  type: string;
  title: string;
  contents: string;
  author: string;
  regdated: string;
  views: number;
}

export default function PostComponent({ id }: { id: string }) {
  const [post, setPost] = useState<Post | null>(null);
  const [morePosts, setMorePosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      try {
        const data = await getPost(id);
        setPost(data);
      } catch (error) {
        console.error("게시글을 불러오는 중 오류 발생:", error);
      } finally {
        setLoading(false);
      }
    }

    async function fetchMorePosts() {
      const data = await getPostsList();
      setMorePosts(data.posts);
    }

    fetchPost();
    fetchMorePosts();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <Skeleton className="h-10 w-full mb-4" />
        <Skeleton className="h-4 w-1/2 mb-2" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center text-red-500 py-20">
        게시글을 찾을 수 없습니다.
      </div>
    );
  }

  return (
    <Card className="shadow-xl rounded-none mb-10">
      <CardHeader>
        <CardTitle className="text-2xl md:text-3xl font-bold leading-tight tracking-tight">
          {post.title}
        </CardTitle>
        <div className="text-sm text-right text-muted-foreground mt-2">
          {post.author} · 등록일: {post.regdated.split("T")[0]}{" "}
          {post.regdated.split("T")[1].substring(0, 5)}
        </div>
      </CardHeader>

      <ImageComponents type={post.type} answerDate={post.regdated} />

      <CardContent>
        <div
          id="post-content"
          className="prose prose-lg max-w-none text-gray-900 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post.contents }}
        />
      </CardContent>

      <div className="px-6 mb-10">
        <h2 className="text-lg font-bold mb-2">📖 다른 콘텐츠 확인하기</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {morePosts &&
            morePosts.map((post) => (
              <Link
                key={post.id}
                href={`/posts/${post.id}`}
                className="underline"
              >
                {post.title}
              </Link>
            ))}
        </div>
      </div>
    </Card>
  );
}
