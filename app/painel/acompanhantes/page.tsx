import SearchAcompanhantes from "@/components/SearchAcompanhantes";

export default function SearchPage() {
  return (
    <div className="container mx-auto mt-[5%] p-0">
      <h1 className="text-gray-600 text-xl font-bold mb-4">Buscar Acompanhantes por Cidade</h1>
      <SearchAcompanhantes />
    </div>
  );
}
