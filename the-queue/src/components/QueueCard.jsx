import React from 'react'
import '../css/queueCard.css'
import Task from './Task'

const QueueCard = ({ title, tasks = [] }) => {
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
            <div className='duration'></div>
        </div>
    )
}

export default QueueCard