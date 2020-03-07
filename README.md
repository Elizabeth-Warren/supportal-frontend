<img src="https://static.pokemonpets.com/images/monsters-images-800-800/7-Squirtle.png" width="300" />

# supportal

A volunteer support portal. A supportal. Sounds like Squirtle!

## Background and history

Internally called "supportal", this project was a collection of volunteer organizing web apps for the Elizabeth Warren campaign.

The primary app in the collection, [Switchboard](http://switchboard.elizabethwarren.com/) was a tool for volunteer organizers. Volunteer organizers would receive training and once complete have access to the web app. Once loggeed in, they would receive a list of leads for individuals in their area that had expressed interest in volunteering for the campaign. Volunteer organizers could call those leads and then indicate their response, even directly signing the leads up within the app for volunteering shifts. At last count Switchboard was responsible for facilitating some tens of thousands of calls to potential volunteers.

The [Event Scheduler](https://switchboard.elizabethwarren.com/event-scheduler), internally known as "Shifter" was a mini web app to search and sign up for volunteer shifts in a more streamlined process than the Mobilize America service it was built on top of. The component was commonly used as an [embedded iframe](https://switchboard.elizabethwarren.com/embed/event-scheduler) within our text and phone banking tools (Spoke and ThruTalk respectively) to allow volunteers to sign up people they were contacting for volunteer shifts. URL params could be passed in to the iframe to preselect events and timeslots by ID, and prefill necessary form fields.

Finally, "Glitter" was going to be a replacement for Shadow peer to peer email system. Our original idea was to create a tool to replace Shadow named SHADE (Sending Helpful And Direct Emails) but we decided it was better to throw glitter, not shade. Hence, Glitter was born. This project was only just beginning when the campaign came to a close.

The front-end was hosted on Netlify and worked with our [Python API](https://github.com/Elizabeth-Warren/supportal-backend).

## Project setup

```sh
# install dependencies
npm install

# copy necessary environment variables
cp .env.sample .env

# run the project at localhost:8001
npm run dev
```


## Technical summary

### JavaScript
The supportal is a web app built with [React](https://reactjs.org/docs/getting-started.html) and [Next.js](https://nextjs.org/docs). Other commonly used third-party libraries include:

* [axios](https://github.com/axios/axios) - for make HTTP requests
* [date-fns](https://date-fns.org/v2.6.0/docs/) - for date manipulation
* [lodash](https://lodash.com/docs/) - for utility functions
* [localForage](https://localforage.github.io/localForage/) - for local state persistence
* [aws-amplify](https://aws-amplify.github.io/docs/js/authentication) and [cognito](https://www.npmjs.com/package/amazon-cognito-identity-js) - for authentication

Coding conventions are enfroced with [Prettier](https://prettier.io/) and [ESLint](https://eslint.org/), using the Airbnb presets.

### CSS and Component Styling

Commonly used base components are taken from the campaigns internal component library, [Persist](https://github.com/Elizabeth-Warren/persist). After that, the primary component styling solution being used is [Tailwind CSS](https://tailwindcss.com/docs/) with theming based on Persist's theme file. For more complex CSS that Tailwind's utility classes can't address, [styled-jsx](https://github.com/zeit/styled-jsx) is [included with Next.js by default](https://nextjs.org/docs#built-in-css-support). [styled-components](https://www.styled-components.com/) is also installed since it's used by the website. However because of issues with universal rendering, it's prefered to use Tailwind and styled-jsx or Tailwind and inline styles.

Coding conventions are enforced with [Prettier](https://prettier.io/) and [Stylelint](https://stylelint.io/).

### Infrastructure

The supportal web app was originally hosted on Netlify.