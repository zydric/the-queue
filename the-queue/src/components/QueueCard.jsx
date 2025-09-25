import React, { useEffect, useRef, useState } from "react";
import Task from "./Task";

const QueueCard = ({
  title,
  tasks = [],
  onRemoveHigh,
  onRemoveRegular,
  cardIndex,
  className = "",
}) => {
  const durationRef = useRef(null);
  const rafRef = useRef(null);
  const timeoutRef = useRef(null);
  const startTimeRef = useRef(null);
  const [widthPercent, setWidthPercent] = useState(100);

  const activeTask = tasks.length > 0 ? tasks[0] : null;

  const activeDurationMs = activeTask
    ? Math.max(400, (Number(activeTask.value) / 200) * 5000)
    : 0;

  const activeTaskId = activeTask ? activeTask.id : null;
  const activeTaskValue = activeTask ? activeTask.value : null;

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    if (!activeTask) return;

    setWidthPercent(100);
    startTimeRef.current = performance.now();

    const animate = (now) => {
      const elapsed = now - startTimeRef.current;
      const pct = Math.max(0, 100 - (elapsed / activeDurationMs) * 100);
      setWidthPercent(pct);
      if (pct > 0) rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    timeoutRef.current = setTimeout(() => {
      if (activeTask) {
        if (activeTask.high && typeof onRemoveHigh === "function") {
          onRemoveHigh(cardIndex ?? 0, activeTask.id);
        } else if (!activeTask.high && typeof onRemoveRegular === "function") {
          onRemoveRegular(cardIndex ?? 0, activeTask.id);
        }
      }
    }, activeDurationMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [activeTaskId, activeTaskValue]);

  const durationStyle = activeTask ? { width: `${widthPercent}%` } : {};
  return (
    <div className={`queue-card ${className}`}>
      <h2>{title}</h2>
      <p>Queue List</p>
      <div>
        {tasks.map((t) => (
          <Task key={t.id} taskNumber={t.value} high={t.high} />
        ))}
      </div>
      <p>Duration</p>
      <div className="duration" ref={durationRef} style={durationStyle}></div>
    </div>
  );
};

export default QueueCard;
