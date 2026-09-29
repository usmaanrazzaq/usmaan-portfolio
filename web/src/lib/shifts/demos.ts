/**
 * The five self-running component demos in the Shifts case study. Each mount
 * fits its canvas into the frame, then plays a list of beats on a loop while
 * the figure is on screen (see `loopBeats`). Every mount returns a teardown.
 * `fraction` overrides how much of the frame's width the canvas spans, which
 * the lightbox uses on phones.
 */

import { fitCanvas, loopBeats, typeBeats } from "@/lib/demoLoop";
import type { Beat } from "@/lib/demoLoop";

/** Width of each component on its 800px Paper artboard. */
const PAPER_W = {
  createTeam: 472,
  schedule: 296,
  properties: 310,
  teamMenu: 532,
  newShift: 354,
};

function setup(root: HTMLElement, fraction: number) {
  const canvas = root.querySelector<HTMLElement>("[data-shd-canvas]");
  if (!canvas) return null;
  const q = <T extends HTMLElement = HTMLElement>(sel: string) => canvas.querySelector<T>(sel);
  const qa = (sel: string) => Array.from(canvas.querySelectorAll<HTMLElement>(sel));
  return { canvas, q, qa, unfit: fitCanvas(root, canvas, fraction) };
}

const on = (el: HTMLElement | null | undefined, cls = "is-on") => () => el?.classList.add(cls);
const off = (el: HTMLElement | null | undefined, cls = "is-on") => () => el?.classList.remove(cls);

/** Clears typed values and every state class a demo sets. */
function clearFields(fields: (HTMLElement | null)[]) {
  fields.forEach((field) => {
    if (!field) return;
    field.classList.remove("is-typing", "has-value", "is-focus");
    const val = field.querySelector("[data-val]");
    if (val) val.textContent = "";
  });
}

function mount(
  root: HTMLElement,
  fraction: number,
  build: (s: NonNullable<ReturnType<typeof setup>>) => {
    reset: () => void;
    beats: Beat[];
    leaveAt: number;
    loopMs: number;
  },
) {
  const s = setup(root, fraction);
  if (!s) return () => {};
  const stopLoop = loopBeats(root, s.canvas, build(s));
  return () => {
    stopLoop();
    s.unfit();
  };
}

/** Create a new team: name typed, colour picked, a member added, submitted. */
export function mountCreateTeamDemo(root: HTMLElement, fraction?: number) {
  return mount(root, fraction ?? PAPER_W.createTeam / 800, ({ q, qa }) => {
    const name = q("[data-sct-name]");
    const swatches = q("[data-sct-swatches]");
    const members = q("[data-sct-members]");
    const chip = q("[data-sct-chip]");
    const submit = q("[data-sct-submit]");

    return {
      reset() {
        clearFields([name, members]);
        swatches?.classList.remove("is-picked");
        swatches?.style.setProperty("--sel", "0");
        members?.classList.remove("has-items");
        chip?.classList.remove("is-on");
        submit?.classList.remove("is-pressed");
        qa(".is-on").forEach((el) => el.classList.remove("is-on"));
      },
      beats: [
        { at: 400, run: on(name, "is-focus") },
        ...typeBeats(name, "Brand Studio", 650, 60),
        { at: 1850, run: off(name, "is-focus") },
        { at: 2100, run: on(swatches, "is-picked") },
        { at: 2700, run: () => swatches?.style.setProperty("--sel", "2") },
        ...typeBeats(members, "Don Draper", 3400, 60),
        {
          at: 4350,
          run: () => {
            members?.classList.add("has-items");
            chip?.classList.add("is-on");
          },
        },
        { at: 5100, run: on(submit, "is-pressed") },
        { at: 5300, run: off(submit, "is-pressed") },
      ],
      leaveAt: 6600,
      loopMs: 7200,
    };
  });
}

/** Schedule day column: the four shift cards stack in, hold, and replay. */
export function mountScheduleDemo(root: HTMLElement, fraction?: number) {
  return mount(root, fraction ?? PAPER_W.schedule / 800, ({ q }) => {
    const stage = q("[data-ssd-stage]");
    return {
      reset: () => stage?.classList.add("is-intro"),
      beats: [{ at: 250, run: off(stage, "is-intro") }],
      leaveAt: 4400,
      loopMs: 4900,
    };
  });
}

/** Properties panel: each property fills in, then a note is typed. */
export function mountPropertiesDemo(root: HTMLElement, fraction?: number) {
  return mount(root, fraction ?? PAPER_W.properties / 800, ({ q, qa }) => {
    const rows = qa("[data-spp-row]");
    const notes = q("[data-spp-notes]");
    return {
      reset() {
        rows.forEach((row) => row.classList.remove("is-filled"));
        clearFields([notes]);
      },
      beats: [
        ...rows.map((row, n) => ({ at: 450 + n * 420, run: on(row, "is-filled") })),
        { at: 3200, run: on(notes, "is-focus") },
        ...typeBeats(
          notes,
          "Moodboards are in the shared drive. Walk the client through type options at 10:30.",
          3350,
          38,
        ),
        { at: 6900, run: off(notes, "is-focus") },
      ],
      leaveAt: 8200,
      loopMs: 8800,
    };
  });
}

/** Team menu: the hover highlight glides down the actions and back. */
export function mountTeamMenuDemo(root: HTMLElement, fraction?: number) {
  return mount(root, fraction ?? PAPER_W.teamMenu / 800, ({ q, qa }) => {
    const menu = q("[data-stm-menu]");
    const rows = qa("[data-stm-row]");

    function hover(index: number) {
      return () => {
        menu?.style.setProperty("--row", String(index));
        menu?.classList.toggle("is-danger", index === rows.length - 1);
        rows.forEach((row, n) => row.classList.toggle("is-hover", n === index));
      };
    }

    return {
      reset() {
        hover(0)();
        rows[0]?.classList.remove("is-hover");
        menu?.classList.remove("is-on");
      },
      beats: [
        {
          at: 300,
          run: () => {
            menu?.classList.add("is-on");
            hover(0)();
          },
        },
        ...rows.slice(1).map((_, n) => ({ at: 1300 + n * 1000, run: hover(n + 1) })),
        { at: 3300 + 1300, run: off(menu) },
      ],
      leaveAt: 4900,
      loopMs: 5400,
    };
  });
}

/** New shift: title, times, priority, members, and labels filled, then added. */
export function mountNewShiftDemo(root: HTMLElement, fraction?: number) {
  return mount(root, fraction ?? PAPER_W.newShift / 800, ({ q, qa }) => {
    const title = q("[data-sns-title]");
    const start = q("[data-sns-start]");
    const end = q("[data-sns-end]");
    const priority = q("[data-sns-priority]");
    const options = qa("[data-sns-option]");
    const members = q("[data-sns-members]");
    const labels = q("[data-sns-labels]");
    const chips = qa("[data-sns-chip]");
    const submit = q("[data-sns-submit]");

    const pick = (index: number) => () =>
      options.forEach((opt, n) => opt.classList.toggle("is-hover", n === index));

    return {
      reset() {
        clearFields([title, start, end, priority]);
        priority?.classList.remove("is-open");
        pick(-1)();
        members?.classList.remove("has-items");
        labels?.classList.remove("has-items");
        chips.forEach((chip) => chip.classList.remove("is-on"));
        submit?.classList.remove("is-pressed");
      },
      beats: [
        { at: 350, run: on(title, "is-focus") },
        ...typeBeats(title, "Client Workshop", 550, 55),
        { at: 1650, run: off(title, "is-focus") },
        { at: 1750, run: on(start, "is-focus") },
        ...typeBeats(start, "09:00 AM", 1850, 55),
        { at: 2500, run: off(start, "is-focus") },
        { at: 2600, run: on(end, "is-focus") },
        ...typeBeats(end, "12:00 PM", 2700, 55),
        { at: 3350, run: off(end, "is-focus") },
        {
          at: 3600,
          run: () => priority?.classList.add("is-focus", "is-open"),
        },
        { at: 3950, run: pick(0) },
        { at: 4250, run: pick(1) },
        { at: 4550, run: pick(2) },
        {
          at: 4950,
          run: () => {
            const val = priority?.querySelector("[data-val]");
            if (val) val.textContent = "High";
            priority?.classList.add("has-value");
            priority?.classList.remove("is-open", "is-focus");
          },
        },
        ...chips.map((chip, n) => ({
          at: 5400 + n * 320,
          run: () => {
            chip.parentElement?.classList.add("has-items");
            chip.classList.add("is-on");
          },
        })),
        { at: 5400 + chips.length * 320 + 500, run: on(submit, "is-pressed") },
        { at: 5400 + chips.length * 320 + 700, run: off(submit, "is-pressed") },
      ],
      leaveAt: 8400,
      loopMs: 9000,
    };
  });
}
