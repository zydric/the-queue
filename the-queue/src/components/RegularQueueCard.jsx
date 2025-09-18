import React from 'react'
import QueueCard from './QueueCard'

const RegularQueueCard = ({ title = 'Regular Queue', tasks = [], onRemoveRegular, cardIndex }) => {
  return (
    <QueueCard title={title} tasks={tasks} onRemoveRegular={onRemoveRegular} cardIndex={cardIndex} />
  )
}

export default RegularQueueCard