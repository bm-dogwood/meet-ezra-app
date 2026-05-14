import { describe, it, expect } from 'vitest';
import { buildCronExpression, cronToHumanReadable, FrequencyType } from './cronUtils';

describe('buildCronExpression', () => {
  describe('daily frequency', () => {
    it('builds a daily cron for 8:00', () => {
      expect(buildCronExpression('daily', [], 1, 8, 0)).toBe('0 8 * * *');
    });

    it('builds a daily cron for 14:30', () => {
      expect(buildCronExpression('daily', [], 1, 14, 30)).toBe('30 14 * * *');
    });

    it('builds a daily cron for midnight', () => {
      expect(buildCronExpression('daily', [], 1, 0, 0)).toBe('0 0 * * *');
    });

    it('builds a daily cron for 23:45', () => {
      expect(buildCronExpression('daily', [], 1, 23, 45)).toBe('45 23 * * *');
    });
  });

  describe('weekdays frequency', () => {
    it('builds a weekday cron for 9:00', () => {
      expect(buildCronExpression('weekdays', [], 1, 9, 0)).toBe('0 9 * * 1-5');
    });

    it('builds a weekday cron for 17:15', () => {
      expect(buildCronExpression('weekdays', [], 1, 17, 15)).toBe('15 17 * * 1-5');
    });
  });

  describe('specific_days frequency', () => {
    it('builds cron for Monday only', () => {
      expect(buildCronExpression('specific_days', [1], 1, 8, 0)).toBe('0 8 * * 1');
    });

    it('builds cron for Mon, Wed, Fri', () => {
      expect(buildCronExpression('specific_days', [1, 3, 5], 1, 9, 30)).toBe('30 9 * * 1,3,5');
    });

    it('sorts days numerically', () => {
      expect(buildCronExpression('specific_days', [5, 1, 3], 1, 10, 0)).toBe('0 10 * * 1,3,5');
    });

    it('builds cron for Sunday and Saturday', () => {
      expect(buildCronExpression('specific_days', [0, 6], 1, 12, 0)).toBe('0 12 * * 0,6');
    });

    it('falls back to wildcard when no days selected', () => {
      expect(buildCronExpression('specific_days', [], 1, 8, 0)).toBe('0 8 * * *');
    });

    it('handles all seven days', () => {
      expect(buildCronExpression('specific_days', [0, 1, 2, 3, 4, 5, 6], 1, 6, 15)).toBe(
        '15 6 * * 0,1,2,3,4,5,6',
      );
    });
  });

  describe('monthly frequency', () => {
    it('builds cron for 1st of month at 7:00', () => {
      expect(buildCronExpression('monthly', [], 1, 7, 0)).toBe('0 7 1 * *');
    });

    it('builds cron for 15th of month at 18:45', () => {
      expect(buildCronExpression('monthly', [], 15, 18, 45)).toBe('45 18 15 * *');
    });

    it('builds cron for 28th of month', () => {
      expect(buildCronExpression('monthly', [], 28, 8, 0)).toBe('0 8 28 * *');
    });
  });
});

describe('cronToHumanReadable', () => {
  describe('daily patterns', () => {
    it('describes a daily 8 AM schedule', () => {
      const result = cronToHumanReadable('0 8 * * *', 'America/Chicago');
      expect(result).toMatch(/Every day at 8:00 AM/);
    });

    it('describes a daily midnight schedule', () => {
      const result = cronToHumanReadable('0 0 * * *', 'UTC');
      expect(result).toMatch(/Every day at 12:00 AM/);
    });

    it('describes a daily PM schedule', () => {
      const result = cronToHumanReadable('30 14 * * *', 'America/New_York');
      expect(result).toMatch(/Every day at 2:30 PM/);
    });
  });

  describe('weekday patterns', () => {
    it('describes a weekday schedule', () => {
      const result = cronToHumanReadable('0 8 * * 1-5', 'America/New_York');
      expect(result).toMatch(/Every weekday at 8:00 AM/);
    });
  });

  describe('specific day patterns', () => {
    it('describes Mon, Wed schedule', () => {
      const result = cronToHumanReadable('30 9 * * 1,3', 'America/Los_Angeles');
      expect(result).toMatch(/Every Mon, Wed at 9:30 AM/);
    });

    it('describes Sunday only', () => {
      const result = cronToHumanReadable('0 10 * * 0', 'America/Chicago');
      expect(result).toMatch(/Every Sun at 10:00 AM/);
    });

    it('describes multiple days', () => {
      const result = cronToHumanReadable('15 17 * * 1,3,5', 'UTC');
      expect(result).toMatch(/Every Mon, Wed, Fri at 5:15 PM/);
    });
  });

  describe('monthly patterns', () => {
    it('describes 1st of month', () => {
      const result = cronToHumanReadable('0 7 1 * *', 'UTC');
      expect(result).toMatch(/On the 1st of every month at 7:00 AM/);
    });

    it('describes 15th of month', () => {
      const result = cronToHumanReadable('45 18 15 * *', 'America/Chicago');
      expect(result).toMatch(/On the 15th of every month at 6:45 PM/);
    });

    it('describes 2nd of month', () => {
      const result = cronToHumanReadable('0 9 2 * *', 'UTC');
      expect(result).toMatch(/On the 2nd of every month at 9:00 AM/);
    });

    it('describes 3rd of month', () => {
      const result = cronToHumanReadable('0 9 3 * *', 'UTC');
      expect(result).toMatch(/On the 3rd of every month at 9:00 AM/);
    });

    it('describes 22nd of month', () => {
      const result = cronToHumanReadable('0 9 22 * *', 'UTC');
      expect(result).toMatch(/On the 22nd of every month at 9:00 AM/);
    });
  });

  describe('edge cases', () => {
    it('returns raw expression for invalid cron', () => {
      expect(cronToHumanReadable('invalid', 'UTC')).toBe('invalid');
    });

    it('returns raw expression for too few fields', () => {
      expect(cronToHumanReadable('0 8 *', 'UTC')).toBe('0 8 *');
    });

    it('returns raw expression for non-numeric hour', () => {
      expect(cronToHumanReadable('0 */2 * * *', 'UTC')).toBe('0 */2 * * *');
    });

    it('handles noon correctly', () => {
      const result = cronToHumanReadable('0 12 * * *', 'UTC');
      expect(result).toMatch(/Every day at 12:00 PM/);
    });

    it('handles invalid timezone gracefully', () => {
      const result = cronToHumanReadable('0 8 * * *', 'Invalid/Timezone');
      // Should still produce a readable string, falling back to the raw timezone
      expect(result).toContain('Every day at 8:00 AM');
    });
  });
});

describe('round-trip: buildCronExpression → cronToHumanReadable', () => {
  it('daily round-trip', () => {
    const cron = buildCronExpression('daily', [], 1, 8, 0);
    const readable = cronToHumanReadable(cron, 'UTC');
    expect(readable).toMatch(/Every day at 8:00 AM/);
  });

  it('weekdays round-trip', () => {
    const cron = buildCronExpression('weekdays', [], 1, 9, 30);
    const readable = cronToHumanReadable(cron, 'UTC');
    expect(readable).toMatch(/Every weekday at 9:30 AM/);
  });

  it('specific_days round-trip', () => {
    const cron = buildCronExpression('specific_days', [1, 3], 1, 14, 0);
    const readable = cronToHumanReadable(cron, 'UTC');
    expect(readable).toMatch(/Every Mon, Wed at 2:00 PM/);
  });

  it('monthly round-trip', () => {
    const cron = buildCronExpression('monthly', [], 15, 7, 0);
    const readable = cronToHumanReadable(cron, 'UTC');
    expect(readable).toMatch(/On the 15th of every month at 7:00 AM/);
  });
});
