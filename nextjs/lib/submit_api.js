import { showLoader, hideLoader } from '/components/loader'

// /lib/submit_api provides 2 functions for sending forms.
// One of these is submitJson() and the other is submitForm().
//
// submitJson() expects you to provide a JSON representation of data
// in `params`. submitJson() will be sent with `Content-type` of `application/json`.
//
// On the other hand, submitForm() does not need `params`. It can derive
// the data entered into the form using a FormData object. submitForm() will
// be sent with `Content-type` of `x-www-form-url-encoded`
//
// To send complex hash data structures to the API server with submitForm(),
// consult the documentation for the API server framework. For example, the
// [Rails Guide](https://guides.rubyonrails.org/action_controller_overview.html#hash-and-array-parameters)
// documents how Rails converts names to complex hash structures.
//
// We recommend using submitForm() since less code is required. When working
// with controlled forms or React Form Hook, you may need to use submitJson().
//
//
export async function submitJson ({form, params, success, failure}) {
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
