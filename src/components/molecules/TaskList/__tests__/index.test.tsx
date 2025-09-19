import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskList from '..';
import { useForm } from '@/hooks/form';

jest.mock('@/hooks/form');

const mockUseForm = useForm as jest.Mock;

describe('TaskList', () => {
    const mockCompleteTask = jest.fn();
    const mockDeleteTask = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('Deve exibir a mensagem Carregando... enquanto busca a listagem', () => {
        mockUseForm.mockReturnValue({
            data: { isLoading: true },
        });

        render(<TaskList />);
        expect(screen.getByText('Carregando...')).toBeInTheDocument();
    });

    it('Deve exibir a mensagem Nenhuma tarefa encontrada quando não retornar nenhum resultado.', () => {
        mockUseForm.mockReturnValue({
            data: {
                isLoading: false,
                data: {
                    page: { totalElements: 0 },
                    content: [],
                },
            },
        });

        render(<TaskList />);
        expect(screen.getByText('Nenhuma tarefa encontrada.')).toBeInTheDocument();
    });

    describe('Quando retornar tasks', () => {
        const tasks = [
            {
                id: 1,
                titulo: 'Task 1',
                descricao: 'Description 1',
                prazo: '2025-10-01',
                categoria: 'Work',
                concluida: false,
            },
            {
                id: 2,
                titulo: 'Task 2',
                descricao: 'Description 2',
                prazo: '2025-10-02',
                categoria: 'Personal',
                concluida: true,
            },
        ];

        beforeEach(() => {
            mockUseForm.mockReturnValue({
                data: {
                    isLoading: false,
                    data: {
                        page: { totalElements: tasks.length },
                        content: tasks,
                    },
                },
                completeTask: { mutate: mockCompleteTask },
                deleteTask: { mutate: mockDeleteTask },
            });
        });

        it('Verificar a renderização da lista de tasks', () => {
            render(<TaskList />);
            expect(screen.getByText('Task 1')).toBeInTheDocument();
            expect(screen.getByText('Description 1')).toBeInTheDocument();
            expect(screen.getByText('Task 2')).toBeInTheDocument();
            expect(screen.getByText('Description 2')).toBeInTheDocument();
        });

        it('Deve exibir a data formatada', () => {
            render(<TaskList />);
            const task1Details = screen.getByText(/Prazo: 01\/10\/2025/);
            expect(task1Details).toBeInTheDocument();
            expect(task1Details).toHaveTextContent('Categoria: Work');
        });

        it('verificar se está adicionando o estilo correto a listagem.', () => {
            render(<TaskList />);
            const completedTaskItem = screen.getByText('Task 2').closest('li');
            expect(completedTaskItem).toHaveClass('bg-blue-100 line-through text-gray-500');
        });

        it('Exibir botão de concluir apenas para tasks não concluidas', () => {
            render(<TaskList />);
            const incompleteTaskItem = screen.getByText('Task 1').closest('li');
            const completedTaskItem = screen.getByText('Task 2').closest('li');

            expect(incompleteTaskItem).toHaveTextContent('Concluir');
            expect(completedTaskItem).not.toHaveTextContent('Concluir');
        });

        it('Deve chamar o mockCompleteTask quando clicar em Concluir.', async () => {
            const user = userEvent.setup();
            render(<TaskList />);

            const completeButton = screen.getByRole('button', { name: 'Concluir' });
            await user.click(completeButton);

            expect(mockCompleteTask).toHaveBeenCalledWith({ id: 1 });
        });

        it('Deve chamar o mockDeleteTask quando clicar em Excluir.', async () => {
            const user = userEvent.setup();
            render(<TaskList />);

            const deleteButtons = screen.getAllByRole('button', { name: 'Excluir' });
            await user.click(deleteButtons[0]);

            expect(mockDeleteTask).toHaveBeenCalledWith({ id: 1 });

            await user.click(deleteButtons[1]);
            expect(mockDeleteTask).toHaveBeenCalledWith({ id: 2 });
        });
    });
});
