import PostComponent from "@/components/PostComponent";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PostComponent id={id} />;
}
