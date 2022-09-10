// Send an API request to the BE with context received from the browser.
//
// Acting as a pass-through
// =================
//
// "context" refers to the headers and cookies that were sent to
// the BFF (backend for frontend -- NextJS). Namely, the request headers.
//
// Also on receiving a response from the BE, return the new context
// to the browser by means of the response headers. Namely, the response headers.
//
// Although this generally passes-through the headers as is,
// there are a couple of exceptions.
//
// 1. The request to the BE will be sent to accept: 'application/json'
// 2. The response header 'content-type' will be ignored. -- this will be
//    set by NextJS and will be 'text/html' for SSR and something else
//    when CSR. It is up to NextJS to determine.
// 3. The response header 'content-encoding' will also be ignored. -- this
//    typically mentions gzip compression. In some cases, this caused problems
//    in the browser.
//
// Managing errors
// =====================
//
// Error handling is mostly common to every endpoint and should be handled in
// a generic manner. apiGetProps() aims to do all the boring error handling
// and just provide the results after a successful request -- it only
// sends back what your code is interested in.
export default async function apiGetProps({context, url, options = {}, success}) {
  const apiHeaders = apiRequestHeaders(context)

  const response = await fetch(url, { headers: apiHeaders, ...options })

  if (response.status == 200) {
    const headers = await response.headers
    const json = await response.json()

    setBrowserResponseHeaders(headers, context)

    return success(response, json)
  } else if (response.status == 401) {
    return {
      redirect: {
        destination: '/users/login',
        permanent: false,
      },
    }
  } else if (response.status == 404) {
    return {
      notFound: true
    }
  } else {
    return {
      notFound: true
    }
  }
}

function apiRequestHeaders(context) {
  // use spread assignment to remove any headers that you
  // do not want to pass through.
  // https://www.cloudhadoop.com/2020/02/different-ways-of-remove-property-in.html
  const { ...browserHeaders } = context.req.headers

  return { ...browserHeaders, ...{accept: 'application/json'} }
}

function setBrowserResponseHeaders(headers, context) {
  const ignoredResponseHeaders = ['content-type', 'content-encoding']

  headers.forEach((value, key) => {
    if (ignoredResponseHeaders.includes(key)) { return }

    context.res.setHeader(key, value)
  })
}

// Experiments to asynchronously fetch from multiple APIs and
// aggregate the results.
//
// I'm considering an API like the following
//
// const [categories, frameworks] = await apiGetMuliple({
//   context: context,
//   requests: [
//     {url: "http://web:3000/api/categories", options: {}},
//     {url: "http://web:3000/api/frameworks", options: {}},
//   ]
// })
//
// Essentially, the consumer of the API simply specifies the API endpoints
// and receives the results as JSON.
//
// Error handling may be a bit complicated. I would prefer to keep error
// handling out of the controller code, but it may not be possible.
// In case of an error from one of the APIs, we want the remainder of the
// API set to still run and return results. The API with an error can simply
// return null or an error message.
//
// Points to consider
// 1. We want to be able to do as much eager fetching as a GraphQL protocol.
//    Understand how GraphQL works, especially under the hood.
// 2. I want to understand how this method is better than designing the back-end
//    to handle GraphQL requests. I want to understand how multiple generic REST-APIs
//    aggregated by an API gateway can end up being a better solution than
//    implementing a GraphQL API on the Rails server.
export async function apiTest(context) {
  const apiHeaders = apiRequestHeaders(context)

  const categories = fetch("http://web:3000/api/categories", { headers: apiHeaders }).then((res) => res.json())
  const frameworks = fetch("http://web:3000/api/frameworks", { headers: apiHeaders }).then((res) => res.json())

  return Promise.all([categories, frameworks]);
}
