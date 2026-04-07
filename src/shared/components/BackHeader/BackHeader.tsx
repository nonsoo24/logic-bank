import { ArrowLeft } from '@/assets/svg';

export interface BackHeaderProps {
  title: string;
  onBack?: () => void;
}

export function BackHeader({ title, onBack }: BackHeaderProps) {
  return (
    <div className="px-4 sm:px-6 md:px-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 py-4">
          <button
            type="button"
            onClick={onBack}
            className="p-1 hover:opacity-70 transition-opacity cursor-pointer shrink-0"
            aria-label="Go back"
          >
            <img src={ArrowLeft} alt="" className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-medium text-black">{title}</h1>
        </div>
        <div className="h-1 bg-accent-gold w-full" />
      </div>
    </div>
  );
}
