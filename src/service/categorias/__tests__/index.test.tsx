import api from "../../api";
import { CategoriasService } from "../index";
import { ICategora } from "../types";

jest.mock("../../api", () => ({
    get: jest.fn(),
}));

describe("CategoriasService", () => {
    const mockCategorias: ICategora[] = [
        { nome: 'categoria1', descricao: 'Categoria 1' },
        { nome: 'categoria2', descricao: 'Categoria 2' },
    ];

    it("deve chamar o endpoint correto", async () => {
        (api.get as jest.Mock).mockResolvedValueOnce({ data: mockCategorias });

        const response = await CategoriasService.get();

        expect(api.get).toHaveBeenCalledWith("/api/categories");
        expect(response.data).toEqual(mockCategorias);
    });

    it("deve propagar erro se a API falhar", async () => {
        const error = new Error("Erro de rede");
        (api.get as jest.Mock).mockRejectedValueOnce(error);

        await expect(CategoriasService.get()).rejects.toThrow("Erro de rede");
    });
});