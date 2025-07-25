import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { tips } from "../tipsData";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tip = tips.find((t) => t.id === id);
  if (!tip) {
    return {
      title: "팁을 찾을 수 없습니다 | 앱테크 팁",
      description: "존재하지 않는 팁입니다.",
      robots: { index: false, follow: false },
    };
  }
  return {
    title: `${tip.title} | 앱테크 팁 | 퀴즈벨`,
    description: tip.description,
    openGraph: {
      title: `${tip.title} | 앱테크 팁 | 퀴즈벨`,
      description: tip.description,
      type: "article",
      url: `https://quizbells.com/tips/${tip.id}`,
    },
    alternates: {
      canonical: `https://quizbells.com/tips/${tip.id}`,
    },
    robots: { index: true, follow: true },
  };
}

export default async function TipDetailPage({
  params,
}: {
  params: Promise<{ id?: string | string[] }>;
}) {
  const { id } = await params;
  const tip = tips.find((t) => t.id === id);

  if (!tip) {
    return (
      <main className="max-w-2xl mx-auto py-10 px-4">
        <h1 className="text-2xl font-bold mb-4">팁을 찾을 수 없습니다</h1>
        <Link href="/tips" className="text-blue-600 underline">
          팁 목록으로 돌아가기
        </Link>
      </main>
    );
  }

  return (
    <div className="max-w-[720px] mx-auto mb-20">
      <Card className="shadow-xl border-none rounded-none mb-10 gap-4">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl font-bold leading-tight tracking-tight">
            {tip.title}
          </CardTitle>
          <div className="text-sm text-right text-muted-foreground mt-2">
            등록일: {tip.date}
          </div>
        </CardHeader>

        <CardContent>
          <div
            id="post-content"
            className="prose prose-lg max-w-none text-gray-900 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: tip.content }}
          />
          <nav className="flex justify-between text-sm mt-8">
            {(() => {
              const idx = tips.findIndex((t) => t.id === tip.id);
              const prev = tips[idx - 1];
              const next = tips[idx + 1];
              return (
                <>
                  {prev ? (
                    <Link
                      href={`/tips/${prev.id}`}
                      className="text-blue-600 underline"
                    >
                      ← {prev.title}
                    </Link>
                  ) : (
                    <span />
                  )}
                  {next ? (
                    <Link
                      href={`/tips/${next.id}`}
                      className="text-blue-600 underline"
                    >
                      {next.title} →
                    </Link>
                  ) : (
                    <span />
                  )}
                </>
              );
            })()}
          </nav>
        </CardContent>
      </Card>
      <div className="mb-20">
        <Link href="/tips" className="text-blue-600 underline">
          팁 목록으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
