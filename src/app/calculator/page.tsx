'use client';

import { useState, useRef, useEffect } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import CardInput from '@/components/CardInput';

export default function CalculatorPage() {
    const [results, setResults] = useState({
        totalSalary: 0,                  // 총 급여액
        incomeDeduction: 0,              // 근로소득공제
        incomeAmount: 0,                 // 근로소득금액
        itemizedDeduction: 0,            // 소득공제
        taxableIncome: 0,                // 종합소득과세표준
        calculatedTax: 0,                // 산출세액
        taxCredit: 0,                    // 세액감면 및 세액공제
        determinedTax: 0,                // 결정세액
        paidTax: 0,                      // 기납부세액
        refundAmount: 0,                 // 환급 예상액
    });
    const [isCalculated, setIsCalculated] = useState(false);

    // 급여 정보 State
    const [salaryData, setSalaryData] = useState({
        annualSalary: 61622780,          // 연봉 (급여 + 상여)
        mealAllowance: 2400000,          // 비과세(식대) - 연간
        childrenUnder6: 1,               // 6세 이하 자녀 수 (보육수당용)
    });

    // 보육수당 비과세 계산 (2026년: 6세 이하 자녀 1인당 월 20만원)
    const childcareAllowance = salaryData.childrenUnder6 * 200000 * 12; // 연간
    const totalTaxExempt = salaryData.mealAllowance + childcareAllowance;

    // 총 급여액 자동 계산 (연봉 - 비과세)
    const totalSalary = salaryData.annualSalary - totalTaxExempt;

    // 교육비·의료비 State
    const [eduMedData, setEduMedData] = useState({
        // 교육비
        selfEducation: 0,                // 본인 교육비
        preschool: 180000,               // 미취학
        elementary: 1448170,             // 초중고
        university: 0,                   // 대학
        // 의료비 (세부 항목)
        infertility: 0,                  // 난임시술비 (30%)
        premature: 0,                    // 미숙아,선천성이상아 의료비 (20%)
        selfDisabledSenior: 389200,      // 본인/장애인/만65세이상/6세이하/건강보험산정특례자 (15%, 한도없음)
        otherFamily: 1467140,            // 그 밖의 부양가족 의료비 (15%, 700만원 한도)
        insuranceReimbursement: 467488,  // 실손의료보험금 (차감)
    });

    // 기부금 State
    const [donationData, setDonationData] = useState({
        political: 100000,                // 정치자금 기부금
        hometown: 100000,                 // 고향사랑 기부금
        hometownDisaster: 0,             // 고향사랑 기부금 특별재난지역
        special: 0,                      // 특례기부금
        employee: 0,                     // 우리사주조합 기부금
        designated: 0,                   // 지정 기부금 (종교단체 외)
        religious: 0,                    // 종교단체 기부금
    });

    // 보험·연금 State
    const [insurancePensionData, setInsurancePensionData] = useState({
        insurance: 1000000,             // 보장성 보험료
        pensionSavings: 6000000,         // 연금저축
        irp: 3000000,                    // 퇴직연금(IRP)
        isa: 0,                          // ISA 추가 납입액
    });

    // 자녀 세액공제 State
    const [childTaxCreditData, setChildTaxCreditData] = useState({
        childrenOver8: 1,                // 만 8세 이상 자녀 수
        newbornOrAdopted: 0,             // 출산/입양 자녀 수 (해당 과세기간)
    });

    // 부양가족공제 State (1인당 150만원 소득공제)
    const [dependentData, setDependentData] = useState({
        spouse: 0,                       // 배우자 (1명)
        parents: 0,                      // 직계존속 (만60세 이상)
        children: 3,                     // 자녀/입양자 (만20세 이하)
        siblings: 0,                     // 형제자매 (만20세 이하 또는 만60세 이상)
        foster: 0,                       // 위탁아동 (6개월 이상)
        recipient: 0,                    // 기초생활수급자
    });

    // 사회보험료 State (전액 소득공제)
    const [socialInsuranceData, setSocialInsuranceData] = useState({
        nationalPension: 2258520,        // 국민연금
        healthInsurance: 1960580,        // 건강보험료
        longTermCare: 253760,            // 장기요양보험료
        employmentInsurance: 511390,     // 고용보험료
    });

    // 주택자금 State
    const [housingData, setHousingData] = useState({
        housingSavings: 0,               // 주택청약저축
        rent: 0,                         // 월세
        leaseLoan: 0,                    // 주택임차차입금 원리금상환액
        mortgageInterest: 0,             // 장기주택저당차입금 이자상환액
    });

    // 기납부세액 State
    const [paidTaxData, setPaidTaxData] = useState({
        paidTax: 1267560,                // 기납부 소득세 (원천징수 세액)
    });

    // 교육비 공제 계산 (15% 공제율)
    const calculateEducationDeduction = () => {
        const selfDeduction = eduMedData.selfEducation * 0.15; // 한도 없음
        const preschoolDeduction = Math.min(eduMedData.preschool, 3000000) * 0.15; // 300만원 한도
        const elementaryDeduction = Math.min(eduMedData.elementary, 3000000) * 0.15; // 300만원 한도
        const universityDeduction = Math.min(eduMedData.university, 9000000) * 0.15; // 900만원 한도

        return {
            self: Math.round(selfDeduction),
            preschool: Math.round(preschoolDeduction),
            elementary: Math.round(elementaryDeduction),
            university: Math.round(universityDeduction),
            total: Math.round(selfDeduction + preschoolDeduction + elementaryDeduction + universityDeduction)
        };
    };

    // 의료비 공제 계산 (3% 초과분에 대해서만 공제율 적용)
    const calculateMedicalDeduction = () => {
        const threshold = totalSalary * 0.03; // 총급여의 3%

        // 각 항목별 금액 (실손보험금은 차감)
        const totalMedical = eduMedData.infertility + eduMedData.premature +
            eduMedData.selfDisabledSenior + eduMedData.otherFamily;
        const netMedical = totalMedical - eduMedData.insuranceReimbursement; // 실손보험금 차감

        // 공제대상금액 = 실제 의료비 - 3% 기준 (0 이상)
        const deductibleAmount = Math.max(0, netMedical - threshold);

        // 그 밖의 부양가족 의료비 (700만원 한도)
        const otherFamilyLimited = Math.min(eduMedData.otherFamily, 7000000);

        // 세액공제액 계산 - 공제대상금액(3% 초과분)에 대해서만 공제
        let finalDeduction = 0;
        let remainingDeductible = deductibleAmount; // 남은 공제 대상 금액

        // 항목별 세액공제 상세 (표시용)
        let infertilityApplied = 0;   // 난임: 30%
        let prematureApplied = 0;     // 미숙아: 20%
        let selfDisabledApplied = 0;  // 본인/장애인 등: 15%
        let otherFamilyApplied = 0;   // 그 밖의 부양가족: 15%

        if (deductibleAmount > 0) {
            // 높은 공제율부터 적용 (난임 30% → 미숙아 20% → 나머지 15%)

            // 1. 난임시술비 (30%) - 가장 높은 공제율 우선 적용
            const infertilityAvailable = Math.min(eduMedData.infertility, remainingDeductible);
            infertilityApplied = infertilityAvailable;
            finalDeduction += infertilityAvailable * 0.30;
            remainingDeductible -= infertilityAvailable;

            // 2. 미숙아/선천성이상아 (20%)
            if (remainingDeductible > 0) {
                const prematureAvailable = Math.min(eduMedData.premature, remainingDeductible);
                prematureApplied = prematureAvailable;
                finalDeduction += prematureAvailable * 0.20;
                remainingDeductible -= prematureAvailable;
            }

            // 3. 본인/장애인/65세이상/6세이하/건강보험산정특례자 (15%)
            if (remainingDeductible > 0) {
                const selfDisabledAvailable = Math.min(eduMedData.selfDisabledSenior, remainingDeductible);
                selfDisabledApplied = selfDisabledAvailable;
                finalDeduction += selfDisabledAvailable * 0.15;
                remainingDeductible -= selfDisabledAvailable;
            }

            // 4. 그 밖의 부양가족 (15%, 700만원 한도)
            if (remainingDeductible > 0) {
                const otherFamilyAvailable = Math.min(otherFamilyLimited, remainingDeductible);
                otherFamilyApplied = otherFamilyAvailable;
                finalDeduction += otherFamilyAvailable * 0.15;
                remainingDeductible -= otherFamilyAvailable;
            }
        }

        return {
            infertility: eduMedData.infertility,
            premature: eduMedData.premature,
            selfDisabledSenior: eduMedData.selfDisabledSenior,
            otherFamily: eduMedData.otherFamily,
            otherFamilyLimited: otherFamilyLimited,
            insuranceReimbursement: eduMedData.insuranceReimbursement,
            totalMedical: totalMedical,
            netMedical: Math.round(netMedical),
            threshold: Math.round(threshold),
            deductibleAmount: Math.round(deductibleAmount),
            // 항목별 적용 금액 (표시용)
            infertilityApplied: Math.round(infertilityApplied),
            prematureApplied: Math.round(prematureApplied),
            selfDisabledApplied: Math.round(selfDisabledApplied),
            otherFamilyApplied: Math.round(otherFamilyApplied),
            deduction: Math.round(finalDeduction)
        };
    };

    const educationDeduction = calculateEducationDeduction();
    const medicalDeduction = calculateMedicalDeduction();

    // 기부금 공제 계산 함수 (국세청 공식 계산식)
    const calculateDonationDeduction = () => {
        // 정치자금: 10만원 이하 100/110 (≈90.909%), 10만원 초과 15%, 3천만원 초과 25%
        const politicalBaseAmount = Math.min(donationData.political, 100000);
        const politicalBase = politicalBaseAmount * (100 / 110);
        const politicalExcess = Math.max(0, donationData.political - 100000);
        const politicalExcess15 = Math.min(politicalExcess, 30000000);
        const politicalExcess25 = Math.max(0, politicalExcess - 30000000);
        const politicalExcessDeduction = politicalExcess15 * 0.15 + politicalExcess25 * 0.25;
        const politicalDeduction = politicalBase + politicalExcessDeduction;

        // 고향사랑 기부금 합산 한도: 일반 + 특별재난지역 합쳐서 연 2,000만원
        const hometownTotal = donationData.hometown + donationData.hometownDisaster;
        const hometownTotalLimit = 20000000;

        // 일반 고향사랑 먼저 적용, 남은 한도로 특별재난지역 적용
        const hometownLimited = Math.min(donationData.hometown, hometownTotalLimit);
        const hometownRemainingLimit = Math.max(0, hometownTotalLimit - hometownLimited);
        const hometownDisasterLimited = Math.min(donationData.hometownDisaster, hometownRemainingLimit);

        // 고향사랑 일반: 10만원 이하 100/110, 10만원 초과 15%
        const hometownBaseAmount = Math.min(hometownLimited, 100000);
        const hometownBase = hometownBaseAmount * (100 / 110);
        const hometownExcessAmount = Math.max(0, hometownLimited - 100000);
        const hometownExcess = hometownExcessAmount * 0.15;
        const hometownDeduction = hometownBase + hometownExcess;

        // 고향사랑 특별재난지역: 10만원 이하 100/110, 10만원 초과 30%
        const hometownDisasterBaseAmount = Math.min(hometownDisasterLimited, 100000);
        const hometownDisasterBase = hometownDisasterBaseAmount * (100 / 110);
        const hometownDisasterExcessAmount = Math.max(0, hometownDisasterLimited - 100000);
        const hometownDisasterExcess = hometownDisasterExcessAmount * 0.30;
        const hometownDisasterDeduction = hometownDisasterBase + hometownDisasterExcess;

        // 특례기부금: 소득 100% 한도, 1천만원 이하 15%, 초과분 30%
        const special15Amount = Math.min(donationData.special, 10000000);
        const special30Amount = Math.max(0, donationData.special - 10000000);
        const specialDeduction = special15Amount * 0.15 + special30Amount * 0.30;

        // 우리사주조합: 소득 30% 한도, 1천만원 이하 15%, 초과분 30%
        const employeeLimit = totalSalary * 0.30;
        const employeeLimited = Math.min(donationData.employee, employeeLimit);
        const employee15Amount = Math.min(employeeLimited, 10000000);
        const employee30Amount = Math.max(0, employeeLimited - 10000000);
        const employeeDeduction = employee15Amount * 0.15 + employee30Amount * 0.30;

        // 지정 기부금 (종교단체 외): 소득 30% 한도, 1천만원 이하 15%, 초과분 30%
        const designatedLimit = totalSalary * 0.30;
        const designatedLimited = Math.min(donationData.designated, designatedLimit);
        const designated15Amount = Math.min(designatedLimited, 10000000);
        const designated30Amount = Math.max(0, designatedLimited - 10000000);
        const designatedDeduction = designated15Amount * 0.15 + designated30Amount * 0.30;

        // 종교단체 기부금: 소득 10% 한도, 1천만원 이하 15%, 초과분 30%
        const religiousLimit = totalSalary * 0.10;
        const religiousLimited = Math.min(donationData.religious, religiousLimit);
        const religious15Amount = Math.min(religiousLimited, 10000000);
        const religious30Amount = Math.max(0, religiousLimited - 10000000);
        const religiousDeduction = religious15Amount * 0.15 + religious30Amount * 0.30;

        const totalDeduction = politicalDeduction + hometownDeduction + hometownDisasterDeduction +
            specialDeduction + employeeDeduction + designatedDeduction + religiousDeduction;

        return {
            political: Math.round(politicalDeduction),
            politicalDetail: {
                base: Math.round(politicalBase),
                baseAmount: politicalBaseAmount,
                excess15: Math.round(politicalExcess15 * 0.15),
                excess15Amount: politicalExcess15,
                excess25: Math.round(politicalExcess25 * 0.25),
                excess25Amount: politicalExcess25,
            },
            hometown: Math.round(hometownDeduction),
            hometownDetail: {
                base: Math.round(hometownBase),
                baseAmount: hometownBaseAmount,
                excess: Math.round(hometownExcess),
                excessAmount: hometownExcessAmount,
            },
            hometownDisaster: Math.round(hometownDisasterDeduction),
            hometownDisasterDetail: {
                base: Math.round(hometownDisasterBase),
                baseAmount: hometownDisasterBaseAmount,
                excess: Math.round(hometownDisasterExcess),
                excessAmount: hometownDisasterExcessAmount,
            },
            special: Math.round(specialDeduction),
            specialDetail: {
                amount15: special15Amount,
                deduction15: Math.round(special15Amount * 0.15),
                amount30: special30Amount,
                deduction30: Math.round(special30Amount * 0.30),
            },
            employee: Math.round(employeeDeduction),
            employeeDetail: {
                amount15: employee15Amount,
                deduction15: Math.round(employee15Amount * 0.15),
                amount30: employee30Amount,
                deduction30: Math.round(employee30Amount * 0.30),
            },
            designated: Math.round(designatedDeduction),
            designatedDetail: {
                amount15: designated15Amount,
                deduction15: Math.round(designated15Amount * 0.15),
                amount30: designated30Amount,
                deduction30: Math.round(designated30Amount * 0.30),
            },
            religious: Math.round(religiousDeduction),
            religiousDetail: {
                amount15: religious15Amount,
                deduction15: Math.round(religious15Amount * 0.15),
                amount30: religious30Amount,
                deduction30: Math.round(religious30Amount * 0.30),
            },
            total: Math.round(totalDeduction)
        };
    };

    const donationDeduction = calculateDonationDeduction();

    // 보험·연금 공제 계산
    const calculateInsurancePensionDeduction = () => {
        // 총급여액 기반 공제율 결정 (5,500만원 이하: 15%, 초과: 12%)
        // 참고: 원래 16.5%/13.2%이지만 지방세 제외하여 15%/12% 적용
        const pensionRate = totalSalary <= 55000000 ? 0.15 : 0.12;
        const pensionRatePercent = totalSalary <= 55000000 ? "15%" : "12%";

        // 보장성 보험료: 연 100만원 한도, 12%
        const insuranceLimited = Math.min(insurancePensionData.insurance, 1000000);
        const insuranceDeduction = insuranceLimited * 0.12;

        // 연금저축: 최대 600만원 한도 (2023년 개정, 총급여 무관)
        // 단, 연금저축 단독 400만원 한도, 퇴직연금 합산시 900만원 한도
        const pensionSavingsLimited = Math.min(insurancePensionData.pensionSavings, 6000000);

        // 퇴직연금(IRP): 연금저축 합산 최대 900만원 한도
        const irpLimited = Math.min(insurancePensionData.irp, Math.max(0, 9000000 - pensionSavingsLimited));

        // 연금 합계 세액공제
        const pensionTotal = pensionSavingsLimited + irpLimited;
        const pensionDeduction = pensionTotal * pensionRate;

        // ISA 추가 납입액: 납입액 3,000만원 한도, 세액공제는 10% (최대 300만원 한도)
        const isaLimited = Math.min(insurancePensionData.isa, 30000000);
        const isaDeduction = Math.min(isaLimited * 0.10, 3000000); // 300만원 한도

        return {
            insurance: Math.round(insuranceDeduction),
            insuranceDetail: {
                amount: insuranceLimited,
                rate: "12%",
            },
            pensionSavings: Math.round(pensionSavingsLimited * pensionRate),
            pensionSavingsDetail: {
                amount: pensionSavingsLimited,
                rate: pensionRatePercent,
            },
            irp: Math.round(irpLimited * pensionRate),
            irpDetail: {
                amount: irpLimited,
                rate: pensionRatePercent,
            },
            pensionTotal: Math.round(pensionDeduction),
            isa: Math.round(isaDeduction),
            isaDetail: {
                amount: isaLimited,
                rate: "10%",
            },
            total: Math.round(insuranceDeduction + pensionDeduction + isaDeduction),
            pensionRate: pensionRatePercent,
        };
    };

    const insurancePensionDeduction = calculateInsurancePensionDeduction();

    // 주택자금 공제 계산
    const calculateHousingDeduction = () => {
        // === 소득공제 항목 ===
        // 공제 순서: 1. 주택임차차입금 먼저 → 2. 주택청약저축 (남은 한도에서)
        // 합산 한도: 400만원

        const combinedLimit = 4000000; // 합산 한도 400만원

        // 1. 주택임차차입금 원리금상환액: 40% (먼저 적용)
        const leaseLoanRaw = housingData.leaseLoan * 0.40;
        const leaseLoanDeduction = Math.min(leaseLoanRaw, combinedLimit);

        // 2. 주택마련저축 (주택청약저축): 300만원 한도, 40% (남은 한도에서 적용)
        // ※ 총급여 7,000만원 초과 시 공제 대상 아님
        const isHousingSavingsEligible = totalSalary <= 70000000;
        const housingSavingsLimited = isHousingSavingsEligible ? Math.min(housingData.housingSavings, 3000000) : 0;
        const housingSavingsRaw = housingSavingsLimited * 0.40;
        const remainingLimit = Math.max(0, combinedLimit - leaseLoanDeduction);
        const housingSavingsDeduction = Math.min(housingSavingsRaw, remainingLimit);

        // 주택마련저축 + 주택임차차입금 합계
        const combinedLimited = leaseLoanDeduction + housingSavingsDeduction;

        // 3. 장기주택저당차입금 이자상환액: 전액 소득공제 (한도 적용은 조건에 따라 다름)
        const mortgageInterestDeduction = housingData.mortgageInterest;

        // 소득공제 합계 (주택임차+주택청약 합산한도 적용 후 + 장기주택저당)
        const incomeDeductionTotal = combinedLimited + mortgageInterestDeduction;

        // === 세액공제 항목 ===

        // 월세 세액공제: 1,000만원 한도
        // 총급여 5,500만원 이하: 17%, 초과 8,000만원 이하: 15%
        const rentLimited = Math.min(housingData.rent, 10000000);
        const rentRate = results.totalSalary <= 55000000 ? 0.17 : 0.15;
        const rentRatePercent = results.totalSalary <= 55000000 ? "17%" : "15%";
        const rentDeduction = rentLimited * rentRate;

        const taxCreditTotal = rentDeduction;

        return {
            housingSavings: Math.round(housingSavingsDeduction),
            housingSavingsDetail: {
                amount: housingSavingsLimited,
                rate: "40%",
            },
            rent: Math.round(rentDeduction),
            rentDetail: {
                amount: rentLimited,
                rate: rentRatePercent,
            },
            leaseLoan: Math.round(leaseLoanDeduction),
            leaseLoanDetail: {
                amount: housingData.leaseLoan,
                rate: "40%",
            },
            mortgageInterest: Math.round(mortgageInterestDeduction),
            mortgageInterestDetail: {
                amount: housingData.mortgageInterest,
                rate: "전액",
            },
            combinedLimited: Math.round(combinedLimited),
            combinedRaw: Math.round(leaseLoanRaw + housingSavingsRaw),
            incomeDeductionTotal: Math.round(incomeDeductionTotal),
            taxCreditTotal: Math.round(taxCreditTotal),
            rentRate: rentRatePercent,
        };
    };

    const housingDeduction = calculateHousingDeduction();

    // 근로소득세액공제 계산
    const calculateEarnedIncomeTaxCredit = () => {
        const calculatedTax = results.calculatedTax;
        const salary = totalSalary;

        // 1. 산출세액 기준 공제액 계산
        let taxCreditRaw: number;
        if (calculatedTax <= 1300000) {
            // 산출세액 130만원 이하: 55%
            taxCreditRaw = calculatedTax * 0.55;
        } else {
            // 산출세액 130만원 초과: 71.5만원 + (산출세액 - 130만원) × 30%
            taxCreditRaw = 715000 + (calculatedTax - 1300000) * 0.30;
        }

        // 2. 총급여 기준 한도 계산
        let creditLimit: number;
        if (salary <= 33000000) {
            // 3,300만원 이하: 74만원
            creditLimit = 740000;
        } else if (salary <= 70000000) {
            // 3,300만원 초과 7,000만원 이하: 74만원 - (총급여 - 3,300만원) × 0.008, 최소 66만원
            creditLimit = Math.max(660000, 740000 - (salary - 33000000) * 0.008);
        } else if (salary <= 120000000) {
            // 7,000만원 초과 1억2천만원 이하: 66만원 - (총급여 - 7,000만원) × 1/2, 최소 50만원
            creditLimit = Math.max(500000, 660000 - (salary - 70000000) * 0.5);
        } else {
            // 1억2천만원 초과: 50만원 - (총급여 - 1억2천만원) × 1/2, 최소 20만원
            creditLimit = Math.max(200000, 500000 - (salary - 120000000) * 0.5);
        }

        // 3. 최종 공제액 (산출세액 기준 vs 한도 중 작은 값)
        const finalCredit = Math.min(taxCreditRaw, creditLimit);

        return {
            taxCreditRaw: Math.round(taxCreditRaw),
            creditLimit: Math.round(creditLimit),
            finalCredit: Math.round(finalCredit),
            calculatedTax: calculatedTax,
            rate: calculatedTax <= 1300000 ? "55%" : "30%",
        };
    };

    const earnedIncomeTaxCredit = calculateEarnedIncomeTaxCredit();

    // 자녀 세액공제 계산
    const calculateChildTaxCredit = () => {
        const { childrenOver8, newbornOrAdopted } = childTaxCreditData;

        // 1. 기본 자녀 세액공제 (만 8세 이상)
        // 1명: 25만원, 2명: 55만원, 3명 이상: 55만원 + (N-2) × 40만원
        let basicCredit = 0;
        if (childrenOver8 === 1) {
            basicCredit = 250000;
        } else if (childrenOver8 === 2) {
            basicCredit = 550000;
        } else if (childrenOver8 >= 3) {
            basicCredit = 550000 + (childrenOver8 - 2) * 400000;
        }

        // 2. 출산/입양 자녀 세액공제
        // 첫째: 30만원, 둘째: 50만원, 셋째 이상: 70만원씩
        let birthAdoptionCredit = 0;
        for (let i = 1; i <= newbornOrAdopted; i++) {
            if (i === 1) birthAdoptionCredit += 300000;
            else if (i === 2) birthAdoptionCredit += 500000;
            else birthAdoptionCredit += 700000;
        }

        const totalCredit = basicCredit + birthAdoptionCredit;

        return {
            childrenOver8,
            newbornOrAdopted,
            basicCredit,
            birthAdoptionCredit,
            totalCredit,
        };
    };

    const childTaxCredit = calculateChildTaxCredit();

    // 카드·현금 사용액 State
    const [cardData, setCardData] = useState({
        creditCard: 15241850,            // 신용카드
        debitCard: 11036540,             // 체크카드
        cash: 6162286,                   // 현금영수증
        traditionalMarket: 1984300,      // 전통시장
        publicTransport: 1358970,        // 대중교통
        culture: 203767,                 // 문화체육
        childrenCount: 0,                // 자녀 수 (2026년 한도 확대용)
    });

    // 2026년 자녀 수 연계 한도 계산 함수
    const getCardDeductionLimit = (salary: number, children: number): number => {
        if (salary <= 70000000) {
            // 총급여 7천만원 이하
            if (children >= 2) return 4000000; // 400만원
            if (children === 1) return 3500000; // 350만원
            return 3000000; // 기본 300만원
        } else {
            // 총급여 7천만원 초과
            if (children >= 2) return 3000000; // 300만원
            if (children === 1) return 2750000; // 275만원
            return 2500000; // 기본 250만원
        }
    };

    // 카드 공제 계산 함수 (2026년 개정안 반영)
    const calculateCardDeduction = () => {
        const threshold = totalSalary * 0.25; // 총급여의 25%
        const basicCardUsage = cardData.creditCard + cardData.debitCard + cardData.cash;
        const totalUsage = basicCardUsage + cardData.traditionalMarket + cardData.publicTransport + cardData.culture;

        // 25%를 신용카드 → 체크카드 → 현금영수증 순서로 차감
        let remainingThreshold = threshold;

        // 신용카드에서 25% 차감
        const creditUsedForThreshold = Math.min(cardData.creditCard, remainingThreshold);
        remainingThreshold -= creditUsedForThreshold;

        // 체크카드에서 남은 25% 차감
        const debitUsedForThreshold = Math.min(cardData.debitCard, remainingThreshold);
        remainingThreshold -= debitUsedForThreshold;

        // 현금영수증에서 남은 25% 차감
        const cashUsedForThreshold = Math.min(cardData.cash, remainingThreshold);
        remainingThreshold -= cashUsedForThreshold;

        // 25% 초과분 계산 (각 항목별)
        const creditExcess = cardData.creditCard - creditUsedForThreshold;
        const debitExcess = cardData.debitCard - debitUsedForThreshold;
        const cashExcess = cardData.cash - cashUsedForThreshold;

        // 공제 계산 (25% 초과분에 대해서만)
        const creditDeduction = creditExcess * 0.15;     // 신용카드 15%
        const debitDeduction = debitExcess * 0.30;       // 체크카드 30%
        const cashDeduction = cashExcess * 0.30;         // 현금영수증 30%
        const marketDeduction = cardData.traditionalMarket * 0.40;  // 전통시장 40%
        const transportDeduction = cardData.publicTransport * 0.40; // 대중교통 40%
        const cultureDeduction = cardData.culture * 0.30;           // 문화체육 30%

        // 기본 공제 합계 (신용카드+체크카드+현금영수증)
        const basicDeduction = creditDeduction + debitDeduction + cashDeduction;

        // 2026년 자녀 수 연계 한도 적용
        const limit = getCardDeductionLimit(totalSalary, cardData.childrenCount);
        const basicDeductionWithLimit = Math.min(basicDeduction, limit);

        // 대중교통+전통시장+문화체육 합산 한도 300만원
        const specialDeductionRaw = marketDeduction + transportDeduction + cultureDeduction;
        const specialLimit = 3000000; // 합산 300만원 한도
        const specialDeduction = Math.min(specialDeductionRaw, specialLimit);
        const totalDeduction = basicDeductionWithLimit + specialDeduction;

        const excessAmount = Math.max(0, totalUsage - threshold);

        return {
            total: Math.round(totalDeduction),
            threshold: Math.round(threshold),
            totalUsage,
            excessAmount,
            details: {
                creditCard: { amount: cardData.creditCard, rate: 15, deduction: Math.round(creditDeduction), excess: creditExcess },
                debitCard: { amount: cardData.debitCard, rate: 30, deduction: Math.round(debitDeduction), excess: debitExcess },
                cash: { amount: cardData.cash, rate: 30, deduction: Math.round(cashDeduction), excess: cashExcess },
                traditionalMarket: { amount: cardData.traditionalMarket, rate: 40, deduction: Math.round(marketDeduction) },
                publicTransport: { amount: cardData.publicTransport, rate: 40, deduction: Math.round(transportDeduction) },
                culture: { amount: cardData.culture, rate: 30, deduction: Math.round(cultureDeduction) },
            },
            limit,
            basicDeduction: Math.round(basicDeductionWithLimit),
            specialDeduction: Math.round(specialDeduction),
            specialLimit,
        };
    };

    const cardDeduction = calculateCardDeduction();

    // 전체 세금 계산 함수
    const calculateAllTax = () => {
        // 1. 총 급여액
        const calculatedTotalSalary = totalSalary;

        // 2. 근로소득공제 계산
        let incomeDeduction = 0;
        if (calculatedTotalSalary <= 5000000) {
            incomeDeduction = calculatedTotalSalary * 0.70;
        } else if (calculatedTotalSalary <= 15000000) {
            incomeDeduction = 3500000 + (calculatedTotalSalary - 5000000) * 0.40;
        } else if (calculatedTotalSalary <= 45000000) {
            incomeDeduction = 7500000 + (calculatedTotalSalary - 15000000) * 0.15;
        } else if (calculatedTotalSalary <= 100000000) {
            incomeDeduction = 12000000 + (calculatedTotalSalary - 45000000) * 0.05;
        } else {
            incomeDeduction = 14750000 + (calculatedTotalSalary - 100000000) * 0.02;
        }

        // 3. 근로소득금액
        const incomeAmount = calculatedTotalSalary - incomeDeduction;

        // 4. 소득공제 합계
        // 인적공제: 기본공제(본인) 150만원 + 부양가족 1인당 150만원
        const basicPersonalDeduction = 1500000; // 본인 기본공제
        const dependentCount = dependentData.spouse + dependentData.parents +
            dependentData.children + dependentData.siblings +
            dependentData.foster + dependentData.recipient;
        const dependentDeduction = dependentCount * 1500000; // 부양가족 1인당 150만원

        // 사회보험료 공제 (전액 소득공제)
        const socialInsuranceDeduction = socialInsuranceData.nationalPension +
            socialInsuranceData.healthInsurance +
            socialInsuranceData.longTermCare +
            socialInsuranceData.employmentInsurance;


        // 주택자금 + 카드 소득공제 - 함수를 직접 호출하여 최신 값 사용
        const currentHousingDeductionForIncome = calculateHousingDeduction();
        const currentCardDeduction = calculateCardDeduction();
        const housingIncomeDeduction = currentHousingDeductionForIncome.incomeDeductionTotal;
        const cardIncomeDeduction = currentCardDeduction.total;

        const itemizedDeduction = basicPersonalDeduction + dependentDeduction +
            socialInsuranceDeduction + housingIncomeDeduction + cardIncomeDeduction;

        // 5. 종합소득과세표준
        const taxableIncome = Math.max(0, incomeAmount - itemizedDeduction);

        // 6. 산출세액 (종합소득세율 적용)
        let calculatedTax = 0;
        if (taxableIncome <= 14000000) {
            calculatedTax = taxableIncome * 0.06;
        } else if (taxableIncome <= 50000000) {
            calculatedTax = 840000 + (taxableIncome - 14000000) * 0.15;
        } else if (taxableIncome <= 88000000) {
            calculatedTax = 6240000 + (taxableIncome - 50000000) * 0.24;
        } else if (taxableIncome <= 150000000) {
            calculatedTax = 15360000 + (taxableIncome - 88000000) * 0.35;
        } else if (taxableIncome <= 300000000) {
            calculatedTax = 37060000 + (taxableIncome - 150000000) * 0.38;
        } else if (taxableIncome <= 500000000) {
            calculatedTax = 94060000 + (taxableIncome - 300000000) * 0.40;
        } else if (taxableIncome <= 1000000000) {
            calculatedTax = 174060000 + (taxableIncome - 500000000) * 0.42;
        } else {
            calculatedTax = 384060000 + (taxableIncome - 1000000000) * 0.45;
        }

        // 7. 세액공제 합계
        // 근로소득세액공제 재계산 (산출세액 기준)
        let earnedTaxCreditRaw = 0;
        if (calculatedTax <= 1300000) {
            earnedTaxCreditRaw = calculatedTax * 0.55;
        } else {
            earnedTaxCreditRaw = 715000 + (calculatedTax - 1300000) * 0.30;
        }

        let earnedTaxCreditLimit = 0;
        if (calculatedTotalSalary <= 33000000) {
            earnedTaxCreditLimit = 740000;
        } else if (calculatedTotalSalary <= 70000000) {
            earnedTaxCreditLimit = Math.max(660000, 740000 - (calculatedTotalSalary - 33000000) * 0.008);
        } else if (calculatedTotalSalary <= 120000000) {
            earnedTaxCreditLimit = Math.max(500000, 660000 - (calculatedTotalSalary - 70000000) * 0.5);
        } else {
            earnedTaxCreditLimit = Math.max(200000, 500000 - (calculatedTotalSalary - 120000000) * 0.5);
        }
        const earnedTaxCreditFinal = Math.min(earnedTaxCreditRaw, earnedTaxCreditLimit);

        // 기타 세액공제 - 함수를 직접 호출하여 최신 값 사용
        const currentChildTaxCredit = calculateChildTaxCredit();
        const currentEducationDeduction = calculateEducationDeduction();
        const currentMedicalDeduction = calculateMedicalDeduction();
        const currentDonationDeduction = calculateDonationDeduction();
        const currentInsurancePensionDeduction = calculateInsurancePensionDeduction();
        const currentHousingDeduction = calculateHousingDeduction();

        const childCredit = currentChildTaxCredit.totalCredit;
        const educationCredit = currentEducationDeduction.total;
        const medicalCredit = currentMedicalDeduction.deduction;
        const donationCredit = currentDonationDeduction.total;
        const insurancePensionCredit = currentInsurancePensionDeduction.total;
        const housingTaxCredit = currentHousingDeduction.taxCreditTotal;


        const totalTaxCredit = earnedTaxCreditFinal + childCredit + educationCredit +
            medicalCredit + donationCredit + insurancePensionCredit + housingTaxCredit;


        // 8. 결정세액
        const determinedTax = Math.max(0, calculatedTax - totalTaxCredit);

        // 9. 환급/추가납부 계산
        const paidTax = paidTaxData.paidTax;
        const refundAmount = paidTax - determinedTax;

        // 결과 업데이트
        setResults({
            totalSalary: Math.round(calculatedTotalSalary),
            incomeDeduction: Math.round(incomeDeduction),
            incomeAmount: Math.round(incomeAmount),
            itemizedDeduction: Math.round(itemizedDeduction),
            taxableIncome: Math.round(taxableIncome),
            calculatedTax: Math.round(calculatedTax),
            taxCredit: Math.round(totalTaxCredit),
            determinedTax: Math.round(determinedTax),
            paidTax: Math.round(paidTax),
            refundAmount: Math.round(refundAmount),
        });
        setIsCalculated(true);
    };

    // Format number with thousand separators
    const formatNumber = (value: number | string): string => {
        const num = typeof value === 'string' ? parseInt(value.replace(/,/g, ''), 10) : value;
        if (isNaN(num)) return '';
        return num.toLocaleString('ko-KR');
    };

    // Parse formatted number back to number
    const parseNumber = (value: string): number => {
        return parseInt(value.replace(/,/g, ''), 10) || 0;
    };

    // Formatted Number Input Component
    const FormattedInput = ({ defaultValue, placeholder, ...props }: { defaultValue?: number | string; placeholder?: string;[key: string]: any }) => {
        const [displayValue, setDisplayValue] = useState(defaultValue ? formatNumber(defaultValue) : '');

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const rawValue = e.target.value.replace(/[^0-9]/g, '');
            setDisplayValue(rawValue ? formatNumber(rawValue) : '');
        };

        return (
            <Input
                type="text"
                value={displayValue}
                onChange={handleChange}
                placeholder={placeholder}
                className="border-brutal shadow-brutal-sm text-lg font-semibold h-12"
                {...props}
            />
        );
    };

    // Handler for CardInput onChange
    const handleCardChange = (fieldName: string, value: number) => {
        setCardData(prev => ({ ...prev, [fieldName]: value }));
    };


    return (
        <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-black mb-8">연말정산 계산기</h1>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left: Calculator Form */}
                <div className="lg:col-span-2 space-y-6">
                    <Accordion type="multiple" className="space-y-4" defaultValue={['income']}>
                        {/* 1. 급여 정보 */}
                        <AccordionItem value="income" className="bg-white border-brutal shadow-brutal">
                            <AccordionTrigger className="px-6 py-4 text-xl font-bold hover:bg-[#F7CB15] transition-colors">
                                💰 1. 급여 정보
                            </AccordionTrigger>
                            <AccordionContent className="px-6 py-4 space-y-4">
                                <div>
                                    <Label className="text-base font-bold mb-2 block">연봉 (원)</Label>
                                    <Input
                                        type="text"
                                        defaultValue={formatNumber(salaryData.annualSalary)}
                                        onBlur={(e) => {
                                            const rawValue = e.target.value.replace(/[^0-9]/g, '');
                                            const numValue = parseInt(rawValue, 10) || 0;
                                            setSalaryData(prev => ({ ...prev, annualSalary: numValue }));
                                            e.target.value = formatNumber(numValue);
                                        }}
                                        placeholder="69,387,336"
                                        className="border-brutal shadow-brutal-sm text-lg font-semibold h-12"
                                    />
                                    <p className="text-sm text-muted-foreground font-semibold mt-1">
                                        💡 급여 + 상여
                                    </p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-base font-bold mb-2 block">비과세(식대)</Label>
                                        <Input
                                            type="text"
                                            defaultValue={formatNumber(salaryData.mealAllowance)}
                                            onBlur={(e) => {
                                                const rawValue = e.target.value.replace(/[^0-9]/g, '');
                                                const numValue = parseInt(rawValue, 10) || 0;
                                                setSalaryData(prev => ({ ...prev, mealAllowance: numValue }));
                                                e.target.value = formatNumber(numValue);
                                            }}
                                            placeholder="1,200,000"
                                            className="border-brutal shadow-brutal-sm text-lg font-semibold h-12"
                                        />
                                        <p className="text-sm text-muted-foreground font-semibold mt-1">
                                            💡 월 20만원 한도 × 12개월 = 연 240만원
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-base font-bold mb-2 block">비과세(보육수당)</Label>
                                        <Input
                                            type="number"
                                            min="0"
                                            value={salaryData.childrenUnder6}
                                            onChange={(e) => {
                                                const value = parseInt(e.target.value) || 0;
                                                setSalaryData(prev => ({ ...prev, childrenUnder6: value }));
                                            }}
                                            placeholder="0"
                                            className="border-brutal shadow-brutal-sm text-lg font-semibold h-12"
                                        />
                                        <p className="text-sm text-muted-foreground font-semibold mt-1">
                                            💡 6세 이하 자녀 수 입력 (1인당 월 20만원 × 12개월)
                                        </p>
                                    </div>
                                </div>

                                {/* 비과세 합계 표시 */}
                                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold">📋 비과세 소득 합계</span>
                                        <span className="text-xl font-black text-blue-600">{formatNumber(totalTaxExempt)}원</span>
                                    </div>
                                    <div className="mt-2 space-y-1 text-xs">
                                        <div className="flex justify-between text-muted-foreground">
                                            <span>• 비과세(식대)</span>
                                            <span>{formatNumber(salaryData.mealAllowance)}원</span>
                                        </div>
                                        {salaryData.childrenUnder6 > 0 && (
                                            <div className="flex justify-between text-muted-foreground">
                                                <span>• 비과세(보육수당) - {salaryData.childrenUnder6}명 × 월 20만원 × 12개월</span>
                                                <span>{formatNumber(childcareAllowance)}원</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-base font-bold mb-2 block">총 급여액 (원)</Label>
                                    <Input
                                        type="text"
                                        value={formatNumber(totalSalary)}
                                        readOnly
                                        disabled
                                        className="border-brutal shadow-brutal-sm text-lg font-semibold h-12 bg-gray-100 cursor-not-allowed"
                                    />
                                    <p className="text-sm text-muted-foreground font-semibold mt-1">
                                        💡 연봉 - 비과세 합계 (자동 계산)
                                    </p>
                                </div>

                                <div className="border-t-4 border-orange-400 pt-4">
                                    <Label className="text-base font-bold mb-2 block">기납부세액 (원)</Label>
                                    <Input
                                        type="text"
                                        defaultValue={formatNumber(paidTaxData.paidTax)}
                                        onBlur={(e) => {
                                            const rawValue = e.target.value.replace(/[^0-9]/g, '');
                                            const numValue = parseInt(rawValue, 10) || 0;
                                            setPaidTaxData({ paidTax: numValue });
                                            e.target.value = formatNumber(numValue);
                                        }}
                                        placeholder="0"
                                        className="border-brutal shadow-brutal-sm text-lg font-semibold h-12 bg-orange-50 border-orange-300"
                                    />
                                    <p className="text-sm text-muted-foreground font-semibold mt-1">
                                        💡 해당 연도 급여 자료 중 "소득세" 합산 금액
                                    </p>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* 2. 인적공제 */}
                        <AccordionItem value="personal" className="bg-white border-brutal shadow-brutal">
                            <AccordionTrigger className="px-6 py-4 text-xl font-bold hover:bg-[#00D9FF] transition-colors">
                                👨‍👩‍👧‍👦 2. 인적공제
                            </AccordionTrigger>
                            <AccordionContent className="px-6 py-4 space-y-6">
                                {/* 본인 및 배우자 */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-base font-bold mb-2 block">본인</Label>
                                        <Input
                                            type="text"
                                            value="1,500,000"
                                            readOnly
                                            disabled
                                            className="border-brutal shadow-brutal-sm text-lg font-semibold h-12 bg-gray-100 cursor-not-allowed"
                                        />
                                        <p className="text-sm text-muted-foreground font-semibold mt-1">
                                            💡 기본공제 150만원 (고정)
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-base font-bold mb-2 block">배우자공제</Label>
                                        <select
                                            className="w-full border-brutal shadow-brutal-sm text-lg font-semibold h-12 px-3"
                                            defaultValue={dependentData.spouse}
                                            onChange={(e) => setDependentData(prev => ({ ...prev, spouse: parseInt(e.target.value) }))}
                                        >
                                            <option value={0}>없음</option>
                                            <option value={1}>있음 (150만원 공제)</option>
                                        </select>
                                        <p className="text-sm text-muted-foreground font-semibold mt-1">
                                            💡 근로소득자: 연봉 500만원 이하 / 다른소득자: 소득금액 100만원 이하
                                        </p>
                                    </div>
                                </div>

                                {/* 부양가족공제 */}
                                <div className="border-t-2 border-black/30 pt-4">
                                    <h4 className="text-base font-black mb-4">부양가족공제</h4>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <Label className="text-base font-bold mb-2 block">직계존속 (인)</Label>
                                            <Input
                                                type="text"
                                                defaultValue={dependentData.parents.toString()}
                                                onBlur={(e) => {
                                                    const value = parseInt(e.target.value, 10) || 0;
                                                    setDependentData(prev => ({ ...prev, parents: value }));
                                                    e.target.value = value.toString();
                                                }}
                                                placeholder="0"
                                                className="border-brutal shadow-brutal-sm text-lg font-semibold h-12"
                                            />
                                            <p className="text-sm text-muted-foreground font-semibold mt-1">
                                                💡 부,모,장인,장모 등 / 만60세 이상
                                            </p>
                                        </div>
                                        <div>
                                            <Label className="text-base font-bold mb-2 block">자녀 (인)</Label>
                                            <Input
                                                type="number"
                                                min="0"
                                                value={dependentData.children}
                                                onChange={(e) => setDependentData(prev => ({ ...prev, children: parseInt(e.target.value) || 0 }))}
                                                className="border-brutal shadow-brutal-sm text-lg font-semibold h-12"
                                            />
                                            <p className="text-sm text-muted-foreground font-semibold mt-1">
                                                💡 만20세 이하
                                            </p>
                                        </div>
                                        <div>
                                            <Label className="text-base font-bold mb-2 block">형제 자매 (인)</Label>
                                            <Input
                                                type="text"
                                                defaultValue={dependentData.siblings.toString()}
                                                onBlur={(e) => {
                                                    const value = parseInt(e.target.value, 10) || 0;
                                                    setDependentData(prev => ({ ...prev, siblings: value }));
                                                    e.target.value = value.toString();
                                                }}
                                                placeholder="0"
                                                className="border-brutal shadow-brutal-sm text-lg font-semibold h-12"
                                            />
                                            <p className="text-sm text-muted-foreground font-semibold mt-1">
                                                💡 만20세 이하 또는 만60세 이상
                                            </p>
                                        </div>
                                        <div>
                                            <Label className="text-base font-bold mb-2 block">위탁아동 (인)</Label>
                                            <Input
                                                type="text"
                                                defaultValue={dependentData.foster.toString()}
                                                onBlur={(e) => {
                                                    const value = parseInt(e.target.value, 10) || 0;
                                                    setDependentData(prev => ({ ...prev, foster: value }));
                                                    e.target.value = value.toString();
                                                }}
                                                placeholder="0"
                                                className="border-brutal shadow-brutal-sm text-lg font-semibold h-12"
                                            />
                                            <p className="text-sm text-muted-foreground font-semibold mt-1">
                                                💡 6개월 이상 위탁양육
                                            </p>
                                        </div>
                                        <div>
                                            <Label className="text-base font-bold mb-2 block">수급자 (인)</Label>
                                            <Input
                                                type="text"
                                                defaultValue={dependentData.recipient.toString()}
                                                onBlur={(e) => {
                                                    const value = parseInt(e.target.value, 10) || 0;
                                                    setDependentData(prev => ({ ...prev, recipient: value }));
                                                    e.target.value = value.toString();
                                                }}
                                                placeholder="0"
                                                className="border-brutal shadow-brutal-sm text-lg font-semibold h-12"
                                            />
                                            <p className="text-sm text-muted-foreground font-semibold mt-1">
                                                💡 기초생활수급자
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* 3. 국민연금·건강/장기/고용보험료 공제 */}
                        <AccordionItem value="insurance" className="bg-white border-brutal shadow-brutal">
                            <AccordionTrigger className="px-6 py-4 text-xl font-bold hover:bg-[#FF6B35] transition-colors">
                                🏥 3. 국민연금·4대보험료 공제
                            </AccordionTrigger>
                            <AccordionContent className="px-6 py-4 space-y-4">
                                <div>
                                    <Label className="text-base font-bold mb-2 block">국민연금 (원)</Label>
                                    <Input
                                        type="text"
                                        defaultValue={formatNumber(socialInsuranceData.nationalPension)}
                                        onBlur={(e) => {
                                            const rawValue = e.target.value.replace(/[^0-9]/g, '');
                                            const numValue = parseInt(rawValue, 10) || 0;
                                            setSocialInsuranceData(prev => ({ ...prev, nationalPension: numValue }));
                                            e.target.value = formatNumber(numValue);
                                        }}
                                        placeholder="3,500,000"
                                        className="border-brutal shadow-brutal-sm text-lg font-semibold h-12"
                                    />
                                    <p className="text-sm text-muted-foreground font-semibold mt-1">
                                        💡 전액 소득공제
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-base font-bold mb-2 block">건강보험료 (원)</Label>
                                    <Input
                                        type="text"
                                        defaultValue={formatNumber(socialInsuranceData.healthInsurance)}
                                        onBlur={(e) => {
                                            const rawValue = e.target.value.replace(/[^0-9]/g, '');
                                            const numValue = parseInt(rawValue, 10) || 0;
                                            setSocialInsuranceData(prev => ({ ...prev, healthInsurance: numValue }));
                                            e.target.value = formatNumber(numValue);
                                        }}
                                        placeholder="2,000,000"
                                        className="border-brutal shadow-brutal-sm text-lg font-semibold h-12"
                                    />
                                    <p className="text-sm text-muted-foreground font-semibold mt-1">
                                        💡 본인 부담금 전액 공제
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-base font-bold mb-2 block">노인장기요양보험료 (원)</Label>
                                    <Input
                                        type="text"
                                        defaultValue={formatNumber(socialInsuranceData.longTermCare)}
                                        onBlur={(e) => {
                                            const rawValue = e.target.value.replace(/[^0-9]/g, '');
                                            const numValue = parseInt(rawValue, 10) || 0;
                                            setSocialInsuranceData(prev => ({ ...prev, longTermCare: numValue }));
                                            e.target.value = formatNumber(numValue);
                                        }}
                                        placeholder="200,000"
                                        className="border-brutal shadow-brutal-sm text-lg font-semibold h-12"
                                    />
                                    <p className="text-sm text-muted-foreground font-semibold mt-1">
                                        💡 전액 소득공제
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-base font-bold mb-2 block">고용보험료 (원)</Label>
                                    <Input
                                        type="text"
                                        defaultValue={formatNumber(socialInsuranceData.employmentInsurance)}
                                        onBlur={(e) => {
                                            const rawValue = e.target.value.replace(/[^0-9]/g, '');
                                            const numValue = parseInt(rawValue, 10) || 0;
                                            setSocialInsuranceData(prev => ({ ...prev, employmentInsurance: numValue }));
                                            e.target.value = formatNumber(numValue);
                                        }}
                                        placeholder="500,000"
                                        className="border-brutal shadow-brutal-sm text-lg font-semibold h-12"
                                    />
                                    <p className="text-sm text-muted-foreground font-semibold mt-1">
                                        💡 전액 소득공제
                                    </p>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* 4. 카드·현금 사용액 */}
                        <AccordionItem value="card" className="bg-white border-brutal shadow-brutal">
                            <AccordionTrigger className="px-6 py-4 text-xl font-bold hover:bg-[#F7CB15] transition-colors">
                                💳 4. 카드·현금 사용액
                            </AccordionTrigger>
                            <AccordionContent className="px-6 py-4 space-y-4">
                                <CardInput label="신용카드 사용액" fieldName="creditCard" value={cardData.creditCard} rate={15} placeholder="15,665,472" deductionInfo={cardDeduction.details?.creditCard} onChange={handleCardChange} />
                                <CardInput label="체크카드" fieldName="debitCard" value={cardData.debitCard} rate={30} placeholder="3,000,000" deductionInfo={cardDeduction.details?.debitCard} onChange={handleCardChange} />
                                <CardInput label="현금영수증" fieldName="cash" value={cardData.cash} rate={30} placeholder="2,000,000" deductionInfo={cardDeduction.details?.cash} onChange={handleCardChange} />

                                {/* 자녀 수 입력 (2026년 한도 확대용) */}
                                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                                    <Label className="text-base font-bold mb-2 block">👶 자녀 수 (2026년 한도 확대)</Label>
                                    <Input
                                        type="number"
                                        min="0"
                                        value={cardData.childrenCount}
                                        onChange={(e) => {
                                            const value = parseInt(e.target.value) || 0;
                                            setCardData(prev => ({ ...prev, childrenCount: value }));
                                        }}
                                        placeholder="0"
                                        className="border-brutal shadow-brutal-sm text-lg font-semibold h-12"
                                    />
                                    <p className="text-sm text-muted-foreground font-semibold mt-1">
                                        💡 2026년부터 자녀 1명당 50만원, 최대 100만원까지 한도 인상
                                    </p>
                                </div>

                                {/* 신용카드+체크카드+현금영수증 합산 공제 요약 */}
                                <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 mt-4">
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold">💳 신용카드+체크카드+현금영수증 공제</span>
                                        <span className="text-xl font-black text-yellow-600">{formatNumber(cardDeduction.basicDeduction || 0)}원</span>
                                    </div>
                                    <div className="mt-2 space-y-1 text-xs">
                                        <div className="flex justify-between text-muted-foreground">
                                            <span>• 신용카드 ({formatNumber(cardData.creditCard)}원 × 15%)</span>
                                            <span>{formatNumber(cardDeduction.details?.creditCard?.deduction || 0)}원</span>
                                        </div>
                                        <div className="flex justify-between text-muted-foreground">
                                            <span>• 체크카드 ({formatNumber(cardData.debitCard)}원 × 30%)</span>
                                            <span>{formatNumber(cardDeduction.details?.debitCard?.deduction || 0)}원</span>
                                        </div>
                                        <div className="flex justify-between text-muted-foreground">
                                            <span>• 현금영수증 ({formatNumber(cardData.cash)}원 × 30%)</span>
                                            <span>{formatNumber(cardDeduction.details?.cash?.deduction || 0)}원</span>
                                        </div>
                                    </div>
                                    <p className="text-xs text-yellow-700 font-semibold mt-2 border-t border-yellow-200 pt-2">
                                        💡 기본 공제한도: {formatNumber(cardDeduction.limit || 3000000)}원 (25% 기준: {formatNumber(cardDeduction.threshold || 0)}원)
                                    </p>
                                    {cardData.childrenCount > 0 && (
                                        <p className="text-xs text-blue-600 font-semibold mt-1">
                                            ✨ 자녀 {cardData.childrenCount}명으로 한도가 {formatNumber(cardDeduction.limit || 3000000)}원으로 확대!
                                        </p>
                                    )}
                                </div>

                                <CardInput label="전통시장" fieldName="traditionalMarket" value={cardData.traditionalMarket} rate={40} placeholder="500,000" deductionInfo={cardDeduction.details?.traditionalMarket} onChange={handleCardChange} />
                                <CardInput label="대중교통 사용액" fieldName="publicTransport" value={cardData.publicTransport} rate={40} placeholder="960,000" deductionInfo={cardDeduction.details?.publicTransport} onChange={handleCardChange} />

                                <CardInput label="문화체육 (도서·공연·체육시설 등)" fieldName="culture" value={cardData.culture} rate={30} placeholder="300,000" deductionInfo={cardDeduction.details?.culture} onChange={handleCardChange} />

                                {/* 대중교통+전통시장+문화체육 합산 공제 요약 */}
                                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mt-4">
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold">🌟 대중교통+전통시장+문화체육 공제</span>
                                        <span className="text-xl font-black text-blue-600">{formatNumber(cardDeduction.specialDeduction || 0)}원</span>
                                    </div>
                                    <div className="mt-2 space-y-1 text-xs">
                                        <div className="flex justify-between text-muted-foreground">
                                            <span>• 대중교통 ({formatNumber(cardData.publicTransport)}원 × 40%)</span>
                                            <span>{formatNumber(cardDeduction.details?.publicTransport?.deduction || 0)}원</span>
                                        </div>
                                        <div className="flex justify-between text-muted-foreground">
                                            <span>• 전통시장 ({formatNumber(cardData.traditionalMarket)}원 × 40%)</span>
                                            <span>{formatNumber(cardDeduction.details?.traditionalMarket?.deduction || 0)}원</span>
                                        </div>
                                        <div className="flex justify-between text-muted-foreground">
                                            <span>• 문화체육 ({formatNumber(cardData.culture)}원 × 30%)</span>
                                            <span>{formatNumber(cardDeduction.details?.culture?.deduction || 0)}원</span>
                                        </div>
                                    </div>
                                    <p className="text-xs text-blue-600 font-semibold mt-2 border-t border-blue-200 pt-2">
                                        💡 3가지 항목 합산 총 공제한도: 3,000,000원
                                    </p>
                                </div>

                                {/* 카드 사용 총 공제금액 */}
                                <div className="bg-gray-100 border-2 border-black rounded-lg p-4 mt-4">
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold">📊 카드 사용 총 공제금액</span>
                                        <span className="text-2xl font-black text-green-600">{formatNumber(cardDeduction.total)}원</span>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* 5. 교육비·의료비 */}
                        <AccordionItem value="education" className="bg-white border-brutal shadow-brutal">
                            <AccordionTrigger className="px-6 py-4 text-xl font-bold hover:bg-[#00D9FF] transition-colors">
                                📚 5. 교육비·의료비
                            </AccordionTrigger>
                            <AccordionContent className="px-6 py-4 space-y-4">
                                <div>
                                    <Label className="text-base font-bold mb-2 block">본인 교육비 (원)</Label>
                                    <Input
                                        type="text"
                                        defaultValue={formatNumber(eduMedData.selfEducation)}
                                        onBlur={(e) => {
                                            const rawValue = e.target.value.replace(/[^0-9]/g, '');
                                            const numValue = parseInt(rawValue, 10) || 0;
                                            setEduMedData(prev => ({ ...prev, selfEducation: numValue }));
                                            e.target.value = formatNumber(numValue);
                                        }}
                                        placeholder="0"
                                        className="border-brutal shadow-brutal-sm text-lg font-semibold h-12"
                                    />
                                    <p className="text-sm text-muted-foreground font-semibold mt-1">
                                        💡 한도 없음, 15% 공제
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-base font-bold mb-2 block">자녀 교육비 - 미취학 (원)</Label>
                                    <Input
                                        type="text"
                                        defaultValue={formatNumber(eduMedData.preschool)}
                                        onBlur={(e) => {
                                            const rawValue = e.target.value.replace(/[^0-9]/g, '');
                                            const numValue = parseInt(rawValue, 10) || 0;
                                            setEduMedData(prev => ({ ...prev, preschool: numValue }));
                                            e.target.value = formatNumber(numValue);
                                        }}
                                        placeholder="2,000,000"
                                        className="border-brutal shadow-brutal-sm text-lg font-semibold h-12"
                                    />
                                    <p className="text-sm text-muted-foreground font-semibold mt-1">
                                        💡 1인당 연 300만원 한도
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-base font-bold mb-2 block">자녀 교육비 - 초중고 (원)</Label>
                                    <Input
                                        type="text"
                                        defaultValue={formatNumber(eduMedData.elementary)}
                                        onBlur={(e) => {
                                            const rawValue = e.target.value.replace(/[^0-9]/g, '');
                                            const numValue = parseInt(rawValue, 10) || 0;
                                            setEduMedData(prev => ({ ...prev, elementary: numValue }));
                                            e.target.value = formatNumber(numValue);
                                        }}
                                        placeholder="2,000,000"
                                        className="border-brutal shadow-brutal-sm text-lg font-semibold h-12"
                                    />
                                    <p className="text-sm text-muted-foreground font-semibold mt-1">
                                        💡 1인당 연 300만원 한도
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-base font-bold mb-2 block">자녀 교육비 - 대학 (원)</Label>
                                    <Input
                                        type="text"
                                        defaultValue={formatNumber(eduMedData.university)}
                                        onBlur={(e) => {
                                            const rawValue = e.target.value.replace(/[^0-9]/g, '');
                                            const numValue = parseInt(rawValue, 10) || 0;
                                            setEduMedData(prev => ({ ...prev, university: numValue }));
                                            e.target.value = formatNumber(numValue);
                                        }}
                                        placeholder="2,000,000"
                                        className="border-brutal shadow-brutal-sm text-lg font-semibold h-12"
                                    />
                                    <p className="text-sm text-muted-foreground font-semibold mt-1">
                                        💡 1인당 연 900만원 한도
                                    </p>
                                </div>

                                {/* 교육비 공제 요약 */}
                                <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 mt-4">
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold">📚 교육비 공제</span>
                                        <span className="text-xl font-black text-yellow-600">{formatNumber(educationDeduction.total)}원</span>
                                    </div>
                                    <div className="mt-2 space-y-1 text-xs">
                                        <div className="flex justify-between text-muted-foreground">
                                            <span>• 본인 교육비 ({formatNumber(eduMedData.selfEducation)}원 × 15%)</span>
                                            <span>{formatNumber(educationDeduction.self)}원</span>
                                        </div>
                                        <div className="flex justify-between text-muted-foreground">
                                            <span>• 미취학 ({formatNumber(eduMedData.preschool)}원 × 15%, 한도 300만원)</span>
                                            <span>{formatNumber(educationDeduction.preschool)}원</span>
                                        </div>
                                        <div className="flex justify-between text-muted-foreground">
                                            <span>• 초중고 ({formatNumber(eduMedData.elementary)}원 × 15%, 한도 300만원)</span>
                                            <span>{formatNumber(educationDeduction.elementary)}원</span>
                                        </div>
                                        <div className="flex justify-between text-muted-foreground">
                                            <span>• 대학 ({formatNumber(eduMedData.university)}원 × 15%, 한도 900만원)</span>
                                            <span>{formatNumber(educationDeduction.university)}원</span>
                                        </div>
                                    </div>
                                </div>

                                {/* 의료비 세부 항목 */}
                                <div className="border-t-2 border-gray-200 pt-4 mt-4">
                                    <h4 className="font-bold text-lg mb-4">🏥 의료비 세부 항목</h4>

                                    <div className="space-y-4">
                                        <div>
                                            <Label className="text-base font-bold mb-2 block">난임시술비 (원)</Label>
                                            <Input
                                                type="text"
                                                defaultValue={formatNumber(eduMedData.infertility)}
                                                onBlur={(e) => {
                                                    const rawValue = e.target.value.replace(/[^0-9]/g, '');
                                                    const numValue = parseInt(rawValue, 10) || 0;
                                                    setEduMedData(prev => ({ ...prev, infertility: numValue }));
                                                    e.target.value = formatNumber(numValue);
                                                }}
                                                placeholder="0"
                                                className="border-brutal shadow-brutal-sm text-lg font-semibold h-12"
                                            />
                                            <p className="text-sm text-muted-foreground font-semibold mt-1">
                                                💡 30% 공제, 700만원 한도 없이 전액 공제
                                            </p>
                                        </div>

                                        <div>
                                            <Label className="text-base font-bold mb-2 block">미숙아·선천성이상아 의료비 (원)</Label>
                                            <Input
                                                type="text"
                                                defaultValue={formatNumber(eduMedData.premature)}
                                                onBlur={(e) => {
                                                    const rawValue = e.target.value.replace(/[^0-9]/g, '');
                                                    const numValue = parseInt(rawValue, 10) || 0;
                                                    setEduMedData(prev => ({ ...prev, premature: numValue }));
                                                    e.target.value = formatNumber(numValue);
                                                }}
                                                placeholder="0"
                                                className="border-brutal shadow-brutal-sm text-lg font-semibold h-12"
                                            />
                                            <p className="text-sm text-muted-foreground font-semibold mt-1">
                                                💡 20% 공제, 700만원 한도 없이 전액 공제
                                            </p>
                                        </div>

                                        <div>
                                            <Label className="text-base font-bold mb-2 block">본인/장애인/만65세이상/6세이하/건강보험산정특례자 의료비 (원)</Label>
                                            <Input
                                                type="text"
                                                defaultValue={formatNumber(eduMedData.selfDisabledSenior)}
                                                onBlur={(e) => {
                                                    const rawValue = e.target.value.replace(/[^0-9]/g, '');
                                                    const numValue = parseInt(rawValue, 10) || 0;
                                                    setEduMedData(prev => ({ ...prev, selfDisabledSenior: numValue }));
                                                    e.target.value = formatNumber(numValue);
                                                }}
                                                placeholder="0"
                                                className="border-brutal shadow-brutal-sm text-lg font-semibold h-12"
                                            />
                                            <p className="text-sm text-muted-foreground font-semibold mt-1">
                                                💡 15% 공제, 700만원 한도 없이 전액 공제
                                            </p>
                                        </div>

                                        <div>
                                            <Label className="text-base font-bold mb-2 block">그 밖의 부양가족 의료비 (원)</Label>
                                            <Input
                                                type="text"
                                                defaultValue={formatNumber(eduMedData.otherFamily)}
                                                onBlur={(e) => {
                                                    const rawValue = e.target.value.replace(/[^0-9]/g, '');
                                                    const numValue = parseInt(rawValue, 10) || 0;
                                                    setEduMedData(prev => ({ ...prev, otherFamily: numValue }));
                                                    e.target.value = formatNumber(numValue);
                                                }}
                                                placeholder="1,856,340"
                                                className="border-brutal shadow-brutal-sm text-lg font-semibold h-12"
                                            />
                                            <p className="text-sm text-muted-foreground font-semibold mt-1">
                                                💡 15% 공제, 700만원 한도
                                            </p>
                                        </div>

                                        <div>
                                            <Label className="text-base font-bold mb-2 block">실손의료보험금 (원)</Label>
                                            <Input
                                                type="text"
                                                defaultValue={formatNumber(eduMedData.insuranceReimbursement)}
                                                onBlur={(e) => {
                                                    const rawValue = e.target.value.replace(/[^0-9]/g, '');
                                                    const numValue = parseInt(rawValue, 10) || 0;
                                                    setEduMedData(prev => ({ ...prev, insuranceReimbursement: numValue }));
                                                    e.target.value = formatNumber(numValue);
                                                }}
                                                placeholder="467,488"
                                                className="border-brutal shadow-brutal-sm text-lg font-semibold h-12"
                                            />
                                            <p className="text-sm text-muted-foreground font-semibold mt-1">
                                                💡 차감의료비 (공제대상에서 제외)
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* 의료비 공제 요약 */}
                                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mt-4">
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold">🏥 의료비 공제</span>
                                        <span className="text-xl font-black text-blue-600">{formatNumber(medicalDeduction.deduction)}원</span>
                                    </div>

                                    {/* Step 1: 총 사용금액 - 실손보험금 = 순 의료비 */}
                                    <div className="mt-3 space-y-1 text-xs">
                                        <div className="flex justify-between text-muted-foreground font-semibold">
                                            <span>📊 총 의료비 사용금액</span>
                                            <span>{formatNumber(medicalDeduction.totalMedical)}원</span>
                                        </div>
                                        <div className="flex justify-between text-muted-foreground">
                                            <span>　- 실손의료보험금 (차감)</span>
                                            <span className="text-red-500">-{formatNumber(medicalDeduction.insuranceReimbursement)}원</span>
                                        </div>
                                        <div className="flex justify-between text-muted-foreground font-semibold border-t border-blue-200 pt-1">
                                            <span>= 실제 의료비</span>
                                            <span>{formatNumber(medicalDeduction.netMedical)}원</span>
                                        </div>
                                    </div>

                                    {/* Step 2: 3% 기준 비교 */}
                                    <div className="mt-3 space-y-1 text-xs border-t border-blue-300 pt-2">
                                        <div className="flex justify-between text-muted-foreground">
                                            <span>📏 총급여 3% 기준 (최저한도)</span>
                                            <span>{formatNumber(medicalDeduction.threshold)}원</span>
                                        </div>
                                        <div className="flex justify-between text-muted-foreground font-semibold">
                                            <span>= 3% 초과분 (공제대상 금액)</span>
                                            <span className={medicalDeduction.deductibleAmount > 0 ? "text-green-600" : "text-gray-500"}>
                                                {formatNumber(medicalDeduction.deductibleAmount)}원
                                            </span>
                                        </div>
                                    </div>

                                    {/* 3% 미달 시 안내 메시지 */}
                                    {medicalDeduction.deductibleAmount === 0 && (
                                        <p className="text-xs text-blue-700 font-semibold mt-2 border-t border-blue-200 pt-2">
                                            💡 의료비가 총급여 3%를 초과해야 공제 가능
                                        </p>
                                    )}

                                    {/* Step 3: 3% 초과 시 항목별 공제 계산 */}
                                    {medicalDeduction.deductibleAmount > 0 && (
                                        <div className="mt-3 space-y-1 text-xs border-t border-blue-300 pt-2">
                                            <div className="font-semibold text-muted-foreground mb-1">📝 항목별 세액공제 (공제대상 {formatNumber(medicalDeduction.deductibleAmount)}원 적용)</div>
                                            {medicalDeduction.infertilityApplied > 0 && (
                                                <div className="flex justify-between text-muted-foreground">
                                                    <span>• 난임시술비 ({formatNumber(medicalDeduction.infertilityApplied)}원 × 30%)</span>
                                                    <span>{formatNumber(Math.round(medicalDeduction.infertilityApplied * 0.30))}원</span>
                                                </div>
                                            )}
                                            {medicalDeduction.prematureApplied > 0 && (
                                                <div className="flex justify-between text-muted-foreground">
                                                    <span>• 미숙아·선천성이상아 ({formatNumber(medicalDeduction.prematureApplied)}원 × 20%)</span>
                                                    <span>{formatNumber(Math.round(medicalDeduction.prematureApplied * 0.20))}원</span>
                                                </div>
                                            )}
                                            {medicalDeduction.selfDisabledApplied > 0 && (
                                                <div className="flex justify-between text-muted-foreground">
                                                    <span>• 본인/장애인/65세이상/6세이하 ({formatNumber(medicalDeduction.selfDisabledApplied)}원 × 15%)</span>
                                                    <span>{formatNumber(Math.round(medicalDeduction.selfDisabledApplied * 0.15))}원</span>
                                                </div>
                                            )}
                                            {medicalDeduction.otherFamilyApplied > 0 && (
                                                <div className="flex justify-between text-muted-foreground">
                                                    <span>• 그 밖의 부양가족 ({formatNumber(medicalDeduction.otherFamilyApplied)}원 × 15%)</span>
                                                    <span>{formatNumber(Math.round(medicalDeduction.otherFamilyApplied * 0.15))}원</span>
                                                </div>
                                            )}
                                            {/* 난임/미숙아가 없고 본인/부양가족만 있는 경우 15% 단일 표시 */}
                                            {medicalDeduction.infertilityApplied === 0 && medicalDeduction.prematureApplied === 0 &&
                                                medicalDeduction.selfDisabledApplied === 0 && medicalDeduction.otherFamilyApplied === 0 && (
                                                    <div className="flex justify-between text-muted-foreground">
                                                        <span>• 의료비 ({formatNumber(medicalDeduction.deductibleAmount)}원 × 15%)</span>
                                                        <span>{formatNumber(Math.round(medicalDeduction.deductibleAmount * 0.15))}원</span>
                                                    </div>
                                                )}
                                        </div>
                                    )}
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* 6. 기부금 */}
                        <AccordionItem value="donation" className="bg-white border-brutal shadow-brutal">
                            <AccordionTrigger className="px-6 py-4 text-xl font-bold hover:bg-[#FF6B35] transition-colors">
                                ❤️ 6. 기부금
                            </AccordionTrigger>
                            <AccordionContent className="px-6 py-4 space-y-4">
                                <div>
                                    <Label className="text-base font-bold mb-2 block">정치자금 기부금 (원)</Label>
                                    <Input
                                        type="text"
                                        defaultValue={formatNumber(donationData.political)}
                                        onBlur={(e) => {
                                            const rawValue = e.target.value.replace(/[^0-9]/g, '');
                                            const numValue = parseInt(rawValue, 10) || 0;
                                            setDonationData(prev => ({ ...prev, political: numValue }));
                                            e.target.value = formatNumber(numValue);
                                        }}
                                        placeholder="100,000"
                                        className="border-brutal shadow-brutal-sm text-lg font-semibold h-12"
                                    />
                                    <p className="text-sm text-muted-foreground font-semibold mt-1">
                                        💡 근로소득금액 100% 한도, 10만원 이하 100/110, 초과 15%, 3천만원 초과 25%
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-base font-bold mb-2 block">고향사랑 기부금 (원)</Label>
                                    <Input
                                        type="text"
                                        defaultValue={formatNumber(donationData.hometown)}
                                        onBlur={(e) => {
                                            const rawValue = e.target.value.replace(/[^0-9]/g, '');
                                            const numValue = parseInt(rawValue, 10) || 0;
                                            setDonationData(prev => ({ ...prev, hometown: numValue }));
                                            e.target.value = formatNumber(numValue);
                                        }}
                                        placeholder="100,000"
                                        className="border-brutal shadow-brutal-sm text-lg font-semibold h-12"
                                    />
                                    <p className="text-sm text-muted-foreground font-semibold mt-1">
                                        💡 10만원 이하 100/110, 초과 15% (연 2,000만원 한도)
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-base font-bold mb-2 block">고향사랑 기부금 특별재난지역 (원)</Label>
                                    <Input
                                        type="text"
                                        defaultValue={formatNumber(donationData.hometownDisaster)}
                                        onBlur={(e) => {
                                            const rawValue = e.target.value.replace(/[^0-9]/g, '');
                                            const numValue = parseInt(rawValue, 10) || 0;
                                            setDonationData(prev => ({ ...prev, hometownDisaster: numValue }));
                                            e.target.value = formatNumber(numValue);
                                        }}
                                        placeholder="0"
                                        className="border-brutal shadow-brutal-sm text-lg font-semibold h-12"
                                    />
                                    <p className="text-sm text-muted-foreground font-semibold mt-1">
                                        💡 10만원 이하 100/110, 초과 30% (연 2,000만원 한도)
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-base font-bold mb-2 block">특례기부금 (원)</Label>
                                    <Input
                                        type="text"
                                        defaultValue={formatNumber(donationData.special)}
                                        onBlur={(e) => {
                                            const rawValue = e.target.value.replace(/[^0-9]/g, '');
                                            const numValue = parseInt(rawValue, 10) || 0;
                                            setDonationData(prev => ({ ...prev, special: numValue }));
                                            e.target.value = formatNumber(numValue);
                                        }}
                                        placeholder="0"
                                        className="border-brutal shadow-brutal-sm text-lg font-semibold h-12"
                                    />
                                    <p className="text-sm text-muted-foreground font-semibold mt-1">
                                        💡 근로소득금액 100% 한도, 1천만원 이하 15%, 초과 30%
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-base font-bold mb-2 block">우리사주조합 기부금 (원)</Label>
                                    <Input
                                        type="text"
                                        defaultValue={formatNumber(donationData.employee)}
                                        onBlur={(e) => {
                                            const rawValue = e.target.value.replace(/[^0-9]/g, '');
                                            const numValue = parseInt(rawValue, 10) || 0;
                                            setDonationData(prev => ({ ...prev, employee: numValue }));
                                            e.target.value = formatNumber(numValue);
                                        }}
                                        placeholder="0"
                                        className="border-brutal shadow-brutal-sm text-lg font-semibold h-12"
                                    />
                                    <p className="text-sm text-muted-foreground font-semibold mt-1">
                                        💡 근로소득금액의 30% 한도, 1천만원 이하 15%, 초과 30%
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-base font-bold mb-2 block">일반기부금(종교단체 외) (원)</Label>
                                    <Input
                                        type="text"
                                        defaultValue={formatNumber(donationData.designated)}
                                        onBlur={(e) => {
                                            const rawValue = e.target.value.replace(/[^0-9]/g, '');
                                            const numValue = parseInt(rawValue, 10) || 0;
                                            setDonationData(prev => ({ ...prev, designated: numValue }));
                                            e.target.value = formatNumber(numValue);
                                        }}
                                        placeholder="500,000"
                                        className="border-brutal shadow-brutal-sm text-lg font-semibold h-12"
                                    />
                                    <p className="text-sm text-muted-foreground font-semibold mt-1">
                                        💡 근로소득금액의 30% 한도, 1천만원 이하 15%, 초과 30%
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-base font-bold mb-2 block">일반기부금(종교단체) (원)</Label>
                                    <Input
                                        type="text"
                                        defaultValue={formatNumber(donationData.religious)}
                                        onBlur={(e) => {
                                            const rawValue = e.target.value.replace(/[^0-9]/g, '');
                                            const numValue = parseInt(rawValue, 10) || 0;
                                            setDonationData(prev => ({ ...prev, religious: numValue }));
                                            e.target.value = formatNumber(numValue);
                                        }}
                                        placeholder="0"
                                        className="border-brutal shadow-brutal-sm text-lg font-semibold h-12"
                                    />
                                    <p className="text-sm text-muted-foreground font-semibold mt-1">
                                        💡 근로소득금액의 10% 한도, 1천만원 이하 15%, 초과 30%
                                    </p>
                                </div>

                                {/* 기부금 공제 요약 */}
                                <div className="bg-orange-50 border-2 border-orange-300 rounded-lg p-4 mt-4">
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold">❤️ 기부금 세액공제</span>
                                        <span className="text-xl font-black text-orange-600">{formatNumber(donationDeduction.total)}원</span>
                                    </div>
                                    <div className="mt-2 space-y-2 text-xs">
                                        {donationData.political > 0 && (
                                            <div className="border-b border-orange-200 pb-2">
                                                <div className="flex justify-between text-muted-foreground font-semibold">
                                                    <span>• 정치자금 기부금</span>
                                                    <span>{formatNumber(donationDeduction.political)}원</span>
                                                </div>
                                                <div className="ml-3 text-[10px] text-gray-500 mt-1 space-y-0.5">
                                                    {donationDeduction.politicalDetail.baseAmount > 0 && (
                                                        <div className="flex justify-between">
                                                            <span>- {formatNumber(donationDeduction.politicalDetail.baseAmount)}원 × 100/110</span>
                                                            <span>{formatNumber(donationDeduction.politicalDetail.base)}원</span>
                                                        </div>
                                                    )}
                                                    {donationDeduction.politicalDetail.excess15Amount > 0 && (
                                                        <div className="flex justify-between">
                                                            <span>- {formatNumber(donationDeduction.politicalDetail.excess15Amount)}원 × 15%</span>
                                                            <span>{formatNumber(donationDeduction.politicalDetail.excess15)}원</span>
                                                        </div>
                                                    )}
                                                    {donationDeduction.politicalDetail.excess25Amount > 0 && (
                                                        <div className="flex justify-between">
                                                            <span>- {formatNumber(donationDeduction.politicalDetail.excess25Amount)}원 × 25%</span>
                                                            <span>{formatNumber(donationDeduction.politicalDetail.excess25)}원</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                        {donationData.hometown > 0 && (
                                            <div className="border-b border-orange-200 pb-2">
                                                <div className="flex justify-between text-muted-foreground font-semibold">
                                                    <span>• 고향사랑 기부금</span>
                                                    <span>{formatNumber(donationDeduction.hometown)}원</span>
                                                </div>
                                                <div className="ml-3 text-[10px] text-gray-500 mt-1 space-y-0.5">
                                                    {donationDeduction.hometownDetail.baseAmount > 0 && (
                                                        <div className="flex justify-between">
                                                            <span>- {formatNumber(donationDeduction.hometownDetail.baseAmount)}원 × 100/110</span>
                                                            <span>{formatNumber(donationDeduction.hometownDetail.base)}원</span>
                                                        </div>
                                                    )}
                                                    {donationDeduction.hometownDetail.excessAmount > 0 && (
                                                        <div className="flex justify-between">
                                                            <span>- {formatNumber(donationDeduction.hometownDetail.excessAmount)}원 × 15%</span>
                                                            <span>{formatNumber(donationDeduction.hometownDetail.excess)}원</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                        {donationData.hometownDisaster > 0 && (
                                            <div className="border-b border-orange-200 pb-2">
                                                <div className="flex justify-between text-muted-foreground font-semibold">
                                                    <span>• 고향사랑 특별재난지역</span>
                                                    <span>{formatNumber(donationDeduction.hometownDisaster)}원</span>
                                                </div>
                                                <div className="ml-3 text-[10px] text-gray-500 mt-1 space-y-0.5">
                                                    {donationDeduction.hometownDisasterDetail.baseAmount > 0 && (
                                                        <div className="flex justify-between">
                                                            <span>- {formatNumber(donationDeduction.hometownDisasterDetail.baseAmount)}원 × 100/110</span>
                                                            <span>{formatNumber(donationDeduction.hometownDisasterDetail.base)}원</span>
                                                        </div>
                                                    )}
                                                    {donationDeduction.hometownDisasterDetail.excessAmount > 0 && (
                                                        <div className="flex justify-between">
                                                            <span>- {formatNumber(donationDeduction.hometownDisasterDetail.excessAmount)}원 × 30%</span>
                                                            <span>{formatNumber(donationDeduction.hometownDisasterDetail.excess)}원</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                        {donationData.special > 0 && (
                                            <div className="border-b border-orange-200 pb-2">
                                                <div className="flex justify-between text-muted-foreground font-semibold">
                                                    <span>• 특례기부금</span>
                                                    <span>{formatNumber(donationDeduction.special)}원</span>
                                                </div>
                                                <div className="ml-3 text-[10px] text-gray-500 mt-1 space-y-0.5">
                                                    {donationDeduction.specialDetail.amount15 > 0 && (
                                                        <div className="flex justify-between">
                                                            <span>- {formatNumber(donationDeduction.specialDetail.amount15)}원 × 15%</span>
                                                            <span>{formatNumber(donationDeduction.specialDetail.deduction15)}원</span>
                                                        </div>
                                                    )}
                                                    {donationDeduction.specialDetail.amount30 > 0 && (
                                                        <div className="flex justify-between">
                                                            <span>- {formatNumber(donationDeduction.specialDetail.amount30)}원 × 30%</span>
                                                            <span>{formatNumber(donationDeduction.specialDetail.deduction30)}원</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                        {donationData.employee > 0 && (
                                            <div className="border-b border-orange-200 pb-2">
                                                <div className="flex justify-between text-muted-foreground font-semibold">
                                                    <span>• 우리사주조합 기부금</span>
                                                    <span>{formatNumber(donationDeduction.employee)}원</span>
                                                </div>
                                                <div className="ml-3 text-[10px] text-gray-500 mt-1 space-y-0.5">
                                                    {donationDeduction.employeeDetail.amount15 > 0 && (
                                                        <div className="flex justify-between">
                                                            <span>- {formatNumber(donationDeduction.employeeDetail.amount15)}원 × 15%</span>
                                                            <span>{formatNumber(donationDeduction.employeeDetail.deduction15)}원</span>
                                                        </div>
                                                    )}
                                                    {donationDeduction.employeeDetail.amount30 > 0 && (
                                                        <div className="flex justify-between">
                                                            <span>- {formatNumber(donationDeduction.employeeDetail.amount30)}원 × 30%</span>
                                                            <span>{formatNumber(donationDeduction.employeeDetail.deduction30)}원</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                        {donationData.designated > 0 && (
                                            <div className="border-b border-orange-200 pb-2">
                                                <div className="flex justify-between text-muted-foreground font-semibold">
                                                    <span>• 일반기부금 (종교단체 외)</span>
                                                    <span>{formatNumber(donationDeduction.designated)}원</span>
                                                </div>
                                                <div className="ml-3 text-[10px] text-gray-500 mt-1 space-y-0.5">
                                                    {donationDeduction.designatedDetail.amount15 > 0 && (
                                                        <div className="flex justify-between">
                                                            <span>- {formatNumber(donationDeduction.designatedDetail.amount15)}원 × 15%</span>
                                                            <span>{formatNumber(donationDeduction.designatedDetail.deduction15)}원</span>
                                                        </div>
                                                    )}
                                                    {donationDeduction.designatedDetail.amount30 > 0 && (
                                                        <div className="flex justify-between">
                                                            <span>- {formatNumber(donationDeduction.designatedDetail.amount30)}원 × 30%</span>
                                                            <span>{formatNumber(donationDeduction.designatedDetail.deduction30)}원</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                        {donationData.religious > 0 && (
                                            <div>
                                                <div className="flex justify-between text-muted-foreground font-semibold">
                                                    <span>• 일반기부금 (종교단체)</span>
                                                    <span>{formatNumber(donationDeduction.religious)}원</span>
                                                </div>
                                                <div className="ml-3 text-[10px] text-gray-500 mt-1 space-y-0.5">
                                                    {donationDeduction.religiousDetail.amount15 > 0 && (
                                                        <div className="flex justify-between">
                                                            <span>- {formatNumber(donationDeduction.religiousDetail.amount15)}원 × 15%</span>
                                                            <span>{formatNumber(donationDeduction.religiousDetail.deduction15)}원</span>
                                                        </div>
                                                    )}
                                                    {donationDeduction.religiousDetail.amount30 > 0 && (
                                                        <div className="flex justify-between">
                                                            <span>- {formatNumber(donationDeduction.religiousDetail.amount30)}원 × 30%</span>
                                                            <span>{formatNumber(donationDeduction.religiousDetail.deduction30)}원</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* 7. 보험·연금 */}
                        <AccordionItem value="pension" className="bg-white border-brutal shadow-brutal">
                            <AccordionTrigger className="px-6 py-4 text-xl font-bold hover:bg-[#F7CB15] transition-colors">
                                🏦 7. 보험·연금
                            </AccordionTrigger>
                            <AccordionContent className="px-6 py-4 space-y-4">
                                <div>
                                    <Label className="text-base font-bold mb-2 block">보장성 보험료 (원)</Label>
                                    <Input
                                        type="text"
                                        defaultValue={formatNumber(insurancePensionData.insurance)}
                                        onBlur={(e) => {
                                            const rawValue = e.target.value.replace(/[^0-9]/g, '');
                                            const numValue = parseInt(rawValue, 10) || 0;
                                            setInsurancePensionData(prev => ({ ...prev, insurance: numValue }));
                                            e.target.value = formatNumber(numValue);
                                        }}
                                        placeholder="1,000,000"
                                        className="border-brutal shadow-brutal-sm text-lg font-semibold h-12"
                                    />
                                    <p className="text-sm text-muted-foreground font-semibold mt-1">
                                        💡 연 100만원 한도, 12% 세액공제
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-base font-bold mb-2 block">연금저축 (원)</Label>
                                    <Input
                                        type="text"
                                        defaultValue={formatNumber(insurancePensionData.pensionSavings)}
                                        onBlur={(e) => {
                                            const rawValue = e.target.value.replace(/[^0-9]/g, '');
                                            const numValue = parseInt(rawValue, 10) || 0;
                                            setInsurancePensionData(prev => ({ ...prev, pensionSavings: numValue }));
                                            e.target.value = formatNumber(numValue);
                                        }}
                                        placeholder="4,000,000"
                                        className="border-brutal shadow-brutal-sm text-lg font-semibold h-12"
                                    />
                                    <p className="text-sm text-muted-foreground font-semibold mt-1">
                                        💡 최대 600만원 한도, 총급여 5,500만원 이하 15% / 초과 12% 세액공제
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-base font-bold mb-2 block">퇴직연금(IRP) (원)</Label>
                                    <Input
                                        type="text"
                                        defaultValue={formatNumber(insurancePensionData.irp)}
                                        onBlur={(e) => {
                                            const rawValue = e.target.value.replace(/[^0-9]/g, '');
                                            const numValue = parseInt(rawValue, 10) || 0;
                                            setInsurancePensionData(prev => ({ ...prev, irp: numValue }));
                                            e.target.value = formatNumber(numValue);
                                        }}
                                        placeholder="3,000,000"
                                        className="border-brutal shadow-brutal-sm text-lg font-semibold h-12"
                                    />
                                    <p className="text-sm text-muted-foreground font-semibold mt-1">
                                        💡 연금저축 합산 최대 900만원 한도, 총급여 5,500만원 이하 15% / 초과 12% 세액공제
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-base font-bold mb-2 block">ISA 추가 납입액 (원)</Label>
                                    <Input
                                        type="text"
                                        defaultValue={formatNumber(insurancePensionData.isa)}
                                        onBlur={(e) => {
                                            const rawValue = e.target.value.replace(/[^0-9]/g, '');
                                            const numValue = parseInt(rawValue, 10) || 0;
                                            if (numValue > 30000000) {
                                                alert('ISA 추가 납입액은 3,000만원을 초과할 수 없습니다.');
                                                e.target.value = '';
                                                setInsurancePensionData(prev => ({ ...prev, isa: 0 }));
                                                return;
                                            }
                                            setInsurancePensionData(prev => ({ ...prev, isa: numValue }));
                                            e.target.value = formatNumber(numValue);
                                        }}
                                        placeholder="0"
                                        className="border-brutal shadow-brutal-sm text-lg font-semibold h-12"
                                    />
                                    <p className="text-sm text-muted-foreground font-semibold mt-1">
                                        💡 납입액 3,000만원 한도, 10% 세액공제 (최대 300만원)
                                    </p>
                                </div>


                                {/* 보험·연금 공제 요약 */}
                                <div className="bg-orange-50 border-2 border-orange-300 rounded-lg p-4 mt-4">
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold">🏦 보험·연금 세액공제</span>
                                        <span className="text-xl font-black text-orange-600">{formatNumber(insurancePensionDeduction.total)}원</span>
                                    </div>
                                    <div className="mt-2 space-y-2 text-xs">
                                        {insurancePensionData.insurance > 0 && (
                                            <div className="border-b border-orange-200 pb-2">
                                                <div className="flex justify-between text-muted-foreground font-semibold">
                                                    <span>• 보장성 보험료</span>
                                                    <span>{formatNumber(insurancePensionDeduction.insurance)}원</span>
                                                </div>
                                                <div className="ml-3 text-[10px] text-gray-500 mt-1 space-y-0.5">
                                                    <div className="flex justify-between">
                                                        <span>- {formatNumber(Math.min(insurancePensionData.insurance, 1000000))}원 × 12%</span>
                                                        <span>{formatNumber(insurancePensionDeduction.insurance)}원</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {insurancePensionData.pensionSavings > 0 && (
                                            <div className="border-b border-orange-200 pb-2">
                                                <div className="flex justify-between text-muted-foreground font-semibold">
                                                    <span>• 연금저축</span>
                                                    <span>{formatNumber(insurancePensionDeduction.pensionSavings)}원</span>
                                                </div>
                                                <div className="ml-3 text-[10px] text-gray-500 mt-1 space-y-0.5">
                                                    <div className="flex justify-between">
                                                        <span>- {formatNumber(insurancePensionDeduction.pensionSavingsDetail.amount)}원 × {insurancePensionDeduction.pensionRate}</span>
                                                        <span>{formatNumber(insurancePensionDeduction.pensionSavings)}원</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {insurancePensionData.irp > 0 && (
                                            <div className="border-b border-orange-200 pb-2">
                                                <div className="flex justify-between text-muted-foreground font-semibold">
                                                    <span>• 퇴직연금(IRP)</span>
                                                    <span>{formatNumber(insurancePensionDeduction.irp)}원</span>
                                                </div>
                                                <div className="ml-3 text-[10px] text-gray-500 mt-1 space-y-0.5">
                                                    <div className="flex justify-between">
                                                        <span>- {formatNumber(insurancePensionDeduction.irpDetail.amount)}원 × {insurancePensionDeduction.pensionRate}</span>
                                                        <span>{formatNumber(insurancePensionDeduction.irp)}원</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {insurancePensionData.isa > 0 && (
                                            <div className="border-b border-orange-200 pb-2">
                                                <div className="flex justify-between text-muted-foreground font-semibold">
                                                    <span>• ISA 추가 납입</span>
                                                    <span>{formatNumber(insurancePensionDeduction.isa)}원</span>
                                                </div>
                                                <div className="ml-3 text-[10px] text-gray-500 mt-1 space-y-0.5">
                                                    <div className="flex justify-between">
                                                        <span>- {formatNumber(insurancePensionDeduction.isaDetail.amount)}원 × 10%</span>
                                                        <span>{formatNumber(insurancePensionDeduction.isa)}원</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-[10px] text-gray-500 mt-2">
                                        ※ 연금 공제율: 총급여 5,500만원 이하 15%, 초과 12% (현재: {insurancePensionDeduction.pensionRate})
                                    </p>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* 8. 자녀 세액공제 */}
                        <AccordionItem value="childTaxCredit" className="bg-white border-brutal shadow-brutal">
                            <AccordionTrigger className="px-6 py-4 text-xl font-bold hover:bg-[#FF69B4] transition-colors">
                                👶 8. 자녀 세액공제
                            </AccordionTrigger>
                            <AccordionContent className="px-6 py-4 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-base font-bold mb-2 block">만 8세 이상 자녀 (인)</Label>
                                        <Input
                                            type="number"
                                            min="0"
                                            value={childTaxCreditData.childrenOver8}
                                            onChange={(e) => setChildTaxCreditData(prev => ({ ...prev, childrenOver8: parseInt(e.target.value) || 0 }))}
                                            className="border-brutal shadow-brutal-sm text-lg font-semibold h-12"
                                        />
                                        <p className="text-sm text-muted-foreground font-semibold mt-1">
                                            💡 1명 25만원, 2명 55만원, 3명+ 추가 40만원/인
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-base font-bold mb-2 block">출산/입양 자녀 (인)</Label>
                                        <Input
                                            type="number"
                                            min="0"
                                            value={childTaxCreditData.newbornOrAdopted}
                                            onChange={(e) => setChildTaxCreditData(prev => ({ ...prev, newbornOrAdopted: parseInt(e.target.value) || 0 }))}
                                            className="border-brutal shadow-brutal-sm text-lg font-semibold h-12"
                                        />
                                        <p className="text-sm text-muted-foreground font-semibold mt-1">
                                            💡 첫째 30만원, 둘째 50만원, 셋째+ 70만원
                                        </p>
                                    </div>
                                </div>

                                {/* 자녀 세액공제 요약 */}
                                <div className="bg-pink-50 border-2 border-pink-300 rounded-lg p-4 mt-4">
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold">👶 자녀 세액공제</span>
                                        <span className="text-xl font-black text-pink-600">{formatNumber(childTaxCredit.totalCredit)}원</span>
                                    </div>
                                    <div className="mt-2 space-y-2 text-xs">
                                        {childTaxCredit.basicCredit > 0 && (
                                            <div className="border-b border-pink-200 pb-2">
                                                <div className="flex justify-between text-muted-foreground font-semibold">
                                                    <span>• 기본 자녀공제 (만8세 이상 {childTaxCredit.childrenOver8}명)</span>
                                                    <span>{formatNumber(childTaxCredit.basicCredit)}원</span>
                                                </div>
                                                <div className="ml-3 text-[10px] text-gray-500 mt-1">
                                                    {childTaxCredit.childrenOver8 === 1 && "- 1명: 25만원"}
                                                    {childTaxCredit.childrenOver8 === 2 && "- 2명: 55만원"}
                                                    {childTaxCredit.childrenOver8 >= 3 && `- 55만원 + ${childTaxCredit.childrenOver8 - 2}명 × 40만원`}
                                                </div>
                                            </div>
                                        )}
                                        {childTaxCredit.birthAdoptionCredit > 0 && (
                                            <div className="border-b border-pink-200 pb-2">
                                                <div className="flex justify-between text-muted-foreground font-semibold">
                                                    <span>• 출산/입양 자녀공제 ({childTaxCredit.newbornOrAdopted}명)</span>
                                                    <span>{formatNumber(childTaxCredit.birthAdoptionCredit)}원</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* 9. 주택자금 */}
                        <AccordionItem value="housing" className="bg-white border-brutal shadow-brutal">
                            <AccordionTrigger className="px-6 py-4 text-xl font-bold hover:bg-[#00D9FF] transition-colors">
                                🏠 9. 주택자금
                            </AccordionTrigger>
                            <AccordionContent className="px-6 py-4 space-y-6">
                                {/* 소득공제 항목 */}
                                <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4">
                                    <h4 className="text-lg font-black mb-4 text-green-700 flex items-center gap-2">
                                        📋 소득공제 항목
                                        <Badge className="bg-green-600 text-white text-xs">과세표준 감소</Badge>
                                    </h4>
                                    <div className="space-y-4">
                                        <div>
                                            <Label className="text-base font-bold mb-2 block">주택청약저축 (원)</Label>
                                            <Input
                                                type="text"
                                                value={totalSalary > 70000000 ? '' : formatNumber(housingData.housingSavings)}
                                                onChange={(e) => {
                                                    if (totalSalary > 70000000) return;
                                                    const rawValue = e.target.value.replace(/[^0-9]/g, '');
                                                    const numValue = parseInt(rawValue, 10) || 0;
                                                    setHousingData(prev => ({ ...prev, housingSavings: numValue }));
                                                }}
                                                onBlur={(e) => {
                                                    if (totalSalary > 70000000) return;
                                                    const rawValue = e.target.value.replace(/[^0-9]/g, '');
                                                    const numValue = parseInt(rawValue, 10) || 0;
                                                    setHousingData(prev => ({ ...prev, housingSavings: numValue }));
                                                    e.target.value = formatNumber(numValue);
                                                }}
                                                placeholder={totalSalary > 70000000 ? "총급여 7,000만원 초과 - 공제 대상 아님" : "2,400,000"}
                                                disabled={totalSalary > 70000000}
                                                className={`border-brutal shadow-brutal-sm text-lg font-semibold h-12 ${totalSalary > 70000000 ? 'bg-gray-200 cursor-not-allowed text-gray-500' : 'bg-white'}`}
                                            />
                                            {totalSalary > 70000000 ? (
                                                <p className="text-sm text-red-500 font-bold mt-1">
                                                    ⚠️ 총급여 7,000만원 초과로 주택청약저축 소득공제 대상이 아닙니다
                                                </p>
                                            ) : (
                                                <p className="text-sm text-muted-foreground font-semibold mt-1">
                                                    💡 <span className="text-red-500 font-bold">총급여 7,000만원 이하</span> | 납입액 300만원 한도 × 40% 소득공제 (주택임차차입금과 합산 400만원 한도)
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <Label className="text-base font-bold mb-2 block">주택임차차입금 원리금상환액 (원)</Label>
                                            <Input
                                                type="text"
                                                defaultValue={formatNumber(housingData.leaseLoan)}
                                                onBlur={(e) => {
                                                    const rawValue = e.target.value.replace(/[^0-9]/g, '');
                                                    const numValue = parseInt(rawValue, 10) || 0;
                                                    setHousingData(prev => ({ ...prev, leaseLoan: numValue }));
                                                    e.target.value = formatNumber(numValue);
                                                }}
                                                placeholder="0"
                                                className="border-brutal shadow-brutal-sm text-lg font-semibold h-12 bg-white"
                                            />
                                            <p className="text-sm text-muted-foreground font-semibold mt-1">
                                                💡 원리금상환액 × 40% 소득공제 (주택마련저축과 합산 400만원 한도)
                                            </p>
                                        </div>
                                        <div>
                                            <Label className="text-base font-bold mb-2 block">장기주택저당차입금 이자상환액 (원)</Label>
                                            <Input
                                                type="text"
                                                defaultValue={formatNumber(housingData.mortgageInterest)}
                                                onBlur={(e) => {
                                                    const rawValue = e.target.value.replace(/[^0-9]/g, '');
                                                    const numValue = parseInt(rawValue, 10) || 0;
                                                    setHousingData(prev => ({ ...prev, mortgageInterest: numValue }));
                                                    e.target.value = formatNumber(numValue);
                                                }}
                                                placeholder="0"
                                                className="border-brutal shadow-brutal-sm text-lg font-semibold h-12 bg-white"
                                            />
                                            <p className="text-sm text-muted-foreground font-semibold mt-1">
                                                💡 전액 소득공제 (상환조건에 따라 600만~2,000만원 한도)
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* 세액공제 항목 */}
                                <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4">
                                    <h4 className="text-lg font-black mb-4 text-blue-700 flex items-center gap-2">
                                        💰 세액공제 항목
                                        <Badge className="bg-blue-600 text-white text-xs">납부세액 감소</Badge>
                                    </h4>
                                    <div className="space-y-4">
                                        <div>
                                            <Label className="text-base font-bold mb-2 block">월세 (원)</Label>
                                            <Input
                                                type="text"
                                                defaultValue={formatNumber(housingData.rent)}
                                                onBlur={(e) => {
                                                    const rawValue = e.target.value.replace(/[^0-9]/g, '');
                                                    const numValue = parseInt(rawValue, 10) || 0;
                                                    setHousingData(prev => ({ ...prev, rent: numValue }));
                                                    e.target.value = formatNumber(numValue);
                                                }}
                                                placeholder="0"
                                                className="border-brutal shadow-brutal-sm text-lg font-semibold h-12 bg-white"
                                            />
                                            <p className="text-sm text-muted-foreground font-semibold mt-1">
                                                💡 연 1,000만원 한도, 총급여 5,500만원 이하 17% / 초과 15% 세액공제
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* 주택자금 공제 요약 */}
                                <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-gray-300 rounded-lg p-4 mt-4">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="font-bold text-lg">🏠 주택자금 공제 합계</span>
                                    </div>

                                    {/* 소득공제 합계 */}
                                    <div className="bg-green-100 rounded-lg p-3 mb-2">
                                        <div className="flex justify-between items-center">
                                            <span className="font-bold text-green-700">📋 소득공제 합계</span>
                                            <span className="text-xl font-black text-green-700">
                                                {formatNumber(housingDeduction.incomeDeductionTotal)}원
                                            </span>
                                        </div>
                                        <div className="mt-2 space-y-1 text-xs">
                                            {housingData.leaseLoan > 0 && (
                                                <div className="flex justify-between text-muted-foreground">
                                                    <span>• 주택임차차입금 ({formatNumber(housingDeduction.leaseLoanDetail.amount)}원 × 40%)</span>
                                                    <span>{formatNumber(housingDeduction.leaseLoan)}원</span>
                                                </div>
                                            )}
                                            {housingData.housingSavings > 0 && (
                                                <div className="flex justify-between text-muted-foreground">
                                                    <span>• 주택청약저축 ({formatNumber(housingDeduction.housingSavingsDetail.amount)}원 × 40%)</span>
                                                    <span>{formatNumber(housingDeduction.housingSavings)}원</span>
                                                </div>
                                            )}
                                            {housingData.mortgageInterest > 0 && (
                                                <div className="flex justify-between text-muted-foreground">
                                                    <span>• 장기주택저당차입금 ({formatNumber(housingDeduction.mortgageInterestDetail.amount)}원 × 전액)</span>
                                                    <span>{formatNumber(housingDeduction.mortgageInterest)}원</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* 세액공제 합계 */}
                                    <div className="bg-blue-100 rounded-lg p-3">
                                        <div className="flex justify-between items-center">
                                            <span className="font-bold text-blue-700">💰 세액공제 합계</span>
                                            <span className="text-xl font-black text-blue-700">
                                                {formatNumber(housingDeduction.taxCreditTotal)}원
                                            </span>
                                        </div>
                                        {housingData.rent > 0 && (
                                            <div className="mt-2 space-y-1 text-xs">
                                                <div className="flex justify-between text-muted-foreground">
                                                    <span>• 월세 ({formatNumber(housingDeduction.rentDetail.amount)}원 × {housingDeduction.rentRate})</span>
                                                    <span>{formatNumber(housingDeduction.rent)}원</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-3 space-y-1 text-xs">
                                        {(housingData.housingSavings > 0 || housingData.leaseLoan > 0) && (
                                            <p className="text-gray-500">
                                                ※ 주택청약저축(300만원 한도)+주택임차차입금 합산 공제 400만원 한도
                                            </p>
                                        )}
                                        {housingData.rent > 0 && (
                                            <p className="text-gray-500">
                                                ※ 월세 공제율: 총급여 5,500만원 이하 17%, 초과 15% (현재: {housingDeduction.rentRate})
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>

                    {/* Calculate Button */}
                    <div className="flex gap-4">
                        <Button className="flex-1 bg-black text-white text-xl font-black py-6 border-brutal shadow-brutal hover-brutal">
                            💡 AI 분석 요청
                        </Button>
                        <Button
                            onClick={calculateAllTax}
                            className="flex-1 bg-[#FF6B35] text-black text-xl font-black py-6 border-brutal shadow-brutal hover-brutal hover:text-white"
                        >
                            🧮 계산하기
                        </Button>
                    </div>
                </div>

                {/* Right: Results Panel (Sticky) */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 space-y-4">
                        <Card className="bg-[#F7CB15] border-brutal shadow-brutal-lg p-6">
                            <h3 className="text-2xl font-black mb-4">📊 계산 결과</h3>
                            {!isCalculated ? (
                                <div className="text-center py-12">
                                    <div className="relative inline-block">
                                        <div className="absolute inset-0 bg-orange-400/30 rounded-full blur-xl animate-pulse"></div>
                                        <div className="relative text-7xl animate-bounce">💰</div>
                                    </div>
                                    <div className="mt-6 flex items-center justify-center gap-2">
                                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                    <p className="text-lg font-bold text-gray-600 mt-4">
                                        정보를 입력하고
                                    </p>
                                    <p className="text-lg font-bold text-gray-600">
                                        <span className="text-[#FF6B35] animate-pulse">계산하기</span> 버튼을 클릭하세요
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm font-semibold text-muted-foreground mb-1">총 급여액</p>
                                        <p className="text-xl font-black">
                                            {results.totalSalary.toLocaleString()}원
                                        </p>
                                    </div>
                                    <div className="border-t-2 border-black/30 pt-3">
                                        <p className="text-sm font-semibold text-muted-foreground mb-1">근로소득공제</p>
                                        <p className="text-xl font-black text-blue-700">
                                            -{results.incomeDeduction.toLocaleString()}원
                                        </p>
                                        <div className="text-[10px] text-gray-600 mt-1 space-y-0.5">
                                            <p>
                                                {results.totalSalary <= 5000000
                                                    ? `• ${(results.totalSalary / 10000).toLocaleString()}만원 × 70%`
                                                    : results.totalSalary <= 15000000
                                                        ? `• 350만원 + (${(results.totalSalary / 10000).toLocaleString()}만원 - 500만원) × 40%`
                                                        : results.totalSalary <= 45000000
                                                            ? `• 750만원 + (${(results.totalSalary / 10000).toLocaleString()}만원 - 1,500만원) × 15%`
                                                            : results.totalSalary <= 100000000
                                                                ? `• 1,200만원 + (${(results.totalSalary / 10000).toLocaleString()}만원 - 4,500만원) × 5%`
                                                                : `• 1,475만원 + (${(results.totalSalary / 10000).toLocaleString()}만원 - 1억원) × 2%`
                                                }
                                            </p>
                                            <p className="text-gray-500">※ 공제한도 2,000만원</p>
                                        </div>
                                    </div>
                                    <div className="border-t-2 border-black/30 pt-3">
                                        <p className="text-sm font-semibold text-muted-foreground mb-1">근로소득금액</p>
                                        <p className="text-xl font-black">
                                            {results.incomeAmount.toLocaleString()}원
                                        </p>
                                    </div>
                                    <div className="border-t-2 border-black/30 pt-3">
                                        <p className="text-sm font-semibold text-muted-foreground mb-1">소득공제</p>
                                        <p className="text-xl font-black text-blue-700">
                                            -{results.itemizedDeduction.toLocaleString()}원
                                        </p>
                                        <div className="text-[10px] text-gray-600 mt-1 space-y-0.5">
                                            <p>• 기본공제 (본인): 1,500,000원</p>
                                            {(dependentData.spouse + dependentData.parents + dependentData.children +
                                                dependentData.siblings + dependentData.foster + dependentData.recipient) > 0 && (
                                                    <p>• 부양가족공제 ({dependentData.spouse + dependentData.parents + dependentData.children +
                                                        dependentData.siblings + dependentData.foster + dependentData.recipient}명 × 150만원): {((dependentData.spouse + dependentData.parents + dependentData.children +
                                                            dependentData.siblings + dependentData.foster + dependentData.recipient) * 1500000).toLocaleString()}원</p>
                                                )}
                                            {(socialInsuranceData.nationalPension + socialInsuranceData.healthInsurance +
                                                socialInsuranceData.longTermCare + socialInsuranceData.employmentInsurance) > 0 && (
                                                    <p>• 4대보험료: {(socialInsuranceData.nationalPension + socialInsuranceData.healthInsurance +
                                                        socialInsuranceData.longTermCare + socialInsuranceData.employmentInsurance).toLocaleString()}원</p>
                                                )}
                                            {housingDeduction.incomeDeductionTotal > 0 && (
                                                <p>• 주택자금 소득공제: {housingDeduction.incomeDeductionTotal.toLocaleString()}원</p>
                                            )}
                                            {cardDeduction.total > 0 && (
                                                <p>• 카드·현금 소득공제: {cardDeduction.total.toLocaleString()}원</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="border-t-4 border-black pt-3">
                                        <p className="text-sm font-semibold text-muted-foreground mb-1">종합소득과세표준</p>
                                        <p className="text-xl font-black">
                                            {results.taxableIncome.toLocaleString()}원
                                        </p>
                                    </div>
                                    <div className="border-t-2 border-black/30 pt-3">
                                        <p className="text-sm font-semibold text-muted-foreground mb-1">산출세액</p>
                                        <p className="text-xl font-black">
                                            {results.calculatedTax.toLocaleString()}원
                                        </p>
                                    </div>
                                    <div className="border-t-2 border-black/30 pt-3">
                                        <p className="text-sm font-semibold text-muted-foreground mb-1">근로소득세액공제</p>
                                        <p className="text-xl font-black text-blue-700">
                                            -{earnedIncomeTaxCredit.finalCredit.toLocaleString()}원
                                        </p>
                                        <div className="text-[10px] text-gray-600 mt-1 space-y-0.5">
                                            <p>
                                                {earnedIncomeTaxCredit.calculatedTax <= 1300000
                                                    ? `• 산출세액 ${(earnedIncomeTaxCredit.calculatedTax / 10000).toLocaleString()}만원 × 55% = ${earnedIncomeTaxCredit.taxCreditRaw.toLocaleString()}원`
                                                    : `• 71.5만원 + (${(earnedIncomeTaxCredit.calculatedTax / 10000).toLocaleString()}만원 - 130만원) × 30% = ${earnedIncomeTaxCredit.taxCreditRaw.toLocaleString()}원`
                                                }
                                            </p>
                                            <p>• 한도: {earnedIncomeTaxCredit.creditLimit.toLocaleString()}원 (총급여 {(totalSalary / 10000).toLocaleString()}만원 기준)</p>
                                        </div>
                                    </div>

                                    <div className="border-t-2 border-black/30 pt-3">
                                        <p className="text-sm font-semibold text-muted-foreground mb-1">세액감면 및 세액공제</p>
                                        <p className="text-xl font-black text-blue-700">
                                            -{(childTaxCredit.totalCredit + educationDeduction.total + medicalDeduction.deduction + donationDeduction.total + insurancePensionDeduction.total + housingDeduction.taxCreditTotal).toLocaleString()}원
                                        </p>
                                        <div className="text-[10px] text-gray-600 mt-1 space-y-0.5">

                                            {childTaxCredit.totalCredit > 0 && (
                                                <p>• 자녀세액공제: {childTaxCredit.totalCredit.toLocaleString()}원</p>
                                            )}
                                            {educationDeduction.total > 0 && (
                                                <p>• 교육비: {educationDeduction.total.toLocaleString()}원</p>
                                            )}
                                            {medicalDeduction.deduction > 0 && (
                                                <p>• 의료비: {medicalDeduction.deduction.toLocaleString()}원</p>
                                            )}
                                            {donationDeduction.total > 0 && (
                                                <p>• 기부금: {donationDeduction.total.toLocaleString()}원</p>
                                            )}
                                            {insurancePensionDeduction.total > 0 && (
                                                <p>• 보험·연금: {insurancePensionDeduction.total.toLocaleString()}원</p>
                                            )}
                                            {housingDeduction.taxCreditTotal > 0 && (
                                                <p>• 월세: {housingDeduction.taxCreditTotal.toLocaleString()}원</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="border-t-2 border-black/30 pt-3">
                                        <p className="text-sm font-semibold text-muted-foreground mb-1">결정세액</p>
                                        <p className="text-xl font-black">
                                            {results.determinedTax.toLocaleString()}원
                                        </p>
                                    </div>
                                    <div className="border-t-2 border-black/30 pt-3">
                                        <p className="text-sm font-semibold text-muted-foreground mb-1">기납부세액</p>
                                        <p className="text-xl font-black text-blue-700">
                                            -{results.paidTax.toLocaleString()}원
                                        </p>
                                    </div>
                                    <div className="border-t-4 border-black pt-3 bg-white border-brutal shadow-brutal p-4">
                                        <p className="text-sm font-bold mb-1 flex items-center gap-2">
                                            환급 예상액
                                            <span className="inline-block animate-bounce text-xl">🎉</span>
                                        </p>
                                        <p className="text-3xl font-black text-[#FF6B35]">
                                            {results.refundAmount.toLocaleString()}원
                                        </p>
                                        <Badge className="mt-2 bg-green-500 text-white font-bold border-2 border-black">
                                            ▲ 전년 대비 +12.3%
                                        </Badge>
                                    </div>
                                </div>
                            )}
                        </Card>

                        <Button className="w-full bg-black text-white text-xl font-black py-6 border-brutal shadow-brutal hover-brutal">
                            📄 PDF 리포트 다운로드
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
