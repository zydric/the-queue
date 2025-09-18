import React from 'react'
import QueueCard from './QueueCard'

const HighPriorityQueueCard = ({ title = 'High Priority Queue', tasks = [] }) => {
    return (
        <QueueCard title={title} tasks={tasks} />
    )
}

export default HighPriorityQueueCard