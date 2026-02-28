import { HStack, Button } from '@chakra-ui/react'
import './App.css'
import { Provider } from './components/ui/provider'

function App() {

  return (
    <Provider>
      <HStack>
        <Button>Click me</Button>
      </HStack>
    </Provider>
  )
}

export default App
