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

const LIMIT = 10;

const CATEGORIES = [
  { label: "전체", value: "" },
  { label: "금융", value: "금융" },
  { label: "세금", value: "세금" },
  { label: "정부지원", value: "정부지원" },
  { label: "앱테크", value: "앱테크" },
  { label: "건강", value: "건강" },
  { label: "쇼핑", value: "쇼핑" },
];

export default function PostPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("");

  const fetchPosts = async (page: number, category: string) => {
    setLoading(true);
    const offset = (page - 1) * LIMIT;
    try {
      const data = await getPostsList(offset, LIMIT, category);
      setPosts(data?.posts || []);
      setTotal(data?.total || 0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(page, selectedCategory);
  }, [page, selectedCategory]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setPage(1);
  };

  const totalPages = Math.ceil(total / LIMIT);

  const renderPaginationItems = () => {
    const items = [];
    const maxVisible = 5;
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    if (start > 1) {
      items.push(
        <PaginationItem key={1}>
          <PaginationLink href="#" onClick={(e) => { e.preventDefault(); setPage(1); }}>
            1
          </PaginationLink>
        </PaginationItem>
      );
      if (start > 2) {
        items.push(<PaginationItem key="es"><PaginationEllipsis /></PaginationItem>);
      }
    }

    for (let i = start; i <= end; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            href="#"
            isActive={page === i}
            onClick={(e) => { e.preventDefault(); setPage(i); }}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (end < totalPages) {
      if (end < totalPages - 1) {
        items.push(<PaginationItem key="ee"><PaginationEllipsis /></PaginationItem>);
      }
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink href="#" onClick={(e) => { e.preventDefault(); setPage(totalPages); }}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 pt-10 pb-20">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">콘텐츠</h1>
          <p className="text-sm text-slate-500">
            금융, 세금, 앱테크 등 실생활에 도움되는 정보 모음
          </p>
        </div>

        {/* 카테고리 필터 */}
        <div className="flex gap-1.5 mb-6 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => handleCategoryChange(cat.value)}
              className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat.value
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* 게시글 수 */}
        <div className="flex items-center justify-between mb-4 px-1">
          <span className="text-xs text-slate-400">
            총 {total}개의 글
          </span>
        </div>

        {/* 목록 */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <PostTableComponents posts={posts} loading={loading} />
        </div>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="mt-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (page > 1) setPage(page - 1);
                    }}
                    className={page === 1 ? "pointer-events-none opacity-40" : ""}
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
                    className={page === totalPages ? "pointer-events-none opacity-40" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}

        {/* 빈 상태 */}
        {!loading && posts.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-slate-400 text-sm">해당 카테고리에 게시글이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
