import React, { useState, useEffect, useContext } from "react";
import { useSearchParams } from 'react-router-dom';
import { TimerContext } from '../../App'
import { calcTotalSeconds } from '../../utils/helpers'
import styled from "styled-components";

const AddTimerTable = styled.table`
	margin: 10px;
`
const AddTimerDataCell = styled.td`
	padding: 20px;
`
const AddTimerButton = styled.button`
  text-align: center;
  margin-top: 15px;
  background-color: blue;
  color: white;
  font-size: 15px;
  width: 200px;
  height: 50px
`

const AddTimerComponent = () => {
	const [timerMessage, setTimerMessage] = useState('Start Time')
	const [roundsHidden, setRoundsHidden] = useState({ visibility: 'hidden' })
	const [restTimeHidden, setRestTimeHidden] = useState({ visibility: 'hidden' })
	const [timer, setTimer] = useState('')
	const [time, setTime] = useState(1)
	const [restTime, setRestTime] = useState(0)
	const [rounds, setRounds] = useState(1)
	const [description, setDescription] = useState('')
  	const [, setTimerParams] = useSearchParams()
	const { timers, addTimer, setCurrentTimer, setIsWorkoutOngoing, setElapsedTime } = useContext(TimerContext)
	
	useEffect(() => {
		setCurrentTimer(0)
		setIsWorkoutOngoing(false)
		setElapsedTime(0)
	})
	const newTimer = () => {
		if(!timer) {
			alert('Please select a timer.')
			return
		}
		if(!time) {
			alert(`Please enter the ${timerMessage.toLowerCase()}.`)
			return
		}
		if(timer === 'Tabata') {
			if(!restTime) {
				alert('Please enter the rest time')
				return
			}
			if(!rounds) {
				alert('Please enter the number of rounds.')
				return
			}
		}
		if(timer === 'XY' && !rounds) {
			alert('Please enter the number of rounds.')
			return
		}
		try
		{
			const newTimer = { title: timer, time: time, description: description }
			if(timer === 'XY' || timer === 'Tabata')
				newTimer.rounds = rounds
			if(timer === 'Tabata')
				newTimer.restTime = restTime
			newTimer.totalSeconds = calcTotalSeconds(newTimer.time + (newTimer.restTime || 0), newTimer.rounds || 1)
			addTimer(newTimer)
			const workout = btoa(JSON.stringify(timers))
			setTimerParams({ 'workout': workout })
			alert(`${timer} successfully created.`)
		}
		catch(error)
		{
			alert(error)
		}
	}
	return (
		<AddTimerTable>
			<tbody>
				<tr>
					<AddTimerDataCell>
						<input type="radio" name="radioTimer" value="Countdown" onChange={ (e) => { setTimer(e.target.value); setTimerMessage('Start Time'); setRoundsHidden({ visibility: 'hidden' }); setRestTimeHidden({ visibility: 'hidden' }); }} />Countdown
					</AddTimerDataCell>
					<AddTimerDataCell>
						<input type="radio" name="radioTimer" value="Stopwatch" onChange={ (e) => { setTimer(e.target.value); setTimerMessage('End Time'); setRoundsHidden({ visibility: 'hidden' }); setRestTimeHidden({ visibility: 'hidden' }); }} />Stopwatch
					</AddTimerDataCell>
					<AddTimerDataCell>
						<input type="radio" name="radioTimer" value="XY" onChange={ (e) => { setTimer(e.target.value); setTimerMessage('Start Time'); setRoundsHidden({ visibility: 'visible' }); setRestTimeHidden({ visibility: 'hidden' }); }} />XY
					</AddTimerDataCell>
					<AddTimerDataCell>
						<input type="radio" name="radioTimer" value="Tabata" onChange={ (e) => { setTimer(e.target.value); setTimerMessage('Work Time'); setRoundsHidden({ visibility: 'visible' }); setRestTimeHidden({ visibility: 'visible' }); }} />Tabata
					</AddTimerDataCell>
				</tr>
				<tr>
					<AddTimerDataCell>
						{timerMessage}: <input type="number" size="10" min="1" value={time} onChange={ (e) => { setTime(parseInt(e.target.value)) }} />
					</AddTimerDataCell>
					<AddTimerDataCell style={restTimeHidden} >
						Rest Time: <input type="number" size="10" min="1" value={restTime} onChange={ (e) => { setRestTime(parseInt(e.target.value)) }} />
					</AddTimerDataCell>
					<AddTimerDataCell style={roundsHidden}>
						Rounds: <input type="number" size="10" min="1" value={rounds} onChange={ (e) => { setRounds(parseInt(e.target.value)) }} />
					</AddTimerDataCell>
					<AddTimerDataCell>
						&nbsp;
					</AddTimerDataCell>
				</tr>
				<tr>
					<AddTimerDataCell colSpan="4">
						Description: <input type="text" size="50" value={description} onChange={e => setDescription(e.target.value)} />
					</AddTimerDataCell>
				</tr>
				<tr>
					<AddTimerDataCell colSpan="4">
						<AddTimerButton onClick={newTimer}>Add Timer</AddTimerButton>
					</AddTimerDataCell>
				</tr>
			</tbody>
		</AddTimerTable>
	)
}

export default AddTimerComponent