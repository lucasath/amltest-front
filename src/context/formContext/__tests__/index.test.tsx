import { render, screen, waitFor } from '@testing-library/react';
import { FormProvider, formContext } from '..';
import { useContext } from 'react';
import { ITaskForm } from '@/service/tarefas/types';
import { TarefasService } from '@/service/tarefas';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import userEvent from '@testing-library/user-event';

jest.mock('@/service/tarefas');

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
        <FormProvider>{children}</FormProvider>
    </QueryClientProvider>
);

const TestComponent = () => {
    const {
        data,
        submitTasks,
        completeTask,
        deleteTask,
        setFilter,
        filter,
    } = useContext(formContext);

    const handleAddTask = () => {
        const newTask: ITaskForm = {
            titulo: 'New Task',
            descricao: 'New Description',
            prazo: '2025-12-31',
            categoria: 'test',
        };
        submitTasks.mutateAsync(newTask);
    };

    const handleCompleteTask = () => {
        completeTask.mutateAsync({ id: 1 });
    };

    const handleDeleteTask = () => {
        deleteTask.mutateAsync({ id: 1 });
    };

    const handleFilterChange = () => {
        setFilter?.({ ...filter, page: 1 });
    };

    return (
        <div>
            <div data-testid="tasks-data">{JSON.stringify(data.data)}</div>
            <button onClick={handleAddTask}>Add Task</button>
            <button onClick={handleCompleteTask}>Complete Task</button>
            <button onClick={handleDeleteTask}>Delete Task</button>
            <button onClick={handleFilterChange}>Change Filter</button>
        </div>
    );
};

describe('FormProvider', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        queryClient.clear();
        (TarefasService.get as jest.Mock).mockResolvedValue({
            data: { content: [{ id: 1, titulo: 'Test Task' }] },
        });
        (TarefasService.post as jest.Mock).mockResolvedValue({ data: { id: '2' } });
        (TarefasService.putConcluir as jest.Mock).mockResolvedValue({ data: {} });
        (TarefasService.delete as jest.Mock).mockResolvedValue({ data: {} });
    });

    it('Buscar listagem quando renderizar', async () => {
        render(<TestComponent />, { wrapper });

        await waitFor(() => {
            expect(TarefasService.get).toHaveBeenCalledWith({
                page: 0,
                size: 10,
                sort: 'prazo,desc',
            });
        });

        await waitFor(() => {
            expect(screen.getByTestId('tasks-data')).toHaveTextContent(
                '{"content":[{"id":1,"titulo":"Test Task"}]}'
            );
        });
    });

    it('Verificar se está o submitTasks mutation está chamando o TarefaService.post', async () => {
        const user = userEvent.setup();
        render(<TestComponent />, { wrapper });

        const addTaskButton = screen.getByText('Add Task');
        await user.click(addTaskButton);

        await waitFor(() => {
            expect(TarefasService.post).toHaveBeenCalledWith({
                form: {
                    titulo: 'New Task',
                    descricao: 'New Description',
                    prazo: '2025-12-31',
                    categoria: 'test',
                },
            });
        });
    });

    it('Verificar se está o completeTasks mutation está chamando o TarefaService.putConcluir', async () => {
        const user = userEvent.setup();
        render(<TestComponent />, { wrapper });

        const completeTaskButton = screen.getByText('Complete Task');
        await user.click(completeTaskButton);

        await waitFor(() => {
            expect(TarefasService.putConcluir).toHaveBeenCalledWith({ id: 1 });
        });
    });

    it('Verificar se está o deleteTasks mutation está chamando o TarefaService.delete', async () => {
        const user = userEvent.setup();
        render(<TestComponent />, { wrapper });

        const deleteTaskButton = screen.getByText('Delete Task');
        await user.click(deleteTaskButton);

        await waitFor(() => {
            expect(TarefasService.delete).toHaveBeenCalledWith({ id: 1 });
        });
    });

    it('Atualizar a lista de tasks quando o filtro mudar', async () => {
        const user = userEvent.setup();
        render(<TestComponent />, { wrapper });

        await waitFor(() => {
            expect(TarefasService.get).toHaveBeenCalledTimes(1);
        });

        const changeFilterButton = screen.getByText('Change Filter');
        await user.click(changeFilterButton);

        await waitFor(() => {
            expect(TarefasService.get).toHaveBeenCalledWith({
                page: 1,
                size: 10,
                sort: 'prazo,desc',
            });
        });

        expect(TarefasService.get).toHaveBeenCalledTimes(2);
    });

    it('Atualizar listagem apos algum mutation for chamado', async () => {
        const user = userEvent.setup();
        render(<TestComponent />, { wrapper });

        await waitFor(() => expect(TarefasService.get).toHaveBeenCalledTimes(1));

        const addTaskButton = screen.getByText('Add Task');
        await user.click(addTaskButton);

        await waitFor(() => expect(TarefasService.post).toHaveBeenCalledTimes(1));
        await waitFor(() => expect(TarefasService.get).toHaveBeenCalledTimes(2));
    });
});
