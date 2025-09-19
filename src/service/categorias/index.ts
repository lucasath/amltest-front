import api from "../api";
import { ICategora } from "./types";

const urlBase = "/api/categories";
export class CategoriasService {
    static async get() {
        return api.get<ICategora[]>(urlBase);
    }
}
