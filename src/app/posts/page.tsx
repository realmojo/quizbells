"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getPostsList } from "@/utils/api";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getQuitItem } from "@/utils/utils";

export default function BlogPage() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    getPostsList().then((data) => {
      console.log(data);
      setPosts(data.posts);
    });
  }, []);

  return (
    <Table className="max-w-[860px] mx-auto">
      <TableHeader>
        <TableRow>
          {/* <TableHead className="w-[80px] text-center">번호</TableHead> */}
          <TableHead>제목</TableHead>
          <TableHead className="w-[150px] text-center">작성자</TableHead>
          <TableHead className="w-[150px] text-center">작성일</TableHead>
          {/* <TableHead className="w-[100px] text-center">조회수</TableHead> */}
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts &&
          posts.map((post) => (
            <TableRow key={post.id}>
              {/* <TableCell className="text-center font-medium">{post.id}</TableCell> */}
              <TableCell className="hover:underline text-black-600 cursor-pointer">
                <Link href={`/posts/${post.id}`} prefetch>
                  <span className="text-sm text-blue-500">
                    [{getQuitItem(post.type)?.typeKr}]
                  </span>{" "}
                  {post.title}
                </Link>
              </TableCell>
              <TableCell className="text-center">{post.author}</TableCell>
              <TableCell className="text-center">
                {post.regdated.split("T")[0]}
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={5} className="text-center font-semibold">
            총 게시글 수: {posts.length}개
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
