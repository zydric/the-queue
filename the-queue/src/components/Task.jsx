import React from 'react'
import '../css/task.css'

const Task = ({ taskNumber, high = false }) => {
  console.log(taskNumber, high)
  return (
    <div className={"task" + (high ? ' high' : '')}>{taskNumber}</div>
  )
}

export default Task