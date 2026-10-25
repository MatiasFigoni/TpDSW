import { CLOSED_WEEKDAY } from "../types/reservation.types.ts";

/** Date -> "YYYY-MM-DD" usando la hora LOCAL (no UTC). */
export function toLocalDateKey(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

/** "YYYY-MM-DD" -> Date local a las 00:00. */
export function fromLocalDateKey(key: string): Date {
    const [y, m, d] = key.split("-").map(Number);
    return new Date(y, m - 1, d);
}

/** Devuelve un Date local con la fecha y hora indicadas. */
export function buildDateTime(dateKey: string, hour: number): Date {
    const date = fromLocalDateKey(dateKey);
    date.setHours(hour, 0, 0, 0);
    return date;
}

export function isClosedDay(date: Date): boolean {
    return date.getDay() === CLOSED_WEEKDAY;
}

export function nextDays(count: number, from: Date = new Date()): Date[] {
    const start = new Date(from.getFullYear(), from.getMonth(), from.getDate());
    const result: Date[] = [];
    for (let i = 0; i < count; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        result.push(d);
    }
    return result;
}

export function formatHour(hour: number): string {
    return `${String(hour % 24).padStart(2, "0")}:00`;
}

export function formatLongDate(dateKey: string): string {
    return fromLocalDateKey(dateKey).toLocaleDateString("es-AR", {
        weekday: "long",
        day: "numeric",
        month: "long",
    });
}

export function formatPrice(value: number): string {
    return value.toLocaleString("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 0,
    });
}
