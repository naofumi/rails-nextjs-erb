// CSRF token management
// ========
//
// This file provides a `CsrfToken` component. This component
// sends a GET request to the `/csrf` endpoint on load. If the GET request
// returns a JSON with a `authenticity_token` key, then this will be
// used to create a hidden input tag with the name set to `authenticity_token`
// and the value set to the what was provided in the JSON response.
//
// This enables us to insert a CsrfToken in any page that is generated
// in Next.js. It works with SSG/SSR and SPA generated pages.
//
// You are responsible for submitting the `authenticity_token` value together
// with your form request.
//
// If you are sending the form without using Javascript, then the browser
// will automatically send this for you. If you are using Javascript and you
// are using the `FormData` object to send data, again the browser will automatically
// set this in the `FormData` object for you to use.
//
// If you are sending the form but are not using the `FormData` object, then it
// is up to you to ensure that this value is sent together with your form submission
// data.
//
// Performance concerns
// ------------
//
// The `CsrfToken` will send a GET request to the `/csrf` endpoint asynchronously
// so the user will not experience any performance degradation due to the extra
// request. CSRF token generation in Rails also does not touch the database so
// the load on the Rails server should also be very light.
//
// In my opinion, the simplicity of this scheme and the similarity to the methods
// used in Rails and in Laravel for CSRF protection make this a better solution
// compared to those where the CSRF token to the browser as an HTTP header or a
// cookie.
//
import { useState, useEffect } from 'react'

export default function CsrfToken () {
  const [ xsrfToken, setXsrfToken ] = useState('')

  useEffect(() => {
    fetch('/csrf', {headers: {accept: 'application/json'}})
      .then((response) => { return response.json() })
      .then((data) => {
        if (data.authenticity_token) {
          setXsrfToken(data.authenticity_token)
        }
      })
      .catch((error) => {
      })
  }, [])

  return (
    <input type="hidden" name="authenticity_token" value={xsrfToken} />
  )
}
