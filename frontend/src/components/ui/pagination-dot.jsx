export function PaginationDots({ active = 0, total = 4 }) {
  return (
    <div className="flex justify-center gap-1.5 mt-4">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
            i === active ? "bg-[#4461F2] w-4" : "bg-gray-200"
          }`}
        />
      ))}
    </div>
  );
}
