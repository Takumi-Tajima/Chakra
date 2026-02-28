import { HStack, Button } from '@chakra-ui/react'
import { ChakraProvider } from '@chakra-ui/react'
import theme from './thema/thema'

function App() {

  return (
    <ChakraProvider value={theme}>
      <HStack>
        <Button colorPalette="red" size={"xl"}>Click me</Button>
        <h1>Hello, World!</h1>
      </HStack>
    </ChakraProvider>
  )
}

export default App
