"use client";

import { useEffect, useState } from "react";
import { getPost, getPostsList } from "@/utils/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import PostTableComponents from "./PostTableComponents";

interface Post {
  id: string;
  title: string;
  description: string;
  keywords: string[];
  category: string;
  content: string;
  date: string;
  view_count: number;
}

export default function PostComponent({ id }: { id: string }) {
  const [post, setPost] = useState<Post | null>(null);
  const [morePosts, setMorePosts] = useState<any[]>([]);
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
      const data = await getPostsList(0, 5);
      setMorePosts(data?.posts || []);
    }

    fetchPost();
    fetchMorePosts();
  }, [id]);

  // JSON-LD 구조화 데이터 삽입
  useEffect(() => {
    if (!post) return;
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "post-jsonld";
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      datePublished: post.date,
      dateModified: post.date,
      author: { "@type": "Organization", name: "퀴즈벨" },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `https://quizbells.com/posts/${post.id}`,
      },
      publisher: {
        "@type": "Organization",
        name: "퀴즈벨",
        logo: {
          "@type": "ImageObject",
          url: "https://quizbells.com/icons/android-icon-192x192.png",
        },
      },
      keywords: post.keywords?.join(", "),
    });
    document.head.appendChild(script);
    return () => {
      document.getElementById("post-jsonld")?.remove();
    };
  }, [post]);

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
    <>
      <div className="max-w-[720px] mx-auto">
        <Card className="shadow-xl border-none rounded-none mb-10 gap-4">
          <CardHeader>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-2 w-fit">
              {post.category}
            </div>
            <CardTitle className="text-2xl md:text-3xl font-bold leading-tight tracking-tight">
              {post.title}
            </CardTitle>
            <div className="text-sm text-right text-muted-foreground mt-2">
              {post.date}
            </div>
          </CardHeader>

          <CardContent>
            <div
              id="post-content"
              className="prose prose-lg max-w-none text-gray-900 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </CardContent>
        </Card>

        <div className="mb-20">
          <div className="flex items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 ml-4">
              다른 콘텐츠도 확인해보세요
            </h2>
          </div>
          <PostTableComponents posts={morePosts} loading={false} />
        </div>
      </div>
    </>
  );
}
