import React, { useState, useEffect, useContext } from 'react';
import Panel from "../generic/Panel";
import DisplayTime from "../generic/DisplayTime";
import DisplayRounds from "../generic/DisplayRounds";
import TimerControls from "../generic/TimerControls";
import { TimerContext } from '../../App'

const Tabata = ({workTime, restTime, rounds, index, description}) => {
	workTime = parseInt(workTime)
	restTime = parseInt(restTime)
	rounds = parseInt(rounds) || 1
	const roundTime = workTime + restTime
	const workText = 'Work:'
	const restText = 'Rest:'
	const workGap = '59px'
	const restGap = '69px'
	const [currentTime, setCurrentTime] = useState(workTime)
	const [currentRound, setCurrentRound] = useState(1)
	const [timerIsRunning, setTimerIsRunning] = useState(false)
	const [isWorking, setIsWorking] = useState(true)
	const [currentMessage, setCurrentMessage] = useState(`${currentRound} of ${rounds}`)
	const { isWorkoutOngoing, editTimer, currentTimer, setCurrentTimer, elapsedTime, setElapsedTime } = useContext(TimerContext)
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
		setCurrentTime(workTime)
		setCurrentRound(1)
		setIsWorking(true)
		setPlayDisabled('')
		setResetDisabled('disabled')
		setFastForwardDisabled('disabled')
		setCurrentMessage(`1 of ${rounds}`)
		setTimerIsRunning(false)
	}
	const endTimer = () => {
		setElapsedTime(elapsedTime + currentTime + (roundTime * (rounds - currentRound)) + (isWorking ? 0 : restTime))
		setCurrentTime(0)
	 	setCurrentRound(rounds)
	 	setIsWorking(false)
		setPlayDisabled('disabled')
		setResetDisabled('disabled')
		setFastForwardDisabled('disabled')
		setCurrentMessage(`${rounds} of ${rounds}`)
		setTimerIsRunning(false)
		setCurrentTimer(currentTimer + 1)
	}
	const changeTime = () => {
		const newWorkTime = parseInt(prompt('Enter new work time, or leave field blank to keep the current time', workTime)) || workTime
		const newRestTime = parseInt(prompt('Enter new rest time, or leave field blank to keep the current time', restTime)) || restTime
		editTimer(index, {  time: newWorkTime, restTime: newRestTime })
  	}
  	const clearElapsedTime = () => {
		setElapsedTime(elapsedTime + currentTime - (isWorking ? workTime : roundTime) - (roundTime * (currentRound - 1)))
  	}
	useEffect(() => {
		if(isWorkoutOngoing && currentTimer === index) {
			const savedWorkout = localStorage.getItem('current_workout')
      		if(savedWorkout) {
        		const saved = JSON.parse(savedWorkout)
		        if(saved.timer === index) {
		        	setCurrentTime(saved.time)
		        	setCurrentRound(saved.round)
		        	setIsWorking(saved.working)
		        }
		      }
			startTimer(true)
		}
	}, [isWorkoutOngoing, currentTimer, index])
	useEffect(() => {
		if(!isWorkoutOngoing) {
			setTimerIsRunning(false)
			setCurrentTime(workTime)
			setCurrentRound(1)
			setCurrentMessage(`${currentRound} of ${rounds}`)
			setIsWorking(true)
			setPlayDisabled('disabled')
			setResetDisabled('disabled')
			setFastForwardDisabled('disabled')
		}
		if(currentTimer === index)
			setPlayDisabled('')
	}, [isWorkoutOngoing, currentTimer, index, timerIsRunning, playDisabled, setTimerIsRunning, workTime, currentRound, rounds])
	useEffect(() => {
		const t = setInterval(() => {
			if(timerIsRunning) {
				setElapsedTime(elapsedTime + 1)
				if(currentTime > 1) {
					setCurrentTime(currentTime - 1)
				}
				else {
					if(isWorking) {
						setIsWorking(false)
						setCurrentTime(restTime)
					}
					else if(currentRound < rounds) {
						setCurrentRound(currentRound + 1)
						setCurrentTime(workTime)
						setIsWorking(true)
						setCurrentMessage(`${currentRound + 1} of ${rounds}`)
					}
					else {
						setCurrentTime(0)
						setPlayDisabled('disabled')
						setResetDisabled('disabled')
						setFastForwardDisabled('disabled')
						setTimerIsRunning(false)
						setCurrentTimer(currentTimer + 1)
					}
				}
				localStorage.setItem('current_workout', JSON.stringify({ 
					timer: currentTimer, time: currentTime, round: currentRound, working: isWorking, elapsed: elapsedTime
				}))
			}
			else
				clearInterval(t)
		}, 1000)
		return () => {
			clearInterval(t)
		}
	}, [timerIsRunning, workTime, restTime, rounds, isWorking, currentTime, currentRound, currentTimer, setCurrentTimer, elapsedTime, setElapsedTime])
	return (
			<Panel>
				<Panel>
					<DisplayTime currentTime={currentTime} changeTime={changeTime} index={index} size="7" text={isWorking ? workText : restText} gap={isWorking ? workGap : restGap} />
				</Panel>
				<Panel>
					<DisplayRounds currentRound={currentMessage} numRounds={rounds} index={index} size="7" text="Round:" />
				</Panel>
				<TimerControls play={startTimer} clearElapsed={clearElapsedTime} playDisabled={playDisabled} reset={resetTimer} fastForward={endTimer} resetDisabled={resetDisabled} 
					fastForwardDisabled={fastForwardDisabled} index={index} description={description} />
			</Panel>
		)
};

export default Tabata;
