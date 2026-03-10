import { Wrap, WrapItem, Spinner, VStack, Text } from "@chakra-ui/react"
import { memo, useEffect } from "react"

import { UserCard } from "../organisms/user/UserCard"
import { useAllUsers } from "../../hooks/useAllUsers"

export const UserManagement = memo(() => {
  const { getUsers, loading, users } = useAllUsers()

  useEffect(() => {
    getUsers()
  }, [])

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
              <UserCard imageUrl="https://picsum.photos/800/600" userName={user.username} fullName={user.name}/>
            </WrapItem>
          ))}
        </Wrap>
      )}
    </>
  )
})
