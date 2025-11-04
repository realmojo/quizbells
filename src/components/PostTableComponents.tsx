"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { getQuitItem } from "@/utils/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function PostTableComponents({
  posts,
  loading,
}: {
  posts: any[];
  loading: boolean;
}) {
  if (loading) {
    return (
      <Table className="max-w-[720px] mx-auto">
        <TableHeader>
          <TableRow>
            <TableHead>제목</TableHead>
            <TableHead className="w-[150px] text-center">작성자</TableHead>
            <TableHead className="w-[150px] text-center">작성일</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(5)].map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton className="h-4 w-3/4" />
              </TableCell>
              <TableCell className="text-center">
                <Skeleton className="h-4 w-1/2 mx-auto" />
              </TableCell>
              <TableCell className="text-center">
                <Skeleton className="h-4 w-2/3 mx-auto" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  return (
    <Table className="max-w-[720px] w-full mx-auto">
      <TableHeader>
        <TableRow>
          <TableHead>제목</TableHead>
          <TableHead className="w-[150px] text-center hidden md:table-cell">
            작성자
          </TableHead>
          <TableHead className="w-[150px] text-center hidden md:table-cell">
            작성일
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts.map((post) => (
          <TableRow key={post.id}>
            <TableCell className="cursor-pointer">
              <Link href={`/posts/${post.id}`}>
                {/* PC 버전 */}
                <div className="hidden md:block hover:underline text-black-600 truncate max-w-[500px]">
                  <span className="text-sm text-blue-500 mr-1">
                    [{getQuitItem(post.type)?.typeKr}]
                  </span>
                  {post.title}
                </div>

                {/* 모바일 버전: 타입 + 제목 두 줄 (줄바꿈 허용) */}
                <div className="block md:hidden">
                  <div className="text-sm text-blue-500">
                    [{getQuitItem(post.type)?.typeKr}]
                  </div>
                  <div className="text-black-700 text-sm font-medium whitespace-normal break-words leading-snug">
                    {post.title}
                  </div>
                </div>
              </Link>
            </TableCell>

            {/* PC 전용 작성자/작성일 */}
            <TableCell className="text-center hidden md:table-cell">
              {post.author}
            </TableCell>
            <TableCell className="text-center hidden md:table-cell">
              {post.regdated}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
