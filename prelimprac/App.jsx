import React, { useState } from 'react'
import ColorBar from './components/ColorBar'
import CardContainer from './components/CardContainer'
import './index.css'

const PALETTE = ['fuchsia', 'blue', 'red', 'orange', 'cyan', 'green', 'greenyellow', 'yellow', 'purple'];

const shuffle = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const App = () => {
  const [colorSequence, setColorSequence] = useState(() => shuffle([...PALETTE]));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealedCards, setRevealedCards] = useState(Array(PALETTE.length).fill(false));

  const startNewGame = () => {
    const nextSeq = shuffle([...PALETTE]);
    setColorSequence(nextSeq);
    setRevealedCards(Array(nextSeq.length).fill(false));
    setCurrentIndex(0);
  };


  const handleCardClick = (position, seqIndex) => {
    if (revealedCards[position]) return;

    if (seqIndex === currentIndex) {
      setRevealedCards(prev => {
        const next = [...prev];
        next[position] = true;
        return next;
      });

      const nextIndex = currentIndex + 1;
      setCurrentIndex(prev => prev + 1);

      if (nextIndex === colorSequence.length) {
        setTimeout(() => {
          window.alert('Good Job!');
          startNewGame();
        }, 250);
      }

      return;
    }

    setRevealedCards(Array(colorSequence.length).fill(false));
    setCurrentIndex(0);
  };

  return (
    <>
      <ColorBar colorSequence={colorSequence} />
      <CardContainer
        colorSequence={colorSequence}
        onCardClick={handleCardClick}
        revealedCards={revealedCards}
        currentIndex={currentIndex}
      />
    </>
  );
};

export default App;