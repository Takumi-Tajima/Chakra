import { Flex, Box, Heading, Separator, Input, Stack } from "@chakra-ui/react"
import { memo } from "react"
import { PrimaryButton } from "../atoms/button/PrimaryButton"

export const Login = memo(() => {
  return (
    <Flex align='center' justify='center' height='100vh'>
      <Box bg='white' w='sm' p={4} rounded='md' shadow='md'>
        <Heading as='h1' size='lg' textAlign='center'>Login</Heading>
        <Separator my={4} variant="solid" />
        <Stack gap={4} py={4} px={10}>
          <Input placeholder="ユーザーID" />
          <PrimaryButton>Login</PrimaryButton>
        </Stack>
      </Box>
    </Flex>
  )
})
