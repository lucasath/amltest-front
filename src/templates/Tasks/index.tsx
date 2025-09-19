import TaskForm from "@/components/forms/TaskForm";
import TaskList from "@/components/molecules/TaskList";
import { useForm } from "@/hooks/form";
import { CategoriasService } from "@/service/categorias";
import React, { useState } from "react";
import { SingleValue } from "react-select";
import AsyncSelect from "react-select/async";
import Select from "react-select";

const Option = [{
  label: 'Prazo ↑', value: 'prazo,asc'
}, {
  label: 'Prazo ↓', value: 'prazo,desc'
}]

const TasksTemplate = () => {
  const { data, filter, setFilter } = useForm();
  const [categoria, setCategoria] = useState<SingleValue<{ label: string; value: string; }>>();
  const [sort, setSort] = useState<SingleValue<{ label: string; value: string; }>>();

  const loadOptions = (inputValue: string, callback: (options: { label: string, value: string }[]) => void) => {
    CategoriasService.get().then(({ data }) => {
      callback(data
        .map(categoria => ({ value: categoria?.nome, label: categoria?.descricao })))
    });
  }

  return <div className="mx-auto p-6 max-w-150 min-w-120 flex flex-col space-between gap-2">
    <h1 className="text-3xl font-bold text-gray-600 self-center">Minhas Tarefas</h1>

    <TaskForm />

    <div className="sm:w-full gap-0 flex flex-col">
      <div className="flex flex-col flex-wrap items-center gap-4 my-6 justify-end sm:flex-row">
        <AsyncSelect
          className="rounded focus:ring focus:border-blue-400 w-full sm:w-1/3"
          placeholder="Categoria"
          required
          cacheOptions
          defaultOptions
          isClearable
          value={categoria}
          onChange={option => {
            setFilter({ ...filter, categoria: option ? option.value : '' })
            setCategoria(option)
          }}
          loadOptions={loadOptions}
        />

        <Select

          className="rounded focus:ring focus:border-blue-400 w-full sm:w-2/5"
          isClearable
          placeholder="Ordenar por"
          options={Option}
          value={sort ?? null}
          onChange={e => {
            setFilter({ ...filter, sort: e?.value as 'asc' | 'desc' | undefined })
            setSort(e)
          }}
        />

      </div>

      <TaskList />
    </div>

    <div className="flex justify-between items-center mt-6">
      <button
        className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 cursor-pointer disabled:cursor-auto"
        disabled={data?.data?.page?.number === 0}
        onClick={() => setFilter({ ...filter, page: (filter?.page || 0) - 1 })}
      >
        Anterior
      </button>
      <span className="text-gray-700">
        Página {(data?.data?.page?.number !== undefined ? data.data.page.number + 1 : 1)} de {data?.data?.page?.totalPages || 1}
      </span>
      <button
        className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 cursor-pointer disabled:cursor-auto"
        disabled={typeof data?.data?.page?.number !== "number" ? true : data?.data?.page?.totalPages === data?.data?.page?.number + 1}
        onClick={() => setFilter({ ...filter, page: (filter?.page || 0) + 1 })}
      >
        Próxima
      </button>
    </div>
  </div>;
}

export default TasksTemplate;