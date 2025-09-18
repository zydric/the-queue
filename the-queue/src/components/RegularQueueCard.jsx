import React from 'react'
import QueueCard from './QueueCard'

const RegularQueueCard = ({ title = 'Regular Queue', tasks = [] }) => {
  return (
    <QueueCard title={title} tasks={tasks} />
  )
}

export default RegularQueueCard