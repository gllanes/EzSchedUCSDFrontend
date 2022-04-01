import axios from "axios";
import logger from '../utils/logger';

const API_ENDPOINT_BASE=process.env.REACT_APP_API_ENDPOINT_BASE;

// Wait for api response for schedules.
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class API {
  
  static axiosPromiseRejected(error, resourceNotFoundMessage) {
    if (error.response) {
      if (error.response.status === 404) {
        return Promise.reject(new Error(resourceNotFoundMessage));
      } else if (error.response.status === 500) {
        return Promise.reject(new Error("API encountered an internal server error."));
      }
      return Promise.reject(new Error("API returned unknown status code."));
    } else if (error.request) {
      return Promise.reject(new Error("Unable to connect to API."));
    } else {
      return Promise.reject(new Error("Bad API request."));
    }
  }

  /**
   * Fetch all subjects from the API. These are generally unchanging.
   */
  static getSubjects() {
    return axios({
      method: "get",
      url: "/subjects",
      baseURL: API_ENDPOINT_BASE
    })
      .then(response => {
        return response.data.data;
      })
      .catch(error => {
        return API.axiosPromiseRejected(error, "Unable to get subjects.");
      });
  }

  static getQuarters() {
    return axios({
      method: "get",
      url: "/quarters",
      baseURL: API_ENDPOINT_BASE
    })
      .then(response => {
        return response.data.data;
      })
      .catch(error => {
        return API.axiosPromiseRejected(error, "Unable to get quarters.");
      });
  }

  static getCourses(quarterCode, subjectCode) {
    return axios({
      method: "get",
      url: "/course_offerings",
      baseURL: API_ENDPOINT_BASE,
      params: {
        "quarter_code": quarterCode,
        "subject_code": subjectCode
      }
    })
      .then(response => {
        return response.data.data;
      })
      .catch(error => {
        return API.axiosPromiseRejected(error, "No courses found for selected subject/quarter.");
      });
  }


  static getInstructors(quarterCode, subjectCode, courseNumber) {
    return axios({
      method: "get",
      url: "/instructors",
      baseURL: API_ENDPOINT_BASE,
      params: {
        "quarter_code": quarterCode,
        "subject_code": subjectCode,
        "course_number": courseNumber
      }
    })
      .then(response => {
        return response.data.data;
      })
      .catch(error => {
        return API.axiosPromiseRejected(error, "No instructors available for selected course.");
      })
  }

  static postSchedules(quarterCode, courses, preferredStartTime) {

    let coursesJSON = courses.map(course => {
      let d = {
        "subject_code": course.subject_code,
        "number": course.number,
      };
      if (course.preferredInstructor)
        d.preferred_instructor = course.preferredInstructor;
      return d;
    }); 

    let requestBodyJSON = {
      "quarter_code": quarterCode,
      "courses": coursesJSON
    };

    if (preferredStartTime)
      requestBodyJSON.preferred_start_time = preferredStartTime;

    logger("request body schedules");
    logger(JSON.stringify(requestBodyJSON));

    return axios({
      method: "post",
      url: "/schedules",
      baseURL: API_ENDPOINT_BASE,
      headers: {
        "Content-Type": "application/json"
      },
      data: requestBodyJSON
    })
      .then(response => {
        return response.data.data.schedule_id;
      })
      .catch(error => {
        logger(error);
        return API.axiosPromiseRejected(error, "Unable to post schedules to API.");
      })
  }

  static async getSchedules(scheduleId) {
    // Important: the schedule might not be generated instantly, so 
    // we might have to try multiple times with some time in between.

    // Try a maximum of seven times to get the schedule, sleeping
    // for one second between each try
    let tries = 7;
    var response;
    try {
      while (tries >= 0) {
        response = await axios({
          method: 'get',
          url: `/schedules/${scheduleId}`,
          baseURL: API_ENDPOINT_BASE
        });
        if (response.status === 200)
          return response.data.data;
        tries = tries - 1;
        await sleep(1000);
      }
    } catch (error) {
      throw Error('An error occurred while trying to retrieve schedules.');
    }

    // If we make it here, then we have tried the max amount of times 
    // and should return an error.
    throw Error('Unable to retrieve schedules from API.');
  }

}

export {
  API
};