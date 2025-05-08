import { Route, Routes } from "react-router-dom";
import { routes } from "./routes/routes.config";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import Layout from "./Layout";

function App() {
  return (
    <>
      <Routes>
        {routes.map(({ path, component: Component, isProtected }, index) => (
          <Route
            key={index}
            path={path}
            element={
              isProtected ? (
                <ProtectedRoute>
                  <Layout >
                  <Component />
                  </Layout>
                </ProtectedRoute>
              ) : (
                <PublicRoute>
                  <Component />
                </PublicRoute>
              )
            }
          />
        ))}
      </Routes>
    </>
  );
}

export default App;
