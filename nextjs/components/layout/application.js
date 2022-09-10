import Navigation from '/components/navigation'
import Breadcrumbs from '/components/breadcrumbs'
import Loader from '/components/loader'


export default function Application({children, breadcrumbs, actionButton}) {
  return (
    <>
      <div className="relative">
        <Loader className="absolute top-3 right-3 z-10" width="200" height="200" />
      </div>
      <Navigation actionButton={actionButton} />
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 mt-2">
        <Breadcrumbs breadcrumbs={breadcrumbs}/>
        { children }
      </div>
    </>
  )
}


