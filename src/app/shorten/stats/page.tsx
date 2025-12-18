"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { toast } from "sonner";
import { BarChart3, Calendar, Loader2, Lock, TrendingUp } from "lucide-react";

type DailyAggregated = {
  date: string;
  totalClicks: number;
};

export default function ShortenStatsPage() {
  // 인증 상태
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");

  // 데이터 상태
  const [stats, setStats] = useState<DailyAggregated[]>([]);
  const [detailedStats, setDetailedStats] = useState<any[]>([]); // 상세 내역
  const [loading, setLoading] = useState(false);
  const [totalClicksAllTime, setTotalClicksAllTime] = useState(0);
  const [showTodayOnly, setShowTodayOnly] = useState(false);

  // 비밀번호 확인
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 환경 변수에서 비밀번호 가져오기 (또는 하드코딩)
    const correctPassword = process.env.NEXT_PUBLIC_STATS_PASSWORD || "1313";
    if (password === correctPassword) {
      setIsAuthenticated(true);
      localStorage.setItem("stats_authenticated", "true");
    } else {
      toast.error("비밀번호가 올바르지 않습니다.");
      setPassword("");
    }
  };

  // 컴포넌트 마운트 시 인증 상태 확인 및 메타 태그 설정
  useEffect(() => {
    const authStatus = localStorage.getItem("stats_authenticated");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    }

    // 로봇 수집 방지 메타 태그 추가
    const metaRobots = document.createElement("meta");
    metaRobots.name = "robots";
    metaRobots.content = "noindex, nofollow, noarchive, nosnippet";
    document.head.appendChild(metaRobots);

    const metaGooglebot = document.createElement("meta");
    metaGooglebot.name = "googlebot";
    metaGooglebot.content = "noindex, nofollow";
    document.head.appendChild(metaGooglebot);

    return () => {
      // cleanup
      const existingRobots = document.querySelector('meta[name="robots"]');
      const existingGooglebot = document.querySelector(
        'meta[name="googlebot"]'
      );
      if (
        existingRobots &&
        existingRobots.getAttribute("content") ===
          "noindex, nofollow, noarchive, nosnippet"
      ) {
        existingRobots.remove();
      }
      if (
        existingGooglebot &&
        existingGooglebot.getAttribute("content") === "noindex, nofollow"
      ) {
        existingGooglebot.remove();
      }
    };
  }, []);

  // 통계 데이터 불러오기 및 가공
  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      // 오늘 날짜 문자열 (YYYY-MM-DD 형식)
      const today = format(new Date(), "yyyy-MM-dd");

      // 쿼리 빌더 시작
      // Supabase 조인: 외래키 관계에 따라 문법이 다를 수 있음
      // link_id가 외래키라면 quizbells_short_links!link_id 형식 사용
      let query = supabase.from("quizbells_short_links_daily").select(`
          access_date,
          clicks,
          link_id,
          quizbells_short_links (
            code,
            original_url
          )
        `);

      // 오늘만 보기 필터 적용
      if (showTodayOnly) {
        query = query.eq("access_date", today);
      }

      const { data, error } = await query.order("access_date", {
        ascending: false,
      });

      if (error) {
        console.error("Supabase Error Details:", error);
        throw error;
      }

      console.log("Fetched Stats Data:", data);

      if (data) {
        // 조인된 데이터 구조 변환
        // Supabase 조인 결과는 배열 또는 객체일 수 있음
        const transformedData = data.map((item: any) => {
          let linkData = null;

          // 조인 결과가 배열인 경우 첫 번째 요소 사용
          if (Array.isArray(item.quizbells_short_links)) {
            linkData = item.quizbells_short_links[0] || null;
          } else if (item.quizbells_short_links) {
            linkData = item.quizbells_short_links;
          }
          // 조인이 실패한 경우는 나중에 별도 처리 (성능 최적화)

          return {
            ...item,
            link: linkData,
          };
        });

        // 조인이 실패한 항목들만 별도로 조회 (성능 최적화)
        const missingLinks = transformedData.filter(
          (item: any) => !item.link && item.link_id
        );
        if (missingLinks.length > 0) {
          const linkIds = missingLinks.map((item: any) => item.link_id);
          const { data: linksData } = await supabase
            .from("quizbells_short_links")
            .select("id, code, original_url")
            .in("id", linkIds);

          // 링크 데이터 매핑
          const linksMap = new Map(
            (linksData || []).map((link: any) => [link.id, link])
          );

          // 누락된 링크 데이터 채우기
          transformedData.forEach((item: any) => {
            if (!item.link && item.link_id) {
              item.link = linksMap.get(item.link_id) || null;
            }
          });
        }

        setDetailedStats(transformedData); // 상세 리스트용 원본 데이터 저장

        // 날짜별로 그룹화하여 합계 계산 (그래프용)
        // access_date 기준으로 합산
        const aggregated = transformedData.reduce(
          (acc: { [key: string]: number }, curr: any) => {
            const date = curr.access_date;
            acc[date] = (acc[date] || 0) + curr.clicks;
            return acc;
          },
          {}
        );

        // 배열로 변환 및 정렬 (날짜 오름차순 for Graph)
        const result: DailyAggregated[] = Object.entries(aggregated).map(
          ([date, totalClicks]) => ({
            date,
            totalClicks: totalClicks as number,
          })
        );

        result.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        setStats(result);

        // 전체 누적 클릭 수 계산
        const total = result.reduce((sum, item) => sum + item.totalClicks, 0);
        setTotalClicksAllTime(total);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
      toast.error("통계 데이터를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }, [showTodayOnly]);

  // 인증 후 데이터 로드
  useEffect(() => {
    if (isAuthenticated) {
      fetchStats();
    }
  }, [isAuthenticated, fetchStats]);

  // 차트 최대값 계산
  const maxClicks = Math.max(...stats.map((s) => s.totalClicks), 1);

  // 인증 화면
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="w-6 h-6 text-purple-600" />
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              통계 페이지 접근
            </h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            이 페이지에 접근하려면 비밀번호를 입력하세요.
          </p>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호 입력"
                className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
            >
              확인
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
            <TrendingUp className="w-8 h-8 text-purple-600" />
            단축 URL 통계
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            일자별 전체 링크 클릭 집계 현황
          </p>
          <div className="mt-4 flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showTodayOnly}
                onChange={(e) => {
                  setShowTodayOnly(e.target.checked);
                }}
                className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
              />
              <span className="text-sm text-slate-600 dark:text-slate-400">
                오늘만 보기
              </span>
            </label>
            <button
              onClick={() => fetchStats()}
              className="text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
            >
              새로고침
            </button>
          </div>
        </header>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
          </div>
        ) : (
          <div className="space-y-8">
            {/* 요약 카드 */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
              <div className="text-sm text-slate-500 font-medium mb-1">
                누적 총 클릭 수 (집계된 기간 내)
              </div>
              <div className="text-4xl font-extrabold text-slate-900 dark:text-white">
                {totalClicksAllTime.toLocaleString()}
                <span className="text-lg font-medium text-slate-400 ml-2">
                  clicks
                </span>
              </div>
            </div>

            {/* 메인 차트 (일자별 통합) */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-slate-800">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-slate-500" />
                일자별 통합 클릭 추이
              </h2>

              {stats.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  데이터가 없습니다.
                </div>
              ) : (
                <div className="space-y-4">
                  {/* 역순(최신 날짜 위)으로 보여주기 */}
                  {[...stats].reverse().map((stat, idx) => {
                    const percentage = (stat.totalClicks / maxClicks) * 100;

                    return (
                      <div
                        key={idx}
                        className="group transition-all hover:bg-slate-50 dark:hover:bg-slate-800/30 p-2 rounded-xl"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-24 text-sm font-mono text-slate-500 flex items-center gap-2">
                            <Calendar className="w-3 h-3" />
                            {format(new Date(stat.date), "MM-dd")}
                          </div>
                          <div className="flex-1 relative h-10 bg-slate-100 dark:bg-slate-800/50 rounded-lg overflow-hidden">
                            <div
                              className="h-full bg-purple-500 dark:bg-purple-600 rounded-lg transition-all duration-700 ease-out flex items-center justify-end px-3 group-hover:bg-purple-600 shadow-md"
                              style={{ width: `${Math.max(percentage, 2)}%` }}
                            >
                              <span className="text-sm font-bold text-white drop-shadow-sm">
                                {stat.totalClicks.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 상세 내역 리스트 (테이블) */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-slate-800">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-slate-500" />
                상세 클릭 집계 내역
              </h2>

              {detailedStats.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  상세 내역이 없습니다.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="px-6 py-3">날짜</th>
                        <th className="px-6 py-3">Code</th>
                        <th className="px-6 py-3">원본 링크</th>
                        <th className="px-6 py-3 text-right">클릭수</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {detailedStats.map((item, idx) => (
                        <tr
                          key={idx}
                          className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                        >
                          <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-200 whitespace-nowrap">
                            {format(new Date(item.access_date), "yyyy-MM-dd")}
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono text-xs">
                              /{item.link?.code || "-"}
                            </span>
                          </td>
                          <td className="px-6 py-4 max-w-xs truncate text-slate-500 dark:text-slate-400">
                            <a
                              href={item.link?.original_url}
                              target="_blank"
                              rel="noreferrer"
                              className="hover:text-purple-500 hover:underline"
                            >
                              {item.link?.original_url || "(삭제됨)"}
                            </a>
                          </td>
                          <td className="px-6 py-4 text-right font-bold text-slate-900 dark:text-white">
                            {item.clicks.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
