import { createBrowserRouter, RouterProvider } from "react-router";
import PWABadge from "./pwa/PWABadge.tsx";
import { route as layout } from "./routes/layout.tsx";

const router = createBrowserRouter([layout]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      {/* <PWABadge /> */}
    </>
  );
}

export default App;
