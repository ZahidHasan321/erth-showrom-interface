import { createRouter } from "@tanstack/react-router";
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools'


import { routeTree } from './routeTree.gen';

export const router = createRouter({
  routeTree, 
  defaultPreload: 'intent',
  scrollRestoration: true,
  context: {
    // auth will initially be undefined
    // We'll be passing down the auth state from within a React component
    auth: undefined!,
  },
})


