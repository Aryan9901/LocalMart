export function StatusBar() {
  return (
    <div className="h-11 px-5 flex items-center justify-between bg-white">
      <div className="text-sm font-medium">9:41</div>
      <div className="flex items-center gap-1">
        <div className="w-4 h-4">
          <svg viewBox="0 0 24 24" className="w-full h-full">
            <path
              fill="currentColor"
              d="M12 21.5c5.523 0 10-4.477 10-10S17.523 1.5 12 1.5s-10 4.477-10 10 4.477 10 10 10z"
              opacity="0.4"
            />
            <path fill="currentColor" d="M12 16.5a5 5 0 100-10 5 5 0 000 10z" />
          </svg>
        </div>
        <div className="w-4 h-4">
          <svg viewBox="0 0 24 24" className="w-full h-full">
            <path
              fill="currentColor"
              d="M16.5 21.5h-9v-19h9v19zm1.5-2V4c0-1.1-.9-2-2-2h-8c-1.1 0-2 .9-2 2v15.5c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
