import { Link, Drawer, Stack } from "@chakra-ui/react"

export const DrawerMenu = () => {
  return(
    <>
      <Drawer.Backdrop />
      <Drawer.Positioner>
        <Drawer.Content>
          <Drawer.CloseTrigger />
          <Drawer.Header>
            <Drawer.Title/>
          </Drawer.Header>
          <Drawer.Body>
            <Stack>
              <Link href='/home'>ホーム</Link>
              <Link href='/home/setting'>設定</Link>
            </Stack>
          </Drawer.Body>
          <Drawer.Footer />
        </Drawer.Content>
      </Drawer.Positioner>
    </>
  )
}
