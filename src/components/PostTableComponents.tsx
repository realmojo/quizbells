"use client";

import { Skeleton } from "@/components/ui/skeleton";

const CATEGORY_COLORS: Record<string, string> = {
  금융: "bg-emerald-50 text-emerald-600",
  세금: "bg-orange-50 text-orange-600",
  정부지원: "bg-purple-50 text-purple-600",
  앱테크: "bg-blue-50 text-blue-600",
  건강: "bg-rose-50 text-rose-600",
  쇼핑: "bg-amber-50 text-amber-600",
};

export default function PostTableComponents({
  posts,
  loading,
}: {
  posts: any[];
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="space-y-3 p-1">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="p-4 space-y-2.5">
            <Skeleton className="h-4 w-16 rounded" />
            <Skeleton className="h-5 w-4/5 rounded" />
            <Skeleton className="h-3.5 w-2/3 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      {posts.map((post, idx) => (
        <a
          key={post.id}
          href={`/posts/${post.id}`}
          target="_self"
          className="block group"
        >
          <div
            className={`px-5 py-4 flex items-start gap-4 hover:bg-slate-50 transition-colors ${
              idx !== posts.length - 1 ? "border-b border-slate-100" : ""
            }`}
          >
            <div className="flex-1 min-w-0">
              {/* 카테고리 + 날짜 */}
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className={`px-1.5 py-0.5 rounded text-xs font-semibold ${
                    CATEGORY_COLORS[post.category] || "bg-slate-50 text-slate-500"
                  }`}
                >
                  {post.category || "일반"}
                </span>
                <span className="text-sm text-slate-400">{post.date}</span>
              </div>

              {/* 제목 */}
              <h3 className="text-base font-semibold text-slate-800 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
                {post.title}
              </h3>

              {/* 설명 */}
              {post.description && (
                <p className="text-sm text-slate-400 mt-1 line-clamp-1">
                  {post.description}
                </p>
              )}
            </div>

            {/* 화살표 */}
            <svg
              className="w-4 h-4 text-slate-300 group-hover:text-blue-500 mt-3 flex-shrink-0 transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </a>
      ))}
    </div>
  );
}
