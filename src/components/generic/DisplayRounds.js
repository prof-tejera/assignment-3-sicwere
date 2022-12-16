import React, { useContext } from "react";
import { useSearchParams } from 'react-router-dom';
import EditableInput from "./EditableInput";
import { TimerContext } from '../../App'

const DisplayRounds = ({currentRound, numRounds, index, size, text, gap, rounds, ...props}) => {
    const { timers, editTimer } = useContext(TimerContext)
    const [, setTimerParams] = useSearchParams()
	currentRound ||= 1
	numRounds ||= 1
	gap ||= '48px'
	size ||= '5'
  	const changeRounds = () => {
		const newRounds = parseInt(prompt('Enter new number of rounds, or leave field blank to keep the current number of rounds', numRounds)) || numRounds
		if(newRounds !== numRounds) {
			editTimer(index, { rounds: newRounds })
			const workout = btoa(JSON.stringify(timers))
			setTimerParams({ 'workout': workout })
		}
  	}
	return (
		<EditableInput text={text} size={size} gap={gap} value={currentRound} index={index} action={changeRounds} {...props} />
	)
}

export default DisplayRounds;