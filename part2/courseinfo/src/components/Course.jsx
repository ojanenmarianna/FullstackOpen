const Header = ({ course }) =>
  <h3>{course.name}</h3>

const Part = ({ part }) => 
  <p>{part.name} {part.exercises}</p>
  
const Content = ({ parts }) =>{
  return (
    <div>
      {parts.map(part => 
        <Part key={part.id} part={part} />
      )}
    </div>
  )
}

const Total = ({parts}) => {
  const sum = parts.reduce((s, part) => s + part.exercises, 0)
  return(
    <div>
      <b>total of {sum} exercises</b>
    </div>
  )
}

const Course = ({course}) => 
  <div>
    <Header course={course} />
    <Content parts={course.parts} />
    <Total parts={course.parts} />
  </div>

export default Course