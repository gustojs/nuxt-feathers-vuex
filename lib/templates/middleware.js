/*
* If it's a private page and there's no payload, redirect.
*/
export default function ({ store, redirect, route }) {
  const { auth } = store.state
  if (!auth.publicPages.includes(route.name) && !auth.payload) {
    return redirect('<%= options.redirect %>')
  }
}
