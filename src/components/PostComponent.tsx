"use client";

import { useEffect, useState } from "react";
import { getPost, getPostsList } from "@/utils/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import ImageComponents from "./ImageComponets";
import { getQuitItem } from "@/utils/utils";
import PostTableComponents from "./PostTableComponents";

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
      <div className="max-w-[720px] mx-auto px-4 py-10">
        <Skeleton className="h-10 w-full mb-4" />
        <Skeleton className="h-4 w-1/2 mb-2" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-[720px] mx-auto text-center text-red-500 py-20">
        게시글을 찾을 수 없습니다.
      </div>
    );
  }

  return (
    <div className="max-w-[720px] mx-auto">
      <Card className="shadow-xl border-none rounded-none mb-10 gap-4">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl font-bold leading-tight tracking-tight">
            {post.title}
          </CardTitle>
          <div className="text-sm text-right text-muted-foreground mt-2">
            {post.author} · 등록일: {post.regdated.split("T")[0]}{" "}
            {post.regdated.split("T")[1].substring(0, 5)}
          </div>
        </CardHeader>

        <div className="flex justify-center">
          <ImageComponents
            width={500}
            height={500}
            type={post.type}
            answerDate={post.regdated}
          />
        </div>
        <div className="text-xs text-center text-gray-500">
          {`${post.regdated.split("T")[0]} ${getQuitItem(post.type)?.typeKr} ${getQuitItem(post.type)?.title} 퀴즈 콘텐츠`}
        </div>

        <CardContent>
          <div
            id="post-content"
            className="prose prose-lg max-w-none text-gray-900 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.contents }}
          />
        </CardContent>
      </Card>

      <div className="mb-20">
        <div className="flex items-center mb-4">
          <span className="text-2xl pl-4">👉</span>
          <h2 className="text-xl font-bold text-gray-900 ml-2">
            다른 콘텐츠도 확인해보세요
          </h2>
        </div>
        <PostTableComponents posts={morePosts} loading={loading} />
      </div>
    </div>
  );
}
