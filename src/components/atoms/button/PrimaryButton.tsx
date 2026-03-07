import { Button } from "@chakra-ui/react"
import type React from "react"

type Props = {
  children: React.ReactNode
  onClick: () => void
  disabled?: boolean
  loading?: boolean
}

export const PrimaryButton = ({ children, onClick, disabled=false, loading=false }: Props) => {
  return (
    <Button bg='teal.400' color='white' _hover={{opacity: 0.8}} onClick={onClick} disabled={disabled || loading} loading={loading}>{children}</Button>
  )
}
