import React, { useEffect, useState } from 'react'
import { Config } from '../lib/bindings';
import { taurpc } from '../lib/ipc';

interface SideBarProps {

}

export const SideBar: React.FC<SideBarProps> = ({ }) => {
	const [configs, setConfigs] = useState<Config[]>([])

	const getConfigs = async () => {
		try {
			const configs = await taurpc.get_configs()
			setConfigs(configs)
		} catch (e) {
			console.error(e)
		}
	}

	useEffect(() => {
		getConfigs()
	}, [])

	return (
		<div className='absolute left-0 top-0 h-screen w-[450px] bg-opacity-80 z-10 bg-[#090909] backdrop-blur-md backdrop-saturate-150 border-r border-[#222255] max-w-[30vw] min-w-[200px]'>
			{/* <div className='absolute left-0 top-0 h-screen w-[450px] bg-opacity-80 z-10 bg-[#090909] backdrop-blur-md backdrop-saturate-150 border-r border-zinc-900 max-w-[30vw] min-w-[200px]'> */}
			<div className='py-5'>

				<h2 className='px-5 border-b border-zinc-900 font-semibold text-lg'>Models</h2>
				<ul>
					{configs.map(({ name, model_path, description }) => (
						<li className='mx-4 px-2 py-4 border-b border-zinc-900'>
							<h1 className='font-semibold text-lg'>{name}</h1>
							<p className='text-gray-400'>{description}</p>
							<span className='text-gray-400'>{model_path}</span>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}