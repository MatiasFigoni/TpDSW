import { useState } from "react";
import { useAuth } from "../../hooks/useAuth.ts";
import { useCategory } from "../../hooks/hooksCategories.ts";
import { useAvailability, useReserveWithPayment } from "../../hooks/hooksReservation.ts";
import { EMPTY_DRAFT, type ReservationDraft, type ReservationStep } from "../../types/reservation.types.ts";
import type { Category } from "../../types/category.class.ts";
import type { Computer } from "../../types/computer.class.ts";
import StepHeader from "../../components/Reservation/StepHeader.tsx";
import StepCategory from "../../components/Reservation/StepCategory.tsx";
import StepDateTime from "../../components/Reservation/StepDateTime.tsx";
import StepComputer from "../../components/Reservation/StepComputer.tsx";
import StepConfirmation from "../../components/Reservation/StepConfirmation.tsx";
import Loading from "../../components/Loading/loading.tsx";
import type { PaymentMethod } from "../../types/pay.type.ts";

function Reserve() {
    const { user } = useAuth();
    const { data: categories = [], isLoading: isLoadingCategories } = useCategory();

    const [step, setStep] = useState<ReservationStep>(1);
    const [maxReachedStep, setMaxReachedStep] = useState<ReservationStep>(1);
    const [draft, setDraft] = useState<ReservationDraft>(EMPTY_DRAFT);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);

    // Consulta de disponibilidad para el paso 3
    const { data: availabilityData, isLoading: isLoadingAvailability, error: availabilityError,
    } = useAvailability(
        draft.date,
        draft.hour,
        draft.duration,
        draft.category ? draft.category.id : undefined
    );

    // Mutación reserva y pago
    const reserveMutation = useReserveWithPayment();
    const createdTurn = reserveMutation.data?.turn ?? null;
    const paymentInfo = reserveMutation.data?.paymentInfo ?? null;


    const advanceTo = (nextStep: ReservationStep) => {
        setStep(nextStep);
        setMaxReachedStep((prevStep) => (nextStep > prevStep ? nextStep : prevStep) as ReservationStep);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSelectCategory = (cat: Category | null) => {
        setDraft((prevDraft) => ({
            ...prevDraft,
            category: cat,
            // Resetear PC seleccionada si cambió categoría
            computer: prevDraft.category?.id !== cat?.id ? null : prevDraft.computer,
        }));
        advanceTo(2);
    };

    const handleSelectDate = (dateKey: string) => {
        setDraft((prevDraft) => ({ ...prevDraft, date: dateKey, computer: null }));
    };

    const handleSelectHour = (hour: number) => {
        setDraft((prevDraft) => ({ ...prevDraft, hour, computer: null }));
    };

    const handleChangeDuration = (duration: number) => {
        setDraft((prevDraft) => ({
            ...prevDraft,
            duration,
            computer: null,
            // Si la hora actual excede las 24hs con la nueva duración, resetear hora
            hour: prevDraft.hour !== null && prevDraft.hour + duration > 24 ? null : prevDraft.hour,
        }));
    };

    const handleSelectComputer = (pc: Computer) => {
        setDraft((prevDraft) => ({ ...prevDraft, computer: pc }));
    };

    const handleConfirmBooking = () => {
        if (!user || !draft.computer || !draft.date || draft.hour === null || !paymentMethod) return;

        reserveMutation.mutateAsync({
            draft,
            userId: user.id,
            paymentMethod,
        });

    };

    const handleReset = () => {
        reserveMutation.reset();
        setDraft(EMPTY_DRAFT);
        setPaymentMethod(null);
        setStep(1);
        setMaxReachedStep(1);
    };

    return (
        <section className="relative min-h-screen bg-zinc-950 text-zinc-100 pt-24 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
            <div className="max-w-6xl mx-auto">
                {/* Cabecera del Asistente con Progreso */}
                <StepHeader
                    step={step}
                    maxReachedStep={maxReachedStep}
                    onBack={step > 1 && !createdTurn ? () => setStep((s) => (s - 1) as ReservationStep) : undefined}
                    onGoTo={(target) => !createdTurn && setStep(target)}
                />

                {/* Paso 1: Selección de Categoría */}
                {step === 1 && (
                    isLoadingCategories ? (
                        <div className="py-20 flex justify-center">
                            <Loading />
                        </div>
                    ) : (
                        <StepCategory
                            categories={categories}
                            selected={draft.category}
                            onSelect={handleSelectCategory}
                        />
                    ))}


                {/* Paso 2: Selección de Fecha, Hora y Duración */}
                {step === 2 && (
                    <StepDateTime
                        date={draft.date}
                        hour={draft.hour}
                        duration={draft.duration}
                        onSelectDate={handleSelectDate}
                        onSelectHour={handleSelectHour}
                        onChangeDuration={handleChangeDuration}
                        onContinue={() => advanceTo(3)}
                    />
                )}

                {/* Paso 3: Selección de Computadora */}
                {step === 3 && (
                    <StepComputer
                        computers={availabilityData?.data ?? []}
                        selectedComputer={draft.computer}
                        duration={draft.duration}
                        isLoading={isLoadingAvailability}
                        error={availabilityError as Error | null}
                        onSelectComputer={handleSelectComputer}
                        onContinue={() => advanceTo(4)}
                    />
                )}

                {/* Paso 4: Confirmación y Resumen */}
                {step === 4 && (
                    <StepConfirmation
                        draft={draft}
                        user={user}
                        isSubmitting={reserveMutation.isPending}
                        submitError={reserveMutation.error}
                        createdTurn={createdTurn}
                        paymentMethod={paymentMethod}
                        paymentInfo={paymentInfo}
                        onSelectPaymentMethod={setPaymentMethod}
                        onConfirm={handleConfirmBooking}
                        onReset={handleReset}
                    />
                )}
            </div>
        </section>
    );
}

export default Reserve;