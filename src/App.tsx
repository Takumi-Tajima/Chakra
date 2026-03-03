// import { HStack, Button } from '@chakra-ui/react'
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter } from 'react-router-dom'

import theme from './thema/thema'
import { Router } from './router/Router'

function App() {

  return (
    <ChakraProvider value={theme}>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </ChakraProvider>
  )
}

export default App
