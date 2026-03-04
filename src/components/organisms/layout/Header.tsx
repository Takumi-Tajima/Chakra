import { MenuIconButton } from "@/components/atoms/button/MenuIconButton"
import { Box, Flex, Heading, Link, Drawer } from "@chakra-ui/react"

export const Header = () => {
  return (
    <Drawer.Root>
    <Flex as='nav' bg='teal.500' color='gray.50' align='center' justify='space-between' p={4}>
      <Flex align='center' as='a' mr={8} _hover={{cursor: 'pointer'}}>
        <Heading as='h1' size={{ base: 'md', md: 'lg' }}>ユーザー管理アプリ</Heading>
      </Flex>
      <Flex align='center' fontSize='sm' flexGrow={2} display={{base: 'none', md: 'flex'}}>
        <Box pr={4}>
          <Link>設定</Link>
        </Box>
      </Flex>
      <Drawer.Trigger asChild>
        <MenuIconButton />
      </Drawer.Trigger>
    </Flex>
    <Drawer.Backdrop />
    <Drawer.Positioner>
      <Drawer.Content>
        <Drawer.CloseTrigger />
        <Drawer.Header>
          <Drawer.Title>メニュー</Drawer.Title>
          <Drawer.Title>neko</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body />
        <Drawer.Footer />
      </Drawer.Content>
    </Drawer.Positioner>
    </Drawer.Root>
  )
}
