import Application from '/components/layout/application'
import { apiGetProps } from '/lib/get_api'
import Link from 'next/link'
import { showLoader } from '/components/loader'

export async function getServerSideProps (context) {
  const breadcrumbs = []

  return apiGetProps({
    context: context,
    url: `http://web:3000/frameworks/${context.params.fid}`,
    options: {},
    success: (response, framework) => {
      return {
        props: {
          framework,
          layout: {
            breadcrumbs,
            actionButton: {url: `/frameworks/${context.params.fid}/edit`, text: "Edit Framework"}
          }
        }
      }
    }
  })
}

export default function Framework ({framework, layout}) {
  return (
    <Application layout={layout}>
      <div id={`framework_${framework.id}`}>
        <div className="bg-white">
          <div className="max-w-2xl mx-auto py-12 px-4 grid items-center grid-cols-1 gap-y-16 gap-x-8 sm:px-6 sm:py-12 lg:max-w-7xl lg:px-8 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{ framework.name }</h2>
              <div className="mt-4 text-gray-900 font-bold">
                { framework.headline }
              </div>
              <div className="mt-4 text-gray-500">
                { framework.description }
              </div>

              <dl className="mt-16 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 sm:gap-y-16 lg:gap-x-8">
                <div className="border-t border-gray-200 pt-4">
                  <dt className="font-medium text-gray-900">Original Creators</dt>
                  <dd className="mt-2 text-sm text-gray-500">
                    { framework.original_creators }
                  </dd>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <dt className="font-medium text-gray-900">Source Code</dt>
                  <dd className="mt-2 text-sm text-gray-500">
                    <Link href={framework.source_code_url}>
                      <a>{framework.source_code_url}</a>
                    </Link>
                  </dd>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <dt className="font-medium text-gray-900">Programming Language</dt>
                  <dd className="mt-2 text-sm text-gray-500">
                    { framework.languages }
                  </dd>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <dt className="font-medium text-gray-900">Related Technologies</dt>
                  <dd className="mt-2 text-sm text-gray-500">
                    { framework.related_technologies }
                  </dd>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <dt className="font-medium text-gray-900">Release year</dt>
                  <dd className="mt-2 text-sm text-gray-500">
                    { framework.release_year }
                  </dd>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <dt className="font-medium text-gray-900">Usage statistics</dt>
                  <dd className="mt-2 text-sm text-gray-500">
                    <Link href={framework.usage_statistics_url}>
                      <a>{framework.usage_statistics_url}</a>
                    </Link>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </Application>
  )
}
