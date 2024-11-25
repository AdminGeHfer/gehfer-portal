import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FiltersProps {
  filters: {
    protocol: string;
    date: string;
    company: string;
    status: string;
    daysOpen: string;
  };
  onFilterChange: (field: string, value: string) => void;
}

export const ComplaintFilters = ({ filters, onFilterChange }: FiltersProps) => {
  return (
    <div className="mb-6 grid grid-cols-1 md:grid-cols-5 gap-4">
      <div>
        <label className="label">Protocolo</label>
        <input
          type="text"
          value={filters.protocol}
          onChange={(e) => onFilterChange("protocol", e.target.value)}
          className="input-field"
          placeholder="Buscar protocolo..."
        />
      </div>
      <div>
        <label className="label">Data</label>
        <input
          type="date"
          value={filters.date}
          onChange={(e) => onFilterChange("date", e.target.value)}
          className="input-field"
        />
      </div>
      <div>
        <label className="label">Empresa</label>
        <input
          type="text"
          value={filters.company}
          onChange={(e) => onFilterChange("company", e.target.value)}
          className="input-field"
          placeholder="Buscar empresa..."
        />
      </div>
      <div>
        <label className="label">Status</label>
        <Select
          value={filters.status}
          onValueChange={(value) => onFilterChange("status", value)}
        >
          <SelectTrigger className="input-field">
            <SelectValue placeholder="Selecione..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="Em análise">Em análise</SelectItem>
            <SelectItem value="Pendente">Pendente</SelectItem>
            <SelectItem value="Programar Coleta">Programar Coleta</SelectItem>
            <SelectItem value="Coleta Programada">Coleta Programada</SelectItem>
            <SelectItem value="Resolvido">Resolvido</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="label">Dias em Aberto</label>
        <input
          type="number"
          value={filters.daysOpen}
          onChange={(e) => onFilterChange("daysOpen", e.target.value)}
          className="input-field"
          placeholder="Número de dias..."
        />
      </div>
    </div>
  );
};