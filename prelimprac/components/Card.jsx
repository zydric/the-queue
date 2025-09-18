import React from 'react'
import '../index.css'

const Card = ({ color, isRevealed, onClick, canReveal }) => {
    const [pressed, setPressed] = React.useState(false);

    const handleMouseDown = (e) => {
        if (e && e.button !== undefined && e.button !== 0) return;
        if (canReveal && !isRevealed) setPressed(true);
    };
    const handleMouseUp = () => {
        if (pressed) setPressed(false);
    };

    return (
        <button
            className='card-button'
            onClick={onClick}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            data-revealed={isRevealed ? 'true' : 'false'}
            data-pressed={pressed ? 'true' : 'false'}
            style={{
                backgroundColor: isRevealed ? color : undefined
            }}
        ></button>
    )
}

export default Card