import SimpleTimer from './SimpleTimer';

const Stopwatch = ({endTime, index, description}) => {
	return (
		<SimpleTimer startTime="0" endTime={endTime} interval="1" index={index} description={description} />
	)
};

export default Stopwatch;
