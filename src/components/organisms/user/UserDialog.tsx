import { Dialog, Portal, CloseButton, Stack, Field, Input } from "@chakra-ui/react"
import { UserCard } from "./UserCard"
import { useState } from "react"

import type { UserInfo } from "../../../types/api/user"
import { useLoginUser } from "@/hooks/useLoginUser"

export const UserDialog = ({ imageUrl, userName, fullName }: UserInfo) => {
  const { LoginUser } = useLoginUser()
  const isAdminUser = LoginUser ? LoginUser.isAdmin : false

  const [name, SetName] = useState(userName)
  const [full, SetFull] = useState(fullName)

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
                  <Input value={name} readOnly={!isAdminUser} onChange={(e) => SetName(e.target.value)} />
                </Field.Root>
                <Field.Root>
                  <Field.Label>Full Name</Field.Label>
                  <Input value={full} readOnly={!isAdminUser} onChange={(e) => SetFull(e.target.value)}/>
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
