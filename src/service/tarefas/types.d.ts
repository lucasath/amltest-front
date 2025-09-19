export interface ITaskResponse {
    titulo: string;
    descricao: string;
    prazo: string;
    categoria: string;
    concluida: boolean;
    id: number;
}

export type ITaskForm = Omit<ITaskResponse, "concluida" | "id">;
