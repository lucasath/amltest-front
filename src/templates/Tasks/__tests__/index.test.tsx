import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TasksTemplate from '..';
import { useForm } from '@/hooks/form';
import { CategoriasService } from '@/service/categorias';
import axios from 'axios';

jest.mock('@/components/forms/TaskForm', () => {
    const MockTaskForm = () => <div data-testid="task-form-mock" />;
    MockTaskForm.displayName = 'MockTaskForm';
    return MockTaskForm;
});
jest.mock('@/components/molecules/TaskList', () => {
    const MockTaskList = () => <div data-testid="task-list-mock" />;
    MockTaskList.displayName = 'MockTaskList';
    return MockTaskList;
});
jest.mock('@/hooks/form');
jest.mock('@/service/categorias');

const mockUseForm = useForm as jest.Mock;
const mockCategoriasService = CategoriasService as jest.Mocked<typeof CategoriasService>;

describe('TasksTemplate', () => {
    let mockSetFilter: jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
        mockSetFilter = jest.fn();

        mockUseForm.mockReturnValue({
            data: {
                data: {
                    page: {
                        number: 0,
                        totalPages: 5,
                    },
                },
            },
            filter: { page: 0 },
            setFilter: mockSetFilter,
        });

        mockCategoriasService.get.mockResolvedValue({
            data: [
                { nome: 'cat1', descricao: 'Categoria 1' },
                { nome: 'cat2', descricao: 'Categoria 2' },
            ],
            status: 200,
            statusText: 'OK',
            headers: {},
            config: { headers: new (axios.AxiosHeaders)() },
        });
    });

    it('Deve renderizar todos os componentes', () => {
        render(<TasksTemplate />);
        expect(screen.getByText('Minhas Tarefas')).toBeInTheDocument();
        expect(screen.getByTestId('task-form-mock')).toBeInTheDocument();
        expect(screen.getByTestId('task-list-mock')).toBeInTheDocument();
    });

    it('Deve filtrar por categoria', async () => {
        const user = userEvent.setup();
        render(<TasksTemplate />);

        const categorySelect = screen.getByText('Categoria');
        await user.click(categorySelect);

        const option = await screen.findByText('Categoria 1');
        await user.click(option);

        expect(mockSetFilter).toHaveBeenCalledWith({ page: 0, categoria: 'cat1' });
    });

    it('Deve ordenar por prazo', async () => {
        const user = userEvent.setup();
        render(<TasksTemplate />);

        const sortSelect = screen.getByText('Ordenar por');
        await user.click(sortSelect);

        const option = await screen.findByText('Prazo ↑');
        await user.click(option);

        expect(mockSetFilter).toHaveBeenCalledWith({ page: 0, sort: 'prazo,asc' });
    });

    describe('Pagination', () => {
        it('Deve exibir corretamente os textos de paginação', () => {
            render(<TasksTemplate />);
            expect(screen.getByText('Página 1 de 5')).toBeInTheDocument();
        });

        it('Deve desabilitar o botão de anterior na primeira pagina', () => {
            render(<TasksTemplate />);
            expect(screen.getByRole('button', { name: 'Anterior' })).toBeDisabled();
        });

        it('Deve desabilitar o botão de proxima quando estiver na ultima pagina', () => {
            mockUseForm.mockReturnValue({
                ...mockUseForm(),
                data: { data: { page: { number: 4, totalPages: 5 } } },
            });
            render(<TasksTemplate />);
            expect(screen.getByRole('button', { name: 'Próxima' })).toBeDisabled();
        });

        it('Deve chamar o setFiltro quando clicar em proxima', async () => {
            const user = userEvent.setup();
            render(<TasksTemplate />);

            const nextButton = screen.getByRole('button', { name: 'Próxima' });
            await user.click(nextButton);

            expect(mockSetFilter).toHaveBeenCalledWith({ page: 1 });
        });

        it('Deve alterar o filtro quando clicar em anterior', async () => {
            const user = userEvent.setup();
            mockUseForm.mockReturnValue({
                ...mockUseForm(),
                data: { data: { page: { number: 1, totalPages: 5 } } },
                filter: { page: 1 },
            });
            render(<TasksTemplate />);

            const prevButton = screen.getByRole('button', { name: 'Anterior' });
            await user.click(prevButton);

            expect(mockSetFilter).toHaveBeenCalledWith({ page: 0 });
        });
    });
});
