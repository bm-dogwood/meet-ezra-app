// ===========================================
// EZRA PORTAL - Mock Campaign Data
// ===========================================

import type {
  SMSTemplate,
  Campaign,
  CampaignMessage,
  CampaignSegment,
  CampaignStatus,
  MessageStatus,
  CampaignStats,
} from '@/types';
import { format, subDays, subHours, addDays, addHours } from 'date-fns';
import { mockLocations } from './mockLocations';
import { generateId } from '@/lib/utils';

// ============ Preset SMS Templates ============
export const PRESET_TEMPLATES: SMSTemplate[] = [
  {
    id: 'tmpl-4wk-gentle',
    name: '4-Week Gentle Reminder',
    content: 'Hi {first_name}! We miss you at {location_name}. It\'s been a few weeks - come back and enjoy {coupon_value} off your next visit! Use code: {coupon_code}. Book now: {booking_link}',
    segment: '4-week',
    suggestedCouponRange: '$10-15',
    isPreset: true,
    createdAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'tmpl-4wk-loyalty',
    name: '4-Week Loyalty Thank You',
    content: 'Thanks for being a loyal guest, {first_name}! As a thank you, here\'s {coupon_value} off your next appointment at {location_name}. Code: {coupon_code}. We\'d love to see you soon!',
    segment: '4-week',
    suggestedCouponRange: '$10-15',
    isPreset: true,
    createdAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'tmpl-6wk-winback',
    name: '6-Week Win-Back Offer',
    content: 'Hey {first_name}, it\'s been over a month! We\'d love to have you back at {location_name}. Here\'s a special {coupon_value} discount just for you. Use code: {coupon_code} before it expires!',
    segment: '6-week',
    suggestedCouponRange: '$15-25',
    isPreset: true,
    createdAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'tmpl-6wk-exclusive',
    name: '6-Week Exclusive Deal',
    content: '{first_name}, we\'ve got an exclusive offer waiting for you! Get {coupon_value} off at {location_name}. It\'s our way of saying we miss you. Code: {coupon_code}. Don\'t wait!',
    segment: '6-week',
    suggestedCouponRange: '$15-25',
    isPreset: true,
    createdAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'tmpl-8wk-urgent',
    name: '8-Week Urgent Re-engagement',
    content: 'We really miss you, {first_name}! It\'s been too long. Here\'s our best offer: {coupon_value} off your next visit to {location_name}. Use code: {coupon_code}. Expires soon - book today!',
    segment: '8-week',
    suggestedCouponRange: '$25-40',
    isPreset: true,
    createdAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'tmpl-8wk-vip',
    name: '8-Week VIP Recovery',
    content: '{first_name}, you\'re a valued guest and we want you back! Enjoy {coupon_value} off - our biggest discount. {location_name} misses you! Code: {coupon_code}. Limited time only.',
    segment: '8-week',
    suggestedCouponRange: '$25-40',
    isPreset: true,
    createdAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'tmpl-all-promo',
    name: 'General Promotion',
    content: 'Hi {first_name}! {location_name} has a special offer for you: {coupon_value} off your next service. Use code: {coupon_code} when you book. See you soon!',
    segment: 'all',
    suggestedCouponRange: '$10-25',
    isPreset: true,
    createdAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'tmpl-all-seasonal',
    name: 'Seasonal Special',
    content: 'Spring into savings, {first_name}! Get {coupon_value} off at {location_name} this season. Code: {coupon_code}. Treat yourself - you deserve it!',
    segment: 'all',
    suggestedCouponRange: '$15-30',
    isPreset: true,
    createdAt: '2025-01-01T00:00:00Z',
  },
];

// ============ Sample Campaigns ============
function generateCampaignStats(total: number, status: CampaignStatus): CampaignStats {
  if (status === 'draft' || status === 'scheduled') {
    return { total, pending: total, sent: 0, delivered: 0, failed: 0, deliveryRate: 0 };
  }
  if (status === 'sending') {
    const sent = Math.floor(total * 0.6);
    const delivered = Math.floor(sent * 0.92);
    const failed = Math.floor(sent * 0.03);
    return { total, pending: total - sent, sent, delivered, failed, deliveryRate: delivered / sent * 100 };
  }
  // sent or partially_sent
  const delivered = Math.floor(total * 0.94);
  const failed = Math.floor(total * 0.04);
  const sent = delivered + failed;
  return { total, pending: 0, sent, delivered, failed, deliveryRate: delivered / sent * 100 };
}

export function getMockCampaigns(): Campaign[] {
  const now = new Date();
  
  return [
    {
      id: 'camp-001',
      name: 'February 8-Week Recovery Push',
      templateId: 'tmpl-8wk-urgent',
      templateName: '8-Week Urgent Re-engagement',
      messageContent: 'We really miss you, {first_name}! It\'s been too long. Here\'s our best offer: $30 off your next visit to {location_name}. Use code: FEB30BACK. Expires soon - book today!',
      segment: '8-week',
      couponValue: '$30',
      couponCode: 'FEB30BACK',
      audienceType: 'all_locations',
      locationIds: [],
      guestIds: [],
      recipientCount: 1240,
      scheduledAt: null,
      sentAt: format(subDays(now, 3), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
      completedAt: format(subDays(now, 3), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
      status: 'sent',
      stats: generateCampaignStats(1240, 'sent'),
      createdAt: format(subDays(now, 4), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
      createdBy: 'user-001',
    },
    {
      id: 'camp-002',
      name: 'Valentine\'s Day Special',
      templateId: 'tmpl-all-seasonal',
      templateName: 'Seasonal Special',
      messageContent: 'Love is in the air, {first_name}! Treat yourself or someone special with $20 off at {location_name}. Code: VDAY20. Book your Valentine\'s appointment today!',
      segment: 'all',
      couponValue: '$20',
      couponCode: 'VDAY20',
      audienceType: 'select_locations',
      locationIds: ['loc-001', 'loc-002', 'loc-003', 'loc-005'],
      guestIds: [],
      recipientCount: 856,
      scheduledAt: format(addDays(now, 2), "yyyy-MM-dd'T'10:00:00'Z'"),
      sentAt: null,
      completedAt: null,
      status: 'scheduled',
      stats: generateCampaignStats(856, 'scheduled'),
      createdAt: format(subDays(now, 1), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
      createdBy: 'user-001',
    },
    {
      id: 'camp-003',
      name: 'MN Region 6-Week Follow-up',
      templateId: 'tmpl-6wk-winback',
      templateName: '6-Week Win-Back Offer',
      messageContent: 'Hey {first_name}, it\'s been over a month! We\'d love to have you back at {location_name}. Here\'s a special $20 discount just for you. Use code: MN20WIN before it expires!',
      segment: '6-week',
      couponValue: '$20',
      couponCode: 'MN20WIN',
      audienceType: 'select_locations',
      locationIds: ['loc-001', 'loc-002', 'loc-003', 'loc-004', 'loc-005', 'loc-006'],
      guestIds: [],
      recipientCount: 423,
      scheduledAt: null,
      sentAt: format(subHours(now, 2), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
      completedAt: null,
      status: 'sending',
      stats: generateCampaignStats(423, 'sending'),
      createdAt: format(subHours(now, 3), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
      createdBy: 'user-001',
    },
    {
      id: 'camp-004',
      name: 'VIP Guest Recovery - TX',
      templateId: 'tmpl-8wk-vip',
      templateName: '8-Week VIP Recovery',
      messageContent: '{first_name}, you\'re a valued guest and we want you back! Enjoy $40 off - our biggest discount. {location_name} misses you! Code: VIPTX40. Limited time only.',
      segment: '8-week',
      couponValue: '$40',
      couponCode: 'VIPTX40',
      audienceType: 'select_guests',
      locationIds: [],
      guestIds: ['guest-101', 'guest-102', 'guest-103', 'guest-104', 'guest-105'],
      recipientCount: 85,
      scheduledAt: null,
      sentAt: format(subDays(now, 7), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
      completedAt: format(subDays(now, 7), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
      status: 'sent',
      stats: generateCampaignStats(85, 'sent'),
      createdAt: format(subDays(now, 8), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
      createdBy: 'user-001',
    },
    {
      id: 'camp-005',
      name: '4-Week Gentle Reminder - All Stores',
      templateId: 'tmpl-4wk-gentle',
      templateName: '4-Week Gentle Reminder',
      messageContent: 'Hi {first_name}! We miss you at {location_name}. It\'s been a few weeks - come back and enjoy $15 off your next visit! Use code: MISS15. Book now: {booking_link}',
      segment: '4-week',
      couponValue: '$15',
      couponCode: 'MISS15',
      audienceType: 'all_locations',
      locationIds: [],
      guestIds: [],
      recipientCount: 2150,
      scheduledAt: null,
      sentAt: format(subDays(now, 14), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
      completedAt: format(subDays(now, 14), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
      status: 'sent',
      stats: generateCampaignStats(2150, 'sent'),
      createdAt: format(subDays(now, 15), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
      createdBy: 'user-001',
    },
    {
      id: 'camp-006',
      name: 'Weekend Flash Sale',
      templateId: null,
      templateName: 'Custom Message',
      messageContent: '⚡ FLASH SALE, {first_name}! This weekend only: $25 off any service at {location_name}. First come, first served! Code: FLASH25. Ends Sunday!',
      segment: 'all',
      couponValue: '$25',
      couponCode: 'FLASH25',
      audienceType: 'all_locations',
      locationIds: [],
      guestIds: [],
      recipientCount: 3200,
      scheduledAt: format(addDays(now, 4), "yyyy-MM-dd'T'09:00:00'Z'"),
      sentAt: null,
      completedAt: null,
      status: 'scheduled',
      stats: generateCampaignStats(3200, 'scheduled'),
      createdAt: format(subHours(now, 5), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
      createdBy: 'user-001',
    },
    {
      id: 'camp-007',
      name: 'Draft - Spring Campaign',
      templateId: 'tmpl-all-seasonal',
      templateName: 'Seasonal Special',
      messageContent: '',
      segment: 'all',
      couponValue: '',
      couponCode: '',
      audienceType: 'all_locations',
      locationIds: [],
      guestIds: [],
      recipientCount: 0,
      scheduledAt: null,
      sentAt: null,
      completedAt: null,
      status: 'draft',
      stats: generateCampaignStats(0, 'draft'),
      createdAt: format(subHours(now, 1), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
      createdBy: 'user-001',
    },
  ];
}

// ============ Sample Campaign Messages ============
export function getMockCampaignMessages(campaignId: string): CampaignMessage[] {
  const campaign = getMockCampaigns().find(c => c.id === campaignId);
  if (!campaign || campaign.status === 'draft' || campaign.status === 'scheduled') {
    return [];
  }

  const messages: CampaignMessage[] = [];
  const statuses: MessageStatus[] = ['delivered', 'delivered', 'delivered', 'delivered', 'delivered', 
                                      'delivered', 'delivered', 'delivered', 'sent', 'failed'];
  
  const sampleCount = Math.min(campaign.recipientCount, 50);
  
  for (let i = 0; i < sampleCount; i++) {
    const location = mockLocations[i % mockLocations.length];
    const status = statuses[i % statuses.length];
    const sentAt = campaign.sentAt || new Date().toISOString();
    
    messages.push({
      id: `msg-${campaignId}-${i}`,
      campaignId,
      guestId: `guest-${1000 + i}`,
      guestPhone: `+1555${String(1000000 + i).slice(-7)}`,
      locationId: location.id,
      locationName: location.name,
      segment: campaign.segment === 'all' ? ['4-week', '6-week', '8-week'][i % 3] as CampaignSegment : campaign.segment,
      couponValue: campaign.couponValue,
      couponCode: campaign.couponCode,
      messageContent: campaign.messageContent.replace('{first_name}', `Guest${i}`).replace('{location_name}', location.name),
      scheduledAt: campaign.scheduledAt,
      sentAt: status !== 'pending' ? sentAt : null,
      deliveredAt: status === 'delivered' ? format(addHours(new Date(sentAt), 0.01), "yyyy-MM-dd'T'HH:mm:ss'Z'") : null,
      status,
      twilioMessageSid: status !== 'pending' ? `SM${generateId()}${generateId()}` : null,
      failedReason: status === 'failed' ? 'Undeliverable: Invalid phone number' : null,
    });
  }
  
  return messages;
}

// ============ Segment Counts for Audience Estimation ============
export function getSegmentCounts(locationIds?: string[]): { segment: CampaignSegment; count: number }[] {
  const locations = locationIds && locationIds.length > 0 
    ? mockLocations.filter(l => locationIds.includes(l.id))
    : mockLocations.filter(l => l.status === 'active');
  
  const multiplier = locations.length;
  
  return [
    { segment: '4-week', count: Math.floor(45 * multiplier * (0.8 + Math.random() * 0.4)) },
    { segment: '6-week', count: Math.floor(38 * multiplier * (0.8 + Math.random() * 0.4)) },
    { segment: '8-week', count: Math.floor(52 * multiplier * (0.8 + Math.random() * 0.4)) },
    { segment: 'all', count: Math.floor(135 * multiplier * (0.8 + Math.random() * 0.4)) },
  ];
}

// ============ Template Helpers ============
export function getTemplatesBySegment(segment: CampaignSegment): SMSTemplate[] {
  return PRESET_TEMPLATES.filter(t => t.segment === segment || t.segment === 'all');
}

export function getTemplateById(templateId: string): SMSTemplate | undefined {
  return PRESET_TEMPLATES.find(t => t.id === templateId);
}

// ============ Campaign Statistics ============
export function getCampaignSummaryStats() {
  const campaigns = getMockCampaigns();
  
  const totalSent = campaigns
    .filter(c => c.status === 'sent' || c.status === 'partially_sent')
    .reduce((sum, c) => sum + c.stats.sent, 0);
  
  const totalDelivered = campaigns
    .filter(c => c.status === 'sent' || c.status === 'partially_sent')
    .reduce((sum, c) => sum + c.stats.delivered, 0);
  
  const avgDeliveryRate = totalSent > 0 ? (totalDelivered / totalSent) * 100 : 0;
  
  return {
    totalCampaigns: campaigns.length,
    activeCampaigns: campaigns.filter(c => c.status === 'sending').length,
    scheduledCampaigns: campaigns.filter(c => c.status === 'scheduled').length,
    totalMessagesSent: totalSent,
    totalDelivered,
    avgDeliveryRate: Math.round(avgDeliveryRate * 10) / 10,
  };
}
