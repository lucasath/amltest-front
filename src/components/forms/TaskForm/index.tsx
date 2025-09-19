import { useForm } from '@/hooks/form';
import { CategoriasService } from '@/service/categorias';
import { ITaskForm } from '@/service/tarefas/types';
import React, { useState } from 'react';
import { SingleValue } from 'react-select';
import AsyncSelect from 'react-select/async';

const initialFormState = {
  titulo: '',
  descricao: '',
  prazo: '',
  categoria: ''
}

const TaskForm = () => {
  const { submitTasks } = useForm();
  const [form, setForm] = useState<ITaskForm>(initialFormState);
  const [categoria, setCategoria] = useState<SingleValue<{ label: string; value: string; }>>();
  const [isFocused, setIsFocused] = useState(false);

  const type = isFocused || form?.prazo ? "date" : "text";

  const loadOptions = (inputValue: string, callback: (options: { label: string, value: string }[]) => void) => {
    CategoriasService.get().then(({ data }) => {
      callback(data
        .map(categoria => ({ value: categoria?.nome, label: categoria?.descricao })))
    });
  }

  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      if (form) {
        submitTasks?.mutateAsync(form).then(() => {
          setForm(initialFormState);
          setCategoria(null);
        })
      }
    }} className="flex flex-col w-full bg-white shadow p-4 rounded-md space-y-3">
      <input name="titulo" className="w-full border px-3 py-2 rounded
      focus:outline-none focus:ring-2 focus:ring-blue-500"
        required value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })} placeholder="Título" />
      <textarea
        name="descricao"
        className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        required value={form.descricao} onChange={e => setForm({ ...form, descricao: e.target.value })} placeholder="Descrição" />
      <input
        name="prazo"
        className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
        type={type}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="Prazo"
        value={form?.prazo}
        onChange={e => {
          setForm({ ...form, prazo: e.target.value });
          e.target.type = 'date';
        }}
      />
      <AsyncSelect
        name="categoria"
        className="w-full border-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400"
        placeholder="Categoria"
        required
        cacheOptions
        defaultOptions
        isClearable
        value={categoria}
        onChange={(option) => {
          setForm({ ...form, categoria: option ? option.value : '' })
          setCategoria(option)
        }}
        loadOptions={loadOptions}
      />
      <button name="adicionar" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700  self-end sm:w-1/3"
        disabled={submitTasks?.isPending} type="submit">Adicionar</button>
    </form>)
}

export default TaskForm;