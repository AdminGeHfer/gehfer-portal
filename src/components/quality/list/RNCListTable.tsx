import { RNC } from "@/types/rnc";

export interface RNCListTableProps {
  rncs: RNC[];
  isLoading: boolean;
  onRowClick: (id: string) => void;
}

export function RNCListTable({ rncs, isLoading, onRowClick }: RNCListTableProps) {
  return (
    <div className="overflow-auto">
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Descrição</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={4} className="text-center">Carregando...</td>
            </tr>
          ) : rncs.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center">Nenhuma RNC encontrada</td>
            </tr>
          ) : (
            rncs.map((rnc) => (
              <tr key={rnc.id} onClick={() => onRowClick(rnc.id)} className="cursor-pointer hover:bg-gray-100">
                <td className="px-4 py-2">{rnc.id}</td>
                <td className="px-4 py-2">{rnc.description}</td>
                <td className="px-4 py-2">{rnc.workflow_status}</td>
                <td className="px-4 py-2">
                  <button className="text-blue-500">Editar</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
