import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Head from "next/head";

export default function NotFound() {
  return (
    <>
      <Head>
        <title>404 - 페이지를 찾을 수 없습니다 | 퀴즈벨(Quizbells)</title>
        <meta
          name="description"
          content="요청하신 페이지를 찾을 수 없습니다. 퀴즈 정답과 앱테크 정보를 빠르게 받아보세요."
        />
        <meta
          property="og:title"
          content="404 - 페이지를 찾을 수 없습니다 | 퀴즈벨(Quizbells)"
        />
        <meta
          property="og:description"
          content="퀴즈벨에서 유효한 페이지로 이동해 주세요."
        />
        <meta property="og:image" content="/icons/android-icon-192x192.png" />
      </Head>

      <main className="flex min-h-screen flex-col items-center justify-center px-4 py-24">
        <Card className="max-w-md w-full text-center shadow-lg">
          <CardContent className="space-y-6 py-12">
            <h1 className="text-4xl font-bold text-gray-900">
              😢 404 Not Found
            </h1>
            <p className="text-gray-600 text-sm leading-relaxed">
              요청하신 페이지를 찾을 수 없습니다.
              <br />
              주소가 변경되었거나 삭제되었을 수 있습니다.
            </p>

            <Separator />

            <Link href="/">
              <Button variant="default" className="mt-4">
                🏠 홈으로 돌아가기
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
