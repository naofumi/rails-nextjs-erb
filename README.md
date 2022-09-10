# Rails - Next.js

## Purpose

This repository is a demo project demonstrating integration of Next.js and Ruby on Rails using a BFF (Backend For Frontend) architecture.

The aim is to enable you to easily transition between a Next.js front-end and a Ruby on Rails ERB front-end while maintaining the same URLs and user experience. Ideally, the developer should be able to swap technologies on individual pages without any externally observable differences.

This capability should enable the developer to gradually transition a website built with ERB technology to one based on React, or vice versa.

Some of the things that we focus on are;

1. **SEO:** The web pages must be generated with either SSR or SSG -- on the first request, the server has to send a fully generated HTML page to the client.
1. **URLs:** We will make a maximum effort not to change URLs -- the URLs for the ERB pages and the React pages has to stay the same.
1. **Ease of transition:** In addition to a smooth user experience during the transition, the developer experience of re-writing ERB pages to React has to be as effortless as possible.
1. **Front-end friendliness:** Front-end developers often have to work within a back-end framework and programming language which they are not very familiar with. This understandably causes stress. It would be more comfortable for the front-end team, to work within a self-contained environment tailored and designed for their needs.

SEO is hugely significant since for a large number of websites, SEO is essential for building and maintaining the business and earning money. In many cases, it will be the top priority. URL changes will also impact SEO so it is important that these do not change.

Ease of transition is a complicated topic. However, it is my observation that a large proportion of the complexity in React projects is in form management. The complexity arises from sources such as controlled components that tie DOM changes to internal state, validation, global state management libraries like Redux, the need to convert form data to JSON, and a general lack of a standardised methodology. This is in stark contrast to form management in ERB, which may not be as dynamic as a React controlled form, but is extremely simple. Therefore, within the current project, efforts will be made to make React form management similar to ERB, and hence much simpler. The hope is to make it possible to transition ERB to React with minimal additional JavaScript code.

## Architecture

This will be a BFF (Back-end for Front-end) architecture and it will involve multiple servers. Hence we will run this in Docker in development. We have the following containers.

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
