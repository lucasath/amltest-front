import api from "../../api";
import { TarefasService } from "../index";
import { ITaskForm, ITaskResponse } from "../types";
import { IPage } from "@/@types/pageable";

// 🔹 mock do módulo api
jest.mock("../../api", () => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
}));

describe("TarefasService", () => {
    const mockTask: ITaskResponse = {
        id: 1,
        titulo: "Teste de Tarefa",
        descricao: "Teste de descrição",
        prazo: "2025-09-20",
        concluida: false,
        categoria: "ESTUDO",
    };

    it("get() deve chamar o endpoint correto com params", async () => {
        const mockPage: IPage<ITaskResponse> = {
            content: [mockTask],
            page: { totalElements: 1, totalPages: 1, size: 10, number: 0 },
        };

        (api.get as jest.Mock).mockResolvedValueOnce({ data: mockPage });

        const response = await TarefasService.get({ categoria: "ESTUDO", page: 0, size: 10 });

        expect(api.get).toHaveBeenCalledWith("/api/tasks", {
            params: { categoria: "ESTUDO", page: 0, size: 10 },
        });
        expect(response.data).toEqual(mockPage);
    });

    it("putConcluir() deve chamar o endpoint correto", async () => {
        (api.put as jest.Mock).mockResolvedValueOnce({ data: { ...mockTask, concluida: true } });

        const response = await TarefasService.putConcluir({ id: 1 });

        expect(api.put).toHaveBeenCalledWith("/api/tasks/1/complete");
        expect(response.data.concluida).toBe(true);
    });

    it("delete() deve chamar o endpoint correto", async () => {
        (api.delete as jest.Mock).mockResolvedValueOnce({ status: 204 });

        const response = await TarefasService.delete({ id: 1 });

        expect(api.delete).toHaveBeenCalledWith("/api/tasks/1");
        expect(response.status).toBe(204);
    });

    it("post() deve chamar o endpoint correto com body", async () => {
        const form: ITaskForm = {
            titulo: "Nova tarefa",
            descricao: "Teste unitário",
            prazo: "2025-09-30",
            categoria: "TRABALHO",
        };

        (api.post as jest.Mock).mockResolvedValueOnce({ data: { ...mockTask, ...form } });

        const response = await TarefasService.post({ form });

        expect(api.post).toHaveBeenCalledWith("/api/tasks", form);
        expect(response.data.titulo).toBe("Nova tarefa");
    });

    it("deve propagar erros da API", async () => {
        const error = new Error("Falha na API");
        (api.get as jest.Mock).mockRejectedValueOnce(error);

        await expect(TarefasService.get({ page: 0, size: 10 })).rejects.toThrow("Falha na API");
    });
});
