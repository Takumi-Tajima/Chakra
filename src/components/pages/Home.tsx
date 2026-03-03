import { memo } from "react"
import { Outlet } from "react-router-dom"

import { Header } from "../organisms/layout/Header"

export const Home = memo(() => {
  return (
    <>
      < Header />
      < Outlet />
    </>
  )
})
