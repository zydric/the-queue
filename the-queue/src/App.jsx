import { useState } from 'react'
import './App.css'
import HighPriorityQueueCard from './components/HighPriorityQueueCard'
import RegularQueueCard from './components/RegularQueueCard'
import Task from './components/Task'

function App() {
  // keep tasks in React state so rendering is managed by React
  // store tasks as objects so we can mark high-priority
  const [queueList, setQueueList] = useState([]);
  // tasks assigned to cards
  const [highTasks, setHighTasks] = useState([]);
  // array of 3 regular card queues
  const [regularTasks, setRegularTasks] = useState([[], [], []]);
  // pointer for admitting to regular cards: start at last index so first admission goes to last card
  const [regularNextIndex, setRegularNextIndex] = useState(2);

  // Add a random task. 1-in-20 chance to be high-priority, but always enqueue at the tail (FIFO).
  const addRandomTask = () => {
    const isHigh = Math.random() < 0.2; // 20% chance
    const task = { id: Date.now() + Math.random(), value: Math.floor(Math.random() * 200), high: isHigh };
    setQueueList(prev => [...prev, task]);
  }

  const admitTask = () => {
    if (queueList.length === 0) return; // nothing to admit

    const [first, ...rest] = queueList;

    // remove from queueList first (FIFO)
    setQueueList(rest);

    if (first.high) {
      // assign to high priority card
      setHighTasks(high => [...high, first]);
    } else {
      // assign to regular card at regularNextIndex
      setRegularTasks(regular => {
        const copy = regular.map(arr => [...arr]);
        copy[regularNextIndex].push(first);
        return copy;
      });
      // move pointer to previous card (wrap around)
      setRegularNextIndex(i => (i - 1 + 3) % 3);
    }
  }

  // remove a task from highTasks by id
  const removeHighTask = (id) => {
    setHighTasks(prev => prev.filter(t => t.id !== id));
  }

  // remove a task from a regularTasks card by id and card index
  const removeRegularTask = (cardIndex, id) => {
    setRegularTasks(prev => {
      const copy = prev.map(arr => [...arr]);
      copy[cardIndex] = copy[cardIndex].filter(t => t.id !== id);
      return copy;
    });
  }

  return (
    <>
      <div className='container'>
        <div>
          <button onClick={addRandomTask}>Add Random Task</button>
          <h1>Task Queue</h1>
          <div className='time-list'>
            {queueList.map((task) => (
              <Task key={task.id} taskNumber={task.value} high={task.high} />
            ))}
          </div>
          <button onClick={admitTask}>Admit Task</button>
        </div>
        <div>
          <HighPriorityQueueCard title={`HighPriorityQueueCard 1`} tasks={highTasks} onRemoveHigh={removeHighTask} />
          <RegularQueueCard title={`RegularQueueCard 1`} tasks={regularTasks[0]} onRemoveRegular={removeRegularTask} cardIndex={0} />
          <RegularQueueCard title={`RegularQueueCard 2`} tasks={regularTasks[1]} onRemoveRegular={removeRegularTask} cardIndex={1} />
          <RegularQueueCard title={`RegularQueueCard 3`} tasks={regularTasks[2]} onRemoveRegular={removeRegularTask} cardIndex={2} />
        </div>
      </div>
    </>
  )
}

export default App
