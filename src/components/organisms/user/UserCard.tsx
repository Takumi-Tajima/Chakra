import { Box, Stack, Image, Text } from "@chakra-ui/react"

import type { BoxProps } from "@chakra-ui/react"
import type { Ref } from "react"
import type { UserInfo } from "../../../types/api/user"

type UserCardProps = UserInfo & BoxProps & { ref?: Ref<HTMLDivElement> }

export const UserCard = ({ imageUrl, userName, fullName, ref, ...rest }: UserCardProps) => {
  return(
    <Box ref={ref} w="260px" h="260px" bg="teal" borderRadius="10px" shadow="md" p={4} _hover={{ bg: "teal.600" }} cursor="pointer" {...rest}>
      <Stack textAlign='center'>
        <Image m="auto" boxSize="150px" borderRadius="full" fit="cover" src={imageUrl}/>
        <Text fontSize="xl" fontWeight="bold">{userName}</Text>
        <Text fontSize='sm'>{fullName}</Text>
      </Stack>
    </Box>
  )
}
