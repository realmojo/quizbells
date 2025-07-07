"use client";

import { getPostsList } from "@/utils/api";
import { useEffect, useState } from "react";
import PostTableComponents from "@/components/PostTableComponents";

export default function BlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPostsList()
      .then((data) => {
        setPosts(data.posts);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return <PostTableComponents posts={posts} loading={loading} />;
}
