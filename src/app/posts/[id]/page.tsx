import PostComponent from "@/components/PostComponent";
import { use } from "react";

export default function Page(props: Promise<{ params: { id: string } }>) {
  const { params } = use(props);
  return <PostComponent id={params.id} />;
}
