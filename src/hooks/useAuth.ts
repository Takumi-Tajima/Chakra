import axios from "axios"
import { useNavigate } from "react-router-dom"
import { useState } from "react"

import type { User } from "@/types/api/user"
import { useMessage } from "./useMessage"
import { useLoginUser } from "./useLoginUser"

export const useAuth = () => {
  const { setLoginUser } = useLoginUser()
  const navigate = useNavigate()
  const { showMessage } = useMessage()
  const [loading, setLoading] = useState(false)
  const login = (id: string) => {
    setLoading(true)
    axios.get<User>(`https://jsonplaceholder.typicode.com/users/${id}`).then((res) => {
      if(res.data) {
        const isAdmin = res.data.id === 10
        setLoginUser({ ...res.data, isAdmin })
        showMessage({
          title: "ログイン成功",
          type: "success"
        })
        navigate("/home")
      }
    }).catch(() => {
      showMessage({
        title: "ログイン失敗",
        type: "error"
      })
    }).finally(() => {
      setLoading(false)
    })
  }

  return { loading, login }
}
