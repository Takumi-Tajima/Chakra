import { useState } from 'react'
import axios from 'axios'

import type { User } from '../types/api/user'
import { useMessage } from './useMessage'

export const useAllUsers = () => {
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState<Array<User>>()
  const { showMessage } = useMessage()

  const getUsers = () => {
    setLoading(true)
    axios.get<Array<User>>('https://jsonplaceholder.typicode.com/users')
      .then(response => {
        setUsers(response.data)
        setLoading(false)
      })
      .catch(() => {
        showMessage({ title: 'ユーザー取得に失敗しました', type: 'error' })
        setLoading(false)
      })
      .finally(() => {setLoading(false)})
  }

  return {getUsers, loading, users}
}
