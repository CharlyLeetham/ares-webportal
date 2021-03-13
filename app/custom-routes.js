export default function setupCustomRoutes(router) {
  // Define your own custom routes here, just as you would in router.js but using 'router' instead of 'this'.
  // For example:
  // router.route('yourroute');
  
  router.route('swrifts-edges', {path: '/swrifts-edges'}); // Define the page to display all the SWRifts edges.
}
