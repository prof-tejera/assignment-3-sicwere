import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import EditableInput from "./EditableInput";
import Panel from "./Panel";
import Button from "./Button";
import { TimerContext } from '../../App'

const TimerControls = ({play, clearElapsed, playDisabled, reset, resetDisabled, fastForward, fastForwardDisabled, index, description }) => {
	const { timers, currentTimer, editTimer, moveTimer, removeTimer, isWorkoutOngoing, setIsWorkoutOngoing } = useContext(TimerContext)
	const playIcon = String.fromCodePoint(0x25B6)
	const pauseIcon = String.fromCodePoint(0x23F8)
	const [toggleTime, setTimerToggle] = useState(true)
	const [playButtonText, setPlayButtonText] = useState(playIcon)
    const [, setTimerParams] = useSearchParams()
    index ||= 0
	const playStyle = {
		backgroundColor: playDisabled ? 'gray' : 'green'
	}
	const resetStyle = {
		backgroundColor: resetDisabled ? 'gray' : 'blue',
		fontWeight: 'bold'
	}
	const fastForwardStyle = {
		backgroundColor: fastForwardDisabled ? 'gray' : 'red',
	}
	const togglePlay = () => {
		setIsWorkoutOngoing(true)
		play(toggleTime)
		setPlayButtonText(toggleTime ? pauseIcon : playIcon)
		setTimerToggle(!toggleTime)
	}
	const changeOrder = () => {
		const newIndex = parseInt(prompt('Enter position to move timer, or leave field blank to keep the current position', index)) ?? index
		if(newIndex !== index)
			moveTimer(index, newIndex)
  	}
  	const changeDesc = () => {
		const newDesc = prompt('Enter a new description', description)
		editTimer(index, {  description: newDesc })
  	}
  	const deleteTimer = () => {
  		clearElapsed()
  		play(false)
  		removeTimer(index)
  		const workout = btoa(JSON.stringify(timers))
  		setTimerParams({ 'workout': workout }) 
  	}
	useEffect(() => {
		if(isWorkoutOngoing && currentTimer === index) {
			setTimerToggle(false)
			setPlayButtonText(pauseIcon)
		}
	}, [isWorkoutOngoing, currentTimer, index, pauseIcon])
	useEffect(() => {
		if(resetDisabled === 'disabled') {
			setTimerToggle(true)
			setPlayButtonText(playIcon)
		}
	},[resetDisabled, playIcon])
	return (
		<>
			<Panel>
				<EditableInput text="Order:" gap='54px' size="4" value={index} index={index} action={changeOrder} />
			</Panel>
			<Panel>
				<EditableInput text="Description:" gap='5px' size="20" value={description} index={index} action={changeDesc} />
			</Panel>
			<Panel style={{ marginTop: '15px' }}>
				<Button text={playButtonText} style={playStyle} disabled={playDisabled} onClick={() => { togglePlay() }} />
				<Button text="&#8634;" style={resetStyle} disabled={resetDisabled} onClick={() => { reset() }} />
				<Button text="&#9658;&#9658;" disabled={fastForwardDisabled} style={fastForwardStyle} onClick={() => { fastForward() }} />
				<Button text="X" style={{ backgroundColor: 'black' }} onClick={() => { deleteTimer() }} />
			</Panel>
		</>
	)
}

export default TimerControls;