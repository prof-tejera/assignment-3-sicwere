import React, { useState, useEffect, useContext } from 'react';
import Panel from "../generic/Panel";
import DisplayTime from "../generic/DisplayTime";
import TimerControls from "../generic/TimerControls";
import { TimerContext } from '../../App'

const SimpleTimer = ({startTime, endTime, interval, index, description}) => {
	startTime = parseInt(startTime)
	endTime = parseInt(endTime)
	interval = parseInt(interval)
	index = parseInt(index)
	const isCountdown = startTime > endTime
	const chosenTime = isCountdown ? startTime : endTime
	const [currentTime, setCurrentTime] = useState(startTime)
	const [timerIsRunning, setTimerIsRunning] = useState(false)
	const { isWorkoutOngoing, currentTimer, setCurrentTimer, elapsedTime, setElapsedTime } = useContext(TimerContext)
	const [playDisabled, setPlayDisabled] = useState(index === currentTimer ? '' : 'disabled')
	const [resetDisabled, setResetDisabled] = useState('disabled')
	const [fastForwardDisabled, setFastForwardDisabled] = useState('disabled')
	const startTimer = (isRunning) => {
		setTimerIsRunning(isRunning)
		setResetDisabled('')
		setFastForwardDisabled('')
	}
	const resetTimer = () => {
		clearElapsedTime()
		setCurrentTime(startTime)
		setPlayDisabled('')
		setResetDisabled('disabled')
		setFastForwardDisabled('disabled')
		setTimerIsRunning(false)
	}
	const endTimer = () => {
		setElapsedTime(elapsedTime + (isCountdown ? currentTime : endTime - currentTime))
		setCurrentTime(endTime)
		setPlayDisabled('disabled')
		setResetDisabled('disabled')
		setFastForwardDisabled('disabled')
		setTimerIsRunning(false)
		setCurrentTimer(currentTimer + 1)
	}
	const clearElapsedTime = () => {
		setElapsedTime(elapsedTime - (isCountdown ? startTime - currentTime : currentTime))
  	}
	useEffect(() => {
		if(!isWorkoutOngoing) {
			setTimerIsRunning(false)
			setCurrentTime(startTime)
			setPlayDisabled('disabled')
			setResetDisabled('disabled')
			setFastForwardDisabled('disabled')
		}
		if(currentTimer === index)
			setPlayDisabled('')
		if(isWorkoutOngoing && currentTimer === index) {
			const savedWorkout = localStorage.getItem('current_workout')
      		if(savedWorkout) {
        		const saved = JSON.parse(savedWorkout)
		        if(saved.timer === index) {
		        	setCurrentTime(saved.time)
		        }
		      }
			startTimer(true)
		}
	}, [isWorkoutOngoing, currentTimer, index, setTimerIsRunning, startTime])
	
	useEffect(() => {
		const t = setInterval(() => {
			if(timerIsRunning) {
				setElapsedTime(elapsedTime + 1)
				if(currentTime !== endTime + (-interval))
					setCurrentTime(currentTime + interval)
				else {
					setPlayDisabled('disabled')
					setResetDisabled('disabled')
					setFastForwardDisabled('disabled')
					setTimerIsRunning(false)
					setCurrentTime(endTime)
					setCurrentTimer(currentTimer + 1)
				}
				localStorage.setItem('current_workout', JSON.stringify({ timer: currentTimer, time: currentTime, elapsed: elapsedTime }))
			} 
			else
				clearInterval(t)
		}, 1000)
		return () => {
			clearInterval(t)
		}
	}, [timerIsRunning, currentTime, endTime, interval, currentTimer, setCurrentTimer, index, elapsedTime, setElapsedTime])
	return (
		<Panel>
			<DisplayTime currentTime={currentTime} chosenTime={chosenTime} index={index} size="9" text="Time: " />
			<TimerControls play={startTimer} clearElapsed={clearElapsedTime} playDisabled={playDisabled} reset={resetTimer} fastForward={endTimer} resetDisabled={resetDisabled} 
				fastForwardDisabled={fastForwardDisabled} index={index} description={description} />
		</Panel>
	)
};
export default SimpleTimer;