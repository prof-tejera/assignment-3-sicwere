import SimpleTimer from './SimpleTimer';

const Countdown = ({startTime, index, description}) => {
	return (
		<SimpleTimer startTime={startTime} endTime="0" interval="-1" index={index} description={description}/>
	)
};
export default Countdown;
