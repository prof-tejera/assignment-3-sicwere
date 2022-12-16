const Input = ({label, gap, ...props}) => {
  gap ||= '5px'
  return (
    <label style={{ fontSize: '20px', marginTop: '15px' }}>
      {label}
      <input style={{ marginLeft: gap }} {...props} />
    </label>
  )
};

export default Input;
