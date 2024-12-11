import { LoadingIndicator } from "@/components/loading-indicator";


export function InlineLoadingIndicator() {
  return (
    <div className="flex-grow flex items-center justify-center">
      <div className="flex flex-col items-center gap-6 w-full max-w-md p-8">
        <div className="text-center space-y-2">
          <h3 className="text-sm sm:text-md md:text-lg font-bold font-doto">Cargando datos...</h3>
          <h4 className="text-xs sm:text-sm md:text-md font-light">Espera un momento mientras se cargan los datos</h4>
        </div>
        <div className="w-full">
          <LoadingIndicator position="relative" />
        </div>
      </div>
    </div>
  );
}
