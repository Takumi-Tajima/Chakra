import { Button } from "@chakra-ui/react"
import type React from "react"

type Props = {
  children: React.ReactNode
}

export const PrimaryButton = ({ children }: Props) => {
  return (
    <Button bg='teal.400' color='white' _hover={{opacity: 0.8}}>{children}</Button>
  )
}
