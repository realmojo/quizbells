import { supabaseAdmin } from "@/lib/supabase";
import Script from "next/script";
import { notFound } from "next/navigation";

export const runtime = "edge";

const CATEGORY_COLORS: Record<string, string> = {
  금융: "bg-emerald-50 text-emerald-600",
  세금: "bg-orange-50 text-orange-600",
  정부지원: "bg-purple-50 text-purple-600",
  앱테크: "bg-blue-50 text-blue-600",
  건강: "bg-rose-50 text-rose-600",
  쇼핑: "bg-amber-50 text-amber-600",
};

async function getPostById(id: string) {
  if (!supabaseAdmin) return null;
  const { data, error } = await supabaseAdmin
    .from("quizbells_posts")
    .select("*")
    .eq("id", id)
    .single();
  if (error || !data) return null;
  return data;
}

async function getRelatedPosts(category: string, currentId: string) {
  if (!supabaseAdmin) return [];
  const { data } = await supabaseAdmin
    .from("quizbells_posts")
    .select("id, title, category, date")
    .eq("category", category)
    .neq("id", currentId)
    .order("date", { ascending: false })
    .limit(4);
  return data || [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPostById(id);

  if (!post) {
    return {
      title: "게시글을 찾을 수 없습니다 | 퀴즈벨",
      robots: { index: false, follow: false },
    };
  }

  const pageTitle = `${post.title} | 퀴즈벨`;
  const pageDescription =
    post.description || `${post.category} 관련 유용한 정보 - 퀴즈벨`;

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: post.keywords || [post.category, "퀴즈벨", "앱테크"],
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      type: "article",
      url: `https://quizbells.com/posts/${post.id}`,
      siteName: "퀴즈벨",
      locale: "ko_KR",
      publishedTime: post.date,
      modifiedTime: post.updated_at || post.date,
      section: post.category,
      tags: post.keywords,
      images: [
        {
          url: "https://quizbells.com/icons/og-image.png",
          width: 1200,
          height: 630,
          alt: `${post.title} - 퀴즈벨`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: ["https://quizbells.com/icons/og-image.png"],
    },
    alternates: {
      canonical: `https://quizbells.com/posts/${post.id}`,
    },
    robots: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large" as const,
      "max-video-preview": -1,
    },
  };
}

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPostById(id);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(post.category, post.id);
  const categoryColor =
    CATEGORY_COLORS[post.category] || "bg-slate-50 text-slate-500";

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updated_at || post.date,
    author: {
      "@type": "Organization",
      name: "퀴즈벨",
      url: "https://quizbells.com",
    },
    publisher: {
      "@type": "Organization",
      name: "퀴즈벨",
      logo: {
        "@type": "ImageObject",
        url: "https://quizbells.com/icons/android-icon-192x192.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://quizbells.com/posts/${post.id}`,
    },
    articleSection: post.category,
    keywords: post.keywords?.join(", "),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "홈", item: "https://quizbells.com" },
      { "@type": "ListItem", position: 2, name: "콘텐츠", item: "https://quizbells.com/posts" },
      { "@type": "ListItem", position: 3, name: post.title, item: `https://quizbells.com/posts/${post.id}` },
    ],
  };

  return (
    <div className="min-h-screen bg-white">
      {/* JSON-LD */}
      <Script
        id={`article-jsonld-${post.id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <Script
        id={`breadcrumb-jsonld-${post.id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="max-w-2xl mx-auto px-4 pt-8 pb-20">
        {/* 브레드크럼 */}
        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex items-center gap-1 text-xs text-slate-400">
            <li>
              <a href="/" target="_self" className="hover:text-slate-600 transition-colors">홈</a>
            </li>
            <li>/</li>
            <li>
              <a href="/posts" target="_self" className="hover:text-slate-600 transition-colors">콘텐츠</a>
            </li>
            <li>/</li>
            <li className="text-slate-600 truncate max-w-[180px]">{post.title}</li>
          </ol>
        </nav>

        {/* 아티클 */}
        <article>
          {/* 헤더 */}
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${categoryColor}`}>
                {post.category}
              </span>
              <time dateTime={post.date} className="text-xs text-slate-400">{post.date}</time>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight mb-3">
              {post.title}
            </h1>

            {post.description && (
              <p className="text-[15px] text-slate-500 leading-relaxed">
                {post.description}
              </p>
            )}

            {/* 키워드 */}
            {post.keywords && post.keywords.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-4">
                {post.keywords.map((kw: string) => (
                  <span
                    key={kw}
                    className="text-[11px] text-slate-400 bg-slate-50 px-2 py-0.5 rounded"
                  >
                    #{kw}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* 구분선 */}
          <hr className="border-slate-100 mb-8" />

          {/* 본문 */}
          <div
            id="post-content"
            className="max-w-none
              [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:pb-2 [&_h2]:border-b [&_h2]:border-slate-100
              [&_p]:text-[17px] [&_p]:leading-9 [&_p]:text-slate-700 [&_p]:mb-6
              [&_a]:text-blue-600 [&_a]:no-underline [&_a]:font-medium hover:[&_a]:underline
              [&_strong]:text-slate-900 [&_strong]:font-semibold
              [&_ul]:my-4 [&_ul]:pl-5 [&_ul]:list-disc
              [&_li]:text-[17px] [&_li]:text-slate-700 [&_li]:leading-8 [&_li]:mb-1
              [&_table]:text-base [&_table]:border-collapse [&_table]:w-full [&_table]:my-6
              [&_th]:bg-slate-50 [&_th]:text-slate-700 [&_th]:font-semibold [&_th]:px-4 [&_th]:py-2.5 [&_th]:text-left [&_th]:border [&_th]:border-slate-200
              [&_td]:px-4 [&_td]:py-2.5 [&_td]:border [&_td]:border-slate-200 [&_td]:text-slate-600
            "
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>

        {/* 구분선 */}
        <hr className="border-slate-100 my-10" />

        {/* 관련 콘텐츠 */}
        {relatedPosts.length > 0 && (
          <section className="mb-10">
            <h2 className="text-base font-bold text-slate-900 mb-4">관련 콘텐츠</h2>
            <div className="space-y-1">
              {relatedPosts.map((related: any) => (
                <a
                  key={related.id}
                  href={`/posts/${related.id}`}
                  target="_self"
                  className="flex items-center justify-between gap-3 py-3 px-3 -mx-3 rounded-lg hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`px-1.5 py-0.5 rounded text-xs font-semibold flex-shrink-0 ${
                      CATEGORY_COLORS[related.category] || "bg-slate-50 text-slate-500"
                    }`}>
                      {related.category}
                    </span>
                    <span className="text-[15px] text-slate-700 truncate group-hover:text-blue-600 transition-colors">
                      {related.title}
                    </span>
                  </div>
                  <span className="text-sm text-slate-400 flex-shrink-0">{related.date}</span>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* 목록 버튼 */}
        <div className="text-center">
          <a
            href="/posts"
            target="_self"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            목록으로 돌아가기
          </a>
        </div>
      </div>
    </div>
  );
}
