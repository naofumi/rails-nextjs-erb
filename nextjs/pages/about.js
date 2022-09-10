import Application from '/components/layout/application'

/* This example requires Tailwind CSS v2.0+ */
function About() {
  return (
    <Application breadcrumbs={[]} actionButton={{url: '', text: ''}}>
      <div className="bg-white">
        <div className="mx-auto max-w-7xl py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-indigo-600">About</h2>
            <p className="mt-1 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Painless integration of Next.js into your Magestic ERB Rails monolith.
            </p>
            <p className="mx-auto mt-5 max-w-xl text-xl text-gray-500">
              Start with a fully Erb-based Rails application. Gradually shift towards Next.js-backed
              React pages.<br /><br />
              No sweat. No drama.<br /><br />
              Conway&apos;s Law will love you.
            </p>
          </div>
        </div>
      </div>
    </Application>
  )
}

export default About
