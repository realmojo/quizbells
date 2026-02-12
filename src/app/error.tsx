"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-24">
      <Card className="max-w-md w-full text-center shadow-lg">
        <CardContent className="space-y-6 py-12">
          <h1 className="text-4xl font-bold text-gray-900">
            오류가 발생했습니다
          </h1>
          <p className="text-gray-600 text-sm leading-relaxed">
            페이지를 불러오는 중 문제가 발생했습니다.
            <br />
            잠시 후 다시 시도해 주세요.
          </p>

          <Separator />

          <div className="flex gap-3 justify-center mt-4">
            <Button variant="default" onClick={reset}>
              다시 시도
            </Button>
            <a href="/" target="_self">
              <Button variant="outline">홈으로 돌아가기</Button>
            </a>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
