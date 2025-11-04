"use client";

import { useEffect, useState } from "react";
import Head from "next/head"; // 또는 next/head는 CSR에서도 사용 가능
import { getPost, getPostsList } from "@/utils/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import ImageComponents from "./ImageComponets";
import { getQuitItem } from "@/utils/utils";
import PostTableComponents from "./PostTableComponents";
import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";

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
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              headline: post.title,
              datePublished: post.regdated,
              dateModified: post.regdated,
              author: {
                "@type": "Person",
                name: post.author,
              },
              mainEntityOfPage: {
                "@type": "WebPage",
                "@id": `https://quizbells.com/posts/${post.id}`,
              },
              publisher: {
                "@type": "Organization",
                name: "퀴즈벨",
                logo: {
                  "@type": "ImageObject",
                  url: "https://quizbells.com/logo.png", // 실제 로고 주소로 변경
                },
              },
              description: `${post.regdated} ${getQuitItem(post.type)?.typeKr} 퀴즈 콘텐츠`,
            }),
          }}
        />
      </Head>
      <div className="max-w-[720px] mx-auto">
        <Card className="shadow-xl border-none rounded-none mb-10 gap-4">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl font-bold leading-tight tracking-tight">
              {post.title}
            </CardTitle>
            <div className="text-sm text-right text-muted-foreground mt-2">
              등록일 {post.regdated}
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
            {`${post.regdated} ${getQuitItem(post.type)?.typeKr} ${getQuitItem(post.type)?.title} 퀴즈 콘텐츠`}
          </div>

          <div className="w-full flex justify-center my-6 px-4">
            <a
              href={`/quiz/${post.type}/today`}
              target="_self"
              rel="noopener noreferrer"
              className="group w-full min-h-[50px]"
            >
              <Button className="bg-black w-full min-h-[50px] hover:bg-black-700 text-white px-6 py-4 text-lg font-semibold shadow-md transition-all duration-300 group-hover:scale-102">
                {getQuitItem(post.type)?.typeKr} 정답 보러가기
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </a>
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
    </>
  );
}
