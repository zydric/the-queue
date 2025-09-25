import { useState } from 'react'
import './App.css'
import HighPriorityQueueCard from './components/HighPriorityQueueCard'
import RegularQueueCard from './components/RegularQueueCard'
import Task from './components/Task'

function App() {
  // queueList: main waiting line (FIFO). We push new tasks here.
  // highTasks: tasks that go to the high-priority card.
  // regularTasks: an array of three arrays, one for each regular card.
  // regularNextIndex: which regular card will receive the next admitted task.
  const [queueList, setQueueList] = useState([])
  const [highTasks, setHighTasks] = useState([])
  const [regularTasks, setRegularTasks] = useState([[], [], []])
  const [regularNextIndex, setRegularNextIndex] = useState(2)

  // Create and enqueue a random task. 
  const addRandomTask = () => {
    const isHigh = Math.random() < 0.1; 
    const task = { id: Date.now() + Math.random(), value: Math.floor(Math.random() * 200), high: isHigh };
    setQueueList(prev => [...prev, task]);
  }

  const admitTask = () => {
    if (queueList.length === 0) return; // nothing to admit

    const [first, ...rest] = queueList;

  // remove from the head of the queue (FIFO)
    setQueueList(rest);

    if (first.high) {
      // send high-priority tasks to the dedicated highTasks list
      setHighTasks((high) => [...high, first])
    } else {
      // Decide where to put the regular task:
      // - If at least one regular card is still empty, keep original round-robin
      //   admission (so initial filling goes card3 -> card2 -> card1).
      // - If every regular card already has at least one task, pick the card
      //   whose total queued duration (sum of task.value) is smallest. This
      //   helps balance finishing times across cards.
      const allHaveTask = regularTasks.every((arr) => arr.length > 0)

      setRegularTasks((regular) => {
        const copy = regular.map((arr) => [...arr])

        let targetIndex
        if (allHaveTask) {
          // compute sum of values for each card and pick the smallest
          const sums = copy.map((arr) => arr.reduce((s, t) => s + Number(t.value || 0), 0))
          const minSum = Math.min(...sums)
          targetIndex = sums.indexOf(minSum)
        } else {
          // still filling initial slots: use round-robin pointer
          targetIndex = regularNextIndex
        }

        copy[targetIndex].push(first)
        return copy
      })

      // Update the pointer only while we're in the initial filling phase.
      if (!allHaveTask) {
        setRegularNextIndex((i) => (i - 1 + 3) % 3)
      }
    }
  }

  // remove a task from the high-priority card by id
  const removeHighTask = (id) => {
    setHighTasks(prev => prev.filter(t => t.id !== id));
  }

  // remove a task from a regular card by card index + id
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
