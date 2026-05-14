// ===========================================
// EZRA PORTAL - Mock Exponential Data
// ===========================================

import type {
  ExponentialSegment,
  ExponentialDailyCampaign,
  ExponentialLocationSummary,
  ExponentialRecommendation,
  ExponentialGuestSample,
  ExponentialOverviewData,
  ExponentialStoreData,
  DateRange,
} from '@/types';
import { format, subDays, parseISO, eachDayOfInterval } from 'date-fns';
import { mockLocations } from './mockLocations';
import { generateId } from '@/lib/utils';

// ============ Constants ============
export const EXPONENTIAL_CONSTANTS = {
  // Bucket definitions (days since last visit)
  BUCKETS: {
    FOUR_WEEK: { min: 0, max: 30, label: '4-week', visits: 2 }, // 2+ visits in 30 days
    SIX_WEEK: { min: 31, max: 42, label: '6-week' },
    EIGHT_WEEK: { min: 43, max: 999, label: '8-week' },
  },
  // Offer ranges by segment
  OFFERS: {
    '4-week': { min: 10, max: 15, description: '$10-15 off next visit' },
    '6-week': { min: 15, max: 25, description: '$15-25 off or 15% discount' },
    '8-week': { min: 25, max: 40, description: '$25-40 off or 20% discount' },
  },
  // Uptake calculation window (days after message)
  UPTAKE_WINDOW_DAYS: 14,
  // Risk thresholds
  RISK_THRESHOLDS: {
    HIGH: 35, // % of customers in 8-week bucket
    MEDIUM: 20,
  },
  // Base metrics for mock data
  BASE_GUESTS_PER_LOCATION: 450,
  BASE_CUSTOMERS_PER_LOCATION: 320,
};

// ============ Helper Functions ============

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function getSegmentRiskLevel(segment: '4-week' | '6-week' | '8-week'): 'low' | 'medium' | 'high' {
  if (segment === '4-week') return 'low';
  if (segment === '6-week') return 'medium';
  return 'high';
}

function calculateRetentionRiskScore(
  fourWeek: number,
  sixWeek: number,
  eightWeek: number,
  uptake: number
): number {
  const total = fourWeek + sixWeek + eightWeek;
  if (total === 0) return 0;
  
  // Higher 8-week % = higher risk
  const eightWeekRatio = (eightWeek / total) * 100;
  // Lower uptake = higher risk
  const uptakePenalty = Math.max(0, 50 - uptake);
  
  const score = Math.round(eightWeekRatio * 0.6 + uptakePenalty * 0.4);
  return Math.min(100, Math.max(0, score));
}

// ============ Data Generation ============

/**
 * Generate segment data for a location
 */
function generateSegments(
  locationId: string,
  totalCustomers: number,
  seed: number
): ExponentialSegment[] {
  const { OFFERS } = EXPONENTIAL_CONSTANTS;
  
  // Distribution varies by location
  const fourWeekRatio = 0.35 + seededRandom(seed) * 0.15; // 35-50%
  const sixWeekRatio = 0.25 + seededRandom(seed + 1) * 0.15; // 25-40%
  const eightWeekRatio = 1 - fourWeekRatio - sixWeekRatio; // remainder
  
  const fourWeekCount = Math.round(totalCustomers * fourWeekRatio);
  const sixWeekCount = Math.round(totalCustomers * sixWeekRatio);
  const eightWeekCount = totalCustomers - fourWeekCount - sixWeekCount;
  
  // Messages sent (70-90% of segment)
  const fourWeekSent = Math.round(fourWeekCount * (0.7 + seededRandom(seed + 2) * 0.2));
  const sixWeekSent = Math.round(sixWeekCount * (0.75 + seededRandom(seed + 3) * 0.2));
  const eightWeekSent = Math.round(eightWeekCount * (0.8 + seededRandom(seed + 4) * 0.15));
  
  // Returns (uptake varies by segment)
  const fourWeekReturns = Math.round(fourWeekSent * (0.35 + seededRandom(seed + 5) * 0.2)); // 35-55%
  const sixWeekReturns = Math.round(sixWeekSent * (0.25 + seededRandom(seed + 6) * 0.15)); // 25-40%
  const eightWeekReturns = Math.round(eightWeekSent * (0.12 + seededRandom(seed + 7) * 0.13)); // 12-25%
  
  return [
    {
      name: '4-week',
      customerCount: fourWeekCount,
      description: 'Regular customers with 2+ visits in the past 30 days. Low churn risk.',
      offerRange: OFFERS['4-week'].description,
      riskLevel: 'low',
      uptakePercent: fourWeekSent > 0 ? Math.round((fourWeekReturns / fourWeekSent) * 1000) / 10 : 0,
      messagesSent: fourWeekSent,
      returns: fourWeekReturns,
    },
    {
      name: '6-week',
      customerCount: sixWeekCount,
      description: 'Customers who visited 31-42 days ago. Moderate re-engagement opportunity.',
      offerRange: OFFERS['6-week'].description,
      riskLevel: 'medium',
      uptakePercent: sixWeekSent > 0 ? Math.round((sixWeekReturns / sixWeekSent) * 1000) / 10 : 0,
      messagesSent: sixWeekSent,
      returns: sixWeekReturns,
    },
    {
      name: '8-week',
      customerCount: eightWeekCount,
      description: 'Lapsed customers (43+ days since last visit). High churn risk, needs aggressive outreach.',
      offerRange: OFFERS['8-week'].description,
      riskLevel: 'high',
      uptakePercent: eightWeekSent > 0 ? Math.round((eightWeekReturns / eightWeekSent) * 1000) / 10 : 0,
      messagesSent: eightWeekSent,
      returns: eightWeekReturns,
    },
  ];
}

/**
 * Generate daily campaign data
 */
function generateDailyCampaigns(
  segments: ExponentialSegment[],
  days: Date[],
  seed: number
): ExponentialDailyCampaign[] {
  const totalFourWeek = segments[0].messagesSent;
  const totalSixWeek = segments[1].messagesSent;
  const totalEightWeek = segments[2].messagesSent;
  
  return days.map((day, index) => {
    const daySeed = seed + index;
    const dayOfWeek = day.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    // Lower sends on weekends
    const weekendMultiplier = isWeekend ? 0.4 : 1;
    
    // Distribute sends across days with variance
    const baseDaily = 1 / days.length;
    const variance = (seededRandom(daySeed) - 0.5) * 0.5;
    const dayRatio = Math.max(0.02, baseDaily + variance * baseDaily) * weekendMultiplier;
    
    const fourWeekSends = Math.round(totalFourWeek * dayRatio * (0.8 + seededRandom(daySeed + 1) * 0.4));
    const sixWeekSends = Math.round(totalSixWeek * dayRatio * (0.8 + seededRandom(daySeed + 2) * 0.4));
    const eightWeekSends = Math.round(totalEightWeek * dayRatio * (0.8 + seededRandom(daySeed + 3) * 0.4));
    
    return {
      date: format(day, 'yyyy-MM-dd'),
      fourWeekSends,
      sixWeekSends,
      eightWeekSends,
      totalSends: fourWeekSends + sixWeekSends + eightWeekSends,
    };
  });
}

/**
 * Generate location summary
 */
function generateLocationSummary(
  locationId: string,
  segments: ExponentialSegment[],
  seed: number
): Omit<ExponentialLocationSummary, 'locationName' | 'storeCode' | 'state'> {
  const { BASE_GUESTS_PER_LOCATION, BASE_CUSTOMERS_PER_LOCATION } = EXPONENTIAL_CONSTANTS;
  
  const guestsMTD = Math.round(BASE_GUESTS_PER_LOCATION * (0.8 + seededRandom(seed) * 0.4));
  const customersLastMonth = Math.round(BASE_CUSTOMERS_PER_LOCATION * (0.85 + seededRandom(seed + 1) * 0.3));
  
  const fourWeekCount = segments[0].customerCount;
  const sixWeekCount = segments[1].customerCount;
  const eightWeekCount = segments[2].customerCount;
  
  const totalSent = segments.reduce((sum, s) => sum + s.messagesSent, 0);
  const totalReturns = segments.reduce((sum, s) => sum + s.returns, 0);
  const overallUptake = totalSent > 0 ? Math.round((totalReturns / totalSent) * 1000) / 10 : 0;
  
  const retentionRiskScore = calculateRetentionRiskScore(
    fourWeekCount,
    sixWeekCount,
    eightWeekCount,
    overallUptake
  );
  
  const location = mockLocations.find(l => l.id === locationId);
  
  return {
    locationId,
    guestsMTD,
    customersLastMonth,
    fourWeekCount,
    sixWeekCount,
    eightWeekCount,
    followUpsSent: totalSent,
    overallUptake,
    retentionRiskScore,
    lastSyncAt: location?.lastSyncAt || new Date().toISOString(),
  };
}

/**
 * Generate recommendations based on data
 */
function generateRecommendations(
  segments: ExponentialSegment[],
  overallUptake: number,
  dailyCampaigns: ExponentialDailyCampaign[]
): ExponentialRecommendation[] {
  const recommendations: ExponentialRecommendation[] = [];
  
  const fourWeek = segments[0];
  const sixWeek = segments[1];
  const eightWeek = segments[2];
  
  const total = fourWeek.customerCount + sixWeek.customerCount + eightWeek.customerCount;
  const eightWeekRatio = total > 0 ? (eightWeek.customerCount / total) * 100 : 0;
  
  // High 8-week bucket
  if (eightWeekRatio > EXPONENTIAL_CONSTANTS.RISK_THRESHOLDS.HIGH) {
    recommendations.push({
      id: generateId(),
      type: 'increase_outreach',
      priority: 'high',
      title: 'Elevated 8-week bucket',
      description: `${eightWeekRatio.toFixed(1)}% of customers are in the 8-week (lapsed) segment. Increase follow-up cadence and offer strength to re-engage these guests before they churn permanently.`,
      metric: `${eightWeek.customerCount} customers in 8-week bucket`,
      impact: `Potential recovery: ${Math.round(eightWeek.customerCount * 0.15)} customers`,
    });
  }
  
  // Best performing segment
  const bestSegment = [...segments].sort((a, b) => b.uptakePercent - a.uptakePercent)[0];
  if (bestSegment.uptakePercent > 30) {
    recommendations.push({
      id: generateId(),
      type: 'segment_focus',
      priority: 'medium',
      title: `Strong uptake in ${bestSegment.name} segment`,
      description: `Uptake is strongest in the ${bestSegment.name} segment at ${bestSegment.uptakePercent.toFixed(1)}%. Prioritize faster outreach to this group for maximum return.`,
      metric: `${bestSegment.uptakePercent.toFixed(1)}% uptake rate`,
    });
  }
  
  // Low uptake in 8-week
  if (eightWeek.uptakePercent < 15 && eightWeek.messagesSent > 50) {
    recommendations.push({
      id: generateId(),
      type: 'adjust_offer',
      priority: 'high',
      title: 'Low 8-week segment response',
      description: `Only ${eightWeek.uptakePercent.toFixed(1)}% of lapsed customers are returning after outreach. Consider increasing offer value or testing different messaging approaches.`,
      metric: `${eightWeek.returns} returns from ${eightWeek.messagesSent} messages`,
      impact: 'Test $35-50 offers for improved conversion',
    });
  }
  
  // Weekend sends analysis
  const weekendSends = dailyCampaigns
    .filter(d => {
      const day = new Date(d.date).getDay();
      return day === 0 || day === 6;
    })
    .reduce((sum, d) => sum + d.totalSends, 0);
  const totalSends = dailyCampaigns.reduce((sum, d) => sum + d.totalSends, 0);
  const weekendRatio = totalSends > 0 ? (weekendSends / totalSends) * 100 : 0;
  
  if (weekendRatio < 10) {
    recommendations.push({
      id: generateId(),
      type: 'timing',
      priority: 'low',
      title: 'Low weekend follow-up activity',
      description: `Only ${weekendRatio.toFixed(1)}% of messages are sent on weekends. Consider adding weekend coverage as customers may be more responsive during leisure time.`,
      metric: `${weekendSends} weekend sends vs ${totalSends - weekendSends} weekday`,
    });
  }
  
  // Good overall performance
  if (overallUptake > 35) {
    recommendations.push({
      id: generateId(),
      type: 'success',
      priority: 'low',
      title: 'Strong retention performance',
      description: `Overall uptake of ${overallUptake.toFixed(1)}% is above benchmark. This location demonstrates effective customer follow-up practices that could be replicated elsewhere.`,
      metric: `${overallUptake.toFixed(1)}% overall uptake`,
    });
  }
  
  // 6-week opportunity
  if (sixWeek.customerCount > fourWeek.customerCount * 0.8) {
    recommendations.push({
      id: generateId(),
      type: 'segment_focus',
      priority: 'medium',
      title: '6-week segment opportunity',
      description: `Large 6-week segment (${sixWeek.customerCount} customers) represents re-engagement opportunity before they become 8-week lapsed. Accelerate outreach timing.`,
      metric: `${sixWeek.customerCount} customers at moderate risk`,
    });
  }
  
  return recommendations.slice(0, 6);
}

/**
 * Generate sample guest data
 */
function generateGuestSamples(
  segments: ExponentialSegment[],
  seed: number
): ExponentialGuestSample[] {
  const samples: ExponentialGuestSample[] = [];
  const now = new Date();
  
  segments.forEach((segment, segIndex) => {
    const count = Math.min(5, Math.ceil(segment.customerCount / 20));
    
    for (let i = 0; i < count; i++) {
      const guestSeed = seed + segIndex * 100 + i;
      
      // Last visit date based on segment
      let daysAgo: number;
      if (segment.name === '4-week') {
        daysAgo = Math.round(5 + seededRandom(guestSeed) * 20); // 5-25 days
      } else if (segment.name === '6-week') {
        daysAgo = Math.round(31 + seededRandom(guestSeed) * 11); // 31-42 days
      } else {
        daysAgo = Math.round(43 + seededRandom(guestSeed) * 30); // 43-73 days
      }
      
      const lastVisitDate = format(subDays(now, daysAgo), 'yyyy-MM-dd');
      
      // Determine status
      const rand = seededRandom(guestSeed + 1);
      let status: ExponentialGuestSample['status'];
      let lastMessageDate: string | null = null;
      
      if (rand < 0.15) {
        status = 'not_messaged';
      } else {
        lastMessageDate = format(subDays(now, Math.round(daysAgo - 3 - seededRandom(guestSeed + 2) * 5)), 'yyyy-MM-dd');
        
        if (rand < 0.15 + segment.uptakePercent / 100 * 0.5) {
          status = 'returned';
        } else if (rand < 0.7) {
          status = 'no_response';
        } else {
          status = 'messaged';
        }
      }
      
      samples.push({
        id: `GST-${String(guestSeed).padStart(5, '0')}`,
        lastVisitDate,
        segment: segment.name,
        lastMessageDate,
        status,
      });
    }
  });
  
  return samples;
}

// ============ Public API ============

/**
 * Get exponential overview data for all locations
 */
export function getExponentialOverview(
  clientId: string,
  dateRange?: DateRange
): ExponentialOverviewData {
  const endDate = dateRange?.endDate || format(new Date(), 'yyyy-MM-dd');
  const startDate = dateRange?.startDate || format(subDays(parseISO(endDate), 30), 'yyyy-MM-dd');
  
  const days = eachDayOfInterval({
    start: parseISO(startDate),
    end: parseISO(endDate),
  });
  
  const locations = mockLocations.filter(l => l.clientId === clientId && l.status === 'active');
  
  let totalGuestsMTD = 0;
  let totalCustomersLastMonth = 0;
  const aggregatedSegments: Record<string, ExponentialSegment> = {};
  const allDailyCampaigns: ExponentialDailyCampaign[] = [];
  
  const locationSummaries: ExponentialLocationSummary[] = locations.map(location => {
    const locationSeed = location.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    const totalCustomers = Math.round(
      EXPONENTIAL_CONSTANTS.BASE_CUSTOMERS_PER_LOCATION * (0.8 + seededRandom(locationSeed) * 0.4)
    );
    
    const segments = generateSegments(location.id, totalCustomers, locationSeed);
    const dailyCampaigns = generateDailyCampaigns(segments, days, locationSeed);
    const summary = generateLocationSummary(location.id, segments, locationSeed);
    
    totalGuestsMTD += summary.guestsMTD;
    totalCustomersLastMonth += summary.customersLastMonth;
    
    // Aggregate segments
    segments.forEach(seg => {
      if (!aggregatedSegments[seg.name]) {
        aggregatedSegments[seg.name] = { ...seg };
      } else {
        aggregatedSegments[seg.name].customerCount += seg.customerCount;
        aggregatedSegments[seg.name].messagesSent += seg.messagesSent;
        aggregatedSegments[seg.name].returns += seg.returns;
      }
    });
    
    // Aggregate daily campaigns
    dailyCampaigns.forEach((dc, idx) => {
      if (!allDailyCampaigns[idx]) {
        allDailyCampaigns[idx] = { ...dc };
      } else {
        allDailyCampaigns[idx].fourWeekSends += dc.fourWeekSends;
        allDailyCampaigns[idx].sixWeekSends += dc.sixWeekSends;
        allDailyCampaigns[idx].eightWeekSends += dc.eightWeekSends;
        allDailyCampaigns[idx].totalSends += dc.totalSends;
      }
    });
    
    return {
      ...summary,
      locationName: location.name,
      storeCode: location.storeCode,
      state: location.state,
    };
  });
  
  // Recalculate uptake for aggregated segments
  const finalSegments = Object.values(aggregatedSegments).map(seg => ({
    ...seg,
    uptakePercent: seg.messagesSent > 0 
      ? Math.round((seg.returns / seg.messagesSent) * 1000) / 10 
      : 0,
  }));
  
  // Sort segments in order
  const orderedSegments = ['4-week', '6-week', '8-week'].map(
    name => finalSegments.find(s => s.name === name)!
  ).filter(Boolean);
  
  // Uptake by segment for chart
  const uptakeBySegment = orderedSegments.map(seg => ({
    segment: seg.name,
    uptake: seg.uptakePercent,
  }));
  
  return {
    guestsMTD: totalGuestsMTD,
    customersLastMonth: totalCustomersLastMonth,
    segments: orderedSegments,
    dailyCampaigns: allDailyCampaigns,
    uptakeBySegment,
    locationSummaries: locationSummaries.sort((a, b) => b.retentionRiskScore - a.retentionRiskScore),
  };
}

/**
 * Get exponential data for a specific store
 */
export function getExponentialStore(
  locationId: string,
  dateRange?: DateRange
): ExponentialStoreData | null {
  const location = mockLocations.find(l => l.id === locationId);
  if (!location) return null;
  
  const endDate = dateRange?.endDate || format(new Date(), 'yyyy-MM-dd');
  const startDate = dateRange?.startDate || format(subDays(parseISO(endDate), 30), 'yyyy-MM-dd');
  
  const days = eachDayOfInterval({
    start: parseISO(startDate),
    end: parseISO(endDate),
  });
  
  const locationSeed = location.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  const totalCustomers = Math.round(
    EXPONENTIAL_CONSTANTS.BASE_CUSTOMERS_PER_LOCATION * (0.8 + seededRandom(locationSeed) * 0.4)
  );
  
  const segments = generateSegments(location.id, totalCustomers, locationSeed);
  const dailyCampaigns = generateDailyCampaigns(segments, days, locationSeed);
  const summaryData = generateLocationSummary(location.id, segments, locationSeed);
  
  const recommendations = generateRecommendations(
    segments,
    summaryData.overallUptake,
    dailyCampaigns
  );
  
  const guestSamples = generateGuestSamples(segments, locationSeed);
  
  return {
    locationId,
    locationName: location.name,
    storeCode: location.storeCode,
    summary: {
      guestsMTD: summaryData.guestsMTD,
      customersLastMonth: summaryData.customersLastMonth,
      fourWeekCount: summaryData.fourWeekCount,
      sixWeekCount: summaryData.sixWeekCount,
      eightWeekCount: summaryData.eightWeekCount,
      followUpsSent: summaryData.followUpsSent,
      overallUptake: summaryData.overallUptake,
    },
    segments,
    dailyCampaigns,
    recommendations,
    guestSamples,
  };
}
