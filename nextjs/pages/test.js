import Application from '/components/layout/application'
import {apiTest} from '/lib/get_api'

export async function getServerSideProps (context) {
  const [categories, frameworks] = await apiTest(context);
  return {
    props: {
      categories,
      frameworks,
    }
  }
}


export default function Test ({categories, frameworks}) {
  return (
    <>
      <h2>Categories</h2>
      { categories.map((category, i) => <p key={i}>{ category.name }</p>)}
      <h2>Frameworks</h2>
      { frameworks.map((framework, i) => <p key={i}>{ framework.name }</p>)}
    </>
  )
}
