import { useEffect, useState } from "react";
import { RNCFilters } from "@/components/organisms/RNCFilters";
import { RNCListTable } from "@/components/quality/list/RNCListTable";
import { RNCListHeader } from "@/components/quality/list/RNCListHeader";
import { useRNCs } from "@/hooks/useRNCs";
import { RNC } from "@/types/rnc";
import { useRNCSearch } from "@/hooks/useRNCSearch";
import { Header } from "@/components/layout/Header";

export default function RNCList() {
  const { rncs: rawRncs, isLoading, createRNC } = useRNCs();
  const [search, setSearch] = useState("");
  const [workflowStatus, setWorkflowStatus] = useState("all");
  const [priority, setPriority] = useState("all");
  const [type, setType] = useState("all");

  const transformedRncs: RNC[] = rawRncs?.map(rnc => ({
    ...rnc,
    priority: rnc.priority as "low" | "medium" | "high",
    type: rnc.type as "client" | "supplier",
    contact: rnc.contact?.[0] || { name: "", phone: "", email: "" },
    timeline: rnc.events.map(event => ({
      id: event.id,
      date: event.created_at,
      title: event.title,
      description: event.description,
      type: event.type as "creation" | "update" | "status" | "comment" | "assignment",
      userId: event.created_by,
      comment: event.comment || ""
    }))
  })) || [];

  const filteredRncs = useRNCSearch(
    transformedRncs,
    search,
    workflowStatus,
    priority,
    type
  );

  const handleClearFilters = () => {
    setSearch("");
    setWorkflowStatus("all");
    setPriority("all");
    setType("all");
  };

  const handleRNCCreated = async () => {
    // Refresh the list after creating a new RNC
    window.location.reload();
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <RNCListHeader onRNCCreated={handleRNCCreated} />
        <div className="mt-8 space-y-6">
          <RNCFilters
            search={search}
            onSearchChange={setSearch}
            workflowStatus={workflowStatus}
            onWorkflowStatusChange={setWorkflowStatus}
            priority={priority}
            onPriorityChange={setPriority}
            type={type}
            onTypeChange={setType}
            onClearFilters={handleClearFilters}
          />
          <RNCListTable rncs={filteredRncs} isLoading={isLoading} />
        </div>
      </main>
    </div>
  );
}