import { showLoader, hideLoader } from '/components/loader'

// /lib/submit_api provides 2 functions for sending forms.
// One of these is submitJson() and the other is submitForm().
//
// submitJson() expects you to provide `params` in the arguments, which is a
// JSON representation of the data that you want to send. submitJson() will be
// sent with `Content-type` of `application/json`.
//
// This means that to send data with submitJson(), you have to transform the
// data in the form to JSON. If you are using controlled forms, it is likely that
// you have already have this as state. If you are not using controlled forms,
// you will traverse the form and collect the parameters that you need.
//
// On the other hand, submitForm() uses the FormData object as is. Hence the data is sent in
// exactly the same way as a regular (non-Javascript) form submission with
// an encoding of `x-www-form-url-encoded` (unless it is a file upload in case
// it will be multipart). This is less code if you are using uncontrolled forms
// and the data is not available in state as JSON.
// You do not have to convert the form data to JSON.
//
// Since server-side web frameworks will happily transform the `x-www-form-url-encoded` into
// a `params` hash, and since this can even be a complex hash like JSON, typically
// there will be no extra work on the server. The server will use the value of
// `Content-Type` to determine whether to decode with JSON or with `x-www-form-url-encoded`
// so it will be totally transparent.
//
// Another idea is to completely forgo Javascript. Forms can submit data without javascript
// and if you can receive `x-www-form-url-encoded`, then sending data works fine. I will need
// to investigate this further.
//
// One thing that needs mentioning is that there are so many ways to send forms in
// React, and so you cannot make an assumption about what other developers are familiar with.
//
//
// Validation
// ======
//
// We currently aren't thinking too much about validation.
//
// 1. HTML natively provides basic form validation, which should be sufficient for
//    many cases.
// 2. Client-side validation that works for ERB forms should work fine with our
//    current scheme. Client-side validation for regular HTML forms works by
//    having either the form or the input tags set onChange handlers. These validate
//    the data and change attributes on the HTML elements as needed. This should
//    work fine with our current scheme.
export default async function submitJson ({form, params, success, failure}) {
  const action = form.attributes.action?.value || document.location.href
  const method = form.attributes.method?.value || "POST"
  const options = {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(params)
  }

  submit(action, options, success, failure)
}

export async function submitForm ({form, success, failure}) {
  const action = form.attributes.action?.value || document.location.href
  const method = form.attributes.method?.value || "POST"
  const options = {
    method: method,
    headers: {
      'Accept': 'application/json'
    },
    body: new FormData(form)
  }

  submit(action, options, success, failure)
}

async function submit(action, options, success, failure) {
  showLoader()

  const response = await fetch(action, options)
  const jsonResult = await response.json()

  hideLoader()

  if (response.status === 201 || response.status == 200) {
    success(response, jsonResult)
  } else {
    failure(response, jsonResult)
  }
}
