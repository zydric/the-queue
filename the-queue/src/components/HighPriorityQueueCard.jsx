import React from 'react'
import QueueCard from './QueueCard'

const HighPriorityQueueCard = ({ title = 'High Priority Queue', tasks = [], onRemoveHigh }) => {
    return (
        <QueueCard title={title} tasks={tasks} onRemoveHigh={onRemoveHigh} />
    )
}

export default HighPriorityQueueCard