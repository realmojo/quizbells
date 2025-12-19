"use client";

import { getQuitItem } from "@/utils/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, User, ArrowRight } from "lucide-react";

export default function PostTableComponents({
  posts,
  loading,
}: {
  posts: any[];
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="p-4 space-y-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="bg-white/50 dark:bg-slate-800/50 rounded-xl p-4 space-y-3"
          >
            <Skeleton className="h-5 w-1/4" />
            <Skeleton className="h-6 w-3/4" />
            <div className="flex gap-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-200 dark:divide-slate-800">
      {posts.map((post) => (
        <a
          key={post.id}
          href={`/posts/${post.id}`}
          target="_self"
          className="block group hover:bg-white/50 dark:hover:bg-slate-800/50 transition-all duration-300"
        >
          <article className="p-6">
            {/* Category Badge */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-3">
              <span>{getQuitItem(post.type)?.typeKr || "일반"}</span>
            </div>

            {/* Title */}
            <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-start gap-2">
              <span className="flex-1 line-clamp-2">{post.title}</span>
              <ArrowRight className="w-5 h-5 mt-0.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 flex-shrink-0" />
            </h3>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <User className="w-4 h-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>{post.regdated}</span>
              </div>
            </div>
          </article>
        </a>
      ))}
    </div>
  );
}
