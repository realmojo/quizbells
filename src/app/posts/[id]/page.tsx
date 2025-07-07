import PostComponent from "@/components/PostComponent";

export default function Page({ params }: { params: { id: string } }) {
  const { id } = params; // 여기서 안전하게 꺼냄
  return <PostComponent id={id} />;
}
