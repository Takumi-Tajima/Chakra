import axios from "axios"
import { useNavigate } from "react-router-dom"
import { useState } from "react"

import type { User } from "@/types/api/user"

export const useAuth = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const login = (id: string) => {
    setLoading(true)
    axios.get<User>(`https://jsonplaceholder.typicode.com/users/${id}`).then((res) => {
      if(res.data) {navigate("/home")}
    }).catch(() => {
      alert("ユーザーが見つかりませんでした")
    }).finally(() => {
      setLoading(false)
    })
  }

  return { loading, login }
}
