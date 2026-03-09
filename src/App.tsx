// import { HStack, Button } from '@chakra-ui/react'
import { Toaster } from "@/components/ui/toaster"
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter } from 'react-router-dom'

import theme from './thema/thema'
import { Router } from './router/Router'

function App() {

  return (
    <ChakraProvider value={theme}>
      <BrowserRouter>
        <Toaster />
        <Router />
      </BrowserRouter>
    </ChakraProvider>
  )
}

export default App
