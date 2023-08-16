import { Provider } from 'jotai'
import { ThreeCanvas } from './components/Canvas'
import { SideBar } from './components/SideBar'
import { store } from './lib/store'

const App = () => {
  return (
    <Provider store={store}>
      <SideBar />
      <ThreeCanvas />
    </Provider>
  )
}

export default App
