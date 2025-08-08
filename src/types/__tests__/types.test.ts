/**
 * Type definition tests
 * These tests verify that our TypeScript interfaces compile correctly
 * and provide proper type safety
 */

import {
  PayrollInputs,
  DeductionInputs,
  YTDInputs,
  PayrollResults,
  RiggingInputs,
  RiggingResults,
  Contract,
  PayrollScenario,
  RiggingScenario,
  Province,
  PayFrequency,
  HitchType,
} from '../index';

describe('Type Definitions', () => {
  describe('Payroll Types', () => {
    it('should create valid PayrollInputs', () => {
      const inputs: PayrollInputs = {
        rate: 60,
        straightTime: 40,
        overtimeHalf: 8,
        overtimeDouble: 0,
        shiftPremium: 1.5,
        travelHours: 0,
        travelRate: 0,
        perDiem: 150,
        days: 5,
        payDate: '2025-01-15',
        frequency: 'weekly',
        province: 'AB',
      };

      expect(inputs.rate).toBe(60);
      expect(inputs.frequency).toBe('weekly');
      expect(inputs.province).toBe('AB');
    });

    it('should create valid DeductionInputs', () => {
      const deductions: DeductionInputs = {
        unionDuesPercent: 3.0,
        rrspPercent: 5.0,
        rrspAtSource: true,
        otherDeductions: 50,
      };

      expect(deductions.unionDuesPercent).toBe(3.0);
      expect(deductions.rrspAtSource).toBe(true);
    });

    it('should create valid YTDInputs', () => {
      const ytd: YTDInputs = {
        pensionableEarnings: 25000,
        cpp1Paid: 1000,
        cpp2Paid: 0,
        insurableEarnings: 25000,
        eiPaid: 400,
      };

      expect(ytd.pensionableEarnings).toBe(25000);
      expect(ytd.cpp1Paid).toBe(1000);
    });
  });

  describe('Rigging Types', () => {
    it('should create valid RiggingInputs', () => {
      const inputs: RiggingInputs = {
        hitchType: 'vertical',
        weight: 5000,
        legs: 2,
        angle: 60,
        cogOffset: 0,
        spacing: 2000,
        slingWLL: 4000,
      };

      expect(inputs.hitchType).toBe('vertical');
      expect(inputs.weight).toBe(5000);
      expect(inputs.legs).toBe(2);
    });
  });

  describe('Contract Types', () => {
    it('should create valid Contract', () => {
      const contract: Contract = {
        id: 'contract-1',
        name: 'Local 146 - Turnaround A',
        baseRate: 62,
        shiftPremium: 1.5,
        overtimeRules: [],
        perDiem: 150,
        province: 'AB',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      expect(contract.name).toBe('Local 146 - Turnaround A');
      expect(contract.baseRate).toBe(62);
      expect(contract.province).toBe('AB');
    });
  });

  describe('Scenario Types', () => {
    it('should create valid PayrollScenario', () => {
      const scenario: PayrollScenario = {
        type: 'netpay',
        name: 'Test Scenario',
        ts: Date.now(),
        inputs: {
          payroll: {
            rate: 60,
            straightTime: 40,
            overtimeHalf: 0,
            overtimeDouble: 0,
            shiftPremium: 0,
            travelHours: 0,
            travelRate: 0,
            perDiem: 0,
            days: 5,
            payDate: '2025-01-15',
            frequency: 'weekly',
            province: 'AB',
          },
          deductions: {
            unionDuesPercent: 3.0,
            rrspPercent: 0,
            rrspAtSource: true,
            otherDeductions: 0,
          },
          ytd: {
            pensionableEarnings: 0,
            cpp1Paid: 0,
            cpp2Paid: 0,
            insurableEarnings: 0,
            eiPaid: 0,
          },
        },
        results: {
          gross: {
            straightTimePay: 2400,
            overtimeHalfPay: 0,
            overtimeDoublePay: 0,
            shiftPremiumPay: 0,
            travelPay: 0,
            wage: 2400,
            allowances: 0,
            total: 2400,
          },
          deductions: {
            union: 72,
            rrsp: 0,
            other: 0,
            cpp1: 142.8,
            cpp2: 0,
            ei: 39.36,
            federal: 300,
            provincial: 100,
            total: 654.16,
          },
          net: 1745.84,
        },
      };

      expect(scenario.type).toBe('netpay');
      expect(scenario.name).toBe('Test Scenario');
      expect(scenario.results.net).toBe(1745.84);
    });

    it('should create valid RiggingScenario', () => {
      const scenario: RiggingScenario = {
        type: 'rigging',
        name: 'Test Rigging',
        ts: Date.now(),
        inputs: {
          hitchType: 'vertical',
          weight: 5000,
          legs: 2,
          angle: 60,
          cogOffset: 0,
          spacing: 2000,
          slingWLL: 4000,
        },
        results: {
          angleFactor: {
            angleFactor: 1.15,
            legAngle: 30,
            efficiency: 0.87,
          },
          loadDistribution: {
            legLoads: [0.5, 0.5],
            maxTension: 28350,
            minTension: 28350,
            isBalanced: true,
            imbalanceRatio: 1.0,
          },
          tensionPerLeg: 28.35,
          forcePerLeg: 28.35,
          safety: {
            isWLLAdequate: true,
            safetyMargin: 38.5,
            minRequiredWLL: 3610,
            recommendedWLL: 4000,
            warnings: [],
            recommendations: [],
          },
          maxTensionKN: 28.35,
          minRequiredWLL: 3610,
          safetyCheck: true,
        },
      };

      expect(scenario.type).toBe('rigging');
      expect(scenario.name).toBe('Test Rigging');
      expect(scenario.results.safetyCheck).toBe(true);
    });
  });

  describe('Enum Types', () => {
    it('should validate Province enum', () => {
      const provinces: Province[] = ['AB', 'BC', 'ON', 'QC'];
      expect(provinces).toContain('AB');
      expect(provinces).toContain('BC');
    });

    it('should validate PayFrequency enum', () => {
      const frequencies: PayFrequency[] = ['weekly', 'biweekly', 'semimonthly', 'monthly'];
      expect(frequencies).toContain('weekly');
      expect(frequencies).toContain('biweekly');
    });

    it('should validate HitchType enum', () => {
      const hitches: HitchType[] = ['vertical', 'choker', 'basket'];
      expect(hitches).toContain('vertical');
      expect(hitches).toContain('choker');
    });
  });
});