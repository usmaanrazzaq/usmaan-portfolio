"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  mountCreateTeamDemo,
  mountNewShiftDemo,
  mountPropertiesDemo,
  mountScheduleDemo,
  mountTeamMenuDemo,
} from "@/lib/shifts/demos";

/** The demos read `--i` off each item to stagger the stack-load entrance. */
function step(index: number) {
  return { "--i": index } as CSSProperties;
}

function Icon({ children, size = 14 }: { children: ReactNode; size?: number }) {
  return (
    <svg
      className="shd-icon"
      viewBox="0 0 16 16"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      focusable="false"
    >
      {children}
    </svg>
  );
}

const CloseIcon = () => (
  <Icon>
    <path d="M4 4l8 8M12 4l-8 8" />
  </Icon>
);

const UsersIcon = () => (
  <Icon>
    <circle cx="6.5" cy="5.5" r="2.5" />
    <path d="M2 14c0-2.6 2-4.2 4.5-4.2S11 11.4 11 14M10.5 3.2a2.4 2.4 0 0 1 0 4.6M12.3 10.2c1 .6 1.7 1.9 1.7 3.8" />
  </Icon>
);

const TagIcon = () => (
  <Icon>
    <path d="M4.2 4.5h8.3a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H4.2L1.8 8z" />
  </Icon>
);

const ClockIcon = () => (
  <Icon size={12}>
    <circle cx="8" cy="8" r="6" />
    <path d="M8 4.8V8h2.4" />
  </Icon>
);

const SearchIcon = () => (
  <Icon size={13}>
    <circle cx="7" cy="7" r="4.5" />
    <path d="M10.4 10.4 14 14" />
  </Icon>
);

function Avatar({ initials, color }: { initials: string; color: string }) {
  return (
    <span className="shd-avatar" style={{ background: color }}>
      {initials}
    </span>
  );
}

const shifts = [
  {
    name: "Maya Chen",
    time: "7:00 AM - 11:00 AM",
    labels: [
      ["teal", "Branding"],
      ["purple", "Motion"],
    ],
  },
  {
    name: "Luis Ortega",
    time: "9:00 AM - 1:00 PM",
    labels: [
      ["orange", "Print"],
      ["gray", "Review"],
      ["purple", "Motion"],
    ],
  },
  {
    name: "Amara Okafor",
    time: "12:00 PM - 4:00 PM",
    labels: [
      ["teal", "Branding"],
      ["purple", "Motion"],
      ["orange", "Print"],
    ],
  },
  {
    name: "Jonah Weiss",
    time: "3:00 PM - 7:00 PM",
    labels: [
      ["blue", "UX"],
      ["pink", "Photo"],
    ],
  },
];

const swatches = ["#3f6bbf", "#b04452", "#037a8b", "#2b2b2b", "#6b7f64", "#ffffff"];

function CreateTeam() {
  return (
    <div
      className="shd__canvas sct"
      data-shd-canvas
      aria-hidden="true"
      style={{ width: 390 }}
    >
      <div className="shd-head">
        <span>Create a new team</span>
        <CloseIcon />
      </div>

      <div className="shd-group">
        <span className="shd-label">Team Name</span>
        <div className="shd-input" data-sct-name>
          <span className="shd-input__ph">Enter team name</span>
          <span className="shd-input__val" data-val />
        </div>
      </div>

      <div className="shd-group">
        <span className="shd-label">Team appearance</span>
        <div className="sct__swatches" data-sct-swatches>
          <span className="sct__ring" />
          {swatches.map((color) => (
            <span className="sct__swatch" style={{ background: color }} key={color} />
          ))}
          <span className="sct__custom">Custom color</span>
          <span className="sct__custom-field" />
        </div>
      </div>

      <div className="shd-group">
        <span className="shd-label">Add members</span>
        <div className="shd-add" data-sct-members>
          <UsersIcon />
          <span className="shd-add__ph">Add Members</span>
          <span className="shd-input__val" data-val />
          <span className="shd-chip shd-chip--person shd-fill" data-sct-chip>
            <Avatar initials="PR" color="#037a8b" />
            Priya Raman
          </span>
        </div>
      </div>

      <span className="shd-btn shd-btn--wide" data-sct-submit>
        Add team
      </span>
    </div>
  );
}

function Schedule() {
  return (
    <div
      className="shd__canvas ssd"
      data-shd-canvas
      aria-hidden="true"
      style={{ width: 320 }}
    >
      <div className="ssd__head">
        <span>Tue Sept 15</span>
        <Icon>
          <path d="M8 3v10M3 8h10" />
        </Icon>
      </div>
      <ul className="ssd__cards is-intro" data-ssd-stage>
        {shifts.map((shift, i) => (
          <li className="ssd__card shd-fill" style={step(i)} key={shift.name}>
            <span className="ssd__time">{shift.time}</span>
            <span className="ssd__name">{shift.name}</span>
            <span className="ssd__labels">
              {shift.labels.map(([tone, label]) => (
                <span className={`shd-tag shd-tag--${tone}`} key={label}>
                  {label}
                </span>
              ))}
            </span>
            <span className="ssd__avatars">
              <span />
              <span />
              <span />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const properties: { label: string; ph: ReactNode; value: ReactNode }[] = [
  { label: "Team Lead", ph: "Set team lead", value: "Maya Chen" },
  {
    label: "Priority",
    ph: "Set priority",
    value: (
      <>
        <span className="spp__dot" />
        High
      </>
    ),
  },
  {
    label: "Team Members",
    ph: (
      <>
        <UsersIcon />
        Add Members
      </>
    ),
    value: (
      <>
        <span className="spp__stack">
          <Avatar initials="PR" color="#037a8b" />
          <Avatar initials="DB" color="#3f6bbf" />
          <Avatar initials="SN" color="#6b7f64" />
        </span>
        3 members
      </>
    ),
  },
  {
    label: "Labels",
    ph: (
      <>
        <TagIcon />
        Add label
      </>
    ),
    value: (
      <>
        <span className="shd-tag shd-tag--teal">Branding</span>
        <span className="shd-tag shd-tag--purple">Motion</span>
      </>
    ),
  },
  { label: "Start Time", ph: "Set start time", value: "9:00 AM EST" },
  { label: "End Time", ph: "Set end time", value: "12:00 PM EST" },
];

function Properties() {
  return (
    <div
      className="shd__canvas spp"
      data-shd-canvas
      aria-hidden="true"
      style={{ width: 386 }}
    >
      <span className="spp__panel-icon">
        <Icon>
          <rect x="2.5" y="2.5" width="11" height="11" rx="1.5" />
          <path d="M9.5 2.5v11" />
        </Icon>
      </span>
      <span className="spp__title">Properties</span>

      <dl className="spp__rows">
        {properties.map((row) => (
          <div className="spp__row" data-spp-row key={row.label}>
            <dt>{row.label}</dt>
            <dd>
              <span className="spp__ph">{row.ph}</span>
              <span className="spp__value shd-fill">{row.value}</span>
            </dd>
          </div>
        ))}
      </dl>

      <div className="spp__notes" data-spp-notes>
        <span className="shd-input__ph">Add notes or instructions</span>
        <span className="shd-input__val shd-fill" data-val />
      </div>

      <span className="shd-btn shd-btn--danger">Delete shift</span>
    </div>
  );
}

const teamActions: { label: string; icon: ReactNode; danger?: boolean }[] = [
  {
    label: "Edit team info",
    icon: <path d="M10.5 2.8l2.7 2.7L6 12.7l-3.3.6.6-3.3z" />,
  },
  {
    label: "Manage team",
    icon: (
      <>
        <circle cx="6.5" cy="5" r="2.5" />
        <path d="M2 13.5c0-2.4 2-4 4.5-4 .6 0 1.2.1 1.7.3" />
        <circle cx="11.8" cy="11.8" r="2" />
        <path d="M11.8 11v.8l.5.4" />
      </>
    ),
  },
  {
    label: "Archive team",
    icon: (
      <>
        <rect x="2.5" y="3" width="11" height="3" rx=".5" />
        <path d="M3.5 6v7h9V6M6.5 8.5h3" />
      </>
    ),
  },
  {
    label: "Delete team",
    icon: <path d="M8 2.5l6 10.5H2zM8 6.8v3M8 11.4v.1" />,
    danger: true,
  },
];

function TeamMenu() {
  return (
    <div
      className="shd__canvas stm"
      data-shd-canvas
      aria-hidden="true"
      style={{ width: 244 }}
    >
      <div className="stm__menu" data-stm-menu>
        <span className="stm__hover" />
        {teamActions.map((action) => (
          <span
            className={`stm__row${action.danger ? " stm__row--danger" : ""}`}
            data-stm-row
            key={action.label}
          >
            <Icon>{action.icon}</Icon>
            {action.label}
          </span>
        ))}
        <svg className="stm__cursor" viewBox="0 0 12 16" width="11" height="15" focusable="false">
          <path
            d="M1 1v12.5l3.2-3 2.1 4.6 2-.9-2.1-4.5H10.5z"
            fill="#111"
            stroke="#fff"
            strokeWidth="1"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}

function NewShift() {
  return (
    <div
      className="shd__canvas sns"
      data-shd-canvas
      aria-hidden="true"
      style={{ width: 390 }}
    >
      <div className="shd-head">
        <span>New Shift</span>
        <CloseIcon />
      </div>
      <span className="sns__date">Sun Sept 13</span>

      <div className="shd-group sns__title">
        <span className="shd-label">Add shift title</span>
        <div className="shd-input" data-sns-title>
          <span className="shd-input__ph">Title</span>
          <span className="shd-input__val" data-val />
        </div>
      </div>

      <div className="sns__times">
        <div className="shd-group">
          <span className="shd-label">Start Time</span>
          <div className="shd-input" data-sns-start>
            <span className="shd-input__ph">--:-- --</span>
            <span className="shd-input__val" data-val />
            <ClockIcon />
          </div>
        </div>
        <div className="shd-group">
          <span className="shd-label">End Time</span>
          <div className="shd-input" data-sns-end>
            <span className="shd-input__ph">--:-- --</span>
            <span className="shd-input__val" data-val />
            <ClockIcon />
          </div>
        </div>
      </div>

      <div className="shd-group">
        <span className="shd-label">Priority</span>
        <div className="shd-input sns__priority" data-sns-priority>
          <span className="shd-input__ph">Select priority</span>
          <span className="shd-input__val" data-val />
          <SearchIcon />
          <ul className="sns__menu">
            {["Low", "Medium", "High"].map((option) => (
              <li data-sns-option key={option}>
                {option}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="shd-group">
        <span className="shd-label">Add members</span>
        <div className="shd-add" data-sns-members>
          <UsersIcon />
          <span className="shd-add__ph">Add Members</span>
          <span className="shd-chip shd-chip--person shd-fill" data-sns-chip>
            <Avatar initials="PR" color="#037a8b" />
            Priya Raman
          </span>
          <span className="shd-chip shd-chip--person shd-fill" data-sns-chip>
            <Avatar initials="DB" color="#3f6bbf" />
            Dev Brooks
          </span>
        </div>
      </div>

      <div className="shd-group sns__labels">
        <span className="shd-label">Labels</span>
        <div className="shd-add" data-sns-labels>
          <TagIcon />
          <span className="shd-add__ph">Add label</span>
          <span className="shd-chip shd-fill" data-sns-chip>
            <span className="shd-tag shd-tag--teal">Branding</span>
          </span>
          <span className="shd-chip shd-fill" data-sns-chip>
            <span className="shd-tag shd-tag--purple">Motion</span>
          </span>
        </div>
      </div>

      <div className="sns__actions">
        <span className="sns__cancel">Cancel</span>
        <span className="shd-btn" data-sns-submit>
          Add shift
        </span>
      </div>
    </div>
  );
}

/**
 * The Components section: five coded, self-running replicas of the Shifts UI,
 * laid out like the screenshots they replace (pair, pair, full width).
 */
export default function ShiftsDemos() {
  const createTeamRef = useRef<HTMLElement>(null);
  const scheduleRef = useRef<HTMLElement>(null);
  const propertiesRef = useRef<HTMLElement>(null);
  const teamMenuRef = useRef<HTMLElement>(null);
  const newShiftRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const teardowns = [
      createTeamRef.current && mountCreateTeamDemo(createTeamRef.current),
      scheduleRef.current && mountScheduleDemo(scheduleRef.current),
      propertiesRef.current && mountPropertiesDemo(propertiesRef.current),
      teamMenuRef.current && mountTeamMenuDemo(teamMenuRef.current),
      newShiftRef.current && mountNewShiftDemo(newShiftRef.current),
    ];

    return () => teardowns.forEach((teardown) => teardown && teardown());
  }, []);

  return (
    <>
      <div className="paper-cs__pair paper-cs__pair--components">
        <figure
          className="paper-cs__shot shd"
          aria-label="Shifts create a new team dialog: a team name is typed, a color picked, and a member added"
          ref={createTeamRef}
        >
          <CreateTeam />
        </figure>
        <figure
          className="paper-cs__shot shd"
          aria-label="Shifts day column with four shift cards stacking into view"
          ref={scheduleRef}
        >
          <Schedule />
        </figure>
      </div>

      <div className="paper-cs__pair paper-cs__pair--components">
        <figure
          className="paper-cs__shot shd"
          aria-label="Shifts properties panel filling in its lead, priority, members, labels, times, and notes"
          ref={propertiesRef}
        >
          <Properties />
        </figure>
        <figure
          className="paper-cs__shot shd"
          aria-label="Shifts team actions menu with a hover highlight moving through each action"
          ref={teamMenuRef}
        >
          <TeamMenu />
        </figure>
      </div>

      <figure
        className="paper-cs__shot paper-cs__shot--full shd"
        aria-label="Shifts new shift dialog filling in a title, times, priority, members, and labels"
        ref={newShiftRef}
      >
        <NewShift />
      </figure>
    </>
  );
}
