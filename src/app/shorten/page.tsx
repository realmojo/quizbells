"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Copy,
  Link as LinkIcon,
  ArrowRight,
  Loader2,
  Sparkles,
} from "lucide-react";

export default function ShortenPage() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setShortUrl("");

    try {
      const response = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setShortUrl(data.shortUrl);
        toast.success("단축 URL이 생성되었습니다!");
      } else {
        toast.error(data.error || "URL 생성에 실패했습니다.");
      }
    } catch (err) {
      toast.error("오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    toast.success("클립보드에 복사되었습니다.");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-10 space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-purple-100 dark:bg-purple-900/30 rounded-2xl mb-4">
            <LinkIcon className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400">
            Quizbells URL Shortener
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            긴 URL을 짧고 간결하게 줄여보세요.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-800">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
                Original URL
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/very/long/url..."
                  required
                  className="w-full pl-4 pr-12 py-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-slate-900 dark:text-white"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <LinkIcon className="w-5 h-5" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-lg shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Shorten URL
                </>
              )}
            </button>
          </form>

          {shortUrl && (
            <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-purple-100 dark:border-purple-900/30 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <p className="text-sm text-slate-500 dark:text-slate-500 font-medium mb-2 ml-1">
                Shortened Link
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="flex-1 w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-purple-600 dark:text-purple-400 font-mono font-medium truncate">
                  {shortUrl}
                </div>
                <button
                  onClick={handleCopy}
                  className="w-full sm:w-auto px-6 py-3 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 min-w-[100px]"
                >
                  {copied ? (
                    "Copied!"
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
