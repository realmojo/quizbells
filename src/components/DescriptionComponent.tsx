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
          <strong>돈버는퀴즈</strong>는 각 회차당 1회만 참여할 수 있으며, 정답을
          맞혀 캐시를 획득한 후에는 퀴즈 내용이 변경되더라도 재참여가
          불가능합니다. 정답을 반복 입력하거나 부정한 방법으로 당첨금을 중복
          수령할 경우 서비스 이용이 제한될 수 있으므로 정당한 참여가
          필수적입니다.
        </p>

        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          <strong>캐시딜과 제로딜</strong>은 3시간 동안만 진행되는 타임특가 쇼핑
          행사로, 상품 구매 후 배송이 완료되면 구매 확정 시 포인트를 지급합니다.
          포인트는 상품별로 최대 7%까지 적립되며, 다양한 프로모션과 연계하여
          더욱 높은 혜택을 누릴 수 있는 것이 특징입니다.
        </p>

        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          <strong>돈버는라방</strong>은 라이브 커머스를 3분 이상 시청하기만 해도
          캐시를 얻을 수 있는 효율적인 리워드 기능입니다. 알림받기 설정을
          활용하면 방송 시작과 동시에 안내를 받을 수 있어, 선착순으로 지급되는
          보상을 놓치지 않고 챙길 수 있습니다.
        </p>

        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          <strong>만보기 기능</strong>은 캐시워크의 핵심으로, 하루 최대
          10,000보까지 걸음 수에 비례하여 캐시를 적립해주며 이는 건강한 생활
          습관 형성을 돕습니다. 앱은 사용자의 위치를 기반으로 최적화된 혜택을
          제공하기 위해 백그라운드 상태에서도 위치 데이터를 수집할 수 있습니다.
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
          신한카드의 모바일 결제 앱<strong>신한 SOL페이</strong>에서 혜택 탭 →
          퀴즈팡팡 메뉴에서 참여할 수 있으며, 정답 맞히면{" "}
          <strong>마이신한포인트</strong> 1P가 적립됩니다. 힌트를 확인하면 추가
          1P가 제공됩니다.
        </p>

        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          <strong>신한 슈퍼SOL 출석퀴즈</strong>는 포인트 더 모으기 메뉴에서
          참여 가능하며, 하루 정답 횟수가 누적되어 등급별 혜택이 주어지고, 월
          30회 정답 시 <strong>최대 10,000P</strong>까지 랜덤 적립됩니다.
        </p>

        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          <strong>신한 SOL뱅크 쏠야구 퀴즈</strong>는 신한은행의 모바일 앱{" "}
          <strong>신한 SOL뱅크</strong> 및 <strong>슈퍼SOL</strong>의 쏠야구
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
          이벤트는 신한은행 신한카드 정책에 따라 조기 종료될 수 있으니{" "}
          <strong>앱 내 힌트 보기와 진행 상황</strong>을 수시로 확인하는 것이
          좋습니다.
        </p>
      </>
    );
  } else if (type === "kakaobank") {
    return (
      <>
        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          <strong>카카오뱅크 OX퀴즈</strong>는 카카오뱅크 앱에서 진행되는 정답형
          참여 퀴즈입니다. 앱 내 알림 또는 이벤트 페이지를 통해 퀴즈에 참여할 수
          있습니다.
        </p>
        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          퀴즈는 <strong>OX형 문제</strong>로 구성되어 있으며, 문제에 정답을
          선택하여 참여할 수 있습니다. 정답자에게는{" "}
          <strong>이벤트 참여 보상</strong>
          으로 추첨을 통한 경품 또는 리워드가 제공됩니다.
        </p>
        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          퀴즈는 <strong>이벤트 기간 중 1회 참여</strong> 방식이며, 정답을
          선택한 후 제출하면 참여가 완료됩니다. 퀴즈 정답 및 당첨 여부는{" "}
          <strong>앱 푸시 알림</strong> 또는{" "}
          <strong>이벤트 페이지 내 결과 발표</strong>를 통해 확인할 수 있습니다.
        </p>
        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          카카오뱅크 OX퀴즈는 카카오뱅크가 주관하는 이벤트의 일환으로 진행되며,
          퀴즈 내용, 정답 기준, 보상 방식은{" "}
          <strong>카카오뱅크 이벤트 안내사항</strong>에 따릅니다.
        </p>
        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          참여 전 반드시 <strong>카카오뱅크 앱 최신 버전</strong>으로
          업데이트되어 있어야 하며, 일부 기능은{" "}
          <strong>알림 설정 및 이벤트 수신 동의</strong>가 필요한 경우도
          있습니다.
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
          <strong>카카오페이 퀴즈타임</strong>은 카카오페이에서 운영하는 참여형
          퀴즈 콘텐츠입니다. 사용자는 카카오페이 앱 또는 카카오톡 내 카카오페이
          서비스 탭을 통해 퀴즈에 참여할 수 있습니다.
        </p>
        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          퀴즈타임은 일정 기간 또는 특정 이벤트 시점에 제공되며, 사용자는 퀴즈를
          풀고 정답을 맞히면 <strong>페이포인트</strong> 또는 리워드를 받을 수
          있습니다.
        </p>
        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          퀴즈는 <strong>일반상식, 금융지식, 이벤트 연계</strong> 등의 다양한
          주제로 구성되며, 객관식이나 OX형식으로 출제됩니다. 정답자는 정해진
          포인트 또는 혜택을 받을 수 있습니다.
        </p>
        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          참여는 <strong>카카오페이 계정 로그인</strong>을 통해 가능하며, 일부
          퀴즈는 카카오톡 알림 또는 배너 등을 통해 참여를 유도합니다. 참여
          조건이나 포인트 지급 방식은 퀴즈마다 상이할 수 있습니다.
        </p>
        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          <strong>카카오페이 퀴즈타임</strong>은 주로{" "}
          <strong>카카오페이 앱</strong> 또는{" "}
          <strong>카카오톡 내 페이 탭</strong>에서 참여할 수 있으며, 참여 기록과
          리워드는 해당 앱에서 확인 가능합니다.
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
          제공하는 실시간 참여형 퀴즈 이벤트입니다. 사용자들은 앱 내 오!퀴즈
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
          오!퀴즈 정답은 오케이캐시백 앱 내에서 확인 가능하며, 특정 제휴 브랜드
          및 이벤트성 퀴즈도 포함됩니다. 브랜드 정보나 힌트를 기반으로 문제를
          풀게끔 구성되어 있어, 자연스럽게 제휴사 홍보 효과도 동반합니다.
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
          매일 정답을 맞히면 스타포인트가 누적되며, 앱 내 생활/혜택 메뉴에서
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
          버전 기준 평점 4.4점(1200개 평가 기준)을 기록했으며, 사용자들은 광고
          없이 바로 포인트 적립” 등 긍정적인 평가를 남기고 있습니다.{" "}
        </p>
      </>
    );
  } else if (type === "3o3") {
    return (
      <>
        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          <strong>삼쩜삼(3.3)</strong>은 프리랜서, N잡러, 사업자 등의 종합소득세
          신고 및 환급을 도와주는 세무 서비스 앱입니다. 자영업자나 프리랜서로
          활동하며 3.3% 세금을 원천징수 당한 사용자들이 간편하게 세무 신고를
          진행하고 환급 여부를 확인할 수 있도록 돕습니다.
        </p>
        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          삼쩜삼에서는 매일{" "}
          <strong>오늘의 경제 퀴즈 또는 삼쩜삼 OX 퀴즈</strong>를 통해 퀴즈를
          맞히고 포인트를 적립할 수 있습니다. 퀴즈는 대부분 OX 형식이며,
          세금·경제 상식과 관련된 간단한 내용을 포함합니다.
        </p>
        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          <strong>포인트는 최대 1만 포인트까지 적립</strong>이 가능하며, 적립한
          포인트는 <strong>네이버페이, 편의점, 커피 등</strong> 다양한
          제휴처에서 사용할 수 있는 기프티콘 또는 간편 결제 수단으로 교환할 수
          있습니다.
        </p>
        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          퀴즈는 앱 알림 또는 배너를 통해 안내되며, 퀴즈 정답을 맞힌
          사용자에게는 보상 포인트가 즉시 지급됩니다. 퀴즈에 참여하기 위해서는{" "}
          <strong>삼쩜삼 회원가입</strong>이 필요합니다.
        </p>
        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          삼쩜삼 앱은 iOS 및 Android 모두 지원하며, 구글 플레이 스토어 기준{" "}
          <strong>수십만 다운로드</strong>를 기록하고 있습니다. 사용자는 세무
          관련 신고뿐 아니라 출석 체크, 리워드 퀴즈, 알림 등을 통해 추가 혜택을
          누릴 수 있습니다.
        </p>
      </>
    );
  } else if (type === "doctornow") {
    return (
      <>
        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          <strong>닥터나우</strong>는 원격진료, 약 배송 서비스를 제공하는 비대면
          진료 플랫폼입니다. 의사와 환자가 모바일 앱을 통해 화상 또는 전화로
          진료를 진행할 수 있으며, 진료 이후 처방전을 기반으로 약 배송까지
          원스톱으로 연결됩니다.
        </p>
        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          닥터나우 앱에서는 <strong>오늘의 퀴즈</strong>라는 이름의 리워드형
          퀴즈 콘텐츠를 운영하고 있습니다. 사용자는 앱 내 퀴즈에 참여하여 정답을
          맞히면 포인트를 적립할 수 있습니다. 퀴즈는 건강상식, 의학지식 등과
          관련된 주제를 포함하고 있습니다.
        </p>
        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          <strong>퀴즈 참여 보상으로 적립되는 포인트</strong>는 일정 수준 이상
          모았을 경우 <strong>기프티콘 교환 등</strong>의 용도로 사용할 수
          있습니다. 앱 내에서 포인트 사용처 및 적립 내역을 확인할 수 있는 기능이
          제공됩니다.
        </p>
        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          닥터나우의 퀴즈는 푸시 알림 또는 앱 홈화면 배너 등을 통해 참여를
          유도하며, 정답 제출 후 즉시 포인트가 적립됩니다. 퀴즈 참여를 위해서는{" "}
          <strong>닥터나우 회원가입</strong> 및 <strong>앱 로그인</strong>이
          필요합니다.
        </p>
        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          닥터나우 앱은 <strong>iOS 및 Android</strong>에서 모두 다운로드
          가능하며, 원격 진료 및 약 배송 서비스를 지원합니다. Google Play 스토어
          및 App Store를 통해 앱 설치가 가능합니다.
        </p>
      </>
    );
  } else if (type === "mydoctor") {
    return (
      <>
        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          <strong>나만의 닥터</strong>는 건강 관련 콘텐츠를 제공하는
          플랫폼입니다. 사용자는 앱 또는 웹을 통해 다양한 건강 정보를 확인할 수
          있습니다.
        </p>
        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          나만의 닥터에서는 <strong>건강퀴즈</strong>라는 이름의 콘텐츠를
          운영하고 있습니다. 사용자는 퀴즈에 참여하여 정답을 맞히는 형식으로
          건강 관련 상식을 점검할 수 있습니다.
        </p>
        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          건강퀴즈는 <strong>건강정보, 질병예방, 생활습관</strong> 등과 관련된
          주제를 포함하고 있으며, 사용자의 자가 건강 인식 향상에 도움을 줍니다.
        </p>
        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          퀴즈 참여는 <strong>회원가입 없이도 가능</strong>하며, 일부 기능은
          로그인 이후에 제공될 수 있습니다. 퀴즈는 정기적으로 업데이트됩니다.
        </p>
        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          나만의 닥터는 <strong>웹 또는 모바일 환경에서</strong> 이용할 수
          있으며, 앱 제공 여부는 공식 웹사이트 또는 마켓 페이지를 통해 확인이
          필요합니다.
        </p>
      </>
    );
  } else if (type === "climate") {
    return (
      <>
        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          <strong>기후행동 기후동행 기회소득</strong>은 서울특별시가 운영하는
          시민 참여형 환경 인센티브 제도입니다. 서울 시민이 친환경 생활 실천을
          하면 포인트를 적립하고, 다양한 보상을 받을 수 있는 제도입니다.
        </p>
        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          참여자는 전용 앱 또는 웹페이지를 통해 <strong>오늘의 퀴즈</strong>에
          참여할 수 있습니다. 퀴즈는 환경, 탄소중립, 에너지 절약 등의 주제로
          출제되며, 참여 시 일정 포인트가 제공됩니다.
        </p>
        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          퀴즈는 주로 OX 형식으로 출제되며, 정답을 제출하면{" "}
          <strong>기후포인트</strong>가 적립됩니다. 오답을 제출해도 일부
          포인트가 지급되며, 해당 포인트는 제휴처 혜택이나 서울시 환경 캠페인
          참여 등에 사용할 수 있습니다.
        </p>
        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          퀴즈 참여는 <strong>하루 1회 가능</strong>하며, 서울시민 누구나 참여할
          수 있습니다. 로그인 또는 인증 절차가 필요할 수 있으며, 앱 내 초대 코드
          기능을 통해 친구 추천도 가능합니다.
        </p>
        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          <strong>기후행동 기후동행 기회소득</strong>은 서울시 공식 홈페이지,
          앱스토어 및 구글플레이에서 다운로드 가능한 전용 앱을 통해 참여
          가능합니다. 퀴즈와 실천 인증 외에도 다양한 환경 캠페인에 참여할 수
          있습니다.
        </p>
      </>
    );
  } else if (type === "hpoint") {
    return (
      <>
        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          <strong>현대포인트 퀴즈</strong>는 현대백화점그룹의 통합 멤버십
          서비스인
          <strong> H.Point</strong>에서 운영하는 퀴즈형 이벤트입니다. 사용자는
          H.Point 모바일 앱을 통해 퀴즈에 참여할 수 있습니다.
        </p>
        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          퀴즈는 일반적으로{" "}
          <strong>현대백화점, 현대홈쇼핑, 현대그린푸드</strong> 등 그룹 계열사의
          서비스, 프로모션 또는 쇼핑 정보와 관련된 내용을 바탕으로 출제됩니다.
          특정 테마나 브랜드 캠페인에 맞춰 퀴즈가 진행되며,
          <strong>정답 제출 시 H.Point 적립</strong> 혜택이 주어집니다.
        </p>
        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          참여자는 H.Point 앱 내 이벤트 영역에서 퀴즈를 확인할 수 있으며, 정답을
          맞히면 <strong>즉시 포인트</strong>가 적립됩니다. 일부 퀴즈는 참여
          횟수나 기간이 제한되어 있으며,
          <strong>일일 퀴즈 또는 주간 이벤트</strong> 형식으로 제공되기도
          합니다.
        </p>
        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          퀴즈 형식은 <strong>객관식 또는 단답형</strong>으로 출제되며, 힌트나
          관련 정보는 이벤트 설명 또는 H.Point 콘텐츠에서 함께 제공됩니다. 퀴즈
          참여는 <strong>로그인한 회원에 한해</strong> 가능하며, H.Point
          회원가입 후 누구나 이용할 수 있습니다.
        </p>
        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          적립된 H.Point는 <strong>현대백화점, 현대홈쇼핑, H몰 등</strong>{" "}
          제휴처에서 사용할 수 있으며, 일부 퀴즈는 당첨자 추첨을 통해 추가
          경품이 제공되는 경우도 있습니다. 퀴즈 내용은 H.Point 앱 공지사항이나
          이벤트 화면에서 확인 가능합니다.
        </p>
      </>
    );
  } else if (type === "skstoa") {
    return (
      <>
        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          <strong>SK스토아 퀴즈</strong>는 SK스토아에서 운영하는 쇼핑 연계형
          이벤트 퀴즈입니다. SK스토아는 TV홈쇼핑과 모바일 커머스를 운영하는 통합
          플랫폼으로, 사용자는 앱 또는 웹사이트를 통해 퀴즈에 참여할 수
          있습니다.
        </p>
        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          퀴즈는 일반적으로 SK스토아의 상품 정보, 방송 콘텐츠, 쇼핑 혜택 등과
          관련된 주제로 출제됩니다. SK스토아 퀴즈는{" "}
          <strong>이벤트성으로 간헐적 제공</strong>되며, 특정 기간 동안 진행되는
          프로모션과 함께 열리는 경우가 많습니다.
        </p>
        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          참여자는 <strong>SK스토아 모바일 앱</strong>이나 웹사이트 내 이벤트
          배너, 알림 등을 통해 퀴즈에 접근할 수 있으며, 정답 제출 시 포인트나
          적립금, 할인쿠폰 등의 <strong>리워드</strong>를 받을 수 있습니다.
        </p>
        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          퀴즈는 선택형, 객관식 또는 OX 형식으로 구성되며, 퀴즈 이벤트에 따라{" "}
          <strong>참여 횟수나 보상 조건</strong>이 달라질 수 있습니다. 이벤트
          상세 안내는 SK스토아 공지사항이나 각 퀴즈 페이지에서 확인할 수
          있습니다.
        </p>
        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          SK스토아 퀴즈는 <strong>회원 가입자에 한해 참여 가능</strong>하며,
          로그인 후 참여가 원칙입니다. 일부 이벤트의 경우 방송 중 실시간 참여를
          요구하기도 하며, 방송 중 퀴즈 정답을 공개하는 방식도 존재합니다.
        </p>
        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          SK스토아는 해당 퀴즈를 통해 고객의 쇼핑 몰입도를 높이고,{" "}
          <strong>참여형 마케팅</strong>을 통해 고객과의 소통을 강화하고
          있습니다. 적립된 포인트는 추후 구매 시 현금처럼 사용 가능하며, 일부
          혜택은 이벤트 종료 후 자동 지급됩니다.
        </p>
      </>
    );
  } else if (type === "hanabank") {
    return (
      <>
        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          <strong>하나원큐 오늘의 퀴즈</strong>는 하나은행의 대표 모바일 앱인{" "}
          <strong>하나원큐</strong>에서 제공하는 퀴즈 콘텐츠입니다. 해당 퀴즈는
          하나원큐 앱 내에서 참여할 수 있으며, 주로 앱 실행 시 표시되는 프로모션
          배너 또는 퀴즈 이벤트 화면을 통해 접근 가능합니다.
        </p>
        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          퀴즈는 일반적으로{" "}
          <strong>하나은행의 금융 상품, 서비스, 이벤트</strong> 등과 관련된
          내용으로 출제되며, <strong>객관식 또는 단답형</strong> 문제 형식을
          따릅니다. 참여자는 정답을 제출하면 리워드 혜택을 받을 수 있습니다.
        </p>
        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          <strong>퀴즈 정답을 맞히면 하나머니 포인트 또는 응모권</strong> 등의
          혜택이 지급되며, 일부 이벤트의 경우 추첨을 통해 경품이 제공되기도
          합니다. 지급 방식과 시기는 퀴즈별 이벤트 안내에 명시됩니다.
        </p>
        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          하나원큐 오늘의 퀴즈는 <strong>하나은행 고객 또는 앱 사용자</strong>
          라면 누구나 참여할 수 있으며, 퀴즈는 앱에서 정해진 기간 동안만
          제공됩니다. 정답은 일반적으로 <strong>제출 즉시 확인</strong>{" "}
          가능하며, 일부 이벤트는 일정 기간 후 당첨자 발표 형식으로 운영되기도
          합니다.
        </p>
        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          퀴즈 내용과 리워드 조건은 수시로 변경될 수 있으며, 하나은행은 해당
          이벤트를 통해 앱 이용자와의{" "}
          <strong>상호 소통 및 금융 상품 홍보</strong>를 병행하고 있습니다. 상세
          내용은 퀴즈 페이지 또는 하나원큐 앱 공지사항 등을 통해 확인할 수
          있습니다.
        </p>
      </>
    );
  } else if (type === "auction") {
    return (
      <>
        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          <strong>옥션 매일 퀴즈</strong>는 이베이코리아에서 운영하는 온라인
          쇼핑몰 <strong>옥션(Auction)</strong>에서 제공하는 참여형 퀴즈
          이벤트입니다. 퀴즈는 주로{" "}
          <strong>옥션 모바일 앱 또는 웹사이트</strong>를 통해 참여할 수 있으며,
          메인 화면 배너 또는 이벤트 메뉴에서 퀴즈로 이동 가능합니다.
        </p>
        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          퀴즈는 일반적으로 <strong>하루 1문제</strong>가 출제되며,{" "}
          <strong>쇼핑 혜택, 인기 상품, 할인 이벤트</strong>와 관련된 주제를
          포함합니다. 객관식 또는 빈칸 채우기 형태로 구성되며, 정답을 제출하면
          포인트 또는 응모권 등의 리워드가 제공됩니다.
        </p>
        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          <strong>
            정답을 맞히면 스마일캐시 또는 할인쿠폰, 경품 응모 기회
          </strong>{" "}
          등의 보상이 주어지며, 일부 이벤트는{" "}
          <strong>선착순 참여자 또는 추첨 방식</strong>으로 당첨자를 선정합니다.
          당첨 여부는 이벤트 종료 후 별도 공지되거나, 스마일캐시 적립 내역 등을
          통해 확인할 수 있습니다.
        </p>
        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          옥션 매일 퀴즈는 <strong>옥션 회원</strong>이라면 누구나 참여
          가능하며, 참여를 위해 로그인이 필요합니다. 정답은{" "}
          <strong>제출 직후 확인</strong>할 수 있으며, 잘못된 정답을
          제출하더라도 하루 1회 재참여 기회는 제한됩니다.
        </p>
        <p
          className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6"
          itemProp="description"
        >
          해당 이벤트는 <strong>쇼핑몰 내 사용자 활성화 및 브랜드 홍보</strong>
          를 목적으로 운영되며, 자세한 이벤트 조건, 정답 공개 시점, 리워드 지급
          방식 등은 옥션 공식 이벤트 페이지에서 확인할 수 있습니다.
        </p>
      </>
    );
  } else if (type === "nh") {
    return (
      <>
        <p className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6">
          <strong>농협 디깅 퀴즈</strong>는 NH농협은행의 공식 모바일 앱인{" "}
          <strong>올원뱅크(NH All-One Bank)</strong>에서 제공하는 정기 퀴즈
          이벤트입니다.
        </p>

        <p className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6">
          사용자는 <strong>NH 올원뱅크 앱 접속 후</strong>, 메인 홈 또는 이벤트
          메뉴에 있는 <strong>‘디깅 퀴즈(Digging Quiz)’</strong> 배너를 클릭하여
          퀴즈에 참여할 수 있습니다.
        </p>

        <p className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6">
          퀴즈는 일반적으로{" "}
          <strong>
            농협의 금융상품, 서비스, 공익 캠페인, 디지털 금융 정보
          </strong>
          와 관련된 객관식 문제 형식이며, 퀴즈 참여 시{" "}
          <strong>포인트(예: 올포인트) 또는 경품</strong>을 지급하는 프로모션과
          함께 진행됩니다.
        </p>

        <p className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6">
          디깅퀴즈는 <strong>매주 또는 특정 기간 동안 한정적으로 진행</strong>
          되며, 퀴즈 정답을 맞힐 경우 즉시 리워드가 지급되거나 추첨 이벤트에
          자동 응모되는 방식이 사용됩니다.
        </p>

        <p className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6">
          일부 퀴즈의 경우{" "}
          <strong>
            NH농협 관련 유튜브 콘텐츠를 시청한 뒤 정답을 맞히는 미션형 퀴즈
          </strong>
          로 제공되기도 합니다. 퀴즈는 일반적으로 하루 1문제 또는 이벤트 기간 중
          1회 참여 형식으로 제한됩니다.
        </p>

        <p className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6">
          참여 전 반드시 NH 올원뱅크 앱의{" "}
          <strong>이벤트 상세 페이지의 안내사항 및 유의사항</strong>을 확인하는
          것이 좋습니다.
        </p>
      </>
    );
  } else if (type === "kbank") {
    return (
      <>
        <p className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6">
          <strong>케이뱅크 퀴즈</strong>는 케이뱅크의 공식 모바일 앱인{" "}
          <strong>케이뱅크 앱</strong>에서 제공하는 정기 퀴즈 이벤트입니다.
        </p>

        <p className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6">
          사용자는 <strong>케이뱅크 앱 접속 후</strong>, 메인 홈 또는 이벤트
          메뉴에 있는 <strong>퀴즈 이벤트 배너</strong>를 클릭하여 퀴즈에 참여할
          수 있습니다.
        </p>

        <p className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6">
          퀴즈는 일반적으로{" "}
          <strong>
            케이뱅크의 금융상품, 서비스, 디지털 금융 정보, 생활 금융 상식
          </strong>
          과 관련된 객관식 문제 형식이며, 퀴즈 참여 시{" "}
          <strong>포인트 또는 경품 추첨 기회</strong>를 제공하는 프로모션과 함께
          진행됩니다.
        </p>

        <p className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6">
          케이뱅크 퀴즈는{" "}
          <strong>매주 또는 특정 기간 동안 한정적으로 진행</strong>되며, 퀴즈
          정답을 맞힐 경우 즉시 리워드가 지급되거나 추첨 이벤트에 자동 응모되는
          방식이 사용됩니다. 일부 퀴즈의 경우{" "}
          <strong>
            케이뱅크 관련 콘텐츠를 확인한 뒤 정답을 맞히는 미션형 퀴즈
          </strong>
          로 제공되기도 합니다.
        </p>

        <p className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6">
          참여 전 반드시 케이뱅크 앱의{" "}
          <strong>이벤트 상세 페이지의 안내사항 및 유의사항</strong>을 확인하는
          것이 좋습니다.
        </p>
      </>
    );
  } else if (type === "monimo") {
    return (
      <>
        <p className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6">
          <strong>모니모 모니스쿨 퀴즈</strong>는 모니모에서 운영하는 퀴즈
          이벤트입니다.
        </p>
        <p className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6">
          사용자는 <strong>모니모 앱 접속 후</strong>, 메인 홈 또는 이벤트
          메뉴에 있는 <strong>퀴즈 이벤트 배너</strong>를 클릭하여 퀴즈에 참여할
          수 있습니다.
        </p>
        <p className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6">
          퀴즈는 일반적으로{" "}
          <strong>
            모니모의 금융상품, 서비스, 디지털 금융 정보, 생활 금융 상식
          </strong>
          과 관련된 객관식 문제 형식이며, 퀴즈 참여 시{" "}
          <strong>포인트 또는 경품 추첨 기회</strong>를 제공하는 프로모션과 함께
          진행됩니다.
        </p>
        <p className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6">
          모니모 모니스쿨 퀴즈는{" "}
          <strong>매주 또는 특정 기간 동안 한정적으로 진행</strong>되며, 퀴즈
          정답을 맞힐 경우 즉시 리워드가 지급되거나 추첨 이벤트에 자동 응모되는
          방식이 사용됩니다. 일부 퀴즈의 경우{" "}
          <strong>
            모니모 관련 콘텐츠를 확인한 뒤 정답을 맞히는 미션형 퀴즈
          </strong>
          로 제공되기도 합니다.
        </p>
        <p className="text-gray-700 text-base leading-relaxed tracking-tight mt-6 mb-6">
          참여 전 반드시 모니모 앱의{" "}
          <strong>이벤트 상세 페이지의 안내사항 및 유의사항</strong>을 확인하는
          것이 좋습니다.
        </p>
      </>
    );
  }

  return null;
}
