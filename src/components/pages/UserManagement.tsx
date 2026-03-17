import { Wrap, WrapItem, Spinner, VStack, Text } from "@chakra-ui/react"
import { memo, useEffect } from "react"

import { UserDialog } from "../organisms/user/UserDialog"
import { useAllUsers } from "../../hooks/useAllUsers"
import { useLoginUser } from "../../hooks/useLoginUser"

export const UserManagement = memo(() => {
  const { getUsers, loading, users } = useAllUsers()

  useEffect(() => {
    getUsers()
  }, [])

  const { LoginUser } = useLoginUser()
  console.log(LoginUser)

  return (
    <>
      { loading ? (
        <VStack colorPalette="teal">
          <Spinner color="colorPalette.600" />
          <Text color="colorPalette.600">Loading...</Text>
        </VStack>
      ) : (
        <Wrap gap={4} mt={4} p={{base: 4, md: 10}}>
          {users?.map(user => (
            <WrapItem key={user.id}>
              <UserDialog imageUrl={`https://i.pravatar.cc/150?img=${user.id}`} userName={user.username} fullName={user.name}/>
            </WrapItem>
          ))}
        </Wrap>
      )}
    </>
  )
})
