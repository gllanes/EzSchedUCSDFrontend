function SelectedCourse(props) {

  const {
    course,
    onCourseInstructorPreferenceChange,
    onClick
  } = props;

  const {
    subject_code,
    number,
    title,
    instructors,
    preferredInstructor,
  } = course;

  const courseDisplay = `${subject_code} ${number} - ${title}`;

  let options;
  if (instructors.length === 0) {
    options = [
      <option key="NONE" value="">--- No instructors available ---</option>
    ];
  } else {
    options = instructors.map(instructor =>
      <option key={instructor} value={instructor}>{instructor}</option>
    );
    options.unshift(<option key="NONE" value="">--- No preferred instructor selected ---</option>);
  }
  
  return (
    <li>
      {courseDisplay}
      <div style={{textAlign: "left"}}>
        <div>
          <select
            value={preferredInstructor}
            onChange={(event) => { onCourseInstructorPreferenceChange(event, subject_code, number) }}
          >
            {options}
          </select>
        </div>
        <div>
          <button
            onClick={(event) => onClick(event, subject_code, number)}
          >
            Remove course
          </button>
        </div>
      </div>
    </li>
  );
}


export default function SelectedCourses(props) {
  const {
    addedCourses,
    onCourseInstructorPreferenceChange,
    onClick,
  } = props;


  let coursesElements;
  if (addedCourses.length === 0) {
    coursesElements = [
      <li key="NONE"> No courses added. Add a course from above!</li>
    ];
  } else {
    coursesElements = addedCourses.map(course =>
      <SelectedCourse 
        key={`${course.subject_code} ${course.number}`}
        course={course}
        onCourseInstructorPreferenceChange={onCourseInstructorPreferenceChange}
        onClick={onClick}
      />
    )
  }

  return (
    <ul>
      {coursesElements}
    </ul>
  );


}