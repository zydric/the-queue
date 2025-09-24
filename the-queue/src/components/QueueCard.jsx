import React, { useEffect, useRef, useState } from 'react'
import '../css/queueCard.css'
import Task from './Task'

// QueueCard now accepts optional removal handlers.
// For high priority cards, pass `onRemoveHigh(id)`.
// For regular cards, pass `onRemoveRegular(cardIndex, id)` and `cardIndex`.
const QueueCard = ({ title, tasks = [], onRemoveHigh, onRemoveRegular, cardIndex }) => {
    const durationRef = useRef(null)
    const rafRef = useRef(null)
    const timeoutRef = useRef(null)
    const startTimeRef = useRef(null)
    const [widthPercent, setWidthPercent] = useState(100)

    // derive duration for the active task: use first task's value as seconds (or ms?)
    // We'll treat the task.value as seconds to make the timeout reasonable.
    const activeTask = tasks.length > 0 ? tasks[0] : null
    // Use seconds but cap at 10 seconds max
    const activeDurationMs = activeTask ? Math.max(1000, (Number(activeTask.value) / 200) * 10000) : 0

    useEffect(() => {
        // clear any previous timers/frames
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
            timeoutRef.current = null
        }
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current)
            rafRef.current = null
        }

        // start with the bar full (100%) and animate down to 0
        // if there's no active task, we want the bar to have no inline width (handled below)
        if (!activeTask) return

        setWidthPercent(100)
        startTimeRef.current = performance.now()

        // animate width from 100 -> 0 over activeDurationMs
        const animate = (now) => {
            const elapsed = now - startTimeRef.current
            const pct = Math.max(0, 100 - (elapsed / activeDurationMs) * 100)
            setWidthPercent(pct)
            if (pct > 0) {
                rafRef.current = requestAnimationFrame(animate)
            }
        }

        rafRef.current = requestAnimationFrame(animate)

        // set a timeout to remove the task when duration elapses
        timeoutRef.current = setTimeout(() => {
            // remove the active task using the provided handlers
            if (activeTask) {
                if (activeTask.high && typeof onRemoveHigh === 'function') {
                    onRemoveHigh(activeTask.id)
                } else if (!activeTask.high && typeof onRemoveRegular === 'function') {
                    // cardIndex might be undefined for high-priority card; ensure it's passed for regular
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTask?.id, activeTask?.value])

    // inline style should only affect width; only set it when there's an active task
    const durationStyle = activeTask ? { width: `${widthPercent}%` } : {}

    return (
        <div className='queue-card'>
            <h2>{title}</h2>
            <p>Queue List</p>
            <div>
                {tasks.map(t => (
                    <Task key={t.id} taskNumber={t.value} high={t.high} />
                ))}
            </div>
            <p>Duration</p>
            <div className='duration' ref={durationRef} style={durationStyle}></div>
        </div>
    )
}

export default QueueCard