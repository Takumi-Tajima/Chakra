import { Wrap, WrapItem } from "@chakra-ui/react"
import { memo } from "react"

import { UserCard } from "../organisms/user/UserCard"

export const UserManagement = memo(() => {
  return (
    <>
      <Wrap gap={4} mt={4} p={{base: 4, md: 10}}>
        <WrapItem>
          <UserCard imageUrl="https://picsum.photos/800/600" userName="user1" fullName="User One"/>
        </WrapItem>
      </Wrap>
    </>
  )
})
