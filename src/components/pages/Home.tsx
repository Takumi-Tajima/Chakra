import { memo } from "react"
import { Outlet } from "react-router-dom"

export const Home = memo(() => {
  return (
    <>
      <h1>homeの共通レイアウトです</h1>
      < Outlet />
    </>
  )
})
