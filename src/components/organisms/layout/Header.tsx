import { MenuIconButton } from "@/components/atoms/button/MenuIconButton"
import { Box, Flex, Heading, Drawer } from "@chakra-ui/react"
import { Link } from "react-router-dom"
import { DrawerMenu } from "./DrawerMenu"

export const Header = () => {
  return (
    <Drawer.Root>
    <Flex as='nav' bg='teal.500' color='gray.50' align='center' justify='space-between' p={4}>
      <Flex align='center' as='a' mr={8} _hover={{cursor: 'pointer'}}>
        <Heading as='h1' size={{ base: 'md', md: 'lg' }}>ユーザー管理アプリ</Heading>
      </Flex>
      <Flex align='center' fontSize='sm' flexGrow={2} display={{base: 'none', md: 'flex'}}>
        <Box pr={4}>
          <Link to='/home/user_management'>ユーザー一覧</Link>
        </Box>
        <Box pr={4}>
          <Link to='/home/setting'>設定</Link>
        </Box>
      </Flex>
      <Drawer.Trigger asChild>
        <MenuIconButton />
      </Drawer.Trigger>
    </Flex>
    <DrawerMenu />
    </Drawer.Root>
  )
}
