// middleware.js
import { NextResponse } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request) {
  // Page Requests to the Next.js router (except '/api/*') are sent to
  // the matching file in '/pages/'. However, these files cannot handle
  // non-GET requests.
  //
  // Therefore, we send them directly to the API server before the Next.js router
  // handles them.
  if ( requestIsGet(request) ) { return }
  if ( requestPathStartsWithApi(request) ) { return }

  return NextResponse.rewrite('http://web:3000' + request.nextUrl.pathname
                                                + request.nextUrl.search)
}

function requestIsGet(request) {
  return (request.method.toUpperCase() == 'GET')
}

function requestPathStartsWithApi(request) {
  return (request.nextUrl.pathname.indexOf('/api/') != -1)
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/:path*',
}


