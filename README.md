# Rails - Next.js

## Purpose

This repository is a demo project demonstrating integration of Next.js and Ruby on Rails using a BFF (Backend For Frontend) architecture.

The aim is to enable you to easily transition between a Next.js front-end and a Ruby on Rails ERB front-end while maintaining the same URLs and user experience. The developer will be able to swap technologies on individual pages without any externally observable differences.

This capability should enable the developer to gradually transition a website built with ERB technology to one based on React, or vice versa. Instead of a "Big-bang" style release, the developer can release each page as it is ready, one by one.

Some of the things that we focus on are;

1. **SEO:** The web pages must be generated with either SSR or SSG -- on the first request, the server has to send a fully generated HTML page to the client.
1. **URLs:** We will make a maximum effort not to change URLs -- the URLs for the ERB pages and the React pages has to stay the same.
1. **Ease of transition:** In addition to a smooth user experience during the transition, the developer experience of re-writing ERB pages to React has to be as effortless as possible.
1. **Front-end friendliness:** Front-end developers often have to work within a back-end framework and programming language which they are not very familiar with. This understandably causes stress. It would be more comfortable for the front-end team, to work within a self-contained environment tailored and designed for their needs.

SEO is hugely significant since for a large number of websites, SEO is essential for building and maintaining the business and earning money. In many cases, it will be the top priority. URL changes will also impact SEO so it is important that these do not change.

Ease of transition is a complicated topic. However, it is my observation that a large proportion of the complexity in React projects is in form management. The complexity arises from sources such as controlled components that tie DOM changes to internal state, validation, global state management libraries like Redux, the need to convert form data to JSON, and a general lack of a standardised methodology. This is in stark contrast to form management in ERB, which may not be as dynamic as a React controlled form, but on the other hand, is extremely simple. Therefore, within the current project, efforts will be made to make React form management similar to ERB, and hence much simpler. The hope is to make it possible to transition ERB to React with minimal additional JavaScript code.

URLs also play a role in easing the transition. If the URLs were to change, then ensuring that there are no internal broken links may lead to a nightmare, especially if you are changing many different pages. Keeping the URLs (at least the GET URLs) the same regardless of whether the pages are built in Rails ERB or React, will greatly reduce the quality control burden.

## Architecture

This will be a BFF (Back-end for Front-end) architecture and it will involve multiple servers. Hence, in development, we will run this in Docker. We have the following containers.

1. **db:** The Postgres database
1. **web:** The Rails application -- this is run in development mode
1. **next:** The next server -- this is also running in development mode with `next dev`.

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

We also provide functions to simplify sending API requests and error handling. Again, since the main objective of this project is initially replicate Rails ERB functionality, we do not provide caching or retry capabilities. Indeed, these features may be less essential since the API requests inside `getServerSideProps()` will go through inter-data centre networks that are fast and highly reliable, potentially making retries and caching unnecessary.

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
