import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTurn, fetchAvailability } from "../services/reservation.services.ts";
import type { CreateTurnPayload, ReservationDraft } from "../types/reservation.types.ts";
import type { PaymentMethod } from "../types/pay.type.ts";
import { buildDateTime } from "../utils/reservationDates.ts";
import { createPayment } from "../services/pay.services.ts";

export function useAvailability(
    date: string | null,
    hour: number | null,
    duration: number,
    categoryId?: number,
) {
    return useQuery({
        queryKey: ["availability", date, hour, duration, categoryId ?? "all"],
        queryFn: () => fetchAvailability(date!, hour!, duration, categoryId),
        enabled: Boolean(date) && hour !== null,
        retry: false,
    });
}

export function useCreateTurn() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: CreateTurnPayload) => createTurn(payload),
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ["availability"] }),
                queryClient.invalidateQueries({ queryKey: ["computers-map"] }),
            ]);
        },
    });
}

interface ReserveWithPaymentParams {
    draft: ReservationDraft;
    userId: number;
    paymentMethod: PaymentMethod;
}

export function useReserveWithPayment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ draft, userId, paymentMethod }: ReserveWithPaymentParams) => {
            if (!draft.computer) throw new Error("No hay computadora seleccionada");
            if (!draft.date || draft.hour === null) throw new Error("Fecha u hora no seleccionada");

            const startDate = buildDateTime(draft.date, draft.hour);
            const endDate = buildDateTime(draft.date, draft.hour + draft.duration);
            const totalPrice = (draft.computer.category?.hourly_price ?? 0) * draft.duration;

            // 1. Crear el Turno
            const initialTurnStatus = paymentMethod === "tarjeta" ? "RESERVADO" : "PENDIENTE";
            const turn = await createTurn({
                computerId: draft.computer.id,
                clientId: userId,
                startTime: startDate.toISOString(),
                endTime: endDate.toISOString(),
                status: initialTurnStatus,
            });

            // 2. Registrar el Pago
            const payRes = await createPayment({
                idTurn: turn.id,
                amount: totalPrice,
                method: paymentMethod,
                status: paymentMethod === "tarjeta" ? "PAGADO" : "PENDIENTE",
            });

            return {
                turn,
                paymentInfo: {
                    transactionId: payRes.data.transactionId,
                    status: payRes.data.status,
                    method: payRes.data.method,
                },
            };
        },
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ["availability"] }),
                queryClient.invalidateQueries({ queryKey: ["computers-map"] }),
            ]);
        },
    });
}
