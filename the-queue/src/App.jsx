import { useState } from "react";
import "./App.css";
import HighPriorityQueueCard from "./components/HighPriorityQueueCard";
import RegularQueueCard from "./components/RegularQueueCard";
import Task from "./components/Task";

function App() {
  const [queueList, setQueueList] = useState([]);

  const [highTasks, setHighTasks] = useState([[]]);
  const [regularTasks, setRegularTasks] = useState([[], [], []]);
  const [regularNextIndex, setRegularNextIndex] = useState(2);
  const [highNextIndex, setHighNextIndex] = useState(0);

  const addRandomTask = () => {
    const isHigh = Math.random() < 0.1;
    const task = {
      id: Date.now() + Math.random(),
      value: Math.floor(Math.random() * 200),
      high: isHigh,
    };
    setQueueList((prev) => [...prev, task]);
  };

  const admitTask = () => {
    if (queueList.length === 0) return;

    const [first, ...rest] = queueList;

    setQueueList(rest);

    if (first.high) {
      const allHighHaveTask = highTasks.every((arr) => arr.length > 0);

      setHighTasks((high) => {
        const copy = high.map((arr) => [...arr]);

        let targetIndex;
        if (allHighHaveTask) {
          const sums = copy.map((arr) =>
            arr.reduce((s, t) => s + Number(t.value || 0), 0)
          );
          const minSum = Math.min(...sums);
          targetIndex = sums.indexOf(minSum);
        } else {
          targetIndex = highNextIndex;
        }

        copy[targetIndex].push(first);
        return copy;
      });

      if (!allHighHaveTask) {
        setHighNextIndex((i) => (i - 1 + highTasks.length) % highTasks.length);
      }
    } else {
      const allHaveTask = regularTasks.every((arr) => arr.length > 0);

      setRegularTasks((regular) => {
        const copy = regular.map((arr) => [...arr]);

        let targetIndex;
        if (allHaveTask) {
          const sums = copy.map((arr) =>
            arr.reduce((s, t) => s + Number(t.value || 0), 0)
          );
          const minSum = Math.min(...sums);
          targetIndex = sums.indexOf(minSum);
        } else {
          targetIndex = regularNextIndex;
        }

        copy[targetIndex].push(first);
        return copy;
      });

      if (!allHaveTask) {
        setRegularNextIndex((i) => (i - 1 + 3) % 3);
      }
    }
  };

  const removeHighTask = (cardIndex, id) => {
    setHighTasks((prev) => {
      const copy = prev.map((arr) => [...arr]);
      copy[cardIndex] = copy[cardIndex].filter((t) => t.id !== id);
      return copy;
    });
  };

  const removeRegularTask = (cardIndex, id) => {
    setRegularTasks((prev) => {
      const copy = prev.map((arr) => [...arr]);
      copy[cardIndex] = copy[cardIndex].filter((t) => t.id !== id);
      return copy;
    });
  };

  return (
    <>
      <div className="container">
        <div>
          <button onClick={addRandomTask}>Add Random Task</button>
          <h1>Task Queue</h1>
          <div className="time-list">
            {queueList.map((task) => (
              <Task key={task.id} taskNumber={task.value} high={task.high} />
            ))}
          </div>
          <button onClick={admitTask}>Admit Task</button>
        </div>
        <div>
          {highTasks.map((tasks, idx) => (
            <HighPriorityQueueCard
              key={`high-${idx}`}
              title={`HighPriorityQueueCard ${idx + 1}`}
              tasks={tasks}
              onRemoveHigh={removeHighTask}
              cardIndex={idx}
            />
          ))}

          <RegularQueueCard
            title={`RegularQueueCard 1`}
            tasks={regularTasks[0]}
            onRemoveRegular={removeRegularTask}
            cardIndex={0}
          />
          <RegularQueueCard
            title={`RegularQueueCard 2`}
            tasks={regularTasks[1]}
            onRemoveRegular={removeRegularTask}
            cardIndex={1}
          />
          <RegularQueueCard
            title={`RegularQueueCard 3`}
            tasks={regularTasks[2]}
            onRemoveRegular={removeRegularTask}
            cardIndex={2}
          />
        </div>
      </div>
    </>
  );
}

export default App;
