/**
 * The tapbacks a visitor can leave on the hero's chat bubbles. They live in
 * HomeChat's state only, so a reload starts the thread without them.
 */

export const REACTIONS = ["heart", "up", "down", "haha", "emphasis", "question"] as const;

export type Reaction = (typeof REACTIONS)[number];

export type Reactions = Readonly<Record<string, Reaction>>;
