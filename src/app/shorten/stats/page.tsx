"use client";

import { useEffect, useState } from "react";
import { Copy, ExternalLink, BarChart3, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface ShortLink {
  id: number;
  code: string;
  original_url: string;
  clicks: number;
  created_at: string;
}

export default function ShortenStatsPage() {
  const [links, setLinks] = useState<ShortLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/shorten/stats");
      const data = await response.json();
      if (data.success) {
        setLinks(data.links);
      }
    } catch (error) {
      console.error(error);
      toast.error("통계 정보를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (code: string) => {
    const fullUrl = `${window.location.origin}/s/${code}`;
    navigator.clipboard.writeText(fullUrl);
    toast.success("링크가 복사되었습니다.");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-20 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-purple-600" />
              Link Statistics
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              생성된 단축 URL의 조회수를 확인할 수 있습니다.
            </p>
          </div>
          <Link
            href="/shorten"
            className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:text-purple-600 transition-colors"
          >
            + Create New
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800">
                    <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">
                      Short Link
                    </th>
                    <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">
                      Original URL
                    </th>
                    <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300 w-24 text-center">
                      Clicks
                    </th>
                    <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300 w-40">
                      Created
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {links.map((link) => (
                    <tr
                      key={link.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-purple-600 dark:text-purple-400 font-medium">
                            /s/{link.code}
                          </span>
                          <button
                            onClick={() => copyToClipboard(link.code)}
                            className="p-1.5 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-md text-slate-400 hover:text-purple-600 transition-colors"
                            title="Copy Link"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div
                          className="max-w-md truncate text-slate-500 dark:text-slate-400"
                          title={link.original_url}
                        >
                          <a
                            href={link.original_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-purple-600 hover:underline flex items-center gap-1"
                          >
                            {link.original_url}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          {link.clicks.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs">
                        {new Date(link.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {links.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-12 text-center text-slate-500"
                      >
                        생성된 링크가 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
