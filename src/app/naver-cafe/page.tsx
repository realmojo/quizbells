"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { quizItems } from "@/utils/utils";
import { getQuizbells } from "@/utils/api";
import { format } from "date-fns";

function NaverCafeWriteContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [accessToken, setAccessToken] = useState("");
  const [loading, setLoading] = useState(false);

  // 카페 목록 상수
  const CAFE_LIST = [
    { id: "31632186", name: "재테크플로우" },
    { id: "22290117", name: "월급쟁이 재테크연구카페" },
    { id: "30786704", name: "정가를 거부하는 사람들" },
    { id: "direct", name: "직접 입력" },
  ];

  // 폼 상태
  const [clubId, setClubId] = useState(CAFE_LIST[0].id);
  const [customClubId, setCustomClubId] = useState("");
  const [menuId, setMenuId] = useState(""); // 예: 1 (게시판 ID)
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");

  // 메뉴(게시판) 목록 상태
  const [menuList, setMenuList] = useState<any[]>([]);
  const [loadingMenus, setLoadingMenus] = useState(false);

  // 퀴즈 불러오기 상태
  const [selectedQuizType, setSelectedQuizType] = useState(quizItems[0].type);

  const NAVER_CLIENT_ID = process.env.NEXT_PUBLIC_NAVER_CLIENT_ID;
  const CALLBACK_URL = "https://quizbells.com/naver-cafe"; // 설정된 콜백 URL 입력

  // 실제 전송에 사용할 clubId 계산
  const effectiveClubId = clubId === "direct" ? customClubId : clubId;

  // 카페 변경 시 메뉴 목록 불러오기
  useEffect(() => {
    const fetchMenus = async () => {
      if (!effectiveClubId) return;

      setLoadingMenus(true);
      setMenuList([]); // 초기화
      // 카페 변경 시 기존 선택된 메뉴 ID 초기화 (안전하게)
      // setMenuId("");

      try {
        const res = await fetch(`/api/naver/menus?clubId=${effectiveClubId}`);
        const data = await res.json();

        if (data && data.result && data.result.menus) {
          // 메뉴 구조 평탄화 or 필요한 것만 필터링
          // API 구조: result.menus -> [{ menuId, name, ... }, ...]
          // 그룹 메뉴 등 복잡할 수 있으니 단순 필터링
          // 실제 글쓰기 가능한 메뉴만 보여주면 좋지만, 우선 전체 로드

          if (effectiveClubId === "22290117") {
            data.result.menus = data.result.menus.filter((menu: any) => {
              const includeMenuIds = [564, 532, 542, 543, 549, 556, 533];

              return includeMenuIds.includes(menu.menuId);
            });
          }

          setMenuList(data.result.menus);
        }
      } catch (error) {
        console.error("메뉴 로딩 실패:", error);
        toast.error("게시판 목록을 불러오지 못했습니다.");
      } finally {
        setLoadingMenus(false);
      }
    };

    fetchMenus();
  }, [effectiveClubId]); // clubId나 customClubId가 바뀌면 실행

  // ... (handleLogin, useEffect 생략)

  // 퀴즈 정답 불러오기 핸들러
  const handleLoadQuiz = async () => {
    setLoading(true);
    try {
      const today = new Date();
      const answerDate = format(today, "yyyy-MM-dd");
      const dateLabel = format(today, "M월 d일");

      const quizItem = quizItems.find((item) => item.type === selectedQuizType);
      const quizName = quizItem
        ? `${quizItem.typeKr} ${quizItem.title}`
        : selectedQuizType;

      const data = await getQuizbells(selectedQuizType, answerDate);

      // 데이터 구조 확인 및 처리: data.contents 배열 사용
      if (data && data.contents && data.contents.length > 0) {
        // 일반 텍스트 포맷으로 변경 (가독성 및 수정 용이성)
        let contentText = `안녕하세요~ ${dateLabel} ${quizName} 정답 공유합니다! ^^\n\n`;

        const prevAnswers: string[] = [];
        data.contents.forEach((q: any) => {
          if (prevAnswers.includes(q.answer)) {
            return;
          }
          prevAnswers.push(q.answer);
          contentText += `Q. ${q.question || "퀴즈 내용"}\n`;
          contentText += `정답: ${q.answer}\n`;
          if (q.otherAnswers && q.otherAnswers.length > 0) {
            contentText += `(또 다른 정답: ${q.otherAnswers.join(", ")})\n`;
          }
          contentText += `\n`;
        });

        contentText += `모두 포인트 적립하시고 좋은 하루 되세요~\n`;
        contentText += `https://quizbells.com/quiz/${selectedQuizType}/today (퀴즈벨 앱테크 정답 알림)`;

        setSubject(`${quizName} 정답 [${dateLabel}]`);
        setContent(contentText);
        toast.success(`'${quizName}' 정답을 불러왔습니다.`);
      } else {
        toast.error("아직 등록된 오늘 날짜 퀴즈가 없습니다.");
      }
    } catch (error) {
      console.error(error);
      toast.error("퀴즈 정보를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 1. 네이버 로그인 URL 생성 및 이동
  const handleLogin = () => {
    if (!NAVER_CLIENT_ID) {
      toast.error(
        "환경 변수(NEXT_PUBLIC_NAVER_CLIENT_ID)가 설정되지 않았습니다."
      );
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
            toast.error(
              "토큰 발급 실패: " + (data.error_description || "알 수 없는 오류")
            );
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
    const targetClubId = clubId === "direct" ? customClubId : clubId;

    if (!accessToken) {
      toast.error("먼저 네이버 로그인을 해주세요.");
      return;
    }
    if (!targetClubId || !menuId || !subject || !content) {
      toast.error("모든 필드를 입력해주세요.");
      return;
    }

    setLoading(true);
    try {
      // 1. 네이버 카페 글쓰기 API 호출
      const res = await fetch("/api/naver/write", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // 주의: api/naver/write는 body를 JSON으로 받고 내부에서 FormData/QueryString으로 변환함.
        // 현재 client -> api route는 JSON으로 통신하므로 JSON.stringify가 맞음.
        body: JSON.stringify({
          accessToken,
          clubId: targetClubId,
          menuId,
          subject,
          content,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success("카페 글쓰기 성공! 🎉");
        // 글쓰기 성공 후 초기화는 선택사항 (연속 등록을 위해 내용만 유지할 수도 있음)
        // setSubject("");
        // setContent("");
      } else {
        toast.error(
          "글쓰기 실패: " +
            (data.message ? data.message.error.msg : "알 수 없는 오류")
        );
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
          <div className="space-y-6">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg text-sm font-medium text-center">
              ✅ 인증되었습니다 (토큰 보유)
            </div>

            {/* 퀴즈 정답 불러오기 섹션 */}
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                🤖 오늘의 정답 불러오기
              </label>
              <div className="flex gap-2">
                <select
                  value={selectedQuizType}
                  onChange={(e) => setSelectedQuizType(e.target.value)}
                  className="flex-1 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#03C75A]"
                >
                  {quizItems.map((item) => (
                    <option key={item.type} value={item.type}>
                      {item.typeKr} {item.title}
                    </option>
                  ))}
                </select>
                <Button
                  onClick={handleLoadQuiz}
                  variant="outline"
                  className="whitespace-nowrap bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  불러오기
                </Button>
              </div>
            </div>

            <hr className="border-slate-100 dark:border-slate-800" />

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                카페 선택
              </label>
              <select
                value={clubId}
                onChange={(e) => setClubId(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-[#03C75A]"
              >
                {CAFE_LIST.map((cafe) => (
                  <option key={cafe.id} value={cafe.id}>
                    {cafe.name}
                  </option>
                ))}
              </select>

              {clubId === "direct" && (
                <input
                  type="text"
                  value={customClubId}
                  onChange={(e) => setCustomClubId(e.target.value)}
                  placeholder="카페 ID 직접 입력"
                  className="w-full px-4 py-3 mt-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-[#03C75A]"
                />
              )}
              <p className="text-xs text-slate-400 mt-1">
                * 글을 작성할 카페를 선택하세요.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                게시판 선택 (Menu ID)
              </label>
              {loadingMenus ? (
                <div className="text-sm text-slate-500 py-3 px-1">
                  게시판 목록을 불러오는 중... ⏳
                </div>
              ) : menuList.length > 0 ? (
                <select
                  value={menuId}
                  onChange={(e) => setMenuId(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-[#03C75A]"
                >
                  <option value="">게시판을 선택하세요</option>
                  {menuList.map((menu: any) => (
                    <option key={menu.menuId} value={menu.menuId}>
                      {menu.name}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={menuId}
                  onChange={(e) => setMenuId(e.target.value)}
                  placeholder="예: 1 (목록 로딩 실패 시 직접 입력)"
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-[#03C75A]"
                />
              )}
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
                className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-[#03C75A] min-h-[300px]"
              />
              <p className="text-xs text-slate-400 mt-2 text-right">
                * HTML 태그 사용이 가능합니다.
              </p>
            </div>

            <Button
              onClick={handleWrite}
              disabled={loading}
              className="w-full bg-slate-900 dark:bg-white text-white dark:text-black font-bold py-6 text-lg rounded-xl shadow-lg mt-4 disabled:opacity-50 hover:bg-slate-800"
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");

  const handleCheckPassword = () => {
    if (password === "1313") {
      setIsAuthenticated(true);
      toast.success("접속 승인되었습니다.");
    } else {
      toast.error("비밀번호가 올바르지 않습니다.");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCheckPassword();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6">
        <div className="max-w-xs w-full bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 text-center">
          <h2 className="text-xl font-bold mb-6 text-slate-800 dark:text-white">
            🔒 관리자 접근 확인
          </h2>
          <div className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="비밀번호 입력"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white text-center text-lg"
              autoFocus
            />
            <Button
              onClick={handleCheckPassword}
              className="w-full py-6 text-lg rounded-xl font-bold"
            >
              확인
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Suspense
      fallback={<div className="flex justify-center p-10">로딩 중...</div>}
    >
      <NaverCafeWriteContent />
    </Suspense>
  );
}
