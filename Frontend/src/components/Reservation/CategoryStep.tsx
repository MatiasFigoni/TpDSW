import { Gamepad2, BriefcaseBusiness } from 'lucide-react';
import type { Category } from '../../types/category.class.ts';
import Loading from '../Loading/loading.tsx';
import ErrorComponent from '../Error/Error.tsx';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api.ts';

interface CategoryStepProps {
  selectedCategoryId: number | null;
  onSelect: (category: Category) => void;
}

async function fetchCategories(): Promise<Category[]> {
  const response = await api('/api/categories');
  if (!response.ok) throw new Error('Error al cargar categorías');
  const result = await response.json();
  return result.data;
}

const categoryIcons: Record<string, React.JSX.Element> = {
  gamer: <Gamepad2 className="w-8 h-8" />,
  oficina: <BriefcaseBusiness className="w-8 h-8" />,
};

const categoryColors: Record<string, { bg: string; border: string; text: string; selected: string }> = {
  gamer: {
    bg: 'bg-blue-500/5',
    border: 'border-blue-500/30',
    text: 'text-blue-400',
    selected: 'bg-blue-500/15 border-blue-500 ring-1 ring-blue-500/50 shadow-lg shadow-blue-500/10',
  },
  oficina: {
    bg: 'bg-emerald-500/5',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
    selected: 'bg-emerald-500/15 border-emerald-500 ring-1 ring-emerald-500/50 shadow-lg shadow-emerald-500/10',
  },
};

export default function CategoryStep({ selectedCategoryId, onSelect }: CategoryStepProps) {
  const { data: categories, isPending, isError, error } = useQuery({
    queryKey: ['categories-reservation'],
    queryFn: fetchCategories,
  });

  if (isPending) return <Loading />;
  if (isError) return <ErrorComponent error={error.message} />;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Elegí tu tipo de equipo</h2>
        <p className="text-zinc-400 text-sm">Selecciona la categoría de computadora que necesitás.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
        {categories.map((cat) => {
          const isSelected = selectedCategoryId === cat.id;
          const colors = categoryColors[cat.description] ?? categoryColors['gamer'];
          const icon = categoryIcons[cat.description] ?? <Gamepad2 className="w-8 h-8" />;

          return (
            <button
              key={cat.id}
              onClick={() => onSelect(cat)}
              className={`relative p-6 rounded-2xl border-2 text-left transition-all duration-300 cursor-pointer group ${
                isSelected
                  ? colors.selected
                  : `${colors.bg} ${colors.border} hover:border-opacity-60`
              }`}
            >
              <div className={`mb-4 ${isSelected ? colors.text : 'text-zinc-500 group-hover:' + colors.text.replace('text-', 'text-')}`}>
                {icon}
              </div>
              <h3 className={`text-lg font-bold mb-1 transition-colors ${isSelected ? 'text-white' : 'text-zinc-300'}`}>
                {cat.name}
              </h3>
              <p className="text-sm text-zinc-500 capitalize">{cat.description}</p>
              <div className="mt-3 pt-3 border-t border-zinc-800">
                <span className={`text-lg font-bold ${colors.text}`}>
                  ${cat.hourly_price.toLocaleString('es-AR')}
                </span>
                <span className="text-xs text-zinc-500 ml-1">/ hora</span>
              </div>

              {isSelected && (
                <div className={`absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center ${colors.text} bg-zinc-900`}>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
