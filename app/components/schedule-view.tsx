"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Schedule = {
  label: string;
  title: string;
  copy: string;
  sessions: string[];
};

export function ScheduleView({ schedules }: { schedules: Schedule[] }) {
  const [activeLabel, setActiveLabel] = useState(schedules[0]?.label ?? "");
  const activeSchedule = schedules.find((item) => item.label === activeLabel) ?? schedules[0];

  return (
    <div className="schedule-view">
      <div className="schedule-tabs" role="tablist" aria-label="Batch schedules">
        {schedules.map((schedule) => (
          <button
            key={schedule.label}
            type="button"
            className={`schedule-tab${activeLabel === schedule.label ? " active-schedule-tab" : ""}`}
            onClick={() => setActiveLabel(schedule.label)}
          >
            {schedule.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeSchedule.label}
          className="schedule-card"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="schedule-kicker">{activeSchedule.label}</p>
          <h3>{activeSchedule.title}</h3>
          <p>{activeSchedule.copy}</p>
          <div className="schedule-session-list">
            {activeSchedule.sessions.map((session) => (
              <div className="schedule-session" key={session}>
                {session}
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
