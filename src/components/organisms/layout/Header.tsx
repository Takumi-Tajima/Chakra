import { Box, Flex, Heading, Link, IconButton, Drawer } from "@chakra-ui/react"
import { GiHamburgerMenu } from "react-icons/gi";

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
        <IconButton aria-label="Menu" display={{base: 'flex', md: 'none'}}>
          <GiHamburgerMenu />
        </IconButton>
      </Drawer.Trigger>
    </Flex>
    <Drawer.Backdrop />
    <Drawer.Positioner>
      <Drawer.Content>
        <Drawer.CloseTrigger />
        <Drawer.Header>
          <Drawer.Title>メニュー</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body />
        <Drawer.Footer />
      </Drawer.Content>
    </Drawer.Positioner>
    </Drawer.Root>
  )
}
