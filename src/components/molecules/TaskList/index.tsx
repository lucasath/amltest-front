'use client'
import { useForm } from "@/hooks/form";
import React from "react";


export default function TaskList() {
  const { data, completeTask, deleteTask } = useForm()

  if (data.isLoading) return <p className="text-gray-500">Carregando...</p>;

  if (!data?.data?.page?.totalElements) return <p className="text-gray-500">Nenhuma tarefa encontrada.</p>;

  return (
    <ul className="space-y-2">
      {data?.data?.content?.map(t => (
        <li
          key={t.id}
          className={`flex justify-between items-center p-4 border rounded shadow-sm ${t.concluida ? "bg-blue-100 line-through text-gray-500" : "bg-white"
            }`}
        >
          <div>
            <h3 className="font-semibold text-lg">{t.titulo}</h3>
            <p className="text-sm">{t.descricao}</p>
            <small className="text-xs text-gray-600">
              Prazo: {t.prazo?.split('-').reverse().join('/') ?? "-"} • Categoria: <span className="capitalize">{t.categoria}</span>
            </small>
          </div>
          <div className="flex gap-2">
            {!t.concluida && (
              <button
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => completeTask?.mutate({ id: t.id })}
              >
                Concluir
              </button>
            )}
            <button
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              onClick={() => deleteTask?.mutate({ id: t.id })}
            >
              Excluir
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}