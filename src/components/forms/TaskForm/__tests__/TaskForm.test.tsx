import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import TaskForm from '..';
import { useForm } from '@/hooks/form';
import { CategoriasService } from '@/service/categorias';

jest.mock('@/hooks/form');
jest.mock('@/service/categorias');

const mockSubmitTasks = {
    mutateAsync: jest.fn().mockImplementation(async (arg) => {
        await new Promise(resolve => setTimeout(resolve, 100));
        return {
            data: {
                id: 1,
                concluida: false,
                ...arg
            }
        };
    }),
    isPending: false,
};

const mockCategories = [
    { nome: 'categoria1', descricao: 'Categoria 1' },
    { nome: 'categoria2', descricao: 'Categoria 2' },
];

describe('TaskForm', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (useForm as jest.Mock).mockReturnValue({ submitTasks: mockSubmitTasks });
        (CategoriasService.get as jest.Mock).mockResolvedValue({ data: mockCategories });
    });

    it('Renderizar todos os campos do formulario', () => {
        render(<TaskForm />);

        expect(screen.getByPlaceholderText('Título')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Descrição')).toBeInTheDocument();
        expect(screen.getByText('Categoria')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Prazo')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Adicionar/i })).toBeInTheDocument();
    });

    it('Rederiza o formulario com todos os componentes com required', () => {
        render(<TaskForm />);

        expect(screen.getByPlaceholderText('Título')).toHaveAttribute('required');
        expect(screen.getByPlaceholderText('Descrição')).toHaveAttribute('required');
        expect(screen.getByPlaceholderText('Prazo')).toHaveAttribute('required');
        expect(screen.getByRole('combobox')).toHaveAttribute('aria-required', 'true');
    });

    it('Carregar as categorias assim que o componente categoria for renderizado', async () => {
        render(<TaskForm />);

        await waitFor(() => {
            expect(CategoriasService.get).toHaveBeenCalled();
        });
    });

    it('Verificar se o componente categoria está selecionando corretamente', async () => {
        const user = userEvent.setup();
        render(<TaskForm />);

        await waitFor(() => {
            expect(CategoriasService.get).toHaveBeenCalled();
        });

        const categorySelect = screen.getByText('Categoria');
        await user.click(categorySelect);

        await waitFor(() => {
            expect(screen.getByText('Categoria 1')).toBeInTheDocument();
        });

        const option = await screen.findByText('Categoria 1');
        await user.click(option);

        expect(screen.getByText('Categoria 1')).toBeInTheDocument();
    });

    it('Limpar a categoria quando clicado', async () => {
        const user = userEvent.setup();
        render(<TaskForm />);

        await waitFor(() => {
            expect(CategoriasService.get).toHaveBeenCalled();
        });

        const categorySelect = screen.getByText('Categoria');
        await user.click(categorySelect);
        const option = await screen.findByText('Categoria 2');
        await user.click(option);

        const clearButton = categorySelect.querySelector('.css-1xc3v61-indicatorContainer');
        if (clearButton) {
            await user.click(clearButton);
        }

        expect(categorySelect.textContent).toBe('Categoria');
    });

    it('Renderiza botão de adicionar habilitado', () => {
        render(<TaskForm />);

        const submitButton = screen.getByText("Adicionar");
        expect(submitButton).toBeEnabled();
    });

    it('Desabilitar botão quando enviar formulario', () => {
        mockSubmitTasks.isPending = true;
        (useForm as jest.Mock).mockReturnValue({ submitTasks: mockSubmitTasks });

        render(<TaskForm />);

        const submitButton = screen.getByText("Adicionar");
        expect(submitButton).toBeDisabled();
    });

    it('Atualizar dados do formulario quando o usuario digitar em componentes input', async () => {
        const user = userEvent.setup();
        render(<TaskForm />);

        const titleInput = screen.getByPlaceholderText('Título');
        const descriptionInput = screen.getByPlaceholderText('Descrição');
        const dateInput = screen.getByPlaceholderText('Prazo');

        await user.type(titleInput, 'Nova Tarefa');
        await user.type(descriptionInput, 'Descrição da tarefa');
        await user.type(dateInput, '2025-09-20');

        expect(titleInput).toHaveValue('Nova Tarefa');
        expect(descriptionInput).toHaveValue('Descrição da tarefa');
        expect(dateInput).toHaveValue('2025-09-20');
    });

    it('Enviar formulario com os dados corretos', async () => {
        const user = userEvent.setup();
        render(<TaskForm />);

        const titleInput = screen.getByPlaceholderText('Título');
        const descriptionInput = screen.getByPlaceholderText('Descrição');
        const dateInput = screen.getByPlaceholderText('Prazo');
        const submitButton = screen.getByText("Adicionar");

        await user.type(titleInput, 'Nova Tarefa');
        await user.type(descriptionInput, 'Descrição da tarefa');
        await user.type(dateInput, '2025-09-20');
        const categorySelect = screen.getByText('Categoria');
        await user.click(categorySelect);
        const option = await screen.findByText('Categoria 1');
        await user.click(option);
        fireEvent.submit(submitButton);

        expect(mockSubmitTasks.mutateAsync).toHaveBeenCalledWith({
            titulo: "Nova Tarefa",
            descricao: "Descrição da tarefa",
            prazo: "2025-09-20",
            categoria: "categoria1"
        });
    });


    it('Limpar todos os campos depois de enviar com sucesso um formulario', async () => {
        const user = userEvent.setup();
        render(<TaskForm />);

        const titleInput = screen.getByPlaceholderText('Título');
        const descriptionInput = screen.getByPlaceholderText('Descrição');
        const categorySelect = screen.getByText('Categoria');
        const dateInput = screen.getByPlaceholderText('Prazo');
        const submitButton = screen.getByText("Adicionar");

        await user.type(titleInput, 'Nova Tarefa');
        await user.type(descriptionInput, 'Descrição da tarefa');
        await user.type(dateInput, '2025-09-20');
        await user.click(categorySelect);
        const option = await screen.findByText('Categoria 1');
        await user.click(option);

        fireEvent.submit(submitButton);

        await waitFor(() => {
            expect(titleInput).toHaveValue('');
            expect(descriptionInput).toHaveValue('');
            expect(dateInput).toHaveValue('');
            expect(categorySelect.textContent).toBe('Categoria');
        });
    });
});