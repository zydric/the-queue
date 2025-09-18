import React from 'react'
import '../index.css'
import Card from './Card'

const CardContainer = ({ colorSequence, onCardClick, revealedCards, currentIndex }) => {
    const shuffledOrder = React.useMemo(() => {
        const indices = colorSequence.map((_, i) => i);
        for (let i = indices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [indices[i], indices[j]] = [indices[j], indices[i]];
        }
        return indices;
    }, [colorSequence]);

    return (
        <div className='card-container'>
            {shuffledOrder.map((seqIndex, pos) => (
                <Card
                    key={pos}
                    color={colorSequence[seqIndex]}
                    isRevealed={revealedCards[pos]}
                    canReveal={seqIndex === currentIndex}
                    onClick={() => onCardClick(pos, seqIndex)}
                />
            ))}
        </div>
    )
}

export default CardContainer