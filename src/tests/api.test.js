import { 
  getScheduleMeetings,
  getScheduleMeta,
  getScheduleFinals
} from '../api/utils';

import {data} from '../mocks/mock-data/data';

const sum = (x, y) => {
  return x + y;
}

test('adds 1 + 2 = 3', () => {
  expect(sum(1, 2)).toBe(3);
});


test('extracts schedule meta information from keys correctly', () => {
  const courseMeta = getScheduleMeta(data.schedules.schedules[0]);
  expect(courseMeta).toHaveLength(1);
  expect(courseMeta).toStrictEqual(['CSE 8A D51']);
});


test('extracts all meetings from a schedule correctly', async () => {
  const firstSchedule = data.schedules.schedules[0];
  const meetings = getScheduleMeetings(firstSchedule);
  expect(meetings).toHaveLength(3);
  const expectedMeetingIds = new Set([1275, 1277, 1273]);
  let actualIds = meetings.map(meeting => {
    return meeting.id;
  });
  expect(expectedMeetingIds).toStrictEqual(new Set(actualIds));
});


test('extracts all finals from a schedule correctly', async () => {
  const firstSchedule = data.schedules.schedules[0];
  const finals = getScheduleFinals(firstSchedule);
  expect(finals).toHaveLength(1);
  const expectedFinalsIds = new Set([1278]);
  let actualIds = finals.map(meeting => {
    return meeting.id;
  }); 
  expect(expectedFinalsIds).toStrictEqual(new Set(actualIds));
});