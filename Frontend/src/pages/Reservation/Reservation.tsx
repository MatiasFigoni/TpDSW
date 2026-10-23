import { useState } from 'react';
import { ArrowLeft, ArrowRight, CalendarCheck, Loader2, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router';
import StepIndicator from '../../components/Reservation/StepIndicator.tsx';
import CategoryStep from '../../components/Reservation/CategoryStep.tsx';
import DateStep from '../../components/Reservation/DateStep.tsx';
import TimeSlotStep from '../../components/Reservation/TimeSlotStep.tsx';
import ComputerStep from '../../components/Reservation/ComputerStep.tsx';
import type { Category } from '../../types/category.class.ts';
import type { Computer } from '../../types/computer.class.ts';
import { useCreateTurn } from '../../hooks/hooksTurns.ts';
import { useAuth } from '../../hooks/useAuth.ts';
import { createPayment } from '../../services/pay.services.ts';

const STEPS = ['Categoría', 'Fecha', 'Horario', 'Equipo'];

export default function Reservation() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const createTurnMutation = useCreateTurn();

  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedHour, setSelectedHour] = useState<number | null>(null);
  const [selectedDuration, setSelectedDuration] = useState(1);
  const [selectedComputer, setSelectedComputer] = useState<Computer | null>(null);

  // Payment method state ('mostrador' | 'tarjeta')
  const [paymentMethod, setPaymentMethod] = useState<'mostrador' | 'tarjeta'>('mostrador');
  const [paymentInfo, setPaymentInfo] = useState<{ transactionId: string; status: string } | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Success state
  const [success, setSuccess] = useState(false);

  const canGoNext = (): boolean => {
    switch (step) {
      case 1:
        return selectedCategory !== null;
      case 2:
        return selectedDate !== '';
      case 3:
        return selectedHour !== null;
      case 4:
        return selectedComputer !== null;
      default:
        return false;
    }
  };

  const goNext = () => {
    if (step < 4 && canGoNext()) {
      setStep(step + 1);
    }
  };

  const goBack = () => {
    if (step > 1) {
      // Reset dependent selections when going back
      if (step === 2) {
        setSelectedDate('');
        setSelectedHour(null);
        setSelectedDuration(1);
        setSelectedComputer(null);
      } else if (step === 3) {
        setSelectedHour(null);
        setSelectedDuration(1);
        setSelectedComputer(null);
      } else if (step === 4) {
        setSelectedComputer(null);
      }
      setStep(step - 1);
    }
  };

  const handleConfirm = async () => {
    if (!user || !selectedComputer || !selectedHour || !selectedDate) return;

    const [year, month, day] = selectedDate.split('-').map(Number);
    const startTime = new Date(year, month - 1, day, selectedHour, 0, 0, 0);
    const endTime = new Date(year, month - 1, day, selectedHour + selectedDuration, 0, 0, 0);
    const totalPrice = selectedCategory ? selectedCategory.hourly_price * selectedDuration : 0;

    setIsProcessingPayment(true);
    try {
      // 1. Crear el Turno
      const initialTurnStatus = paymentMethod === 'tarjeta' ? 'RESERVADO' : 'PENDIENTE';
      const result = await createTurnMutation.mutateAsync({
        computerId: Number(selectedComputer.id),
        clientId: user.id,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        status: initialTurnStatus,
      });

      const newTurn = result.data;

      // 2. Registrar el pago (Tarjeta -> PAGADO con aprobación inmediata, Mostrador -> PENDIENTE)
      const payRes = await createPayment({
        idTurn: newTurn.id,
        amount: totalPrice,
        method: paymentMethod === 'tarjeta' ? 'tarjeta' : 'efectivo',
        status: paymentMethod === 'tarjeta' ? 'PAGADO' : 'PENDIENTE',
      });

      setPaymentInfo({
        transactionId: payRes.data.transactionId,
        status: payRes.data.status,
      });
      setSuccess(true);
    } catch {
      // Error is handled by mutation state
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Success screen
  if (success) {
    const totalPrice = selectedCategory ? selectedCategory.hourly_price * selectedDuration : 0;
    const isTarjeta = paymentMethod === 'tarjeta';

    return (
      <section className="pt-28 pb-24 min-h-screen bg-zinc-950 overflow-hidden relative">
        <div className="max-w-lg mx-auto px-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
            <div className="w-20 h-20 bg-emerald-500/15 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto">
              <CalendarCheck className="w-10 h-10 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">¡Reserva confirmada!</h2>
              <p className="text-zinc-400 text-sm">
                {isTarjeta
                  ? 'Tu pago con tarjeta fue aprobado y el turno ha quedado RESERVADO.'
                  : 'Tu turno fue registrado como PENDIENTE. Abonás en efectivo al presentarte en mostrador.'}
              </p>
            </div>

            <div className="bg-zinc-950 rounded-xl p-4 space-y-2.5 text-sm text-left border border-zinc-800/80">
              <div className="flex justify-between">
                <span className="text-zinc-500">Categoría</span>
                <span className="text-white font-medium">{selectedCategory?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Fecha</span>
                <span className="text-white font-medium capitalize">
                  {new Date(selectedDate + 'T12:00:00').toLocaleDateString('es-AR', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Horario</span>
                <span className="text-white font-medium">
                  {`${String(selectedHour).padStart(2, '0')}:00 — ${String(selectedHour! + selectedDuration).padStart(2, '0')}:00`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">PC Asignada</span>
                <span className="text-white font-medium">#{selectedComputer?.pcNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Medio de Pago</span>
                <span className="text-white font-medium">
                  {isTarjeta ? 'Tarjeta (Crédito / Débito)' : 'En Mostrador (Efectivo)'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Estado de Pago</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${
                    isTarjeta
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                  }`}
                >
                  {isTarjeta ? 'PAGADO (Aprobado)' : 'PENDIENTE DE COBRO'}
                </span>
              </div>

              {paymentInfo?.transactionId && (
                <div className="flex justify-between pt-1 border-t border-zinc-800/60 text-xs">
                  <span className="text-zinc-500">Comprobante</span>
                  <span className="text-zinc-300 font-mono">{paymentInfo.transactionId}</span>
                </div>
              )}

              <div className="flex justify-between pt-2 border-t border-zinc-800">
                <span className="text-zinc-500 font-semibold">Total</span>
                <span className="text-blue-400 font-bold text-lg">${totalPrice.toLocaleString('es-AR')}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => navigate('/')}
                className="flex-1 py-3 rounded-xl border border-zinc-700 text-zinc-300 font-medium hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Volver al inicio
              </button>
              <button
                onClick={() => {
                  setSuccess(false);
                  setStep(1);
                  setSelectedCategory(null);
                  setSelectedDate('');
                  setSelectedHour(null);
                  setSelectedDuration(1);
                  setSelectedComputer(null);
                  setPaymentMethod('mostrador');
                  setPaymentInfo(null);
                }}
                className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 cursor-pointer"
              >
                Nueva reserva
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Login required
  if (!user) {
    return (
      <section className="pt-28 pb-24 min-h-screen bg-zinc-950 overflow-hidden relative">
        <div className="max-w-md mx-auto px-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 bg-blue-500/15 border border-blue-500/30 rounded-full flex items-center justify-center mx-auto">
              <CalendarCheck className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Reservar un turno</h2>
              <p className="text-zinc-400 text-sm">Necesitás iniciar sesión para hacer una reserva.</p>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="w-full py-3.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 cursor-pointer"
            >
              Iniciar sesión
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-28 pb-24 min-h-screen bg-zinc-950 overflow-hidden relative">
      {/* Background effects */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/3 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-3xl mx-auto px-6 relative z-10">
        {/* Step indicator */}
        <StepIndicator currentStep={step} steps={STEPS} />

        {/* Step content card */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 md:p-10 shadow-2xl backdrop-blur-sm min-h-[400px]">
          {step === 1 && (
            <CategoryStep
              selectedCategoryId={selectedCategory?.id ?? null}
              onSelect={(cat) => setSelectedCategory(cat)}
            />
          )}

          {step === 2 && (
            <DateStep
              selectedDate={selectedDate}
              onSelect={(date) => setSelectedDate(date)}
            />
          )}

          {step === 3 && (
            <TimeSlotStep
              selectedDate={selectedDate}
              selectedHour={selectedHour}
              selectedDuration={selectedDuration}
              categoryId={selectedCategory?.id}
              onSelectHour={(hour) => setSelectedHour(hour)}
              onSelectDuration={(dur) => setSelectedDuration(dur)}
            />
          )}

          {step === 4 && selectedCategory && selectedHour !== null && (
            <ComputerStep
              selectedDate={selectedDate}
              selectedHour={selectedHour}
              selectedDuration={selectedDuration}
              category={selectedCategory}
              selectedComputerId={selectedComputer?.id ?? null}
              paymentMethod={paymentMethod}
              onSelectPaymentMethod={(m) => setPaymentMethod(m)}
              onSelectComputer={(pc) => setSelectedComputer(pc)}
            />
          )}
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={goBack}
            disabled={step === 1}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all
              ${step === 1
                ? 'opacity-0 cursor-default'
                : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 cursor-pointer'
              }
            `}
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </button>

          {step < 4 ? (
            <button
              onClick={goNext}
              disabled={!canGoNext()}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all
                ${canGoNext()
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20 cursor-pointer'
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                }
              `}
            >
              Siguiente
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleConfirm}
              disabled={!canGoNext() || createTurnMutation.isPending || isProcessingPayment}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all
                ${canGoNext() && !createTurnMutation.isPending && !isProcessingPayment
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20 cursor-pointer'
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                }
              `}
            >
              {createTurnMutation.isPending || isProcessingPayment ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {paymentMethod === 'tarjeta' ? 'Procesando pago...' : 'Confirmando reserva...'}
                </>
              ) : (
                <>
                  {paymentMethod === 'tarjeta' ? (
                    <CreditCard className="w-4 h-4" />
                  ) : (
                    <CalendarCheck className="w-4 h-4" />
                  )}
                  {paymentMethod === 'tarjeta' ? 'Pagar con Tarjeta y Reservar' : 'Confirmar Reserva (En Mostrador)'}
                </>
              )}
            </button>
          )}
        </div>

        {/* Error message */}
        {createTurnMutation.isError && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm text-center">
            {createTurnMutation.error.message}
          </div>
        )}
      </div>
    </section>
  );
}
