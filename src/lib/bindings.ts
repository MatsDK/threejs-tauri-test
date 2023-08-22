// This file has been generated by Specta. DO NOT EDIT.

export type TauRpcRootApiInputs = { proc_name: "get_configs"; input_type: null }

export type Joint = { name: string; id: string; mesh_id: string; constraints: Constraint | null }

export type TauRpcRootApiOutputTypes = { proc_name: "get_configs"; output_type: Config[] }

export type Constraint = { axis: string; min: number; home: number; max: number }

export type TauRpcEventsOutputTypes = { proc_name: "configs_changed"; output_type: null }

export type Config = { name: string; description: string; model_path: string; joints: Joint[]; tcp_offset: number[] }

export type TauRpcEventsInputs = { proc_name: "configs_changed"; input_type: Config[] }


import { createTauRPCProxy as createProxy } from "taurpc"

export const createTauRPCProxy = () => createProxy<Router>()

type Router = {
	'': [TauRpcRootApiInputs, TauRpcRootApiOutputTypes],
	'events': [TauRpcEventsInputs, TauRpcEventsOutputTypes],
}