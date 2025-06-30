// app/terms/page.tsx
export const metadata = {
  title: "퀴즈벨 이용약관 - 앱테크 퀴즈 정답 알림 서비스",
  description:
    "퀴즈벨(Quizbells)의 이용약관 안내 페이지입니다. 퀴즈 정답 제공 및 서비스 이용 시 유의사항과 권리·의무를 확인하세요.",
  openGraph: {
    title: "퀴즈벨 이용약관",
    description:
      "퀴즈벨 서비스 이용과 관련된 사용자 권리 및 의무, 책임에 대한 약관을 안내합니다.",
    url: "https://quizbells.com/terms",
    type: "website",
  },
  alternates: {
    canonical: "https://quizbells.com/terms",
  },
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 space-y-8 text-sm text-gray-800">
      <section>
        <h2 className="text-xl font-semibold mb-2">1. 목적</h2>
        <p>
          본 약관은 퀴즈벨(이하 &quot;회사&quot;)이 제공하는 퀴즈 정답 알림
          서비스(이하 &quot;서비스&quot;)의 이용과 관련하여 회사와 사용자 간의
          권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">2. 정의</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>
            &quot;서비스&quot;란 회사가 운영하는 웹사이트 및 모바일 앱을 통해
            퀴즈 정답 및 알림 정보를 제공하는 행위를 의미합니다.
          </li>
          <li>
            &quot;사용자&quot;란 본 약관에 따라 서비스를 이용하는 개인 또는
            법인을 의미합니다.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">3. 서비스 제공</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>
            회사는 사용자에게 퀴즈 정답, 푸시 알림, 퀴즈 검색 및 기록 기능 등을
            제공합니다.
          </li>
          <li>
            서비스는 기본적으로 무료로 제공되며, 일부 기능에 대해 광고가 포함될
            수 있습니다.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">4. 이용자의 의무</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>서비스를 악의적으로 이용하거나 방해해서는 안 됩니다.</li>
          <li>
            타인의 개인정보를 무단으로 수집하거나 저장·공유해서는 안 됩니다.
          </li>
          <li>
            서비스와 관련된 지적 재산권은 회사에 귀속되며, 무단 복제·배포를
            금지합니다.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">5. 책임의 제한</h2>
        <p>
          회사는 무료로 제공되는 서비스와 관련하여, 서비스의 중단, 오류, 누락,
          손해 등에 대해 법적 책임을 지지 않습니다. 다만, 서비스의 안정적인
          제공을 위해 최선을 다합니다.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">6. 개인정보 보호</h2>
        <p>
          회사는 개인정보 보호법 등 관계 법령을 준수하며, 사용자의 개인정보는
          개인정보처리방침에 따라 보호됩니다. 이용자는{" "}
          <a href="/privacy" className="text-blue-600 underline">
            개인정보처리방침
          </a>
          을 반드시 숙지해야 합니다.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">7. 약관의 변경</h2>
        <p>
          회사는 관련 법령의 변경이나 서비스 개선 등을 위해 약관을 수정할 수
          있으며, 변경 사항은 사이트 공지 또는 이메일을 통해 사전 안내합니다.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">8. 문의처</h2>
        <p>
          본 약관과 관련한 문의 사항은 아래 이메일을 통해 접수해 주세요.
          <br />
          📧{" "}
          <a
            href="mailto:quizbell.help@gmail.com"
            className="text-blue-600 underline"
          >
            quizbell.help@gmail.com
          </a>
        </p>
      </section>

      <p className="text-xs text-gray-500 text-right">
        &copy; {new Date().getFullYear()} Quizbells. All rights reserved.
      </p>
    </div>
  );
}
