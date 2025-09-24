import React from 'react'

const Task = ({ taskNumber, high = false }) => {
  console.log(taskNumber, high)
  return (
    <div className={"task" + (high ? ' high' : '')}>{taskNumber}</div>
  )
}

export default Task