import { DeliveriesTable } from "@/components/deliveries/deliveries-table";



export function DeliveriesList() {

  return (
    <section className="py-20">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-left font-doto">Lista de entregas</h1>
        <h2 className="text-lg sm:text-xl md:text-2xl font-light text-left">Consulta la lista de entregas disponibles</h2>

        <div className="py-12">
          <DeliveriesTable />
        </div>
      </div>
    </section>
  );
}
