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
//
// Example
// ===================
//   return apiGetProps({
//     context: context,
//     url: `http://web:3000/categories/${context.params.cid}`,
//     options: {},
//     success: (response, category) => {
//       return {
//         props: {
//           category,
//           breadcrumbs,
//           actionButton: {url: `/categories/${context.params.cid}/edit`, text: "Edit Category"}
//         }
//       }
//     }
//   })

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
        destination: '/users/sign_in',
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

// Asynchronously fetch from multiple APIs and send
// json results to the `success` callback.
//
// Acting as a pass-through
// ===============
// This acts in much the same way as `apiGetProps` above.
// We may need further discussion on how the API server's headers are
// sent back to the browser via `setBrowserResponseHeaders`. With the
// current implementation, we are sending back all headers from all the
// API servers to the browser which seems unnecessary and potentially
// harmful, especially regarding caching.
//
// Managing errors
// ===================
//
// Error handing is similar to `apiGetProps` above. If any of the requests
// returns a non 200 status, then error handling is called.
//
// Example
// =====================
// return apiGetMuliple({
//   context: context,
//   requests: [
//     {url: "http://web:3000/categories", options: {}},
//     {url: "http://web:3000/frameworks", options: {}},
//   ],
//   success: (jsonResponses) => {
//     const [categories, frameworks] = jsonResponses
//     return {
//       props: {
//         categories: categories,
//         frameworks: frameworks,
//         breadcrumbs,
//         actionButton: {url: `/categories/${context.params.cid}/edit`, text: "Edit Category"}
//       }
//     }
//   }
// })
//
export async function apiGetMultiple({context, requests, success}) {
  const apiHeaders = apiRequestHeaders(context)

  const jsonPromises = requests.map(async ({url, options}) => {
    const response = await fetch(url, { headers: apiHeaders, ...options })

    if (response.status == 200) {
      const headers = await response.headers
      const json = await response.json()

      setBrowserResponseHeaders(headers, context)

      return json
    } else {
      return {errorStatus: response.status}
    }
  })

  const jsonResponses = await Promise.all(jsonPromises)

  if (jsonResponses.every((jr) => !jr.errorStatus)) {
    return success(jsonResponses)
  } else if (jsonResponses.some((jr) => jr.errorStatus == 401)) {
    return {
      redirect: {
        destination: '/users/sign_in',
        permanent: false,
      },
   }
  } else if (jsonResponses.some((jr) => jr.errorStatus == 404)) {
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
