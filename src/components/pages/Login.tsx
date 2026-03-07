import { Flex, Box, Heading, Separator, Input, Stack } from "@chakra-ui/react"
import { memo, type ChangeEvent } from "react"
import { useState } from "react"

import { PrimaryButton } from "../atoms/button/PrimaryButton"
import { useAuth } from "@/hooks/useAuth"

export const Login = memo(() => {
  const { login, loading } = useAuth()
  const onClickLogin = () => {
    login(userId)
  }
  const [userId, setUserId] = useState("")
  const onChangeUserId = (e: ChangeEvent<HTMLInputElement>) => setUserId(e.target.value)
  return (
    <Flex align='center' justify='center' height='100vh'>
      <Box bg='white' w='sm' p={4} rounded='md' shadow='md'>
        <Heading as='h1' size='lg' textAlign='center'>Login</Heading>
        <Separator my={4} variant="solid" />
        <Stack gap={4} py={4} px={10}>
          <Input placeholder="ユーザーID" value={userId} onChange={onChangeUserId} />
          <PrimaryButton onClick={onClickLogin} loading={loading} disabled={!userId}>Login</PrimaryButton>
        </Stack>
      </Box>
    </Flex>
  )
})
