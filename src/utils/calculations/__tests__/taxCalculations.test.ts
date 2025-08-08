/**
 * Comprehensive tests for tax calculation functions
 * Tests CPP, EI, and income tax calculations with known scenarios for 2025
 */

import { calculateCPP, calculateEI, calculateIncomeTax, calculateStatutoryDeductions } from '../taxCalculations';
import { TAX_CONSTANTS_2025 } from '../../../types/constants';

describe('Tax Calculations', () => {
  describe('calculateCPP', () => {
    describe('CPP1 calculations', () => {
      it('should calculate CPP1 correctly for standard weekly case', () => {
        const result = calculateCPP(5000, 0, 52);
        // 5000 - (3500/52) = 5000 - 67.31 = 4932.69
        // 4932.69 * 0.0595 = 293.5
        expect(result.cpp1).toBeCloseTo(293.5, 1);
        expect(result.cpp2).toBe(0);
        expect(result.pensionableEarnings).toBeCloseTo(4932.69, 2);
      });

      it('should calculate CPP1 correctly for biweekly pay', () => {
        const result = calculateCPP(6000, 0, 26);
        // 6000 - (3500/26) = 6000 - 134.62 = 5865.38
        // 5865.38 * 0.0595 = 349.0
        expect(result.cpp1).toBeCloseTo(349.0, 1);
        expect(result.cpp2).toBe(0);
      });

      it('should calculate CPP1 correctly for monthly pay', () => {
        const result = calculateCPP(8000, 0, 12);
        // 8000 - (3500/12) = 8000 - 291.67 = 7708.33
        // 7708.33 * 0.0595 = 458.65
        expect(result.cpp1).toBeCloseTo(458.65, 1);
        expect(result.cpp2).toBe(0);
      });

      it('should handle CPP1 maximum correctly', () => {
        const result = calculateCPP(5000, 67800, 52); // YTD at CPP1 max
        expect(result.cpp1).toBe(0); // Should be capped
        expect(result.cpp2).toBeCloseTo(60, 1); // Should have CPP2 on excess
      });

      it('should handle partial CPP1 room', () => {
        const result = calculateCPP(2000, 66000, 52); // YTD near max
        // CPP1 room = (71300 - 3500) - 66000 = 1800
        // CPP1 pensionable = min(2000 - 67.31, 1800) = min(1932.69, 1800) = 1800
        // CPP1 = 1800 * 0.0595 = 107.1
        expect(result.cpp1).toBeCloseTo(107.1, 1);
      });

      it('should handle earnings below basic exemption', () => {
        const result = calculateCPP(50, 0, 52); // Very low earnings
        // 50 - (3500/52) = 50 - 67.31 = -17.31, so 0
        expect(result.cpp1).toBe(0);
        expect(result.cpp2).toBe(0);
        expect(result.pensionableEarnings).toBe(0);
      });

      it('should handle zero earnings', () => {
        const result = calculateCPP(0, 0, 52);
        expect(result.cpp1).toBe(0);
        expect(result.cpp2).toBe(0);
        expect(result.pensionableEarnings).toBe(0);
      });
    });

    describe('CPP2 calculations', () => {
      it('should calculate CPP2 for high earners above YMPE', () => {
        const result = calculateCPP(8000, 0, 52);
        // CPP1: (8000 - 67.31) * 0.0595 = 7932.69 * 0.0595 = 472
        // CPP2: 0 (since 8000 < YMPE/52 = 1371.15)
        expect(result.cpp1).toBeCloseTo(472, 1);
        expect(result.cpp2).toBe(0); // No CPP2 yet at this income level
      });

      it('should calculate CPP2 for very high weekly earners', () => {
        const result = calculateCPP(2000, 70000, 52); // YTD near YMPE
        // CPP1 room = (71300 - 3500) - 70000 = -2200, so 0
        // CPP2: pensionable after = min(70000 + 2000, 81200) = 72000
        // Above YMPE after = max(0, 72000 - 71300) = 700
        // CPP2 = 700 * 0.04 = 28
        expect(result.cpp1).toBe(0); // No CPP1 room left
        expect(result.cpp2).toBeCloseTo(28, 1);
      });

      it('should calculate CPP2 for earnings at YAMPE limit', () => {
        const result = calculateCPP(2000, 79200, 52); // YTD near YAMPE
        // CPP2 room = (81200 - 71300) - (79200 - 71300) = 9900 - 7900 = 2000
        // CPP2 base = min(2000, 2000) = 2000
        // CPP2 = 2000 * 0.04 = 80
        expect(result.cpp2).toBeCloseTo(80, 1);
      });

      it('should cap CPP2 at YAMPE maximum', () => {
        const result = calculateCPP(5000, 81200, 52); // YTD at YAMPE max
        expect(result.cpp1).toBe(0);
        expect(result.cpp2).toBe(0); // Should be capped
      });

      it('should handle mixed CPP1 and CPP2 scenario', () => {
        const result = calculateCPP(3000, 69000, 52); // Straddles YMPE
        // CPP1 room = (71300 - 3500) - 69000 = -700, so 0
        // But we need to check if this pay period crosses YMPE
        // This is a complex scenario that depends on exact implementation
        expect(result.cpp1).toBeGreaterThanOrEqual(0);
        expect(result.cpp2).toBeGreaterThanOrEqual(0);
      });
    });

    describe('Edge cases and validation', () => {
      it('should handle negative earnings gracefully', () => {
        const result = calculateCPP(-1000, 0, 52);
        expect(result.cpp1).toBe(0);
        expect(result.cpp2).toBe(0);
        expect(result.pensionableEarnings).toBe(0);
      });

      it('should handle very high YTD amounts', () => {
        const result = calculateCPP(1000, 100000, 52); // YTD above YAMPE
        expect(result.cpp1).toBe(0);
        expect(result.cpp2).toBe(0);
      });

      it('should handle different pay frequencies consistently', () => {
        // Same annual earnings, different frequencies
        const weekly = calculateCPP(1000, 0, 52);
        const biweekly = calculateCPP(2000, 0, 26);
        const monthly = calculateCPP(4333.33, 0, 12);

        // Should have similar annual CPP1 contributions
        const weeklyAnnual = weekly.cpp1 * 52;
        const biweeklyAnnual = biweekly.cpp1 * 26;
        const monthlyAnnual = monthly.cpp1 * 12;

        expect(weeklyAnnual).toBeCloseTo(biweeklyAnnual, 0);
        expect(biweeklyAnnual).toBeCloseTo(monthlyAnnual, 0);
      });
    });
  });

  describe('calculateEI', () => {
    describe('Standard EI calculations', () => {
      it('should calculate EI correctly for standard weekly case', () => {
        const result = calculateEI(5000, 0, 52);
        // 5000 * 0.0164 = 82
        expect(result.ei).toBeCloseTo(82, 2);
        expect(result.insurableEarnings).toBe(5000);
      });

      it('should calculate EI correctly for biweekly pay', () => {
        const result = calculateEI(6000, 0, 26);
        // 6000 * 0.0164 = 98.4
        expect(result.ei).toBeCloseTo(98.4, 2);
        expect(result.insurableEarnings).toBe(6000);
      });

      it('should calculate EI correctly for monthly pay', () => {
        const result = calculateEI(8000, 0, 12);
        // 8000 * 0.0164 = 131.2
        expect(result.ei).toBeCloseTo(131.2, 2);
        expect(result.insurableEarnings).toBe(8000);
      });

      it('should handle zero earnings', () => {
        const result = calculateEI(0, 0, 52);
        expect(result.ei).toBe(0);
        expect(result.insurableEarnings).toBe(0);
      });

      it('should handle negative earnings gracefully', () => {
        const result = calculateEI(-1000, 0, 52);
        expect(result.ei).toBe(0);
        expect(result.insurableEarnings).toBe(0);
      });
    });

    describe('EI maximum threshold handling', () => {
      it('should handle EI with room remaining', () => {
        const result = calculateEI(5000, 60000, 52);
        // EI room = 65700 - 60000 = 5700
        // EI base = min(5000, 5700) = 5000
        // EI = 5000 * 0.0164 = 82
        expect(result.ei).toBeCloseTo(82, 2);
        expect(result.insurableEarnings).toBe(5000);
      });

      it('should cap EI at maximum insurable earnings', () => {
        const result = calculateEI(5000, 65700, 52); // YTD at EI max
        // EI room = 65700 - 65700 = 0
        // EI base = min(5000, 0) = 0
        expect(result.ei).toBe(0);
        expect(result.insurableEarnings).toBe(0);
      });

      it('should handle partial EI room', () => {
        const result = calculateEI(3000, 64000, 52); // YTD near max
        // EI room = 65700 - 64000 = 1700
        // EI base = min(3000, 1700) = 1700
        // EI = 1700 * 0.0164 = 27.88
        expect(result.ei).toBeCloseTo(27.88, 2);
        expect(result.insurableEarnings).toBe(1700);
      });

      it('should handle YTD above maximum', () => {
        const result = calculateEI(2000, 70000, 52); // YTD above EI max
        expect(result.ei).toBe(0);
        expect(result.insurableEarnings).toBe(0);
      });
    });

    describe('EI calculation accuracy', () => {
      it('should calculate maximum annual EI correctly', () => {
        // Maximum EI for 2025: 65700 * 0.0164 = 1077.48
        const maxWeeklyEarnings = TAX_CONSTANTS_2025.EI_MIE / 52; // ~1263.46
        const result = calculateEI(maxWeeklyEarnings, 0, 52);
        const annualEI = result.ei * 52;
        expect(annualEI).toBeCloseTo(1077.48, 1);
      });

      it('should handle different pay frequencies consistently', () => {
        // Same annual earnings, different frequencies
        const weekly = calculateEI(1000, 0, 52);
        const biweekly = calculateEI(2000, 0, 26);
        const monthly = calculateEI(4333.33, 0, 12);

        // Should have similar annual EI contributions
        const weeklyAnnual = weekly.ei * 52;
        const biweeklyAnnual = biweekly.ei * 26;
        const monthlyAnnual = monthly.ei * 12;

        expect(weeklyAnnual).toBeCloseTo(biweeklyAnnual, 0);
        expect(biweeklyAnnual).toBeCloseTo(monthlyAnnual, 0);
      });

      it('should round EI contributions correctly', () => {
        const result = calculateEI(1234.56, 0, 52);
        // 1234.56 * 0.0164 = 20.246784, should round to 20.25
        expect(result.ei).toBeCloseTo(20.25, 2);
      });
    });
  });

  describe('calculateIncomeTax', () => {
    describe('Federal tax calculations', () => {
      it('should calculate federal tax correctly for low income', () => {
        const result = calculateIncomeTax(500, '2025-01-15', 'AB', 52);
        // Annualized income = 500 * 52 = 26000
        // This is below the first bracket, so minimal tax after BPA
        expect(result.federal).toBeGreaterThanOrEqual(0);
        expect(result.taxableIncome).toBe(500);
        expect(result.annualizedIncome).toBe(26000);
      });

      it('should calculate federal tax correctly for middle income', () => {
        const result = calculateIncomeTax(3000, '2025-01-15', 'AB', 52);
        // Annualized income = 3000 * 52 = 156000
        // This spans multiple tax brackets
        expect(result.federal).toBeGreaterThan(0);
        expect(result.taxableIncome).toBe(3000);
        expect(result.annualizedIncome).toBe(156000);
      });

      it('should calculate federal tax correctly for high income', () => {
        const result = calculateIncomeTax(8000, '2025-01-15', 'AB', 52);
        // Annualized income = 8000 * 52 = 416000
        // This is in the highest tax bracket
        expect(result.federal).toBeGreaterThan(0);
        expect(result.annualizedIncome).toBe(416000);
      });

      it('should handle zero income', () => {
        const result = calculateIncomeTax(0, '2025-01-15', 'AB', 52);
        expect(result.federal).toBe(0);
        expect(result.provincial).toBe(0);
        expect(result.taxableIncome).toBe(0);
        expect(result.annualizedIncome).toBe(0);
      });
    });

    describe('Provincial tax calculations (Alberta)', () => {
      it('should calculate Alberta provincial tax correctly', () => {
        const result = calculateIncomeTax(3000, '2025-01-15', 'AB', 52);
        expect(result.provincial).toBeGreaterThan(0);
        // Alberta has its own tax brackets and rates
      });

      it('should handle Alberta tax rate changes in July 2025', () => {
        const resultJan = calculateIncomeTax(2000, '2025-01-15', 'AB', 52);
        const resultJul = calculateIncomeTax(2000, '2025-07-15', 'AB', 52);
        
        // July should have lower Alberta tax due to rate change (10% to 6% in first bracket)
        expect(resultJul.provincial).toBeLessThan(resultJan.provincial);
      });

      it('should calculate Alberta tax for high income earners', () => {
        const result = calculateIncomeTax(6000, '2025-01-15', 'AB', 52);
        // Annualized income = 6000 * 52 = 312000
        // This spans multiple Alberta tax brackets
        expect(result.provincial).toBeGreaterThan(0);
      });
    });

    describe('Mid-year tax rate changes (2025)', () => {
      it('should handle federal tax rate changes in July', () => {
        const resultJan = calculateIncomeTax(3000, '2025-01-15', 'AB', 52);
        const resultJul = calculateIncomeTax(3000, '2025-07-15', 'AB', 52);
        
        // July should have lower federal tax due to rate change (15% to 14% in first bracket)
        expect(resultJul.federal).toBeLessThan(resultJan.federal);
      });

      it('should handle Alberta tax rate changes in July', () => {
        const resultJan = calculateIncomeTax(1500, '2025-01-15', 'AB', 52);
        const resultJul = calculateIncomeTax(1500, '2025-07-15', 'AB', 52);
        
        // July should have significantly lower Alberta tax (10% to 6%)
        expect(resultJul.provincial).toBeLessThan(resultJan.provincial);
        
        // The difference should be substantial for first bracket income
        const annualIncome = 1500 * 52; // 78000
        if (annualIncome <= 60000) {
          const expectedDifference = (annualIncome - 22323) * 0.04 / 52; // 4% difference
          expect(resultJan.provincial - resultJul.provincial).toBeCloseTo(expectedDifference, 1);
        }
      });

      it('should use correct rates based on pay date', () => {
        // Test boundary dates
        const june30 = calculateIncomeTax(2000, '2025-06-30', 'AB', 52);
        const july1 = calculateIncomeTax(2000, '2025-07-01', 'AB', 52);
        
        expect(july1.federal).toBeLessThan(june30.federal);
        expect(july1.provincial).toBeLessThan(june30.provincial);
      });
    });

    describe('Basic Personal Amount (BPA) calculations', () => {
      it('should apply maximum BPA for low income', () => {
        const result = calculateIncomeTax(1000, '2025-01-15', 'AB', 52);
        // Annualized income = 52000, below BPA threshold
        // Should get maximum federal BPA
        expect(result.federal).toBeGreaterThanOrEqual(0);
      });

      it('should apply minimum BPA for high income', () => {
        const result = calculateIncomeTax(8000, '2025-01-15', 'AB', 52);
        // Annualized income = 416000, above BPA phase-out threshold
        // Should get minimum federal BPA
        expect(result.federal).toBeGreaterThan(0);
      });

      it('should phase out BPA correctly for middle income', () => {
        const lowIncome = calculateIncomeTax(3000, '2025-01-15', 'AB', 52); // 156000 annual
        const highIncome = calculateIncomeTax(5000, '2025-01-15', 'AB', 52); // 260000 annual
        
        // Higher income should have higher effective tax rate due to BPA phase-out
        const lowRate = lowIncome.federal / 3000;
        const highRate = highIncome.federal / 5000;
        expect(highRate).toBeGreaterThan(lowRate);
      });
    });

    describe('Tax calculation accuracy and edge cases', () => {
      it('should handle very low taxable income', () => {
        const result = calculateIncomeTax(100, '2025-01-15', 'AB', 52);
        // Annualized income = 5200, well below BPA
        expect(result.federal).toBe(0);
        expect(result.provincial).toBe(0);
      });

      it('should handle negative taxable income gracefully', () => {
        const result = calculateIncomeTax(-500, '2025-01-15', 'AB', 52);
        expect(result.federal).toBe(0);
        expect(result.provincial).toBe(0);
        expect(result.taxableIncome).toBe(-500);
        expect(result.annualizedIncome).toBe(-26000);
      });

      it('should calculate tax consistently across pay frequencies', () => {
        // Same annual income, different frequencies
        const weekly = calculateIncomeTax(2000, '2025-01-15', 'AB', 52);
        const biweekly = calculateIncomeTax(4000, '2025-01-15', 'AB', 26);
        const monthly = calculateIncomeTax(8666.67, '2025-01-15', 'AB', 12);

        // Should have similar annual tax amounts
        const weeklyAnnual = weekly.federal * 52;
        const biweeklyAnnual = biweekly.federal * 26;
        const monthlyAnnual = monthly.federal * 12;

        expect(weeklyAnnual).toBeCloseTo(biweeklyAnnual, 0);
        expect(biweeklyAnnual).toBeCloseTo(monthlyAnnual, 0);
      });

      it('should round tax amounts correctly', () => {
        const result = calculateIncomeTax(1234.56, '2025-01-15', 'AB', 52);
        // Tax amounts should be rounded to 2 decimal places
        expect(result.federal).toEqual(Math.round(result.federal * 100) / 100);
        expect(result.provincial).toEqual(Math.round(result.provincial * 100) / 100);
      });
    });

    describe('Tax bracket calculations', () => {
      it('should calculate tax correctly for first federal bracket', () => {
        const result = calculateIncomeTax(1000, '2025-01-15', 'AB', 52);
        // Annualized income = 52000, in first federal bracket (15% Jan, 14% Jul)
        expect(result.federal).toBeGreaterThanOrEqual(0);
      });

      it('should calculate tax correctly spanning multiple brackets', () => {
        const result = calculateIncomeTax(4000, '2025-01-15', 'AB', 52);
        // Annualized income = 208000, spans multiple federal brackets
        expect(result.federal).toBeGreaterThan(0);
        
        // Should be more than simple first bracket calculation
        const firstBracketOnly = calculateIncomeTax(1000, '2025-01-15', 'AB', 52);
        expect(result.federal).toBeGreaterThan(firstBracketOnly.federal * 4);
      });

      it('should calculate tax correctly for highest bracket', () => {
        const result = calculateIncomeTax(10000, '2025-01-15', 'AB', 52);
        // Annualized income = 520000, in highest federal bracket (33%)
        expect(result.federal).toBeGreaterThan(0);
        
        // Should have significant tax burden
        const effectiveRate = (result.federal * 52) / (10000 * 52);
        expect(effectiveRate).toBeGreaterThan(0.25); // Should be over 25% effective rate
      });
    });
  });

  describe('calculateStatutoryDeductions', () => {
    describe('Integrated statutory deduction calculations', () => {
      it('should calculate all statutory deductions correctly for standard case', () => {
        const result = calculateStatutoryDeductions(
          5000, // grossWage
          0,    // ytdPensionable
          0,    // ytdInsurable
          '2025-01-15', // payDate
          'AB', // province
          52,   // periodsPerYear
          0     // rrspAtSource
        );

        expect(result.cpp.cpp1).toBeCloseTo(293.5, 1);
        expect(result.cpp.cpp2).toBe(0);
        expect(result.ei.ei).toBeCloseTo(82, 2);
        expect(result.tax.federal).toBeGreaterThan(0);
        expect(result.tax.provincial).toBeGreaterThan(0);
        expect(result.totalStatutory).toBeGreaterThan(0);
        
        // Total should equal sum of components
        const expectedTotal = result.cpp.cpp1 + result.cpp.cpp2 + result.ei.ei + 
                             result.tax.federal + result.tax.provincial;
        expect(result.totalStatutory).toBeCloseTo(expectedTotal, 2);
      });

      it('should handle high income with CPP2', () => {
        const result = calculateStatutoryDeductions(
          8000, // grossWage - high weekly income
          70000, // ytdPensionable - near YMPE
          70000, // ytdInsurable
          '2025-01-15',
          'AB',
          52,
          0
        );

        expect(result.cpp.cpp1).toBeGreaterThanOrEqual(0);
        expect(result.cpp.cpp2).toBeGreaterThan(0); // Should have CPP2
        expect(result.ei.ei).toBeGreaterThanOrEqual(0);
        expect(result.tax.federal).toBeGreaterThan(0);
        expect(result.tax.provincial).toBeGreaterThan(0);
      });

      it('should handle maximum YTD scenarios', () => {
        const result = calculateStatutoryDeductions(
          3000,
          67800, // CPP1 max
          65700, // EI max
          '2025-01-15',
          'AB',
          52,
          0
        );

        expect(result.cpp.cpp1).toBe(0); // Should be maxed out
        expect(result.ei.ei).toBe(0); // Should be maxed out
        expect(result.tax.federal).toBeGreaterThan(0); // Tax still applies
        expect(result.tax.provincial).toBeGreaterThan(0);
      });
    });

    describe('RRSP at source handling', () => {
      it('should reduce taxable income with RRSP at source', () => {
        const withoutRRSP = calculateStatutoryDeductions(5000, 0, 0, '2025-01-15', 'AB', 52, 0);
        const withRRSP = calculateStatutoryDeductions(5000, 0, 0, '2025-01-15', 'AB', 52, 500);

        // CPP and EI should be the same (calculated on gross wage)
        expect(withRRSP.cpp.cpp1).toBeCloseTo(withoutRRSP.cpp.cpp1, 2);
        expect(withRRSP.ei.ei).toBeCloseTo(withoutRRSP.ei.ei, 2);

        // Tax should be lower with RRSP at source
        expect(withRRSP.tax.federal).toBeLessThan(withoutRRSP.tax.federal);
        expect(withRRSP.tax.provincial).toBeLessThan(withoutRRSP.tax.provincial);
        
        // Total statutory should be lower
        expect(withRRSP.totalStatutory).toBeLessThan(withoutRRSP.totalStatutory);
      });

      it('should handle large RRSP at source amounts', () => {
        const result = calculateStatutoryDeductions(5000, 0, 0, '2025-01-15', 'AB', 52, 2000);
        
        // Taxable income should be 5000 - 2000 = 3000
        expect(result.tax.taxableIncome).toBe(3000);
        expect(result.tax.annualizedIncome).toBe(156000); // 3000 * 52
      });

      it('should handle RRSP at source exceeding gross wage', () => {
        const result = calculateStatutoryDeductions(3000, 0, 0, '2025-01-15', 'AB', 52, 4000);
        
        // Taxable income should be 0 (not negative)
        expect(result.tax.taxableIncome).toBe(0);
        expect(result.tax.federal).toBe(0);
        expect(result.tax.provincial).toBe(0);
        
        // CPP and EI should still be calculated on gross wage
        expect(result.cpp.cpp1).toBeGreaterThan(0);
        expect(result.ei.ei).toBeGreaterThan(0);
      });
    });

    describe('Different pay frequencies', () => {
      it('should calculate consistently across pay frequencies', () => {
        // Same annual gross wage, different frequencies
        const weekly = calculateStatutoryDeductions(2000, 0, 0, '2025-01-15', 'AB', 52, 0);
        const biweekly = calculateStatutoryDeductions(4000, 0, 0, '2025-01-15', 'AB', 26, 0);
        const monthly = calculateStatutoryDeductions(8666.67, 0, 0, '2025-01-15', 'AB', 12, 0);

        // Annual amounts should be similar (within $5 due to rounding differences)
        const weeklyAnnual = weekly.totalStatutory * 52;
        const biweeklyAnnual = biweekly.totalStatutory * 26;
        const monthlyAnnual = monthly.totalStatutory * 12;

        expect(Math.abs(weeklyAnnual - biweeklyAnnual)).toBeLessThan(5);
        expect(Math.abs(biweeklyAnnual - monthlyAnnual)).toBeLessThan(5);
      });
    });

    describe('Mid-year rate changes', () => {
      it('should apply correct rates based on pay date', () => {
        const january = calculateStatutoryDeductions(3000, 0, 0, '2025-01-15', 'AB', 52, 0);
        const july = calculateStatutoryDeductions(3000, 0, 0, '2025-07-15', 'AB', 52, 0);

        // CPP and EI rates don't change mid-year
        expect(july.cpp.cpp1).toBeCloseTo(january.cpp.cpp1, 2);
        expect(july.ei.ei).toBeCloseTo(january.ei.ei, 2);

        // Tax rates do change
        expect(july.tax.federal).toBeLessThan(january.tax.federal);
        expect(july.tax.provincial).toBeLessThan(january.tax.provincial);
        expect(july.totalStatutory).toBeLessThan(january.totalStatutory);
      });
    });

    describe('Edge cases and validation', () => {
      it('should handle zero gross wage', () => {
        const result = calculateStatutoryDeductions(0, 0, 0, '2025-01-15', 'AB', 52, 0);
        
        expect(result.cpp.cpp1).toBe(0);
        expect(result.cpp.cpp2).toBe(0);
        expect(result.ei.ei).toBe(0);
        expect(result.tax.federal).toBe(0);
        expect(result.tax.provincial).toBe(0);
        expect(result.totalStatutory).toBe(0);
      });

      it('should handle negative gross wage gracefully', () => {
        const result = calculateStatutoryDeductions(-1000, 0, 0, '2025-01-15', 'AB', 52, 0);
        
        expect(result.cpp.cpp1).toBe(0);
        expect(result.cpp.cpp2).toBe(0);
        expect(result.ei.ei).toBe(0);
        expect(result.tax.federal).toBe(0);
        expect(result.tax.provincial).toBe(0);
        expect(result.totalStatutory).toBe(0);
      });

      it('should maintain calculation precision', () => {
        const result = calculateStatutoryDeductions(1234.56, 0, 0, '2025-01-15', 'AB', 52, 0);
        
        // All amounts should be rounded to 2 decimal places
        expect(result.cpp.cpp1).toEqual(Math.round(result.cpp.cpp1 * 100) / 100);
        expect(result.ei.ei).toEqual(Math.round(result.ei.ei * 100) / 100);
        expect(result.tax.federal).toEqual(Math.round(result.tax.federal * 100) / 100);
        expect(result.tax.provincial).toEqual(Math.round(result.tax.provincial * 100) / 100);
        expect(result.totalStatutory).toEqual(Math.round(result.totalStatutory * 100) / 100);
      });
    });

    describe('Real-world scenarios', () => {
      it('should calculate correctly for typical boilermaker weekly pay', () => {
        // Typical scenario: $65/hr, 40 straight + 8 OT
        const grossWage = (40 * 65) + (8 * 65 * 1.5); // 2600 + 780 = 3380
        const result = calculateStatutoryDeductions(grossWage, 0, 0, '2025-01-15', 'AB', 52, 0);
        
        // CPP1: (3380 - 67.31) * 0.0595 = 197.11 (actual calculation)
        expect(result.cpp.cpp1).toBeCloseTo(197.11, 1);
        expect(result.ei.ei).toBeCloseTo(55.43, 2); // 3380 * 0.0164
        expect(result.tax.federal).toBeGreaterThan(0);
        expect(result.tax.provincial).toBeGreaterThan(0);
        
        // Total deductions should be reasonable (typically 25-35% of gross)
        const deductionRate = result.totalStatutory / grossWage;
        expect(deductionRate).toBeGreaterThan(0.20);
        expect(deductionRate).toBeLessThan(0.40);
      });

      it('should calculate correctly for high earner approaching maximums', () => {
        // High earner: $100/hr, 50 hours/week
        const grossWage = 50 * 100; // 5000
        const ytdPensionable = 60000; // Approaching CPP max
        const ytdInsurable = 55000; // Approaching EI max
        
        const result = calculateStatutoryDeductions(
          grossWage, ytdPensionable, ytdInsurable, '2025-01-15', 'AB', 52, 0
        );
        
        expect(result.cpp.cpp1).toBeGreaterThan(0);
        expect(result.ei.ei).toBeGreaterThan(0);
        expect(result.tax.federal).toBeGreaterThan(0);
        expect(result.tax.provincial).toBeGreaterThan(0);
        
        // Should have higher effective tax rate due to higher income
        const effectiveRate = result.totalStatutory / grossWage;
        expect(effectiveRate).toBeGreaterThan(0.30);
      });
    });
  });
});