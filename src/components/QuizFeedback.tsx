"use client";

import { useState, useEffect } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface QuizFeedbackProps {
  type: string;
  date: string;
}

export default function QuizFeedback({ type, date }: QuizFeedbackProps) {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ helpful: 0, notHelpful: 0 });
  const [hasVoted, setHasVoted] = useState<"helpful" | "notHelpful" | null>(
    null
  );

  useEffect(() => {
    fetchStats();
    if (typeof window !== "undefined") {
      const vote = localStorage.getItem(`feedback_${type}_${date}`);
      if (vote === "helpful" || vote === "notHelpful") {
        setHasVoted(vote);
      }
    }
  }, [type, date]);

  const fetchStats = async () => {
    try {
      const res = await fetch(`/api/feedback?type=${type}`);
      if (res.ok) {
        const data = await res.json();
        setStats({ helpful: data.helpful, notHelpful: data.notHelpful });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleVote = async (isHelpful: boolean) => {
    if (hasVoted) {
      toast.info("이미 참여하셨습니다.");
      return;
    }

    setLoading(true);
    const voteType = isHelpful ? "helpful" : "notHelpful";

    // Optimistic UI Update
    setStats((prev) => ({
      ...prev,
      [voteType]: prev[voteType] + 1,
    }));
    setHasVoted(voteType);
    localStorage.setItem(`feedback_${type}_${date}`, voteType);

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, date, isHelpful }),
      });

      if (!res.ok) {
        throw new Error("Failed");
      }
      toast.success(
        isHelpful
          ? "도움이 되었다니 기뻐요! 🥰"
          : "피드백 감사합니다. 빠르게 수정할게요! 🔧"
      );
    } catch (e) {
      console.error(e);
      // Revert on failure
      setStats((prev) => ({
        ...prev,
        [voteType]: prev[voteType] - 1,
      }));
      setHasVoted(null);
      localStorage.removeItem(`feedback_${type}_${date}`);
      toast.error("오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const totalVotes = stats.helpful + stats.notHelpful;
  const helpfulPercent =
    totalVotes > 0 ? Math.round((stats.helpful / totalVotes) * 100) : 0;

  return (
    <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 text-center my-6">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
        오늘의 정답이 도움이 되셨나요?
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        여러분의 참여가 더 정확한 정답을 만듭니다.
      </p>

      <div className="flex gap-4 justify-center mb-6">
        <button
          onClick={() => handleVote(true)}
          disabled={loading || hasVoted !== null}
          className={cn(
            "flex-1 max-w-[140px] flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 active:scale-95",
            hasVoted === "helpful"
              ? "bg-emerald-50 border-emerald-500 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-500 dark:text-emerald-400 ring-2 ring-emerald-200 dark:ring-emerald-900"
              : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-emerald-400 dark:hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/10",
            hasVoted && hasVoted !== "helpful" && "opacity-50 grayscale"
          )}
        >
          <div
            className={cn(
              "p-2 rounded-full transition-colors",
              hasVoted === "helpful"
                ? "bg-emerald-100 dark:bg-emerald-900/50"
                : "bg-slate-100 dark:bg-slate-700"
            )}
          >
            <ThumbsUp
              className={cn(
                "w-6 h-6",
                hasVoted === "helpful"
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-slate-500 dark:text-slate-400"
              )}
            />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm">정답이에요</span>
            {totalVotes > 0 && (
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mt-1">
                {stats.helpful}
              </span>
            )}
          </div>
        </button>

        <button
          onClick={() => handleVote(false)}
          disabled={loading || hasVoted !== null}
          className={cn(
            "flex-1 max-w-[140px] flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 active:scale-95",
            hasVoted === "notHelpful"
              ? "bg-rose-50 border-rose-500 text-rose-700 dark:bg-rose-900/20 dark:border-rose-500 dark:text-rose-400 ring-2 ring-rose-200 dark:ring-rose-900"
              : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-rose-400 dark:hover:border-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/10",
            hasVoted && hasVoted !== "notHelpful" && "opacity-50 grayscale"
          )}
        >
          <div
            className={cn(
              "p-2 rounded-full transition-colors",
              hasVoted === "notHelpful"
                ? "bg-rose-100 dark:bg-rose-900/50"
                : "bg-slate-100 dark:bg-slate-700"
            )}
          >
            <ThumbsDown
              className={cn(
                "w-6 h-6",
                hasVoted === "notHelpful"
                  ? "text-rose-600 dark:text-rose-400"
                  : "text-slate-500 dark:text-slate-400"
              )}
            />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm">틀렸어요</span>
            {totalVotes > 0 && (
              <span className="text-xs font-medium text-rose-600 dark:text-rose-400 mt-1">
                {stats.notHelpful}
              </span>
            )}
          </div>
        </button>
      </div>

      {totalVotes > 0 && (
        <div className="max-w-xs mx-auto animate-in fade-in duration-500">
          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1 px-1">
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              성공률 {helpfulPercent}%
            </span>
            <span>{totalVotes.toLocaleString()}명 참여</span>
          </div>
          <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-100 dark:border-slate-700">
            <div
              className="h-full bg-linear-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(16,185,129,0.5)]"
              style={{ width: `${helpfulPercent}%` }}
            />
          </div>
          {hasVoted === "helpful" && (
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-3 font-medium animate-bounce">
              🎉 정답 확인 성공! 포인트 적립하세요!
            </p>
          )}
        </div>
      )}
    </div>
  );
}
