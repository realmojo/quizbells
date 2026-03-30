import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 - 페이지를 찾을 수 없습니다 | 퀴즈벨(Quizbells)",
  description:
    "요청하신 페이지를 찾을 수 없습니다. 퀴즈 정답과 앱테크 정보를 빠르게 받아보세요.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-24">
      <Card className="max-w-md w-full text-center shadow-lg">
        <CardContent className="space-y-6 py-12">
          <h1 className="text-4xl font-bold text-gray-900">
            404 Not Found
          </h1>
          <p className="text-gray-600 text-sm leading-relaxed">
            요청하신 페이지를 찾을 수 없습니다.
            <br />
            주소가 변경되었거나 삭제되었을 수 있습니다.
          </p>

          <Separator />

          <a href="/" target="_self">
            <Button variant="default" className="mt-4">
              홈으로 돌아가기
            </Button>
          </a>
        </CardContent>
      </Card>
    </main>
  );
}
