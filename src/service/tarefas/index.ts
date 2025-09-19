import { IPage, IPageable } from "@/@types/pageable";
import api from "../api";
import { ITaskForm, ITaskResponse } from "./types";

const urlBase = "/api/tasks";
export class TarefasService {
    static async get(props: { categoria?: string } & IPageable) {
        return api.get<IPage<ITaskResponse>>(urlBase, { params: props });
    }

    static async putConcluir({ id }: { id: number }) {
        return api.put(`${urlBase}/${id}/complete`);
    }

    static async delete({ id }: { id: number }) {
        return api.delete(`${urlBase}/${id}`);
    }

    static async post({ form }: { form: ITaskForm }) {
        return api.post<ITaskResponse>(urlBase, form);
    }
}
