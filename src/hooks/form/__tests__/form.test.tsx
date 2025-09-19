import { renderHook } from '@testing-library/react';
import { useForm } from '..';
import { FormProvider } from '@/context/formContext';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

describe('useForm', () => {
    it('Deve retornar os valores do contexto quando usado dentro do provider', () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => {
            const queryClient = new QueryClient();
            return (
                <QueryClientProvider client={queryClient}>
                    <FormProvider>{children}</FormProvider>
                </QueryClientProvider>
            );
        };

        const { result } = renderHook(() => useForm(), { wrapper });

        expect(result.current).toBeDefined();
        expect(result.current.data).toBeDefined();
        expect(result.current.submitTasks).toBeDefined();
        expect(result.current.completeTask).toBeDefined();
        expect(result.current.deleteTask).toBeDefined();
        expect(result.current.filter).toBeDefined();
        expect(result.current.setFilter).toBeDefined();
    });

    it('Deve retornar erro quando usado fora do provider', () => {
        const originalError = console.error;
        console.error = jest.fn();

        expect(() => useForm()).toThrow();
        console.error = originalError;
    });
});
