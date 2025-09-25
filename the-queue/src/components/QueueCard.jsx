import React, { useEffect, useRef, useState } from 'react'
import Task from './Task'

// Reusable card: shows tasks and a progress bar for the front task.
// When the progress finishes, this component asks the parent to remove the task.
const QueueCard = ({ title, tasks = [], onRemoveHigh, onRemoveRegular, cardIndex }) => {
    const durationRef = useRef(null)
    const rafRef = useRef(null)
    const timeoutRef = useRef(null)
    const startTimeRef = useRef(null)
    const [widthPercent, setWidthPercent] = useState(100)

    // The active task is the first one (FIFO). Convert its value into ms so
    // the UI animation has a real duration to show.
    const activeTask = tasks.length > 0 ? tasks[0] : null
    const activeDurationMs = activeTask ? Math.max(300, (Number(activeTask.value) / 200) * 10000) : 0

    const activeTaskId = activeTask ? activeTask.id : null
    const activeTaskValue = activeTask ? activeTask.value : null

    useEffect(() => {
        // Clear previous timers/frames so we start fresh for the current active task.
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
            timeoutRef.current = null
        }
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current)
            rafRef.current = null
        }

        if (!activeTask) return // nothing to animate or remove

        // Start the progress bar and animate from 100% -> 0% over activeDurationMs.
        setWidthPercent(100)
        startTimeRef.current = performance.now()

        const animate = (now) => {
            const elapsed = now - startTimeRef.current
            const pct = Math.max(0, 100 - (elapsed / activeDurationMs) * 100)
            setWidthPercent(pct)
            if (pct > 0) rafRef.current = requestAnimationFrame(animate)
        }

        rafRef.current = requestAnimationFrame(animate)

        // When time is up, call the parent handler to remove the active task.
        timeoutRef.current = setTimeout(() => {
            if (activeTask) {
                if (activeTask.high && typeof onRemoveHigh === 'function') {
                    onRemoveHigh(activeTask.id)
                } else if (!activeTask.high && typeof onRemoveRegular === 'function') {
                    onRemoveRegular(cardIndex ?? 0, activeTask.id)
                }
            }
        }, activeDurationMs)

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
                timeoutRef.current = null
            }
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current)
                rafRef.current = null
            }
        }
    }, [activeTaskId, activeTaskValue])

    // Only set an inline width while there's an active task; otherwise use stylesheet.
    const durationStyle = activeTask ? { width: `${widthPercent}%` } : {}

    return (
        <div className='queue-card'>
            <h2>{title}</h2>
            <p>Queue List</p>
            <div>
                {tasks.map((t) => (
                    <Task key={t.id} taskNumber={t.value} high={t.high} />
                ))}
            </div>
            <p>Duration</p>
            <div className='duration' ref={durationRef} style={durationStyle}></div>
        </div>
    )
}

export default QueueCard