export const ProductSkeleton = () => {
  return (
    <div className="flex flex-col bg-[#111A2C] border border-[#223049] rounded-xl overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-[#0E1626]/80 relative"></div>
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-center">
          <div className="h-3 w-16 bg-[#223049] rounded"></div>
          <div className="h-3 w-10 bg-[#223049] rounded"></div>
        </div>
        <div className="h-4 bg-[#223049] rounded w-5/6"></div>
        <div className="h-3 bg-[#223049] rounded w-2/3"></div>
        <div className="flex gap-2 pt-1">
          <div className="h-4 w-20 bg-[#1D2A40] rounded"></div>
          <div className="h-4 w-16 bg-[#1D2A40] rounded"></div>
        </div>
        <div className="pt-3 border-t border-[#223049]/60 flex justify-between items-center">
          <div className="h-5 w-24 bg-[#223049] rounded"></div>
          <div className="h-8 w-20 bg-[#223049] rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};
