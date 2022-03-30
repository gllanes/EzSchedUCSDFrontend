import { camelCase, isObject, snakeCase } from "lodash";

const JSONSnakeCaseToCamelCase = (obj) => {
  // object - can be array or regular "map"
  if (isObject(obj)) {
    if (Array.isArray(obj)) {
      // recurse on each value in the array
      return obj.map(val => JSONSnakeCaseToCamelCase(val));
    } 

    // regular "map"
    else {
      const newObj = {};
      // convert all keys to camelCase
      for (const key of Object.keys(obj)) {
        if (key === "meta") {
          newObj[key] = obj[key];
        } else {
          newObj[camelCase(key)] = JSONSnakeCaseToCamelCase(obj[key]);
        }
      }
      return newObj;
    }
  }

  // If it isn't an object (primitive), keep the same.
  return obj;

}


const JSONCamelCaseToSnakeCase = (obj) => {
  if (isObject(obj)) {
    if (Array.isArray(obj)) {
      // recurse on each value in the array
      return obj.map(val => JSONCamelCaseToSnakeCase(val));
    } 

    // regular "map"
    else {
      const newObj = {};
      // convert all keys to camelCase
      for (const key of Object.keys(obj)) {
        newObj[snakeCase(key)] = JSONCamelCaseToSnakeCase(obj[key]);
      }
      return newObj;
    }
  }

  // If it isn't an object (primitive), keep the same.
  return obj;
}


export {
  JSONCamelCaseToSnakeCase,
  JSONSnakeCaseToCamelCase
}