import React, { useState, useEffect, createContext } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import styled from "styled-components";
import DocumentationView from "./views/DocumentationView";
import TimersView from "./views/TimersView";
import AddTimerView from './views/AddTimerView'
import HistoryView from './views/HistoryView'
import {ErrorBoundary} from 'react-error-boundary'
import { calcTotalSeconds } from './utils/helpers'

const Container = styled.div`
  background: #f0f6fb;
  height: 100vh;
  overflow: auto;
`;

function ErrorFallback({error, resetErrorBoundary}) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
    </div>
  )
}

const Nav = ({URL}) => {
  return (
    <nav>
      <ul>
        <li>
          <Link to={URL}>Timers</Link>
        </li>
        <li>
          <Link to="/docs">Documentation</Link>
        </li>
        <li>
          <Link to="/add">Add Timer</Link>
        </li>
        <li>
          <Link to="/history">History</Link>
        </li>
      </ul>
    </nav>
  );
};

export const TimerContext = createContext(null)

const App = () => {
  const [timers, setTimer] = useState([])
  const [currentTimer, setCurrentTimer] = useState(0)
  const [isWorkoutOngoing, setIsWorkoutOngoing] = useState(false)
  const [totalSeconds, setTotalSeconds] = useState(0)
  const [elapsedTime, setElapsedTime] = useState(0)

  const addTimer = (timer) => {
    setTimer([...timers, timer])
  }
  const editTimer = (index, obj) => {
    timers[index] = { ...timers[index], ...obj }
    timers[index].totalSeconds = calcTotalSeconds(timers[index].time + (timers[index].restTime || 0), timers[index].rounds)
    setTimer([...timers])
  }
  const moveTimer = (oldIndex, newIndex) => {
    if(newIndex < 0 || newIndex >= timers.length ) {
      alert(`Order must be between 0 and ${timers.length - 1}.`)
      return
    }
    timers.splice(newIndex, 0, timers.splice(oldIndex, 1)[0])
    setTimer([...timers])
    console.log(timers)
  }
  const removeTimer = (removeIndex) => {
    setTimer(timers.filter((_, index) => { return index !== removeIndex }))
    localStorage.setItem('current_workout', '')
    if(timers.length === 0)
      setIsWorkoutOngoing(false)
  }
  useEffect(() => {
    setTotalSeconds(timers.reduce((total, current) => {
      return total + parseInt(current.totalSeconds)
    }, 0))
  }, [timers])

  useEffect(() => {
    if(currentTimer === timers.length)
      localStorage.removeItem('current_workout')
    if(currentTimer === timers.length && timers.length !== 0) {
      const dateTime = new Date().toLocaleString()
      const finishedTimers = timers.map((timer) => {
        const t = { title: timer.title, description: timer.description, duration: timer.totalSeconds}
        t.rounds = timer.title === 'Tabata' ? `${timer.rounds} rounds of ${timer.time} seconds of work time and ${timer.restTime} seconds of rest time.`
                          : timer.title === 'XY' ? `${timer.rounds} rounds of ${timer.time} seconds.`
                          : ' '
        return t
      })
      const workout = { when: dateTime, timers: finishedTimers }
      const workoutStr = JSON.stringify(workout)
      const history = localStorage.getItem('workout_history')
      if(!history)
        localStorage.setItem('workout_history', workoutStr)
      else
        localStorage.setItem('workout_history', `${history}&${workoutStr}`)
    }
  }, [currentTimer, timers])

  const timerObj = {
    timers,
    addTimer,
    editTimer,
    moveTimer,
    setTimer,
    removeTimer,
    currentTimer,
    setCurrentTimer,
    isWorkoutOngoing,
    setIsWorkoutOngoing,
    totalSeconds,
    elapsedTime,
    setElapsedTime
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <TimerContext.Provider value={timerObj}>
        <Container>
          <Router>
            <Nav URL="/"/>
            <Routes>
              <Route path="/docs" element={<DocumentationView />} />
              <Route path="/*" element={<TimersView />} />
              <Route path="/add" element={<AddTimerView />} />
              <Route path="/history" element={<HistoryView />} />
            </Routes>
          </Router>
        </Container>
      </TimerContext.Provider>
    </ErrorBoundary>
  );
};

export default App;
