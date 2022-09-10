/* This example requires Tailwind CSS v2.0+ */
import { HomeIcon } from '@heroicons/react/20/solid'
import Link from 'next/link'

export default function Breadcrumbs({ breadcrumbs }) {
  return (
    <nav className="flex mt-5 mb-5" aria-label="Breadcrumb">
      <ol role="list" className="flex items-center space-x-4">
        <li>
          <div>
            <Link href="/">
              <a className="text-gray-400 hover:text-gray-500">
                <HomeIcon className="flex-shrink-0 h-5 w-5" aria-hidden="true" />
                <span className="sr-only">Home</span>
              </a>
            </Link>
          </div>
        </li>
        {breadcrumbs.map((crumb) => (
          <li key={crumb.name}>
            <div className="flex items-center">
              <svg
                className="flex-shrink-0 h-5 w-5 text-gray-300"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
              </svg>
              <a
                href={crumb.href}
                className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                aria-current={crumb.current ? 'crumb' : undefined}
              >
                {crumb.name}
              </a>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  )
}
