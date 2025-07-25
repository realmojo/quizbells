import { Separator } from "@/components/ui/separator";
import React from "react";

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto max-w-[720px] px-4 py-8 mb-20">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        개인정보처리방침
      </h1>
      <Separator />
      <section className="mt-8 space-y-6">
        {/* 기존 본문 전체 복사 */}
        <div className="space-y-6 text-gray-800">
          <p>
            퀴즈벨(Quizbell)은 다양한 앱테크 퀴즈의 정답 정보를 실시간으로
            제공하고, 사용자에게 퀴즈 알림 및 포인트 적립 정보를 안내하는
            서비스입니다. 본 페이지는 개인정보 보호 관련 사항을 사용자에게
            명확히 알리기 위한 목적으로 제공됩니다.
          </p>
          <Separator />
          <section>
            <h2 className="mb-2 text-xl font-semibold">
              1. 수집하는 개인정보 항목
            </h2>
            <ul className="list-inside list-disc space-y-1 text-sm">
              <li>FCM 푸시 알림용 디바이스 토큰</li>
              <li>사용자가 선택한 퀴즈 유형(type) 및 알림 설정 값</li>
            </ul>
          </section>
          <Separator />
          <section>
            <h2 className="mb-2 text-xl font-semibold">
              2. 개인정보 수집 목적
            </h2>
            <ul className="list-inside list-disc space-y-1 text-sm">
              <li>퀴즈 정답 알림 및 앱테크 정보 푸시 알림 제공</li>
              <li>사용자 맞춤형 퀴즈 추천 서비스 운영</li>
              <li>시스템 오류 분석 및 사용성 개선을 위한 통계 분석</li>
            </ul>
          </section>
          <Separator />
          <section>
            <h2 className="mb-2 text-xl font-semibold">
              3. 개인정보 보유 및 이용 기간
            </h2>
            <p className="text-sm">
              수집된 정보는 푸시 알림 및 서비스 제공을 위한 최소한의 기간 동안만
              보유되며, 사용자가 알림 수신을 중단하거나 서비스 탈퇴 시 즉시
              파기됩니다.
            </p>
          </section>
          <Separator />
          <section>
            <h2 className="mb-2 text-xl font-semibold">
              4. 개인정보 제3자 제공
            </h2>
            <p className="text-sm">
              퀴즈벨은 사용자의 개인정보를 제3자에게 제공하지 않습니다. 단, 관계
              법령에 따라 수사기관의 요청이 있는 경우에는 관련 법률에 따라
              제공될 수 있습니다.
            </p>
          </section>
          <Separator />
          <section>
            <h2 className="mb-2 text-xl font-semibold">
              5. 사용자 권리 및 행사 방법
            </h2>
            <ul className="list-inside list-disc space-y-1 text-sm">
              <li>언제든지 푸시 알림 수신 동의/철회가 가능합니다.</li>
              <li>서비스 탈퇴 시 개인정보는 자동으로 삭제됩니다.</li>
              <li>
                기타 개인정보 열람, 수정, 삭제 요청은 이메일로 접수 가능합니다.
              </li>
            </ul>
          </section>
          <Separator />
          <section>
            <h2 className="mb-2 text-xl font-semibold">
              6. 개인정보 보호책임자 안내
            </h2>
            <p className="text-sm">
              개인정보 관련 문의는{" "}
              <a
                className="text-blue-600 underline ml-1"
                href="mailto:quizbell.help@gmail.com"
              >
                quizbell.help@gmail.com
              </a>{" "}
              으로 접수해 주세요. 문의사항은 신속히 검토 및 처리해드리겠습니다.
            </p>
          </section>
        </div>
      </section>
      <Separator className="my-8" />
      <p className="text-xs text-gray-500 text-center mt-10">
        &copy; {new Date().getFullYear()} 퀴즈벨. All rights reserved.
      </p>
    </main>
  );
}
