"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  BarChart3,
  Calendar,
  Loader2,
  Lock,
  TrendingUp,
} from "lucide-react";

type DailyStatRaw = {
  access_date: string;
  clicks: number;
};

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

  // ... (비밀번호 확인 로직 생략)

  // 통계 데이터 불러오기 및 가공
  const fetchStats = async () => {
    setLoading(true);
    try {
      // 모든 일별 기록 가져오기 (링크 정보 조인)
      // Supabase 조인 문법: link:quizbells_short_links(...)
      const { data, error } = await supabase
        .from("quizbells_short_links_daily")
        .select(`
          access_date,
          clicks,
          link:quizbells_short_links (
            code,
            original_url
          )
        `)
        .order("access_date", { ascending: false }); // 최신 날짜순

      if (error) {
        console.error("Supabase Error Details:", error);
        throw error;
      }

      console.log("Fetched Stats Data:", data);

      if (data) {
        setDetailedStats(data); // 상세 리스트용 원본 데이터 저장

        // 날짜별로 그룹화하여 합계 계산 (그래프용)
        // access_date 기준으로 합산
        const aggregated = data.reduce((acc: { [key: string]: number }, curr: any) => {
          const date = curr.access_date;
          acc[date] = (acc[date] || 0) + curr.clicks;
          return acc;
        }, {});

        // 배열로 변환 및 정렬 (날짜 오름차순 for Graph)
        const result: DailyAggregated[] = Object.entries(aggregated).map(
          ([date, totalClicks]) => ({
            date,
            totalClicks: totalClicks as number,
          })
        );
        
        result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

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
  };

  // ... (인증 화면 생략)

  // 차트 최대값 계산
  const maxClicks = Math.max(...stats.map((s) => s.totalClicks), 1);

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
                <span className="text-lg font-medium text-slate-400 ml-2">clicks</span>
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
                      <div key={idx} className="group transition-all hover:bg-slate-50 dark:hover:bg-slate-800/30 p-2 rounded-xl">
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
                        <tr key={idx} className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-200 whitespace-nowrap">
                            {format(new Date(item.access_date), "yyyy-MM-dd")}
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono text-xs">
                              /{item.link?.code || '-'}
                            </span>
                          </td>
                          <td className="px-6 py-4 max-w-xs truncate text-slate-500 dark:text-slate-400">
                            <a href={item.link?.original_url} target="_blank" rel="noreferrer" className="hover:text-purple-500 hover:underline">
                              {item.link?.original_url || '(삭제됨)'}
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
