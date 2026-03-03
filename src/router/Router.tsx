import { memo } from "react";
import { Route, Routes } from "react-router-dom";

import { Login } from "../components/pages/Login";
import { Page404 } from "../components/page404";
import { HomeRoutes } from "./HomeRoutes";

export const Router = memo(() => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      {HomeRoutes}
      <Route path="*" element={<Page404 />} />
    </Routes>
  )
})
