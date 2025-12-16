"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

function NaverCafeWriteContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [accessToken, setAccessToken] = useState("");
  const [loading, setLoading] = useState(false);
  
  // 폼 상태
  const [clubId, setClubId] = useState(""); // 예: 12345678 (카페 고유 ID)
  const [menuId, setMenuId] = useState(""); // 예: 1 (게시판 ID)
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");

  const NAVER_CLIENT_ID = process.env.NEXT_PUBLIC_NAVER_CLIENT_ID;
  const CALLBACK_URL = "https://quizbells.com/naver-cafe"; // 설정된 콜백 URL 입력

  // 1. 네이버 로그인 URL 생성 및 이동
  const handleLogin = () => {
    if (!NAVER_CLIENT_ID) {
      toast.error("환경 변수(NEXT_PUBLIC_NAVER_CLIENT_ID)가 설정되지 않았습니다.");
      return;
    }
    const state = Math.random().toString(36).substr(2, 11);
    const authUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&redirect_uri=${encodeURIComponent(CALLBACK_URL)}&state=${state}`;
    window.location.href = authUrl;
  };

  // 2. 콜백 처리: code가 있으면 토큰 발급 요청
  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (code && state && !accessToken) {
      const fetchToken = async () => {
        setLoading(true);
        try {
          const res = await fetch("/api/naver/token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code, state }),
          });
          const data = await res.json();

          if (data.access_token) {
            setAccessToken(data.access_token);
            toast.success("네이버 로그인 성공! 글쓰기가 가능합니다.");
            // URL 파라미터 청소 (선택 사항)
            router.replace("/naver-cafe");
          } else {
            toast.error("토큰 발급 실패: " + (data.error_description || "알 수 없는 오류"));
          }
        } catch (e) {
          console.error(e);
          toast.error("서버 통신 오류가 발생했습니다.");
        } finally {
          setLoading(false);
        }
      };
      fetchToken();
    }
  }, [searchParams, accessToken, router]);

  // 3. 글쓰기 요청
  const handleWrite = async () => {
    if (!accessToken) {
      toast.error("먼저 네이버 로그인을 해주세요.");
      return;
    }
    if (!clubId || !menuId || !subject || !content) {
      toast.error("모든 필드를 입력해주세요.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/naver/write", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accessToken,
          clubId,
          menuId,
          subject,
          content, // HTML 태그 사용 가능
        }),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success("카페 글쓰기 성공! 🎉");
        setSubject("");
        setContent("");
      } else {
        toast.error("글쓰기 실패: " + (data.message ? data.message.error.msg : "알 수 없는 오류"));
        console.error("Write Error:", data);
      }
    } catch (e) {
      console.error(e);
      toast.error("서버 통신 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 flex flex-col items-center">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-800">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 text-center">
          ☕️ 네이버 카페 글쓰기
        </h1>

        {!accessToken ? (
          <div className="text-center py-8">
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              카페에 글을 쓰려면 먼저 네이버 권한이 필요합니다.
            </p>
            <Button
              onClick={handleLogin}
              className="w-full bg-[#03C75A] hover:bg-[#02b351] text-white font-bold py-6 text-lg rounded-xl shadow-md transition-all active:scale-95"
            >
              N 네이버 아이디로 로그인
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg text-sm font-medium text-center">
              ✅ 인증되었습니다 (토큰 보유)
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                카페 ID (Club ID)
              </label>
              <input
                type="text"
                value={clubId}
                onChange={(e) => setClubId(e.target.value)}
                placeholder="예: 31109766"
                className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-[#03C75A]"
              />
              <p className="text-xs text-slate-400 mt-1">
                * 카페 URL의 clubid 파라미터 값입니다.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                게시판 ID (Menu ID)
              </label>
              <input
                type="text"
                value={menuId}
                onChange={(e) => setMenuId(e.target.value)}
                placeholder="예: 1"
                className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-[#03C75A]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                제목
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="글 제목을 입력하세요"
                className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-[#03C75A]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                내용 (HTML 지원)
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="내용을 입력하세요..."
                className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-[#03C75A] min-h-[150px]"
              />
            </div>

            <Button
              onClick={handleWrite}
              disabled={loading}
              className="w-full bg-slate-900 dark:bg-white text-white dark:text-black font-bold py-6 text-lg rounded-xl shadow-lg mt-4 disabled:opacity-50"
            >
              {loading ? "처리 중..." : "카페에 글쓰기"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function NaverCafePage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-10">로딩 중...</div>}>
      <NaverCafeWriteContent />
    </Suspense>
  );
}
