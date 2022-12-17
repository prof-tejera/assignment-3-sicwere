import styled from "styled-components";

const Workouts = styled.div`
	  display: flex;
	  flex-direction: column;
	  flex-wrap: nowrap;
	  align-items: center;
	`

const NoHistory = styled.div`
	font-weight: bold;
	font-size: 25px;
`

const WorkoutTable = styled.table`
	margin: 20px;
`

const WorkoutCaption = styled.caption`
	font-weight: bold;
	font-size: 25px;
`
const WorkoutHeaderCell = styled.th`
	padding: 20px;
`

const WorkoutDataCell = styled.td`
	padding: 20px;
	text-align: center;
`
const HistoryView = () => {
  	const history = localStorage.getItem('workout_history')
  	const hasHistory = history ? 'none': 'block'
  	const workouts = history ? history.split('&').map((workout) => { return JSON.parse(workout) }) : []
	return (
		<Workouts>
			<NoHistory style={{ display: hasHistory }}>No completed workouts</NoHistory>
			{workouts.map((workout, index) => {
          		return <WorkoutTable key={`workout-${index}`}> 
          					<WorkoutCaption>{workout.when}</WorkoutCaption>
          					<thead>
          						<tr>
	          						<WorkoutHeaderCell>Timer</WorkoutHeaderCell>
	          						<WorkoutHeaderCell>Description</WorkoutHeaderCell>
	          						<WorkoutHeaderCell>Duration</WorkoutHeaderCell>
	      							<WorkoutHeaderCell>Rounds</WorkoutHeaderCell>
      							</tr>
							</thead>
							<tbody>
								{workout.timers.map((timer, i) => {
									return <tr key={`workout-${index}-${i}`}>
												<WorkoutDataCell>{timer.title}</WorkoutDataCell>
												<WorkoutDataCell>{timer.description}</WorkoutDataCell>
												<WorkoutDataCell>{timer.duration}</WorkoutDataCell>
												<WorkoutDataCell>{timer.rounds}</WorkoutDataCell>
											</tr>
								})}
							</tbody>
          				</WorkoutTable>
			})}
		</Workouts>
	)
}

export default HistoryView