import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useMemo } from 'react';

interface DateStepProps {
  selectedDate: string;
  onSelect: (date: string) => void;
}

const DAY_NAMES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

function formatDate(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export default function DateStep({ selectedDate, onSelect }: DateStepProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const calendarDays = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1);
    const lastDay = new Date(viewYear, viewMonth + 1, 0);
    const startDayOfWeek = firstDay.getDay();
    const totalDays = lastDay.getDate();

    const days: { day: number; isCurrentMonth: boolean; date: Date }[] = [];

    // Previous month filler days
    const prevMonthLastDay = new Date(viewYear, viewMonth, 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      days.push({
        day: prevMonthLastDay - i,
        isCurrentMonth: false,
        date: new Date(viewYear, viewMonth - 1, prevMonthLastDay - i),
      });
    }

    // Current month days
    for (let d = 1; d <= totalDays; d++) {
      days.push({
        day: d,
        isCurrentMonth: true,
        date: new Date(viewYear, viewMonth, d),
      });
    }

    // Next month filler days
    const remaining = 42 - days.length;
    for (let d = 1; d <= remaining; d++) {
      days.push({
        day: d,
        isCurrentMonth: false,
        date: new Date(viewYear, viewMonth + 1, d),
      });
    }

    return days;
  }, [viewYear, viewMonth]);

  const goToPrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const isPrevDisabled =
    viewYear === today.getFullYear() && viewMonth <= today.getMonth();

  const isDateDisabled = (date: Date): boolean => {
    // Past dates
    if (date < today) return true;
    // Monday (closed)
    if (date.getDay() === 1) return true;
    return false;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Elegí la fecha</h2>
        <p className="text-zinc-400 text-sm">
          Selecciona el día que querés reservar. <span className="text-amber-400/80">Los lunes el local permanece cerrado.</span>
        </p>
      </div>

      <div className="max-w-sm mx-auto bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 shadow-xl">
        {/* Month navigation */}
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={goToPrevMonth}
            disabled={isPrevDisabled}
            className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h3 className="text-white font-semibold tracking-wide">
            {MONTH_NAMES[viewMonth]} {viewYear}
          </h3>
          <button
            onClick={goToNextMonth}
            className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Day names header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAY_NAMES.map((name) => (
            <div
              key={name}
              className={`text-center text-xs font-medium py-1 ${
                name === 'Lun' ? 'text-red-400/60' : 'text-zinc-500'
              }`}
            >
              {name}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map(({ day, isCurrentMonth, date }, index) => {
            const dateStr = formatDate(date.getFullYear(), date.getMonth(), day);
            const disabled = !isCurrentMonth || isDateDisabled(date);
            const isSelected = selectedDate === dateStr && isCurrentMonth;
            const isToday =
              isCurrentMonth &&
              date.getTime() === today.getTime();
            const isMonday = date.getDay() === 1 && isCurrentMonth;

            return (
              <button
                key={index}
                disabled={disabled}
                onClick={() => onSelect(dateStr)}
                className={`aspect-square flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-200
                  ${!isCurrentMonth ? 'text-zinc-700 cursor-default' : ''}
                  ${disabled && isCurrentMonth ? 'text-zinc-600 cursor-not-allowed' : ''}
                  ${isMonday ? 'text-red-400/30 line-through' : ''}
                  ${isSelected
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-105'
                    : isCurrentMonth && !disabled
                      ? 'text-zinc-300 hover:bg-zinc-800 hover:text-white cursor-pointer'
                      : ''
                  }
                  ${isToday && !isSelected ? 'ring-1 ring-blue-500/50 text-blue-400' : ''}
                `}
              >
                {day}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-zinc-800">
          <div className="flex items-center gap-1.5 text-xs text-zinc-500">
            <div className="w-2.5 h-2.5 rounded bg-blue-600" />
            Seleccionado
          </div>
          <div className="flex items-center gap-1.5 text-xs text-zinc-500">
            <div className="w-2.5 h-2.5 rounded ring-1 ring-blue-500/50" />
            Hoy
          </div>
          <div className="flex items-center gap-1.5 text-xs text-zinc-500">
            <div className="w-2.5 h-2.5 rounded bg-zinc-700 line-through" />
            Cerrado
          </div>
        </div>
      </div>
    </div>
  );
}
