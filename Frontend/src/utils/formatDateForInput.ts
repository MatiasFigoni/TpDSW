export const formatDateForInput = (date: Date | string | undefined | null) => {
        if (!date) return "";
        // Si ya es un objeto Date
        if (date instanceof Date) {
            const year = date.getUTCFullYear();
            const month = String(date.getUTCMonth() + 1).padStart(2, "0");
            const day = String(date.getUTCDate()).padStart(2, "0");
            return `${year}-${month}-${day}`;
        }
        // Si es un string ISO (ej: "2024-06-10T00:00:00.000Z")
        return date.split("T")[0];
    };