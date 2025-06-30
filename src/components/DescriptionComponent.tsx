"use client";

export default function DescriptionComponents({ type }: { type: string }) {
  if (type === "toss") {
    return (
      <>
        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          토스 행운퀴즈는 모바일 금융 서비스 토스(Toss) 앱에서 제공하는 대표적인{" "}
          리워드 퀴즈 이벤트입니다. 불특정 시간에 오픈되는 형식으로, 퀴즈에
          참여하면 포인트를 적립할 수 있으며 앱 사용자들에게 일상 속 소소한
          보상을 제공합니다.
        </p>

        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          퀴즈가 시작되면 푸시 알림으로 참여 가능 여부를 알려주며, 하루에 여러
          문제를 제한 없이 풀 수 있다는 점에서 자유도가 높습니다. 정답을 맞히면
          토스 포인트 또는 제휴 브랜드의 상품 리워드를 받을 수 있습니다.
        </p>

        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          토스행운퀴즈 문제는 협력 브랜드의 제품 정보나 캠페인 내용을 기반으로
          출제됩니다. 일부 문제는 힌트나 구글 검색이 필요할 수도 있어,
          자연스럽게 브랜드 정보를 탐색하게끔 설계되어 있습니다.
        </p>

        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          정답을 맞힐 때마다 포인트가 즉시 적립되며, 누적된 포인트는 편의점
          쿠폰, 카페 교환권, 모바일 상품권 등으로 전환 가능합니다. 단, 퀴즈마다
          상금 한도가 존재 하기 때문에 상금이 모두 소진되면 자동으로 종료되니
          빠른 참여가 중요합니다.
        </p>

        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          종료된 퀴즈의 경우에도 일정 시간 동안 힌트를 다시 확인할 수 있어
          학습이나 복습용으로 활용 가능합니다. 또한, 퀴즈 종료 이후에도 추가로
          공개되는 이벤트 페이지 및 할인 혜택이 제공되므로 계속 앱을 체크하는
          것이 좋습니다.
        </p>

        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          이러한 참여형 앱테크 퀴즈는 사용자의 흥미를 유발할 뿐 아니라, 브랜드
          마케팅 효과도 함께 달성할 수 있는 구조로 운영됩니다. 퀴즈를 통해
          브랜드 노출과 정보 전달이 자연스럽게 이루어지며, 사용자 경험도
          향상됩니다.
        </p>

        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          토스 행운퀴즈의 장점은 반복 참여가 가능하고 앱 내 다양한 리워드 적립
          기회를 제공한다는 점입니다. 퀴즈가 끝난 뒤에도 포인트 사용처가
          다양하고 이벤트가 이어지므로, 지속적인 앱테크 수단으로 매우
          유용합니다.
        </p>
      </>
    );
  } else if (type === "cashwalk") {
    return (
      <>
        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          <strong>캐시워크</strong>는 걷기만 해도 포인트(캐시)를 지급하는
          대표적인 만보기 앱입니다. 사용자들의 건강한 습관 형성을 돕기 위해
          100걸음당 1캐시를 적립해주며, 하루 최대 10,000보까지 보상을 받을 수
          있습니다.
        </p>

        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          이와 함께 제공되는 <strong>캐시워크 퀴즈</strong>는 다양한 브랜드와
          협업해 출제되는 퀴즈 이벤트입니다. 퀴즈에 참여해 정답을 맞히면 랜덤한
          캐시를 추가로 적립할 수 있으며, 상금이 모두 소진되면 해당 퀴즈는
          종료됩니다.
        </p>

        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          퀴즈는 <strong>힌트 보기</strong> 기능을 통해 제휴 브랜드의 상품 또는
          캠페인 내용을 소개하고, 사용자는 이를 바탕으로 정답을 추측하거나 직접
          검색해볼 수 있습니다. 자연스럽게 브랜드와 사용자의 연결 고리를 만드는
          구조입니다.
        </p>

        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          <strong>퀴즈 외에도</strong> 캐시워크에서는 다양한 리워드 기능이
          제공됩니다. 출석체크, 보물상자 클릭, 행운 룰렛 등으로 추가 캐시를
          획득할 수 있으며, 앱에서 직접 사용할 수 있는 할인쿠폰이나 모바일
          상품권으로 교환이 가능합니다.
        </p>

        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          이러한 퀴즈 시스템은 단순한 정보 전달을 넘어 사용자에게 실질적인
          혜택을 제공하며, 브랜드 입장에서는 높은 홍보 효과를 기대할 수
          있습니다. 캐시워크는 건강 관리와 소소한 재테크를 동시에 실현할 수 있는
          대표적인 <strong>앱테크 플랫폼</strong>입니다.
        </p>
      </>
    );
  } else if (type === "shinhan") {
    return (
      <>
        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          <strong>신한 쏠페이 퀴즈팡팡</strong>(구 신한플레이 OX퀴즈)은
          신한카드의 모바일 결제 앱<strong>신한 SOL페이</strong>에서 '혜택' 탭 →
          '퀴즈팡팡' 메뉴에서 참여할 수 있으며, 정답 맞히면{" "}
          <strong>마이신한포인트</strong> 1P가 적립됩니다. 힌트를 확인하면 추가
          1P가 제공됩니다.
        </p>

        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          <strong>신한 슈퍼SOL 출석퀴즈</strong>는 '포인트 더 모으기' 메뉴에서
          참여 가능하며, 하루 정답 횟수가 누적되어 등급별 혜택이 주어지고, 월
          30회 정답 시 <strong>최대 10,000P</strong>까지 랜덤 적립됩니다.
        </p>

        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          <strong>신한 SOL뱅크 쏠야구 퀴즈</strong>는 신한은행의 모바일 앱{" "}
          <strong>신한 SOL뱅크</strong> 및 <strong>슈퍼SOL</strong>의 '쏠야구'
          탭에서 참여할 수 있는 야구 상식형 퀴즈입니다. 정답 제출 시{" "}
          <strong>2~100P</strong>가 추첨 방식으로 지급되며, 더블 이벤트 기간에는{" "}
          <strong>최대 200P</strong>까지 획득 가능합니다.
        </p>

        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          모든 쏠퀴즈는 힌트 보기 기능을 제공하며, 힌트를 확인하면 추가 포인트를
          얻거나, 브랜드 정보 탐색과 문제 정답 유추가 용이하도록 설계되었습니다.
        </p>

        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          또한 각 퀴즈는 월별 누적 참여 횟수에 따라 등급별 보상이 주어지며,
          이벤트는 신한은행·신한카드 정책에 따라 조기 종료될 수 있으니{" "}
          <strong>앱 내 '힌트 보기'와 진행 상황</strong>을 수시로 확인하는 것이
          좋습니다.
        </p>
      </>
    );
  } else if (type === "okcashbag") {
    return (
      <>
        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          <strong>오케이캐시백(OK캐쉬백) 오!퀴즈</strong>는 OK캐시백 앱에서
          제공하는 실시간 참여형 퀴즈 이벤트입니다. 사용자들은 앱 내 ‘오!퀴즈’
          영역에서 간단한 퀴즈에 푸시 알림이나 앱 접근을 통해 즉시 참여할 수
          있고, 정답 시 <strong>캐시백 포인트</strong>를 적립할 수 있습니다.
        </p>

        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          이 퀴즈는 사전에 공지 없이 랜덤하게 출제되며, 선착순 응답이나 시간
          제한이 있을 수 있어 빠른 참여가 유리합니다. 문제를 맞히면 적게는 몇몇
          포인트에서 많게는 수천 포인트까지 지급되며, 지속 참여 시 더욱 많은
          혜택을 누릴 수 있습니다.
        </p>

        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          오!퀴즈 정답은 ‘오케이캐시백 앱 내에서 확인 가능’하며, 특정 제휴
          브랜드 및 이벤트성 퀴즈도 포함됩니다. 브랜드 정보나 힌트를 기반으로
          문제를 풀게끔 구성되어 있어, 자연스럽게 제휴사 홍보 효과도 동반합니다.
        </p>

        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          사용자들은 퀴즈를 풀면서 쌓은 OK캐시백 포인트를 제휴 매장 또는
          온라인에서 현금처럼 사용할 수 있습니다. 또한 포인트는 다양한 쿠폰 및
          할인 혜택으로도 교환이 가능하여 실용적인 보상 수단으로 활용됩니다.
        </p>
      </>
    );
  } else if (type === "cashdoc") {
    return (
      <>
        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          <strong>캐시닥 용돈퀴즈</strong>는 캐시닥 앱, 타임스프레드 앱,
          지니어트 앱에서 동시에 라이브로 진행되는 실시간 퀴즈 이벤트입니다.
          참여자는 퀴즈가 출제된 즉시 정답을 맞히면{" "}
          <strong>랜덤 금액의 캐시</strong>를 적립할 수 있습니다.
        </p>

        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          퀴즈는 사전 공지 없이 랜덤한 시간에 오픈되며,{" "}
          <strong>상금 한도가 소진되면 자동 종료</strong>됩니다. 앱 사용자는
          퀴즈 시작 버튼이 보이면 즉시 참여할 수 있어야 리워드를 놓치지
          않습니다.
        </p>

        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          정답자에게는 <strong>최대 1만 캐시</strong>가 지급되며, 이미 참여한
          퀴즈는 재참여가 불가능합니다. 캐시닥은{" "}
          <strong>무료로 이용 가능</strong>하며, 모든 사용자에게 개방된
          구조입니다.
        </p>

        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          퀴즈 외에도 캐시닥 앱은 출석체크, 용돈라방, 건강관리 등 다양한
          방식으로 캐시를 적립할 수 있는 <strong>앱테크 플랫폼</strong>입니다.
          적립한 캐시는 카페, 편의점, 문화상품권 등에서 사용할 수 있는 쿠폰으로
          교환이 가능합니다.
        </p>
      </>
    );
  } else if (type === "kakaopay") {
    return (
      <>
        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          <strong>카카오페이 퀴즈타임</strong>은 카카오페이 앱의 ‘혜택’ 또는
          ‘매일 모으기’ 메뉴에서 참여할 수 있는 실시간 퀴즈 이벤트입니다. 문제가
          출제되면 정답 입력 시<strong>카카오페이 포인트(페이포인트)</strong>가
          즉시 적립됩니다.
        </p>

        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          매번 랜덤한 문제가 출제되며, 최대 <strong>20문제까지 참여</strong>할
          수 있고, 각 문제를 맞히면 대략 <strong>20P</strong>가 즉시 지급됩니다.
        </p>

        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          퀴즈타임은 <strong>선착순 응답 방식</strong>으로 운영되며, 문제는 매주
          3~4일 무작위 시간에 열립니다. 특히 오전 시간대에 자주 오픈한다고
          알려져 있어, 꾸준한 참여가 중요합니다.
        </p>

        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          적립된 페이포인트는 카카오페이 결제나 제휴 쿠폰 구매에 사용할 수
          있으며, 퀴즈타임 외에도 출석체크, 만보기 등 다양한 ‘매일 모으기’
          이벤트 기능이 함께 제공됩니다.
        </p>
      </>
    );
  } else if (type === "kbstar") {
    return (
      <>
        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          <strong>KB스타뱅킹 ‘도전미션 스타퀴즈’</strong>는 KB국민은행의 모바일
          뱅킹 앱<strong>KB스타뱅킹</strong>에서 제공하는 실시간 퀴즈
          이벤트입니다. 퀴즈는 주로 월~금요일에 출제되며, 사용자들은 퀴즈에
          참여해 정답을 맞히면 <strong>스타포인트</strong>를 적립할 수 있습니다.
        </p>

        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          이 퀴즈는 <strong>도전미션 형식</strong>으로 구성되며, 매일 간단한
          문제를 풀어 <strong>랜덤 또는 고정 포인트</strong>를 즉시 지급받을 수
          있습니다.
        </p>

        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          퀴즈는 사전 공지 없이 무작위로 출제되며, 선착순 응답 또는 시간제한이
          있을 수 있어 빠르게 참여하는 것이 유리합니다.
        </p>

        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          매일 정답을 맞히면 스타포인트가 누적되며, 앱 내 ‘생활/혜택’ 메뉴에서
          퀴즈를 확인할 수 있습니다. 이렇게 모인 포인트는 다양한{" "}
          <strong>금융 서비스 또는 제휴 상품 혜택</strong>에 사용할 수 있습니다.
        </p>
      </>
    );
  } else if (type === "bitbunny") {
    return (
      <>
        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          <strong>비트버니(Bitbunny)</strong>는 걷기만 해도 포인트를 적립할 수
          있는 <strong>만보기 기반 앱테크 리워드 앱</strong>입니다. 사용자는
          일상에서 걸음 수를 기록하는 것만으로 포인트를 얻을 수 있으며, 이
          포인트는 현금, 기프티콘, 암호화폐 등으로 전환할 수 있습니다.{" "}
        </p>
        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          앱은 카카오톡, 애플 계정 등으로 쉽게 회원가입할 수 있으며,{" "}
          <strong>삼성 헬스 등 걸음 수 연동 기능</strong>을 지원하여 별도 설정
          없이 자동으로 걸음을 기록하고 포인트로 적립합니다.{" "}
        </p>
        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          포인트는 매일 출석 체크, 퀴즈 참여, 광고 시청, 미션 수행 등을 통해
          추가로 적립할 수 있습니다. 특히{" "}
          <strong>퀴즈 정답을 맞히면 보너스 포인트</strong>가 지급되며, 이를
          통해 다양한 적립 기회를 제공합니다.{" "}
        </p>
        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          적립한 포인트는{" "}
          <strong>
            네이버페이, 기프티콘, 커피·치킨 등 모바일 쿠폰, 암호화폐, 현금화
          </strong>{" "}
          등 다양한 방식으로 환전하거나 사용할 수 있습니다. 암호화폐로 전환해
          재테크도 할 수 있습니다.{" "}
        </p>
        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          앱은 광고가 비교적 적고, 귀여운 토끼 캐릭터 UI가 특징입니다. 최근 iOS
          버전 기준 평점 4.4점(1200개 평가 기준)을 기록했으며, 사용자들은 “광고
          없이 바로 포인트 적립” 등 긍정적인 평가를 남기고 있습니다.{" "}
        </p>
      </>
    );
  }

  return null;
}
