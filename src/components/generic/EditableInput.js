import React, { useContext } from "react";
import Input from "./Input";
import Button from "./Button";
import { TimerContext } from '../../App'

const EditableInput = ({text, gap, size, value, index, action, ...props}) => {
	const { isWorkoutOngoing } = useContext(TimerContext)
	const isVisible = isWorkoutOngoing ? 'hidden' : 'visible'
	const handleChange = event => {
  		
  	}
	return (
		<>
			<Input label={text} type="text" gap={gap} size={size} onChange={handleChange} value={value} {...props} />
			<Button text="&#128393;" style={{ visibility: isVisible, backgroundColor: 'yellow', color: 'black', width: '21px', height: '21px', position: 'relative', top: '4px' }} 
				onClick={() => { action()}} />
		</>
	)
}

export default EditableInput;