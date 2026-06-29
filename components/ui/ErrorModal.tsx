'use client';

interface ErrorModalProps {
  message: string;
  onClose: () => void;
}

export default function ErrorModal({ message, onClose }: ErrorModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 max-w-sm w-full mx-4 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <span className="mt-0.5 text-red-500 text-xl">⚠</span>
          <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">{message}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="self-end px-5 py-2 text-sm font-semibold rounded-xl bg-red-500 hover:bg-red-600 text-white transition-colors"
        >
          OK
        </button>
      </div>
    </div>
  );
}
