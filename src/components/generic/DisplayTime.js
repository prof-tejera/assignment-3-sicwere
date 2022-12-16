import React, { useContext } from "react";
import { useSearchParams } from 'react-router-dom';
import EditableInput from "./EditableInput";
import { TimerContext } from '../../App'

const DisplayTime = ({currentTime, chosenTime, changeTime, index, size, text, gap, ...props}) => {
    const { timers, editTimer } = useContext(TimerContext)
    const [, setTimerParams] = useSearchParams()
	currentTime ||= 0
	gap ||= '57px'
	size ||= '10'
  	changeTime ||= () => {
		const newTime = parseInt(prompt('Enter new time, or leave field blank to keep the current time', chosenTime)) || chosenTime
		if(newTime !== chosenTime) {
			editTimer(index, {  time: newTime })
			const workout = btoa(JSON.stringify(timers))
			setTimerParams({ 'workout': workout })
		}
  	}
	return (
		<EditableInput text={text} gap={gap} size={size} value={currentTime} index={index} action={changeTime} {...props} />
	)
}

export default DisplayTime;