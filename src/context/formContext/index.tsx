import { IPage } from "@/@types/pageable"
import { TarefasService } from "@/service/tarefas"
import { ITaskForm, ITaskResponse } from "@/service/tarefas/types"
import { useMutation, UseMutationResult, useQuery, UseQueryResult } from "@tanstack/react-query"
import { createContext, useState } from "react"

export interface TasksContext {
    submitTasks: UseMutationResult<ITaskResponse, Error, ITaskForm, unknown>,
    completeTask: UseMutationResult<unknown, Error, Parameters<typeof TarefasService.putConcluir>[0], unknown>,
    deleteTask: UseMutationResult<unknown, Error, Parameters<typeof TarefasService.delete>[0], unknown>,
    data: UseQueryResult<IPage<ITaskResponse>, Error>,
    filter?: Parameters<typeof TarefasService.get>[0],
    setFilter?: React.Dispatch<React.SetStateAction<Parameters<typeof TarefasService.get>[0]>>
}

export const formContext = createContext({
    submitTasks: {} as UseMutationResult<ITaskResponse, Error, ITaskForm, unknown>,
    completeTask: {} as UseMutationResult<unknown, Error, Parameters<typeof TarefasService.putConcluir>[0], unknown>,
    deleteTask: {} as UseMutationResult<unknown, Error, Parameters<typeof TarefasService.delete>[0], unknown>,
    data: {} as UseQueryResult<IPage<ITaskResponse>, Error>,
    filter: {} as Parameters<typeof TarefasService.get>[0],
    setFilter: {} as React.Dispatch<React.SetStateAction<Parameters<typeof TarefasService.get>[0]>>
})

import { ReactNode } from "react"

export const FormProvider = ({ children }: { children: ReactNode }) => {
    const [filter, setFilter] = useState<Parameters<typeof TarefasService.get>[0]>({ page: 0, size: 10, sort: 'prazo,desc' })

    const data = useQuery({
        queryKey: ['tasks', filter],
        queryFn: async () => TarefasService.get(filter).then(({ data }) => data),
        retry: 1,
        refetchOnWindowFocus: false,
        enabled: true,
    })

    const mutationSubmit = useMutation({
        mutationFn: (form: ITaskForm) => TarefasService.post({ form }).then(({ data }) => data),
        onSuccess: () => {
            data.refetch()
        }
    })

    const mutationComplete = useMutation({
        mutationFn: (params: Parameters<typeof TarefasService.putConcluir>[0]) => TarefasService.putConcluir(params).then((data) => data),
        onSuccess: () => {
            data.refetch()
        }
    })

    const mutationDelete = useMutation({
        mutationFn: (params: Parameters<typeof TarefasService.delete>[0]) => TarefasService.delete(params).then((data) => data),
        onSuccess: () => {
            data.refetch()
        }
    })

    return (
        <formContext.Provider
            value={{
                submitTasks: mutationSubmit,
                completeTask: mutationComplete,
                deleteTask: mutationDelete,
                data: data,
                filter,
                setFilter
            }}
        >
            {children}
        </formContext.Provider>
    );
}