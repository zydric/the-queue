import React from 'react'
import QueueCard from './QueueCard'

const HighPriorityQueueCard = ({ title = 'High Priority Queue', tasks = [], onRemoveHigh, cardIndex = 0 }) => {
    return <QueueCard title={title} tasks={tasks} onRemoveHigh={onRemoveHigh} cardIndex={cardIndex} className="high" />
}

export default HighPriorityQueueCard