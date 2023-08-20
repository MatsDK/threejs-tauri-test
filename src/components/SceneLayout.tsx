import { sceneStateAtom } from '@lib/store'
import { useAtomValue } from 'jotai'
import { RobotControllerList } from './RobotList'
import { TargetList } from './TargetList'

export const SceneLayout = () => {
  const sceneState = useAtomValue(sceneStateAtom)!

  return (
    <div className='flex flex-col '>
      <RobotControllerList />
      <TargetList />
    </div>
  )
}
