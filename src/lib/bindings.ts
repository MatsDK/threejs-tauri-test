// This file has been generated by Specta. DO NOT EDIT.

export type TauRpcEventsOutputTypes = { proc_name: "configs_changed"; output_type: null }

export type TauRpcEventsInputs = { proc_name: "configs_changed"; input_type: null }

export type Joint = { name: string; id: string; mesh_id: string }

export type TauRpcRootApiOutputTypes = { proc_name: "get_configs"; output_type: Config[] }

export type Config = { name: string; description: string; model_path: string; joints: Joint[] }

export type TauRpcRootApiInputs = { proc_name: "get_configs"; input_type: null }


import { createTauRPCProxy as createProxy } from "taurpc"

export const createTauRPCProxy = () => createProxy<Router>()

type Router = {
	'': [TauRpcRootApiInputs, TauRpcRootApiOutputTypes],
	'events': [TauRpcEventsInputs, TauRpcEventsOutputTypes],
}