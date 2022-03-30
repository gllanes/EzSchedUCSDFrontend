export default function GetSchedulesButton(props) {
  const {
    onClick
  } = props;

  return (
    <div>
      <button onClick={onClick}>Get schedules</button>
    </div>
  );
}