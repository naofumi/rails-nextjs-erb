import Application from '/components/layout/application'
import Category from '/components/category'
import { apiGetProps } from '/lib/get_api'

export async function getServerSideProps (context) {
  return apiGetProps({
    context: context,
    url: 'https://rails-nextjs.fly.dev/categories',
    options: {},
    success: (response, categories) => {
      return {
        props: {
          categories: categories.map((category) => {
            return {
              id: category.id,
              name: category.name
            }
          }),
          layout: {
            breadcrumbs: [{name: 'Categories', href: '/'}],
            actionButton: {url: "/categories/new", text: "New Category"}
          }
        }
      }
    }
  })
}


export default function Categories ({categories, layout}) {
  return (
    <Application layout={layout} >
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900">Categories</h1>
            <p className="mt-2 text-sm text-gray-700">A list of all Framework Categories.</p>
          </div>
        </div>
        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
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
          </div>
        </div>
      </div>
    </Application>
  )
}
