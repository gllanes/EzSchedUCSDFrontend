const timeRegex = /(\d{2}):(\d{2})(AM|PM)/;
const parseTime = (time) => {
  const match = time.match(timeRegex);
  var hour = match[1];
  const minute = match[2];
  var locale = match[3];
  if (locale === 'PM') {
    if (hour !== '12') {
      hour = String(parseInt(hour) + 12);
    }
  }
  return `${hour}:${minute}`
}


test('time parser works correctly', () => {
  expect(parseTime('03:30PM')).toBe('15:30');
  expect(parseTime('12:00PM')).toBe('12:00');
  expect(parseTime('04:45PM')).toBe('16:45');
});