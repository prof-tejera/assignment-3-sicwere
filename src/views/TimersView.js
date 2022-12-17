import React, { useEffect, useContext } from "react";
import { useSearchParams } from 'react-router-dom';
import styled from "styled-components";
import Button from "../components/generic/Button";
import Stopwatch from "../components/timers/Stopwatch";
import Countdown from "../components/timers/Countdown";
import XY from "../components/timers/XY";
import Tabata from "../components/timers/Tabata";
import { TimerContext } from '../App'

const Timers = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
`;

const Timer = styled.div`
  border: 1px solid gray;
  padding: 20px;
  margin: 10px;
  font-size: 1.5rem;
`;

const TimerTitle = styled.div`
  font-family: Times New Roman, serif
`;

const TotalTime = styled.div`
  text-align: center;
  font-size: 20px;
  font-weight: bold;
`
const StartButton = styled.div`
  text-align: center;
  margin-top: 15px;
`

const TimersView = () => {
  const { timers, setTimer, setCurrentTimer, isWorkoutOngoing, setIsWorkoutOngoing, totalSeconds, elapsedTime, setElapsedTime } = useContext(TimerContext)
  const [timerParams, setTimerParams] = useSearchParams()

  const playStyle = {
    backgroundColor: isWorkoutOngoing ? 'green' : 'gray',
    width: "200px", 
    height: "50px"
  }

  const restart = () => {
    setIsWorkoutOngoing(false)
    setCurrentTimer(0)
    setElapsedTime(0)
    localStorage.removeItem('current_workout')
  }
 
  useEffect(() => {
    const params = timerParams.get('workout')
    const workout = params ? JSON.parse(atob(params)) : null
    if((!timers || timers.length === 0) && workout && workout.length)  {
      setTimer(workout)
      const savedWorkout = localStorage.getItem('current_workout')
      if(savedWorkout) {
        const saved = JSON.parse(savedWorkout)
        setCurrentTimer(saved.timer)
        setElapsedTime(saved.elapsed)
        setIsWorkoutOngoing(true)
      }
    }
    else {
      const workout = btoa(JSON.stringify(timers))
      setTimerParams({ 'workout': workout })
    }
  }, [timers, setTimer, setCurrentTimer, setElapsedTime, setIsWorkoutOngoing, timerParams, setTimerParams])

  return (
    <>
      <TotalTime>
        Workout time remaining: { totalSeconds - elapsedTime } seconds.
      </TotalTime>
      <StartButton>
        <Button text="Restart Workout" style={playStyle} onClick={() => { restart() }} />
      </StartButton>
      <Timers>
        {timers.map((timer, index) => {
          return <Timer key={`timer-${index}`}> 
                    <TimerTitle>{timer.title}</TimerTitle>
                    {timer.title === 'Countdown' ? <Countdown startTime={timer.time} index={index} description={timer.description} /> 
                    : timer.title === 'Stopwatch' ? <Stopwatch endTime={timer.time} index={index} description={timer.description} /> 
                    : timer.title === 'XY' ? <XY startTime={timer.time} rounds={timer.rounds} index={index} description={timer.description} /> 
                    : <Tabata workTime={timer.time} restTime={timer.restTime} rounds={timer.rounds} index={index} description={timer.description} />}
                  </Timer>
        })}
      </Timers>
    </>
  );
};

export default TimersView;
