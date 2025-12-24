import { tips } from "../tipsData";
import {
  Calendar,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const runtime = "edge";

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
      <div className="min-h-screen bg-linear-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-slate-950 dark:via-orange-950 dark:to-amber-950">
        <main className="max-w-3xl mx-auto py-20 px-4">
          <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md rounded-3xl p-12 text-center shadow-lg border border-white/50 dark:border-slate-800">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-linear-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
              <Lightbulb className="w-10 h-10 text-amber-600 dark:text-amber-400" />
            </div>
            <h1 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">
              팁을 찾을 수 없습니다
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              요청하신 팁이 존재하지 않습니다.
            </p>
            <a href="/tips" target="_self">
              <Button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                <ArrowLeft className="w-4 h-4 mr-2" />팁 목록으로 돌아가기
              </Button>
            </a>
          </div>
        </main>
      </div>
    );
  }

  const idx = tips.findIndex((t) => t.id === tip.id);
  const prev = tips[idx - 1];
  const next = tips[idx + 1];

  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-slate-950 dark:via-orange-950 dark:to-amber-950">
      <div className="max-w-4xl mx-auto px-4 py-12 mb-20">
        {/* Breadcrumb */}
        <div className="mb-8">
          <a
            href="/tips"
            target="_self"
            className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>팁 목록</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-900 dark:text-white font-medium">
              상세보기
            </span>
          </a>
        </div>

        {/* Main Content Card */}
        <article className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md rounded-3xl shadow-lg border border-white/50 dark:border-slate-800 overflow-hidden mb-8">
          {/* Header */}
          <header className="p-8 md:p-10 border-b border-slate-200 dark:border-slate-800">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 text-amber-700 dark:text-amber-300 text-sm font-bold mb-4">
              <Lightbulb className="w-4 h-4" />
              <span>TIP #{tip.id}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4 leading-tight">
              {tip.title}
            </h1>
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <Calendar className="w-4 h-4" />
              <span>등록일: {tip.date}</span>
            </div>
          </header>

          {/* Content */}
          <div className="p-8 md:p-10">
            <div
              id="post-content"
              className="prose prose-lg max-w-none dark:prose-invert
                prose-headings:text-slate-900 dark:prose-headings:text-white
                prose-headings:font-bold prose-headings:tracking-tight
                prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
                prose-p:text-slate-700 dark:prose-p:text-slate-300
                prose-p:leading-relaxed prose-p:mb-4
                prose-a:text-amber-600 dark:prose-a:text-amber-400
                prose-a:no-underline hover:prose-a:underline
                prose-strong:text-slate-900 dark:prose-strong:text-white
                prose-strong:font-bold
                prose-ul:my-4 prose-li:text-slate-700 dark:prose-li:text-slate-300
                prose-table:border-collapse prose-table:w-full
                prose-th:bg-amber-50 dark:prose-th:bg-amber-900/20
                prose-th:text-amber-900 dark:prose-th:text-amber-300
                prose-th:font-bold prose-th:p-3
                prose-td:p-3 prose-td:border prose-td:border-slate-200 dark:prose-td:border-slate-700"
              dangerouslySetInnerHTML={{ __html: tip.content }}
            />
          </div>
        </article>

        {/* Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {prev ? (
            <a
              href={`/tips/${prev.id}`}
              target="_self"
              className="group bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-white/50 dark:border-slate-800 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-2">
                <ChevronLeft className="w-5 h-5 text-amber-600 dark:text-amber-400 group-hover:-translate-x-1 transition-transform duration-300" />
                <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                  이전 팁
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                {prev.title}
              </h3>
            </a>
          ) : (
            <div />
          )}

          {next ? (
            <a
              href={`/tips/${next.id}`}
              target="_self"
              className="group bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-white/50 dark:border-slate-800 hover:shadow-lg transition-all duration-300 text-right"
            >
              <div className="flex items-center justify-end gap-3 mb-2">
                <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                  다음 팁
                </span>
                <ChevronRight className="w-5 h-5 text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                {next.title}
              </h3>
            </a>
          ) : (
            <div />
          )}
        </div>

        {/* Back to List Button */}
        <div className="text-center">
          <a href="/tips" target="_self">
            <Button
              variant="outline"
              className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border-white/50 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />팁 목록으로 돌아가기
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
