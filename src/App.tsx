import { createBrowserRouter, RouterProvider } from "react-router";
//import PWABadge from "./pwa/PWABadge.tsx";
import { route as layout } from "./routes/layout.tsx";
import { useEffect, useState } from "react";
import { Button } from "react-aria-components";
import { useTranslation } from "react-i18next";

type PromtFn = () => Promise<{ outcome: "accepted" | "dismissed" }>;

const router = createBrowserRouter([layout]);

function App() {
  const [install, setInstall] = useState<PromtFn | null>(null);
  useEffect(() => {
    const onBefore = (
      event: Event & {
        prompt?: PromtFn;
      }
    ) => {
      if (event.prompt) {
        setInstall(event.prompt);
      }
    };

    window.addEventListener("beforeinstallprompt", onBefore);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBefore);
    };
  }, []);
  const { t } = useTranslation();
  return (
    <>
      <RouterProvider router={router} />
      {/* <PWABadge /> */}
      {install !== null && (
        <div className="install-button">
          <Button className="outline" onClick={install}>
            {t("install")}
          </Button>
        </div>
      )}
    </>
  );
}

export default App;
