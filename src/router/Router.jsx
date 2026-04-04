import { useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { App } from "../App";
import { Login } from "../login";
import { HomePage } from "../HomePage";

const ProtectedRoute = ({ hasAccess, children }) => {
  if (!hasAccess) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export const Router = () => {
  const [access, setAccess] = useState(false);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App setAccess={setAccess} />} />
        <Route path="/login" element={<Login setAccess={setAccess} />} />
        <Route path="/main" element={<HomePage setAccess={setAccess} />} />
        {/* <Route
          path="/main"
          element={
            <ProtectedRoute hasAccess={access}>
              <HomePage />
            </ProtectedRoute>
          }
        /> */}
      </Routes>
    </BrowserRouter>
  );
};
