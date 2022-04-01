import {rest} from 'msw';

import {data} from './mock-data/data';

import {subjects} from './mock-data/subjects';
import {quarters} from './mock-data/quarters';
import {
  cse_instructors,
  math_instructors
} from './mock-data/instructors';
import {
  cse_sp21_courses,
  math_sp21_courses
} from './mock-data/courses';
import {
  schedules
} from './mock-data/schedules';
import logger from '../utils/logger'


const REACT_APP_API_ENDPOINT_BASE = process.env.REACT_APP_API_ENDPOINT_BASE;


const fromBase = (path) => {
  return `${REACT_APP_API_ENDPOINT_BASE}${path}`;
};


const okWithData = (data) => {
  return {
    message: 'OK',
    data: data
  };
};


export const handlers = [

  rest.get(fromBase('/subjects'), (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(okWithData(subjects))
    )
  }),

  rest.get(fromBase('/quarters'), (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(okWithData(quarters))
    );
  }),

  rest.get(fromBase('/course_offerings'), (req, res, ctx) => {
    const subjectCode = req.url.searchParams.get('subject_code');
    const quarterCode = req.url.searchParams.get('quarter_code');
    let error = false;
    let returnData = null;
    if (quarterCode === 'SP21') {
      switch (subjectCode) {
        case 'CSE':
          returnData = cse_sp21_courses;
          break;
        case 'MATH':
          returnData = math_sp21_courses;
          break;
        default:
          error = true;
      }
      // All other quarters aside from SP22 are currently unhandled.
    } else {
      error = true;
    }

    if (error)
      return res(
        ctx.status(404),
      )
    else
      return res(
        ctx.status(200),
        ctx.json(okWithData(returnData))
      )

  }),


  rest.get(fromBase('/instructors'), (req, res, ctx) => {
    const subjectCode = req.url.searchParams.get('subject_code');
    const courseNumber = req.url.searchParams.get('course_number');
    const quarterCode = req.url.searchParams.get('quarter_code');
    let error = false;
    let returnData = null;
    switch (subjectCode) {
      case 'CSE':
        returnData = cse_instructors;
        break;
      case 'MATH':
        returnData = math_instructors;
        break;
      default:
        error = true;
    }
    
    if (error) 
      return res(
        ctx.status(404),
      )
    else
        return res(
          ctx.status(200),
          ctx.json(okWithData(returnData))
        )
  }),


  rest.post(fromBase('/schedules'), (req, res, ctx) => {
    logger(`CLIENT REQUEST FOR SCHEDULES WITH INFO: \n${JSON.stringify(req.body)}`)

    // Get the body. 
    // If there are three courses, just return an error.
    // otherwise, just return the default schedule.
    return res(
      ctx.status(201),
      ctx.json(okWithData({schedule_id: 'test-id'}))
    );
  }),


  rest.get(fromBase('/schedules/*'), (req, res, ctx) => {
    // Just return the default schedule.
    return res(
      ctx.status(200),
      ctx.json(okWithData(schedules))
    )
  })

];