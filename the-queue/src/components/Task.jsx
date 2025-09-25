import React from 'react'

const Task = ({ taskNumber, high = false }) => {
  return <div className={'task' + (high ? ' high' : '')}>{taskNumber}</div>
}

export default Task