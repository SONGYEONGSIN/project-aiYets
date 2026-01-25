export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="container max-w-6xl mx-auto px-4 pt-16 pb-12 text-center">
        {/* Badge */}
        <div className="inline-block mb-8">
          <span className="badge-retro">
            ✨ 2026년 연말정산 시즌 오픈!
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="font-head text-4xl md:text-6xl lg:text-7xl mb-6 leading-tight">
          연말정산, 더 이상<br />
          <span className="font-cursive text-5xl md:text-7xl lg:text-8xl italic">어렵지 않아요!</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
          AI가 도와주는 똑똑한 연말정산 시뮬레이터.
          <br />최대 환급액을 찾아드립니다.
        </p>

        {/* CTA Button */}
        <a
          href="/dashboard"
          className="btn-retro bg-primary text-black px-8 py-4 text-lg"
        >
          지금 시작하기 →
        </a>
      </section>

      {/* Features Cards Section */}
      <section className="container max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature Card 1 */}
          <div className="card-retro bg-retro-cyan p-8 text-center">
            <div className="text-5xl mb-4">🤖</div>
            <h3 className="font-head text-xl mb-2">AI 공제 분석</h3>
            <p className="text-muted-foreground">
              소득공제, 세액공제 항목을 AI가 분석하여 놓친 공제를 찾아드립니다.
            </p>
          </div>

          {/* Feature Card 2 */}
          <div className="card-retro bg-retro-yellow p-8 text-center">
            <div className="text-5xl mb-4">💰</div>
            <h3 className="font-head text-xl mb-2">예상 환급액 계산</h3>
            <p className="text-muted-foreground">
              입력된 데이터로 예상 환급액 또는 추가 납부액을 실시간으로 계산합니다.
            </p>
          </div>

          {/* Feature Card 3 */}
          <div className="card-retro bg-retro-pink p-8 text-center">
            <div className="text-5xl mb-4">📊</div>
            <h3 className="font-head text-xl mb-2">간편 데이터 입력</h3>
            <p className="text-muted-foreground">
              급여명세서 사진 OCR 또는 엑셀 업로드로 데이터를 자동 입력합니다.
            </p>
          </div>
        </div>
      </section>

      {/* 공제 항목 섹션 */}
      <section className="container max-w-6xl mx-auto px-4 py-16 text-center">
        <h2 className="font-head text-3xl md:text-4xl mb-4">
          다양한 공제 항목을 한눈에
        </h2>
        <p className="font-cursive text-3xl md:text-4xl italic mb-12">확인하세요!</p>

        {/* 공제 카드 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card-retro bg-retro-cyan p-4">
            <p className="font-head text-lg">의료비</p>
          </div>
          <div className="card-retro bg-retro-yellow p-4">
            <p className="font-head text-lg">교육비</p>
          </div>
          <div className="card-retro bg-retro-lime p-4">
            <p className="font-head text-lg">기부금</p>
          </div>
          <div className="card-retro bg-retro-pink p-4">
            <p className="font-head text-lg">보험료</p>
          </div>
          <div className="card-retro bg-retro-orange p-4">
            <p className="font-head text-lg">신용카드</p>
          </div>
          <div className="card-retro bg-retro-violet p-4">
            <p className="font-head text-lg">주택자금</p>
          </div>
          <div className="card-retro bg-white p-4">
            <p className="font-head text-lg">연금저축</p>
          </div>
          <div className="card-retro bg-retro-cyan p-4">
            <p className="font-head text-lg">월세</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container max-w-6xl mx-auto px-4 py-16">
        <h2 className="font-head text-3xl md:text-4xl text-center mb-4">이용 방법</h2>
        <p className="text-center text-muted-foreground mb-12">
          간단한 3단계로 연말정산을 완료하세요.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="card-retro bg-white p-8 text-center">
            <div className="w-12 h-12 bg-primary border-2 border-black rounded-full flex items-center justify-center mx-auto mb-4 font-head text-xl">
              1
            </div>
            <h3 className="font-head text-xl mb-2">데이터 입력</h3>
            <p className="text-muted-foreground">
              급여명세서와 공제 영수증을 업로드하거나 직접 입력하세요.
            </p>
          </div>

          {/* Step 2 */}
          <div className="card-retro bg-white p-8 text-center">
            <div className="w-12 h-12 bg-retro-cyan border-2 border-black rounded-full flex items-center justify-center mx-auto mb-4 font-head text-xl">
              2
            </div>
            <h3 className="font-head text-xl mb-2">AI 분석</h3>
            <p className="text-muted-foreground">
              AI가 입력된 데이터를 분석하여 최적의 공제 방법을 찾아드립니다.
            </p>
          </div>

          {/* Step 3 */}
          <div className="card-retro bg-white p-8 text-center">
            <div className="w-12 h-12 bg-retro-lime border-2 border-black rounded-full flex items-center justify-center mx-auto mb-4 font-head text-xl">
              3
            </div>
            <h3 className="font-head text-xl mb-2">결과 확인</h3>
            <p className="text-muted-foreground">
              예상 환급액과 절세 팁을 확인하고 연말정산에 활용하세요.
            </p>
          </div>
        </div>
      </section>

      {/* 사용자 후기 Section */}
      <section className="container max-w-6xl mx-auto px-4 py-16">
        <h2 className="font-head text-3xl md:text-4xl text-center mb-12">
          사용자 <span className="font-cursive italic">후기</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 후기 1 */}
          <div className="card-retro bg-white p-6">
            <div className="flex items-start gap-4">
              <div className="text-3xl">"</div>
              <div>
                <p className="text-muted-foreground mb-4">
                  작년보다 30만원 더 환급받았어요! 놓쳤던 의료비 공제를 AI가 찾아줬어요.
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-retro-cyan rounded-full border-2 border-black flex items-center justify-center font-head">김</div>
                  <div>
                    <p className="font-semibold">김직장</p>
                    <p className="text-sm text-muted-foreground">회사원</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 후기 2 */}
          <div className="card-retro bg-white p-6">
            <div className="flex items-start gap-4">
              <div className="text-3xl">"</div>
              <div>
                <p className="text-muted-foreground mb-4">
                  월세 세액공제 받는 법을 몰랐는데 여기서 알게 됐어요. 정말 유용해요!
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-retro-pink rounded-full border-2 border-black flex items-center justify-center font-head">이</div>
                  <div>
                    <p className="font-semibold">이사원</p>
                    <p className="text-sm text-muted-foreground">신입사원</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 후기 3 */}
          <div className="card-retro bg-white p-6">
            <div className="flex items-start gap-4">
              <div className="text-3xl">"</div>
              <div>
                <p className="text-muted-foreground mb-4">
                  부양가족 공제 누락됐던 거 찾아줘서 50만원 더 돌려받았습니다.
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-retro-yellow rounded-full border-2 border-black flex items-center justify-center font-head">박</div>
                  <div>
                    <p className="font-semibold">박과장</p>
                    <p className="text-sm text-muted-foreground">중견기업 과장</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 후기 4 */}
          <div className="card-retro bg-white p-6">
            <div className="flex items-start gap-4">
              <div className="text-3xl">"</div>
              <div>
                <p className="text-muted-foreground mb-4">
                  매년 연말정산 스트레스였는데 이제 10분이면 끝나요!
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-retro-lime rounded-full border-2 border-black flex items-center justify-center font-head">최</div>
                  <div>
                    <p className="font-semibold">최프리</p>
                    <p className="text-sm text-muted-foreground">프리랜서</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container max-w-6xl mx-auto px-4 py-8">
        <div className="bg-primary border-2 border-black rounded-2xl p-8 md:p-16 text-center shadow-brutal-lg">
          <h2 className="font-head text-3xl md:text-4xl mb-4 text-black">
            올해 연말정산,
          </h2>
          <p className="font-cursive text-3xl md:text-4xl italic text-black mb-4">
            얼마나 돌려받을 수 있을까요?
          </p>
          <p className="text-black/70 mb-8 max-w-xl mx-auto">
            지금 바로 시뮬레이션해보고 예상 환급액을 확인하세요.
            <br />AI가 놓친 공제 항목까지 찾아드립니다.
          </p>
          <a
            href="/dashboard"
            className="btn-retro bg-black text-white px-8 py-4 text-lg"
          >
            무료로 시작하기 →
          </a>
        </div>
      </section>

      {/* Bottom Spacing */}
      <div className="h-16"></div>
    </div>
  );
}
