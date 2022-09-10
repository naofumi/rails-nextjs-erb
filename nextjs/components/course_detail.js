export default function CourseList({course}) {
  return (
    <>
    <h2>含まれる単元</h2>
    { course.units.map((unit, i) => {
      return <div key={i}>
        {unit.title}
      </div>
    })}
    </>
  )
}


