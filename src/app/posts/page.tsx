// "use client";

// import { getPostsList } from "@/utils/api";
// import { useEffect, useState } from "react";
// import PostTableComponents from "@/components/PostTableComponents";

// export default function PostPage() {
//   const [posts, setPosts] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     getPostsList()
//       .then((data) => {
//         setPosts(data.posts);
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   }, []);

//   return <PostTableComponents posts={posts} loading={loading} />;
// }

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

  return (
    <div className="max-w-[720px] mx-auto space-y-4">
      <PostTableComponents posts={posts} loading={loading} />

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (page > 1) setPage(page - 1);
                }}
                className={page === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>

            {[...Array(totalPages)].map((_, i) => {
              const pageNum = i + 1;
              // 현재 페이지만 강조
              return (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    href="#"
                    isActive={page === pageNum}
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(pageNum);
                    }}
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            {totalPages > 10 && page < totalPages - 2 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (page < totalPages) setPage(page + 1);
                }}
                className={
                  page === totalPages ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
