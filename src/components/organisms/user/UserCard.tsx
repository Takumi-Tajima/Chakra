import { Box, Stack, Image, Text } from "@chakra-ui/react"

type Props = {
  imageUrl: string
  userName: string
  fullName: string
}

export const UserCard = ({ imageUrl, userName, fullName }: Props) => {
  return(
    <Box w="260px" h="260px" bg="teal" borderRadius="10px" shadow="md" p={4} _hover={{ bg: "teal.600" }} cursor="pointer">
      <Stack textAlign='center'>
        <Image m="auto" boxSize="150px" borderRadius="full" fit="cover" src={imageUrl}/>
        <Text fontSize="xl" fontWeight="bold">{userName}</Text>
        <Text fontSize='sm'>{fullName}</Text>
      </Stack>
    </Box>
  )
}
