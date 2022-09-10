# Rails - Next.js

## Purpose

This repository is a demo project demonstrating integration of Next.js and Ruby on Rails using a BFF (Backend For Frontend) architecture.

The aim is to enable the developer to easily transition between a Next.js front-end and a Ruby on Rails ERB front-end while maintaining the same URLs and user experience. The developer will be able to swap technologies on individual pages without any externally observable differences.

This capability should enable the developer to gradually transition a website built with ERB technology to one based on React, or vice versa. Instead of a "Big-bang" style release, the developer can release each page as it is ready, one by one.

Some of the things that we focus on are;

1. **SEO:** The web pages must be generated with either SSR or SSG -- on the first request, the server has to send a fully generated HTML page to the client.
1. **URLs:** We will make a maximum effort not to change URLs -- the URLs for the ERB pages and the React pages has to stay the same.
1. **Ease of transition:** In addition to a smooth user experience during the transition, the developer experience of re-writing ERB pages to React has to be as effortless as possible.
1. **Front-end friendliness:** Front-end developers often have to work within a back-end framework and a programming language which they are not familiar with. This causes stress. It would be more comfortable for the front-end team to work within a self-contained environment tailored and designed for their needs, in a programming language that they fully understand.

SEO is hugely significant since for a large number of websites, SEO is essential for building and maintaining the business -- earning money. In many cases, SEO will be the un-negotiable, absolute top priority. URL changes will also impact SEO so it is imperative that these do not change.

Ease of transition is a complicated topic. However, it is my observation that a large proportion of the complexity in React projects is in form management. The complexity arises from sources such as controlled components that tie DOM changes to internal state, validation, global state management libraries like Redux, the need to convert form data to JSON, and a general lack of a standardised methodology. This is in stark contrast to form management in ERB, which may not be as dynamic as a React controlled form, but on the other hand, is extremely simple. Therefore, within the current project, we will strive to make React form management similar to ERB, and hence much simpler. The hope is to make it possible to transition ERB to React with minimal additional JavaScript code.

URLs also play a role in easing the transition. If the URLs were to change, then ensuring that there are no internal broken links may lead to nightmare situations, especially if you are changing many different pages. Keeping the URLs (at least the GET URLs) the same regardless of whether the pages are built in Rails ERB or React, will greatly reduce the quality control burden.

## Architecture

This will be a BFF (Back-end for Front-end) architecture and it will involve multiple servers. Hence, in development, we will run this in Docker. We have the following containers.

1. **db:** The Postgres database
1. **web:** The Rails application -- this is run in development mode
1. **next:** The Next.js server -- this is also running in development mode with `next dev`.

## How it works

The Next.js server acts as a BFF (Backend For Frontend). The following describes what this means for each type of request. Note that we describe a typical structure but you can change this if you wish.

### A GET request for a page served by Next.js

For example, assume that the browser accesses `http://localhost:3000/categories` and in your Next.js project directory, you have a file `/pages/categories/index.js`.

In this case, the following will happen.

1. The browser request `GET /categories` will be received by the Next.js server on the `next` container and routed to the file `/pages/categories/index.js`.
1. Assuming that the `/pages/categories/index.js` file is for SSR and contains a `getServerSideProps()` function, we will typically send a request to `GET http://web:3000/categories` from `getServerSideProps()` to get information about the categories.
1. The `GET http://web:3000/categories` request will be sent from the Next.js server (`next` container) to the Rails server (`web` container). Rails will return a JSON response back to the Next.js server and it will in turn generate server-side rendered HTML which is then sent to the browser.

### A GET request for a page not served by Next.js

For example, assume that the browser accesses `http://localhost:3000/categories` and in your Next.js project directory, you **DO NOT** have the file `/pages/categories/index.js`. Also assume that the Rails server has a route for `GET /categories` requests.

In this case, the following will happen.

1. The browser request `GET /categories` will be received by the Next.js server on the `next` container. However, since the file `/pages/categories/index.js` does not exist, Next.js will not process this request.
1. Instead, due to the `rewrites()` statement in `nextjs/next.config.js` (see below), the Next.js server will delegate the request to the Rails server (`web` container). This is commonly called a reverse proxy.
1. Since the Rails server can handle `GET /categories` requests, it will generate an HTML response and send this back to the Next.js server, which it will in turn send as is to the browser.

**nextjs/next.config.js**

```js
  // https://nextjs.org/docs/migrating/incremental-adoption#rewrites
  async rewrites() {
    return {
      // After checking all Next.js pages (including dynamic routes)
      // and static files we proxy any other requests
      fallback: [
        {
          source: '/:path*',
          destination: `http://web:3000/:path*`,
        },
      ],
    }
  },

```

### A non-GET request from the browser on a React generated page

For example, assume that the browser is on `http://localhost/categories/1/edit` and generated from the file in `/nextjs/pages/categories/[cid]/edit.js`. The user has entered information into the form and has pressed the submit button.

In this case, we will write the form to do the following action.

1. The form should have the following attributes -- `<form action="/api/categories/1" method="PATCH" onSubmit={handleSubmit}>`
1. The `handleSubmit()` function should look like the code below. In summary, the `handleSubmit()` function should hand over form processing to the `submitForm()` function, sending in the form DOM element as an argument.
1. The `handleSubmit()` function will send a PATCH request with the form data to `http://localhost:3000/api/categories/1`. Note that this request is sent to the http://localhost:3000 (the Next.js server on the `next` container) and not directly to the Rails server.
1. The Next.js server will receive the request for `PATCH /api/categories/1`. However, since it does not have a route for this request, it will hand it over to the Rails server (`web` container) due to the `rewrites()` function in `nextjs/next.config.js` (see above).
1. The Rails server will receive the `PATCH /api/categories/1`. After updating the database, it will send back a JSON response to the Next.js server. The Next.js server will in turn send the response as is to the browser.
1. The browser will receive the JSON response and process it in either one of the `success` or `failure` callbacks.

**nextjs/pages/categories/[cid]/edit.js**

```js
  const handleSubmit = async (event) => {
    event.preventDefault()

    submitForm({
      form: event.target,
      success: (response, jsonResult) => {
        router.push(`/categories/${jsonResult.id}`)
      },
      failure: (response, jsonResult) => {
        setErrors(jsonResult)
      }
    })
  }
```

#### Important notes

1. The form action is directed to the Next.js server (on `http://localhost:3000`) and not towards the Rails server (on `http://web:3000`). This is because, in production, we will not expose the Rails server to the Internet. This is mainly because we don't want to confuse search engines with multiple ports.
1. With a regular Rails ERB setup, the form action would point to `/categories/1` and not to `/api/categories/1`. This is the one place where we are not able to maintain the same URLs -- non-GET requests will have to point to a different URL. The reason for this is because the Next.js server does not differentiate between different methods, and will try to process the PATCH request using the `/nextjs/pages/categories/[cid].js` file (if it exists). Since this file cannot manage non-GET methods, it will fail. This means that we cannot rely on the Next.js server routing system to ignore the non-GET request and delegate it to the Rails server, and so we need to specify a route that the Next.js server will not recognise at all. Configuring the Rails server to receive requests on both `/categories/1` and `/api/categories/1` using the same controller can be achieved with the following configuration.

**config/routes.rb**
```ruby
  ...

  scope '/api', as: 'api', constraints: {format: 'application/json'} do
    resources :categories
  end

  resources :users

  ...
```

### A non-GET request from the browser on a ERB generated page

The same discussion as above applies to ERB generated pages as well (which is understandable since React generated HTML and ERB generated HTML are identical after being rendered in the browser).

Therefore ERB generated pages will have to be re-written to point to `/api/categories/1` and not `/categories/1`. This can typically be done very simply as show below. Note the addition of `:api` to the `model` argument.

Importantly, requests to `/api/categories/1` and `/categories/1` will be handled identically by the same `CategoriesController`. Unless you have code that specifically looks up the request URL, you should be able to safely rewrite all your forms without introducing errors, including the ones that do not yet have pages re-written in React.

```erb
<%= form_with(model: [:api, category]) do |form| %>
...
<% end %>
```


## Installation for Development

1. Clone the git repository and run `docker compose up` from the project directory (assuming that you have docker installed on your machine).
1. From a separate terminal tab in the same project directory, run `docker compose exec web bin/rails db:prepare db:fixtures:load` to load the data for the demo application.

Access http://localhost:3000 to view the demo application. Login with User credentials which are available on `test/fixtures/users.yml`. For example, login with email: sazae@example.com password: hoge1234

To run the tailwind server (only necessary if you are editing classes inside the ERB files), also run `docker compose exec web bin/rails tailwindcss:watch` -- This will watch your ERB files and rebuild Tailwind CSS on changes. On the Next.js side, Tailwind CSS rebuilding is taken care for you but the `next dev` command which is run automatically so you have no extra work to do.

## Directory structure

The project directory is mostly the same as a default Rails install. The Next.js files are located in the `/nextjs` directory.

## Comparisons to other technologies

The following is basically a list of things that I had in mind when selecting Next.js BFF as the basis of the current project.

1. **Intertia.js:** Interia.js is an impressive project that aims to bridge SPA technologies like React, Vue and Svelte, to back-ends like Laravel and Rails. However, SPA is not acceptable given the SEO demands I had for this project. Intertia.js does have SSR capabilities, but at this point I was not sure if I could fully depend on that. Another concern is that Interia.js manages routing and redirection inside Laravel or Rails, which makes it less accessible to the front-end team.
1. **Remix run:** Remix run is hugely inspiring and what actually started me on this project. However, it is still new and not many front-end developers are familiar with it. Although I would be interested in investigating it further in the future, for today, Next.js seems to be a safer choice.
1. **Hotwire:** Although this project is about transitioning an Rails ERB website to React, my personal preference is to use Hotwire to gain SPA smoothness and to make the pages more interactive. However, I also understand that the selection of technologies is not simply a matter of technical justifications. In most cases, decisions will be driven by organisational structure, as stated by Conway's Law, and given that many organisations are already divided into front-end and back-end, the desire to select React as a way to draw a line between these sections is understandable.

## Form handling

My understanding is that there are many ways to handle forms in React. The React official documentation recommends the usage of [Controller Components](https://reactjs.org/docs/forms.html#controlled-components). On the other hand, the [Next.js documentation on forms](https://nextjs.org/docs/guides/building-forms) mostly discusses non-Javascript techniques. The Javascript form section uses uncontrolled components in contrast to React official document's recommendation. The most popular form validation library, [React Hook Form](https://react-hook-form.com) also seems to recommend non-controlled components.

Furthermore, many of the React projects that I am looking at tend to have a lot of code specific for that single form, even for very basic ones. This is even when I look at the code just for sending the request and ignore validation. This is very different from sending forms in Rails ERB. With Rails ERB, you typically only have form related code in a single location on a single view file, and you even consolidate forms that send POST and PATCH/PUT requests.

When converting Rails ERB templates to React, it makes most sense to first replicate the basic Rails form functionality. If you wish to add more dynamic features that are convenient with React, you may want to add them later, after you have finished the initial transition. What I have provided is a set of functions that allow you to do just this. The following functions are designed to provide just basic Rails form functionality with minimum custom code.


### submitForm()

```jsx
export default function EditCategory ({category, breadcrumbs, actionButton}) {
  const router = useRouter()
  const [ errors, setErrors ] = useState([])

  const handleSubmit = async (event) => {
    event.preventDefault()

    submitForm({
      form: event.target,
      success: (response, jsonResult) => {
        router.push(`/categories/${jsonResult.id}`)
      },
      failure: (response, jsonResult) => {
        setErrors(jsonResult)
      }
    })
  }

  return (
  	  ...
      <form onSubmit={handleSubmit} action={`/api/categories/${category.id}`} method="PUT">
        <CsrfToken />
        <label htmlFor="name">
          Name
        </label>
	    <input
	      type="text"
	      name="category[name]"
	      id="name"
	      defaultValue={category.name}
	    />
        <label htmlFor="name">
          Description
        </label>
        <textarea
          name="category[description]"
          id="description"
          rows={5}
          defaultValue={category.description}
        />
        <button type="submit">
          Save
        </button>
      </form>
     ...
  )
}
```

The above is the code for sending a form. (The `category`, `breadcrumbs`, `actionButton`) are
provided through a `getServerSideProps()` function that is not shown). There are a few features that allow us to make it so compact.

1. `submitForm()` is a generic function that handles the display of a progress loader and errors. No extra code is necessary to handle these.
1. We use the `name` attribute in the `<input>` tag to codify the data structure that we wish to send. This enables us to completely omit the code required to convert the values into a JSON structure. In this example, we are sending values that would be decoded as `{category: {name: [name_value], description: [description_value]} }` on the server. This format has been described in the [Rails Guide](https://guides.rubyonrails.org/action_controller_overview.html#hash-and-array-parameters) and similar coding is available for PHP as well.
1. We are sending POST data in the HTTP body that is formatted in `application/x-www-form-urlencoded` as opposed to `application/json`. The former is native to the browser and therefore no extra work is necessary to send forms in this format. Combined with the former item, this makes preparation of the form data for sending totally unnecessary.
1. This form is an uncontrolled component. `<input>` tags do not have to update state via callback functions.
1. Client side validation can be handled by HTML5 validation features, or by separate JavaScript callbacks that can be bound to the form via event listeners. This is not shown here.

One feature of `submitForm()` is that client-side code defines the response to successful and failed requests. In Rails ERB code (and also in Inertia.js), server-side code is responsible for determining where to redirect after a success, or how to show errors. In `submitForm()`, the client decides, giving the front-end team maximum flexibility over the UI without touching the back-end code.

## API request handling

We also provide functions to simplify sending API requests and error handling. Again, since the main objective of this project is initially replicate Rails ERB functionality, we do not provide caching or retry capabilities to compensate for network inefficiencies. Indeed, these features may be less essential since the API requests inside `getServerSideProps()` will go through inter-data centre networks that are fast and highly reliable, potentially making retries and caching unnecessary.

Although not as severe as the form situation, React code for fetching API responses is also often repetitive and located in multiple files. Again, our aim is to make this simpler.

### apiGetProps()

```js
export async function getServerSideProps (context) {
  return apiGetProps({
    context: context,
    url: 'http://web:3000/api/categories',
    options: {},
    success: (response, categories) => {
      return {
        props: {
          categories,
          breadcrumbs: [{name: 'Categories', href: '/'}],
          actionButton: {url: "/categories/new", text: "New Category"}
        }
      }
    }
  })
}
```

`apiGetProps()` serves the simple function of fetching JSON from an API server. Inside the `success` callback, you can modify the props that you send to the component for display.

...

## Compatibility with Hotwire/Turbo

Since both Hotwire/Turbo and Next.js use different SPA technologies, there are minor issues when transitioning between these pages.

### Turbo page to Next.js page transition

1. The user is currently on a page rendered by Turbo. They click on a link that takes them to a Next.js page.
1. Turbo sends an XMLHTTPRequest request for new page, with the expectation that it will receive an ERB rendered HTML response with the same `<head>` element.
1. Since the URL for the new page is actually rendered by Next.js, the response will be HTML with a completely different `<head>` element.
1. On receiving the response, Turbo recognises the difference and gives up on processing the transition in SPA mode. Instead, it requests a second, full page load for the new URL.
1. Next.js renders the new page again and sends it back to the browser.
1. The browser displays the new page.

This will cause the page transition to be long and show a blank page mid-way. The transition can be made smoother by switching off Turbo globally so that the first XMLHTTPRequest will not be attempted. If you would like to maintain SPA behaviour for Turbo to Turbo transitions, then you can alternatively switch off Turbo for each individual link.

### Next.js page to Turbo page transition

1. From a page rendered in Next.js, the user clicks on a link that takes them to an ERB rendered page.
1. I do not fully understand how Next.js does this, but instead of making an XMLHTTPRequest, it directly makes a request for a full page load.

As a result, Next.js page to Turbo page transitions are smoother than Turbo to Next.js. I suspect that Next.js can do this because it has full knowledge of what routes it can serve. Turbo on the other hand does not have this information, and only realises that the new URL is not Turbo after sending an XMLHTTPRequest and receiving the response.
