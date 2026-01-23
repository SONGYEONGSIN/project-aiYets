export default function Home() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="bg-[#F7CB15] border-brutal shadow-brutal-lg p-8 md:p-12">
        <h1 className="text-4xl md:text-6xl font-black mb-4">
          AI 연말정산 계산기
        </h1>
        <p className="text-xl md:text-2xl font-bold mb-6">
          AI가 도와주는 똑똑한 연말정산, 최대 환급액을 찾아드립니다! 💰
        </p>
        <div className="flex flex-wrap gap-4">
          <a
            href="/dashboard"
            className="inline-block bg-black text-white px-8 py-4 text-lg font-bold border-brutal shadow-brutal hover-brutal"
          >
            시작하기 →
          </a>
          <a
            href="/calculator"
            className="inline-block bg-white text-black px-8 py-4 text-lg font-bold border-brutal shadow-brutal hover-brutal"
          >
            계산기 바로가기
          </a>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid md:grid-cols-3 gap-6">
        {/* Feature 1 */}
        <div className="bg-[#FF6B35] border-brutal shadow-brutal p-6">
          <div className="text-4xl mb-4">🤖</div>
          <h3 className="text-2xl font-bold mb-2">실시간 AI 분석</h3>
          <p className="text-lg">
            입력 데이터를 실시간으로 분석하여 절세 팁을 제공합니다.
          </p>
        </div>

        {/* Feature 2 */}
        <div className="bg-[#00D9FF] border-brutal shadow-brutal p-6">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-2xl font-bold mb-2">자동 데이터 관리</h3>
          <p className="text-lg">
            엑셀 업로드, 사진 OCR로 데이터를 자동으로 입력합니다.
          </p>
        </div>

        {/* Feature 3 */}
        <div className="bg-white border-brutal shadow-brutal p-6">
          <div className="text-4xl mb-4">🔔</div>
          <h3 className="text-2xl font-bold mb-2">세법 변경 알림</h3>
          <p className="text-lg">
            2026년 세법 변경사항을 자동으로 감지하고 알려드립니다.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white border-brutal shadow-brutal-lg p-8 md:p-12">
        <h2 className="text-3xl md:text-4xl font-black mb-8">어떻게 작동하나요?</h2>
        <div className="space-y-6">
          <div className="flex gap-4 items-start">
            <div className="bg-black text-white text-2xl font-black w-12 h-12 flex items-center justify-center border-brutal shadow-brutal-sm flex-shrink-0">
              1
            </div>
            <div>
              <h4 className="text-xl font-bold mb-1">급여 데이터 입력</h4>
              <p className="text-lg text-muted-foreground">
                관리자 페이지에서 급여명세서를 사진으로 찍어 업로드하거나 엑셀 파일로 한 번에 입력하세요.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="bg-[#FF6B35] text-black text-2xl font-black w-12 h-12 flex items-center justify-center border-brutal shadow-brutal-sm flex-shrink-0">
              2
            </div>
            <div>
              <h4 className="text-xl font-bold mb-1">AI가 실시간 분석</h4>
              <p className="text-lg text-muted-foreground">
                입력된 데이터를 AI가 분석하여 놓친 공제 항목과 절세 방법을 자동으로 찾아드립니다.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="bg-[#00D9FF] text-black text-2xl font-black w-12 h-12 flex items-center justify-center border-brutal shadow-brutal-sm flex-shrink-0">
              3
            </div>
            <div>
              <h4 className="text-xl font-bold mb-1">최대 환급액 확인</h4>
              <p className="text-lg text-muted-foreground">
                계산된 결과와 AI 추천을 바탕으로 최대 환급액을 받을 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-black text-white border-brutal shadow-brutal-lg p-8 md:p-12 text-center">
        <h2 className="text-3xl md:text-4xl font-black mb-4">
          지금 바로 시작하세요!
        </h2>
        <p className="text-xl mb-6">
          무료로 연말정산 계산을 시작하고, AI가 찾아주는 절세 팁을 받아보세요.
        </p>
        <a
          href="/dashboard"
          className="inline-block bg-[#F7CB15] text-black px-10 py-5 text-xl font-black border-brutal-white shadow-brutal-white hover-brutal"
        >
          무료로 시작하기 →
        </a>
      </section>
    </div>
  );
}
