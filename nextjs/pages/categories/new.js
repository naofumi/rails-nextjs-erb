import CsrfToken from '/components/csrf_token'
import Application from '/components/layout/application'
import Link from 'next/link'
import { submitForm } from '/lib/submit_api'
import { useRouter } from 'next/router'
import { useState } from 'react'

// We are using SSG to generate the forms.
// Forms that are used to create new entries are generic
// and do not need up-to-date data from the database. Hence
// we can generate them statically with not issues.
// export async function getStaticProps() {
//   return {
//     props: {
//       breadcrumbs: [],
//       actionButton: {url: '', text: ''}
//     }
//   }
// }

// Instead of using getStaticProps to send in breadcrumbs and the actionButton,
// we can (and should) put these two values directly into the component as below.
// In the production build phase, I am assuming that NextJS will create
// the necessary static files, similar to how it works for SSG.
// Essentially, I think we are doing SSG but without having to create the data.
export default function NewCategory () {
  const breadcrumbs = []
  const actionButton = {url: '', text: ''}

  const router = useRouter()
  const [ errors, setErrors ] = useState([])

  const handleSubmit = async (event) => {
    event.preventDefault()

    submitForm({
      form: event.currentTarget,
      success: (response, jsonResult) => {
        router.push(`/categories/${jsonResult.id}`)
      },
      failure: (response, jsonResult) => {
        setErrors(jsonResult)
      }
    })
  }

  return (
    <Application breadcrumbs={breadcrumbs} actionButton={actionButton}>
      <h1 className="text-xl font-semibold text-gray-900">New Category</h1>
      <div className="errors text-rose-600">
        {errors.map((error) => error)}
      </div>
      <form onSubmit={handleSubmit} action="/categories" method="POST">
        <CsrfToken />
        <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
          <div className="space-y-6 pt-8 sm:space-y-5 sm:pt-10">
            <div className="space-y-6 sm:space-y-5">
              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                  Name
                </label>
                <div className="mt-1 sm:col-span-2 sm:mt-0">
                  <input
                    type="text"
                    name="category[name]"
                    id="name"
                    className="border block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                  />
                </div>
              </div>
              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                  Description
                </label>
                <div className="mt-1 sm:col-span-2 sm:mt-0">
                  <textarea
                    name="category[description]"
                    id="description"
                    rows={5}
                    className="border block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                    defaultValue={''}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="pt-5">
          <div className="flex justify-end">
            <Link href="/">
              <button
                type="button"
                className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Cancel
              </button>
            </Link>
            <button
              type="submit"
              className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Save
            </button>
          </div>
        </div>
      </form>
    </Application>
  )
}

