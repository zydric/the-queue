import React from 'react'
import '../index.css'

const ColorBar = ({ colorSequence }) => {
  return (
    <div className='color-bar'>
      {colorSequence.map((color, index) => (
        <div
          key={index}
          className='color'
          style={{ backgroundColor: color }}
        ></div>
      ))}
    </div>
  )
}

export default ColorBar