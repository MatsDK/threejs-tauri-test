import { Provider } from 'jotai'
import { ThreeCanvas } from './components/canvas'
import { Overlay } from './components/Sidebar'
import { store } from './lib/store'

const App = () => {
  return (
    <Provider store={store}>
      <Overlay />
      <ThreeCanvas />
    </Provider>
  )
}

export default App
