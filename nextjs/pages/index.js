import Application from '/components/layout/application'
import {apiGetMultiple} from '/lib/get_api'
import Category from '/components/category'
import Framework from '/components/framework'

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
          categories: categories.map((category) => {
            return {
              id: category.id,
              name: category.name,
            }
          }),
          frameworks: frameworks.map((framework) => {
            return {
              id: framework.id,
              name: framework.name,
            }
          }),
          layout: {
            breadcrumbs: [{}],
            actionButton: null
          }
        }
      }
    }
  });
}


export default function Index ({categories, frameworks, layout}) {
  return (
    <Application layout={layout} >
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-lg font-semibold text-indigo-600">Welcome!</h1>
            <p className="mt-1 text-4xl tracking-tight font-bold text-gray-900 sm:text-5xl lg:text-6xl">
              Dashboard
            </p>
            <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">Categories &amp; Frameworks</p>
          </div>
        </div>
      </div>

      <div className="flex flex-row">
        <div className="basis-1/2 mr-5">
          <h2 className="text-lg font-semibold text-indigo-600">Categories</h2>
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 md:pl-0">Name</th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 md:pr-0">
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              { categories.map((category, i) => {
                  return <Category key={i} category={category} />
                }) }
            </tbody>
          </table>
        </div>

        <div className="basis-1/2 ml-5">
          <h2 className="text-lg font-semibold text-indigo-600">Frameworks</h2>
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 md:pl-0">Name</th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 md:pr-0">
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              { frameworks.map((framework, i) => {
                  return <Framework key={i} framework={framework} />
                }) }
            </tbody>
          </table>
        </div>
      </div>
    </Application>
  )
}
