import Application from '/components/layout/application'
import apiGetProps from '/lib/get_api'
import Link from 'next/link'
import Image from 'next/image'
import { showLoader } from '/components/loader'

export async function getServerSideProps (context) {
  const breadcrumbs = []

  return apiGetProps({
    context: context,
    url: `http://web:3000/categories/${context.params.cid}`,
    options: {},
    success: (response, category) => {
      return {
        props: {
          category,
          breadcrumbs,
          actionButton: {url: `/categories/${context.params.cid}/edit`, text: "Edit Category"}
        }
      }
    }
  })
}

export default function Category ({category, breadcrumbs, actionButton}) {
  return (
    <Application breadcrumbs={breadcrumbs} actionButton={actionButton}>
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-indigo-600">{ category.name }</h2>
            <p className="mt-1 text-4xl tracking-tight font-bold text-gray-900 sm:text-5xl lg:text-6xl">{ category.name }</p>
            <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">{ category.description }</p>
          </div>
        </div>
      </div>

      <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        { category.frameworks.map((fw, i) => {
          return(
            <li key={i} className="col-span-1 flex flex-col text-center bg-white rounded-lg shadow divide-y divide-gray-200">
              <div className="flex-1 flex flex-col p-8">
                <Image
                  src={fw.header_image?.url}
                  alt="framework header image"
                  className="w-32 h-32 flex-shrink-0 mx-auto rounded-full"
                  size="256x256"
                  width="256"
                  height="256"
                />
                <h3 className="mt-6 text-gray-900 text-sm font-medium">{ fw.name }</h3>
                <dl className="mt-1 flex-grow flex flex-col justify-between">
                  <dt className="sr-only">Description</dt>
                  <dd className="text-gray-500 text-sm">{ fw.headline }</dd>
                  <dt className="sr-only">Category</dt>
                  <dd className="mt-3">
                    <span className="px-2 py-1 text-green-800 text-xs font-medium bg-green-100 rounded-full">{ category.name }</span>
                  </dd>
                </dl>
              </div>
              <div>
                <div className="-mt-px flex divide-x divide-gray-200  bg-gray-400 shadow-sm hover:bg-gray-500 focus:outline-none">
                  <div className="-ml-px w-0 flex-1 flex">
                    <Link href={`/frameworks/${ fw.id }`}>
                      <a className="relative w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-white font-medium border border-transparent rounded-br-lg"
                         onClick={showLoader}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
                        </svg>
                        <span className="ml-3">詳しく見てみよう！</span>
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
            </li>
          )
        }) }
      </ul>
    </Application>
  )
}
