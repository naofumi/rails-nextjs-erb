import Link from 'next/link'
import Image from 'next/image'

export default function CoursesList ({courses}) {
  return (
    <>
    <div>Count { courses.length }</div>
    { courses.map((course, i) => {
      return <div key={i}>
        <h3>
          <Link href={`courses/${course.id}`}>
            {course.title}
          </Link>
        </h3>
        <div>
          {course.description}
          { course.feature_image?.url &&
            <Image src={course.feature_image.url} alt="Course image" width="100" height="100"/>
          }
        </div>
      </div>
    })}
    </>
  )
}


