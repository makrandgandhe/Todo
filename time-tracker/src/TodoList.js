import React, { useState, useEffect } from 'react';

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#333',
    color: '#fff',
    padding: '20px',
  },
  header: {
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: '20px',
  },
  input: {
    padding: '8px',
    marginRight: '10px',
  },
  addButton: {
    padding: '8px',
    backgroundColor: '#61dafb',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  todoCell: {
    padding: '10px',
    borderBottom: '1px solid #555',
  },
  timeCell: {
    padding: '10px',
    borderBottom: '1px solid #555',
    textAlign: 'center',
  },
  actionCell: {
    padding: '10px',
    borderBottom: '1px solid #555',
    textAlign: 'center',
  },
  startButton: {
    padding: '8px',
    backgroundColor: '#4CAF50', // Green button color
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
  },
  completeButton: {
    padding: '8px',
    backgroundColor: '#61dafb',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
  },
  overdueRow: {
    animation: 'blinkingBorder 1s infinite',
  },
};

const keyframes = {
  '@keyframes blinkingBorder': {
    '0%': {
      borderColor: 'transparent',
    },
    '50%': {
      borderColor: 'red',
    },
    '100%': {
      borderColor: 'transparent',
    },
  },
};

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [eta, setEta] = useState('');

  const handleAddTodo = () => {
    if (newTodo.trim() !== '' && eta.trim() !== '') {
      const etaInMinutes = parseInt(eta, 10);
      if (!isNaN(etaInMinutes) && etaInMinutes > 0) {
        setTodos([
          ...todos,
          { text: newTodo, id: Date.now(), startTime: null, endTime: new Date(), eta: etaInMinutes, timeTaken: null },
        ]);
        setNewTodo('');
        setEta('');
      }
    }
  };

  const handleStart = (id) => {
    setTodos((prevTodos) => {
      return prevTodos.map((todo) => {
        if (todo.id === id && todo.startTime === null) {
          return { ...todo, startTime: new Date(), endTime: null, timeTaken: null };
        }
        return todo;
      });
    });
  };

  const handleComplete = (id) => {
    setTodos((prevTodos) => {
      return prevTodos.map((todo) => {
        if (todo.id === id && todo.startTime !== null && todo.endTime === null) {
          const endTime = new Date();
          const timeTakenInMinutes = (endTime - todo.startTime) / (1000 * 60);
          return { ...todo, endTime, timeTaken: timeTakenInMinutes };
        }
        return todo;
      });
    });
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTodos((prevTodos) => {
        return prevTodos.map((todo) => {
          if (todo.startTime !== null && todo.endTime === null) {
            const currentTime = new Date();
            const elapsedTimeInSeconds = (currentTime - todo.startTime) / 1000;
            if (elapsedTimeInSeconds > todo.eta) {
              return { ...todo, isOverdue: !todo.isOverdue };
            }
          }
          return todo;
        });
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Todo List with ETA</h2>
      <div style={styles.inputContainer}>
        <input
          type="text"
          placeholder="Add a new task..."
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="ETA in minutes"
          value={eta}
          onChange={(e) => setEta(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleAddTodo} style={styles.addButton}>
          Add Task
        </button>
      </div>
      <style>{Object.values(keyframes).join('')}</style>
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Task</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>ETA (min)</th>
            <th>Time Taken (min)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {todos.map((todo) => (
            <tr key={todo.id} style={todo.isOverdue ? styles.overdueRow : null}>
              <td style={styles.todoCell}>{todo.text}</td>
              <td style={styles.timeCell}>{todo.startTime ? todo.startTime.toLocaleTimeString() : '-'}</td>
              <td style={styles.timeCell}>{todo.endTime ? todo.endTime.toLocaleTimeString() : new Date().toLocaleTimeString()}</td>
              <td style={styles.timeCell}>{todo.eta}</td>
              <td style={styles.timeCell}>{todo.timeTaken !== null ? todo.timeTaken.toFixed(2) : '-'}</td>
              <td style={styles.actionCell}>
                {!todo.startTime ? (
                  <button onClick={() => handleStart(todo.id)} style={styles.startButton}>
                    Start
                  </button>
                ) : !todo.endTime ? (
                  <button onClick={() => handleComplete(todo.id)} style={styles.completeButton}>
                    Complete
                  </button>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TodoList;
