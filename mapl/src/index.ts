import { jitc, router } from "@mapl/app";

// Create a router
const app = router();
// Add a route that matches GET requests to '/'

app.get("/", {
  type: "json",
  fn: () => ({ message: "hello" }),
});

app.get("/req", {
  type: "json",
  fn: (ctx) => ctx,
});

// Build the fetch function
const fetch = jitc(app);

// Export the function for the runtime to execute
export default { fetch };
