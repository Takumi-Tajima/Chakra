import type { Ref } from "react"
import { IconButton, type IconButtonProps } from "@chakra-ui/react"
import { GiHamburgerMenu } from "react-icons/gi"

type Props = IconButtonProps & { ref?: Ref<HTMLButtonElement> }

export const MenuIconButton = ({ ref, ...props }: Props) => {
  return (
    <IconButton ref={ref} aria-label="Menu" display={{base: 'flex', md: 'none'}} {...props}>
      <GiHamburgerMenu />
    </IconButton>
  )
}
