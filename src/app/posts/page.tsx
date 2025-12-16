"use client";

import { useEffect, useState } from "react";
import { getPostsList } from "@/utils/api";
import PostTableComponents from "@/components/PostTableComponents";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { BookOpen, FileText, Sparkles } from "lucide-react";

const LIMIT = 5; // 한 페이지당 게시글 수

export default function PostPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1); // 페이지 번호 (1부터 시작)
  const [total, setTotal] = useState(0);

  const fetchPosts = async (page: number) => {
    setLoading(true);
    const offset = (page - 1) * LIMIT;
    try {
      const data = await getPostsList(offset, LIMIT);
      setPosts(data.posts);
      setTotal(data.total);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  const totalPages = Math.ceil(total / LIMIT);

  // 페이지네이션 렌더링 로직 개선
  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5; // 한 번에 보여줄 최대 페이지 번호 수

    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // 첫 페이지 항상 표시
    if (startPage > 1) {
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setPage(1);
            }}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );
      if (startPage > 2) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            href="#"
            isActive={page === i}
            onClick={(e) => {
              e.preventDefault();
              setPage(i);
            }}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // 마지막 페이지 항상 표시
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setPage(totalPages);
            }}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-sm font-medium mb-2">
            <BookOpen className="w-4 h-4" />
            <span>최신 콘텐츠</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
            콘텐츠 목록
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            앱테크와 퀴즈 관련 유용한 정보를 확인하세요.
          </p>
        </div>

        {/* Stats Card */}
        <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-white/50 dark:border-slate-800 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  전체 게시글
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {total}개
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-600 dark:text-slate-400">
                현재 페이지
              </div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {page} / {totalPages > 0 ? totalPages : 1}
              </div>
            </div>
          </div>
        </div>

        {/* Posts Table */}
        <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md rounded-2xl shadow-sm border border-white/50 dark:border-slate-800 overflow-hidden mb-8">
          <PostTableComponents posts={posts} loading={loading} />
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-white/50 dark:border-slate-800">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (page > 1) setPage(page - 1);
                    }}
                    className={
                      page === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>

                {renderPaginationItems()}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (page < totalPages) setPage(page + 1);
                    }}
                    className={
                      page === totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}

        {/* Empty State */}
        {!loading && posts.length === 0 && (
          <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md rounded-3xl p-12 text-center shadow-sm border border-white/50 dark:border-slate-800">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
              게시글이 없습니다
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              곧 새로운 콘텐츠가 업데이트될 예정입니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
