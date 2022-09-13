import Application from '/components/layout/application'
import {apiGetMultiple} from '/lib/get_api'

export async function getServerSideProps (context) {
  return apiGetMultiple({
    context: context,
    requests: [
      {url: "http://web:3000/categories", options: {}},
      {url: "http://web:3000/frameworks", options: {}},
    ],
    success: (jsonResponses) => {
      const [categories, frameworks] = jsonResponses
      return {
        props: {
          categories: categories,
          frameworks: frameworks,
          breadcrumbs: [{}],
          actionButton: null
        }
      }
    }
  });
}


export default function RootPage ({categories, frameworks, breadcrumbs, actionButton}) {
  return (
    <Application breadcrumbs={breadcrumbs} actionButton={actionButton} >
      <h2>Categories</h2>
      { categories.map((category, i) => <p key={i}>{ category.name }</p>)}
      <h2>Frameworks</h2>
      { frameworks.map((framework, i) => <p key={i}>{ framework.name }</p>)}
    </Application>
  )
}
