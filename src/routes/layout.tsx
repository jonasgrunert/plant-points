import { Link, Outlet, type RouteObject } from "react-router";
import { route as index } from "./index";
import { IconSeedling } from "@tabler/icons-react";

const Layout = () => {
  return (
    <>
      <header>
        <nav>
          <ul>
            <li>
              <h2>
                <Link to="/" className="contrast title">
                  <IconSeedling size={40} />
                  <span>Plant Points</span>
                </Link>
              </h2>
            </li>
          </ul>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
};

export const route: RouteObject = {
  path: "/",
  element: <Layout />,
  children: [index],
};
