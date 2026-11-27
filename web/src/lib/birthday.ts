/**
 * Usmaan's birthday, every year. The day is New York's day, the same clock the
 * header shows beside the avatar, so the hat goes on and comes off at midnight
 * there rather than at each visitor's own midnight.
 */
const TIME_ZONE = "America/New_York";
const BIRTHDAY = { month: 12, day: 6 };

const DAY_MS = 24 * 60 * 60 * 1000;

const parts = new Intl.DateTimeFormat("en-US", {
  timeZone: TIME_ZONE,
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
  hourCycle: "h23",
});

function newYork(now: Date) {
  const values: Record<string, number> = {};
  for (const part of parts.formatToParts(now)) {
    if (part.type !== "literal") values[part.type] = Number(part.value);
  }
  return values as Record<"month" | "day" | "hour" | "minute" | "second", number>;
}

export function isBirthday(now = new Date()): boolean {
  const { month, day } = newYork(now);
  return month === BIRTHDAY.month && day === BIRTHDAY.day;
}

/**
 * Roughly how long until the next New York midnight. On a daylight-saving
 * changeover it can be an hour out, which is harmless: the caller checks the
 * date again when it fires and simply re-arms.
 */
export function msUntilNextMidnight(now = new Date()): number {
  const { hour, minute, second } = newYork(now);
  const elapsed = ((hour * 60 + minute) * 60 + second) * 1000 + now.getMilliseconds();
  return DAY_MS - elapsed + 1000;
}
