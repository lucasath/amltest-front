import { useContext } from "react";
import { formContext } from "@/context/formContext";

export function useForm() {
    const context = useContext(formContext)

    if (!context) {
        throw new Error('useForm must be used within a FormProvider');
    }
    return context;
}