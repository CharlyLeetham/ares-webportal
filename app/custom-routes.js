export default function setupCustomRoutes(router) {
  // Define your own custom routes here, just as you would in router.js but using 'router' instead of 'this'.
  // For example:
  // router.route('yourroute');
  
  router.route('swriftsedges',  { path: '/edges'}); // Define the page to display all the SWRifts edges.
  router.route('swriftshinderances',  { path: '/hinderances'}); // Define the page to display all the SWRifts edges.
  router.route('swriftsiconicf',  { path: '/icf'}); // Define the page to display all the SWRifts edges.  
  router.route('swriftsrace',  { path: '/races'}); // Define the page to display all the SWRifts edges.
  router.route('swriftsskills',  { path: '/skills'}); // Define the page to display all the SWRifts edges.
  router.route('swriftsppower',  { path: '/powers'}); // Define the page to display all the SWRifts edges. 

}
