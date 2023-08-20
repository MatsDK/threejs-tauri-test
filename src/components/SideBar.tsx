import { SidebarState, sidebarStateAtom } from '@lib/store'
import { useAtom } from 'jotai'
import { ImportModel } from './ImportModel'
import { SceneLayout } from './SceneLayout'
import { TransformModal } from './TransformModal'

export const Overlay = () => {
  return (
    <>
      <Sidebar />
      <TransformModal />
    </>
  )
}

const views = {
  [SidebarState.CHOOSE_MODEL]: ImportModel,
  [SidebarState.SCENE_INFO]: SceneLayout,
}

const Sidebar = ({}) => {
  const [sidebarState, setSidebarState] = useAtom(sidebarStateAtom)
  if (sidebarState == SidebarState.COLLAPSED) {
    return null
  }

  const SidebarView = views[sidebarState]

  return (
    // <div className='absolute left-0 top-0 h-screen w-[450px] bg-opacity-80 z-10 bg-[#090909] backdrop-blur-md backdrop-saturate-150 border-r border-[#222255] max-w-[30vw] min-w-[200px]'>
    <div className='absolute z-10 left-0 top-0 h-screen w-[450px] bg-opacity-80 bg-[#090909] backdrop-blur-md backdrop-saturate-150 border-r border-zinc-900 max-w-[30vw] min-w-[200px] overflow-hidden'>
      <SidebarView />
    </div>
  )
}
