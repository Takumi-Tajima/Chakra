import { Dialog, Portal, CloseButton, Stack, Field, Input } from "@chakra-ui/react"
import { UserCard } from "./UserCard"

import type { UserInfo } from "../../../types/api/user"

export const UserDialog = ({ imageUrl, userName, fullName }: UserInfo) => {
  return(
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <UserCard imageUrl={imageUrl} userName={userName} fullName={fullName}/>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>ユーザー詳細</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Stack>
                <Field.Root>
                  <Field.Label>Name</Field.Label>
                  <Input value={userName} readOnly />
                </Field.Root>
                <Field.Root>
                  <Field.Label>Full Name</Field.Label>
                  <Input value={fullName} readOnly />
                </Field.Root>
              </Stack>
            </Dialog.Body>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
