import { ArrowLeft } from '@/assets/svg';

export interface BackHeaderProps {
  title: string;
  onBack?: () => void;
}

export function BackHeader({ title, onBack }: BackHeaderProps) {
  return (
    <div>
      <div className="max-w-3xl mx-auto flex items-center gap-4 px-6 py-4">
        <button
          type="button"
          onClick={onBack}
          className="p-1 hover:opacity-70 transition-opacity cursor-pointer"
          aria-label="Go back"
        >
          <img src={ArrowLeft} alt="" className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-normal text-black">{title}</h1>
      </div>
      <div className="flex justify-center">
        <div className="w-[730px] h-1 bg-accent-gold" />
      </div>
    </div>
  );
}
