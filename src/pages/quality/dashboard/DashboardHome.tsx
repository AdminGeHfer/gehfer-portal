import * as React from "react";
import { useState } from "react";
import { useTheme } from "next-themes";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CalendarIcon, FileDown, Loader2, LogOut, Moon, Sun } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { RNCStats } from "@/components/dashboard/RNCStats";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { cn } from "@/lib/utils";
import html2pdf from "html2pdf.js";
import { toast } from "sonner";

type ChartOption = "type" | "department" | "responsible" | "company";

export const DashboardHome = () => {
  const { theme, setTheme } = useTheme();
  const { signOut } = useAuth();
  const exportRootRef = React.useRef<HTMLDivElement | null>(null);
  
  // Pending dates (selected but not applied)
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  
  // Applied dates (used for filtering)
  const [appliedStartDate, setAppliedStartDate] = useState<Date | undefined>(undefined);
  const [appliedEndDate, setAppliedEndDate] = useState<Date | undefined>(undefined);
  const [isPdfDialogOpen, setIsPdfDialogOpen] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [includeTotalCards, setIncludeTotalCards] = useState(false);
  const [includeMonthlyCards, setIncludeMonthlyCards] = useState(true);
  const [includeResolutionCards, setIncludeResolutionCards] = useState(false);
  const [selectedCharts, setSelectedCharts] = useState<Record<ChartOption, boolean>>({
    type: true,
    department: true,
    responsible: true,
    company: true,
  });

  // Calculate the date range for the hook using APPLIED dates
  const getDateRange = () => {
    if (appliedStartDate && appliedEndDate) {
      const start = new Date(appliedStartDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(appliedEndDate);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    }
    return undefined;
  };

  const dateRange = getDateRange();
  
  const { stats, loading, error } = useDashboardStats(
    dateRange ? { start: dateRange.start, end: dateRange.end } : undefined
  );

  const handleApplyFilters = () => {
    setAppliedStartDate(startDate);
    setAppliedEndDate(endDate);
  };

  const handleClearFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setAppliedStartDate(undefined);
    setAppliedEndDate(undefined);
  };

  const hasUnappliedChanges = startDate !== appliedStartDate || endDate !== appliedEndDate;
  const today = new Date();
  const chartOptions: { key: ChartOption; label: string }[] = [
    { key: "type", label: "RNCs por Tipo" },
    { key: "department", label: "RNCs por Departamento" },
    { key: "responsible", label: "RNCs por Responsável" },
    { key: "company", label: "RNCs por Empresa" },
  ];

  const toggleChart = (chart: ChartOption) => {
    setSelectedCharts((current) => ({
      ...current,
      [chart]: !current[chart],
    }));
  };

  const handleGenerateDashboardPdf = async () => {
    const hasAnyChartSelected = Object.values(selectedCharts).some(Boolean);
    const hasAnyCardsSelected = includeTotalCards || includeMonthlyCards || includeResolutionCards;

    if (!hasAnyChartSelected && !hasAnyCardsSelected) {
      toast.error("Selecione ao menos um card ou gráfico para exportar.");
      return;
    }

    setIsGeneratingPdf(true);
    setIsPdfDialogOpen(false);

    const renderRoot = document.createElement("div");
    renderRoot.style.position = "fixed";
    renderRoot.style.inset = "0";
    renderRoot.style.zIndex = "9999";
    renderRoot.style.overflow = "auto";
    renderRoot.style.background = "#f1f5f9";
    renderRoot.style.padding = "24px";

    const content = document.createElement("div");
    content.style.maxWidth = "1200px";
    content.style.margin = "0 auto";
    content.style.display = "flex";
    content.style.flexDirection = "column";
    content.style.gap = "20px";
    content.style.fontFamily = "Arial, sans-serif";
    content.style.color = "#0f172a";

    const selectedStartDate = appliedStartDate ?? startDate;
    const selectedEndDate = appliedEndDate ?? endDate;
    const formatDate = (date?: Date) => (date ? format(date, "dd/MM/yyyy", { locale: ptBR }) : "--");

    const header = document.createElement("div");
    header.style.background = "#ffffff";
    header.style.border = "1px solid #e2e8f0";
    header.style.borderRadius = "14px";
    header.style.padding = "16px 20px";

    const headerLabel = document.createElement("p");
    headerLabel.textContent = "Período selecionado";
    headerLabel.style.fontSize = "13px";
    headerLabel.style.fontWeight = "600";
    headerLabel.style.color = "#475569";
    headerLabel.style.margin = "0 0 8px";
    header.appendChild(headerLabel);

    const headerDates = document.createElement("div");
    headerDates.style.display = "flex";
    headerDates.style.gap = "16px";
    headerDates.style.flexWrap = "wrap";

    const startBadge = document.createElement("span");
    startBadge.textContent = `Início: ${formatDate(selectedStartDate)}`;
    startBadge.style.background = "#e2e8f0";
    startBadge.style.padding = "6px 10px";
    startBadge.style.borderRadius = "999px";
    startBadge.style.fontSize = "12px";
    startBadge.style.fontWeight = "600";

    const endBadge = document.createElement("span");
    endBadge.textContent = `Fim: ${formatDate(selectedEndDate)}`;
    endBadge.style.background = "#e2e8f0";
    endBadge.style.padding = "6px 10px";
    endBadge.style.borderRadius = "999px";
    endBadge.style.fontSize = "12px";
    endBadge.style.fontWeight = "600";

    headerDates.appendChild(startBadge);
    headerDates.appendChild(endBadge);
    header.appendChild(headerDates);
    content.appendChild(header);

    const cardSelectors: string[] = [];
    if (includeTotalCards) cardSelectors.push('[data-pdf-card-group="total"]');
    if (includeMonthlyCards) cardSelectors.push('[data-pdf-card-group="monthly"]');
    if (includeResolutionCards) cardSelectors.push('[data-pdf-card-group="resolution"]');

    if (cardSelectors.length > 0) {
      const cardsSection = document.createElement("section");
      cardsSection.style.background = "#ffffff";
      cardsSection.style.border = "1px solid #e2e8f0";
      cardsSection.style.borderRadius = "14px";
      cardsSection.style.padding = "18px";

      const cardsTitle = document.createElement("h2");
      cardsTitle.textContent = "Cards";
      cardsTitle.style.fontSize = "18px";
      cardsTitle.style.fontWeight = "700";
      cardsTitle.style.margin = "0 0 14px";
      cardsSection.appendChild(cardsTitle);

      const cardsGrid = document.createElement("div");
      cardsGrid.style.display = "grid";
      cardsGrid.style.gridTemplateColumns = "repeat(2, minmax(0, 1fr))";
      cardsGrid.style.gap = "12px";

      cardSelectors.forEach((selector) => {
        document.querySelectorAll<HTMLElement>(selector).forEach((card) => {
          const clonedCard = card.cloneNode(true) as HTMLElement;
          clonedCard.style.background = "#f8fafc";
          clonedCard.style.border = "1px solid #e2e8f0";
          clonedCard.style.boxShadow = "none";
          cardsGrid.appendChild(clonedCard);
        });
      });

      cardsSection.appendChild(cardsGrid);
      content.appendChild(cardsSection);
    }

    const selectedChartKeys = chartOptions.filter(({ key }) => selectedCharts[key]).map(({ key }) => key);
    if (selectedChartKeys.length > 0) {
      const chartsSection = document.createElement("section");
      chartsSection.style.background = "#ffffff";
      chartsSection.style.border = "1px solid #e2e8f0";
      chartsSection.style.borderRadius = "14px";
      chartsSection.style.padding = "18px";

      const chartsTitle = document.createElement("h2");
      chartsTitle.textContent = "Gráficos";
      chartsTitle.style.fontSize = "18px";
      chartsTitle.style.fontWeight = "700";
      chartsTitle.style.margin = "0 0 14px";
      chartsSection.appendChild(chartsTitle);

      const chartsColumn = document.createElement("div");
      chartsColumn.style.display = "grid";
      chartsColumn.style.gridTemplateColumns = "1fr";
      chartsColumn.style.gap = "16px";

      selectedChartKeys.forEach((chartKey) => {
        const chartCard = document.querySelector<HTMLElement>(`[data-pdf-chart="${chartKey}"]`);
        if (!chartCard) return;

        const clonedChart = chartCard.cloneNode(true) as HTMLElement;
        clonedChart.style.background = "#ffffff";
        clonedChart.style.border = "1px solid #e2e8f0";
        clonedChart.style.boxShadow = "none";
        clonedChart.style.breakInside = "avoid";
        clonedChart.querySelectorAll<HTMLElement>('button[title="Ver ranking completo"]').forEach((button) => {
          button.style.display = "none";
        });
        clonedChart.querySelectorAll<HTMLElement>(".fixed").forEach((modalPart) => {
          modalPart.remove();
        });
        clonedChart.querySelectorAll<SVGTextElement>("svg text").forEach((text) => {
          text.style.fontSize = "12px";
          text.style.fontWeight = "500";
        });

        chartsColumn.appendChild(clonedChart);
      });

      chartsSection.appendChild(chartsColumn);
      content.appendChild(chartsSection);
    }

    renderRoot.appendChild(content);
    document.body.appendChild(renderRoot);

    const htmlElement = document.documentElement;
    const hadDarkClass = htmlElement.classList.contains("dark");
    if (hadDarkClass) {
      htmlElement.classList.remove("dark");
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 700));

      const options = {
        margin: [6, 6],
        filename: `dashboard-rnc-${format(new Date(), "yyyy-MM-dd-HH-mm")}.pdf`,
        image: { type: "png", quality: 1 },
        html2canvas: {
          scale: 3,
          useCORS: true,
          logging: false,
          windowWidth: 1400,
          windowHeight: 2200,
          backgroundColor: "#f1f5f9",
          scrollY: 0,
          scrollX: 0,
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
          compress: true,
        },
        pagebreak: { mode: ["css", "legacy"] },
      };

      await html2pdf().set(options).from(content).save();
      toast.success("PDF gerado com sucesso!");
    } catch (pdfError) {
      console.error("Erro ao gerar PDF do dashboard:", pdfError);
      toast.error("Não foi possível gerar o PDF do dashboard.");
    } finally {
      renderRoot.remove();
      if (hadDarkClass) {
        htmlElement.classList.add("dark");
      }
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={signOut}
              className="text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <div ref={exportRootRef} className="flex-1 container mx-auto px-4 py-8 pb-24">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-muted-foreground">
            Analise as métricas das RNCs geradas no portal
          </p>
          
          <div className="flex flex-wrap items-center gap-3">
            <Dialog open={isPdfDialogOpen} onOpenChange={setIsPdfDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="default" size="sm">
                  <FileDown className="mr-2 h-4 w-4" />
                  Exportar PDF
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[560px]">
                <DialogHeader>
                  <DialogTitle>Exportar Dashboard em PDF</DialogTitle>
                  <DialogDescription>
                    Escolha os cards e gráficos que deseja incluir no arquivo.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-5">
                  <div>
                    <p className="text-sm font-medium mb-3">Cards de estatísticas</p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="cards-total"
                          checked={includeTotalCards}
                          onCheckedChange={(checked) => setIncludeTotalCards(Boolean(checked))}
                        />
                        <Label htmlFor="cards-total" className="cursor-pointer">
                          Cards totais
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="cards-monthly"
                          checked={includeMonthlyCards}
                          onCheckedChange={(checked) => setIncludeMonthlyCards(Boolean(checked))}
                        />
                        <Label htmlFor="cards-monthly" className="cursor-pointer">
                          Cards mensais (padrão)
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="cards-resolution"
                          checked={includeResolutionCards}
                          onCheckedChange={(checked) => setIncludeResolutionCards(Boolean(checked))}
                        />
                        <Label htmlFor="cards-resolution" className="cursor-pointer">
                          Cards de tempo de resolução
                        </Label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-3">Gráficos</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {chartOptions.map((chart) => (
                        <div key={chart.key} className="flex items-center gap-2">
                          <Checkbox
                            id={`chart-${chart.key}`}
                            checked={selectedCharts[chart.key]}
                            onCheckedChange={() => toggleChart(chart.key)}
                          />
                          <Label htmlFor={`chart-${chart.key}`} className="cursor-pointer">
                            {chart.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsPdfDialogOpen(false)} disabled={isGeneratingPdf}>
                    Cancelar
                  </Button>
                  <Button onClick={handleGenerateDashboardPdf} disabled={isGeneratingPdf}>
                    {isGeneratingPdf ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Gerando...
                      </>
                    ) : (
                      "Gerar PDF"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Start Date Filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[160px] justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "dd/MM/yyyy", { locale: ptBR }) : "Data Início"}
                </Button>
              </PopoverTrigger>
              <PopoverContent 
                className="w-auto p-0 bg-white dark:bg-gray-800 border shadow-lg z-50" 
                align="end"
              >
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                  className="pointer-events-auto"
                  locale={ptBR}
                  footer={
                    <div className="flex items-center justify-end gap-2 border-t px-3 py-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setStartDate(undefined)}
                      >
                        Limpar
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setStartDate(today)}
                      >
                        Hoje
                      </Button>
                    </div>
                  }
                />
              </PopoverContent>
            </Popover>

            {/* End Date Filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[160px] justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "dd/MM/yyyy", { locale: ptBR }) : "Data Fim"}
                </Button>
              </PopoverTrigger>
              <PopoverContent 
                className="w-auto p-0 bg-white dark:bg-gray-800 border shadow-lg z-50" 
                align="end"
              >
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                  className="pointer-events-auto"
                  locale={ptBR}
                  footer={
                    <div className="flex items-center justify-end gap-2 border-t px-3 py-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setEndDate(undefined)}
                      >
                        Limpar
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setEndDate(today)}
                      >
                        Hoje
                      </Button>
                    </div>
                  }
                />
              </PopoverContent>
            </Popover>

            {/* Apply Filters Button */}
            {(startDate && endDate) && (
              <Button
                variant="default"
                size="sm"
                onClick={handleApplyFilters}
                disabled={!hasUnappliedChanges}
              >
                Aplicar
              </Button>
            )}

            {/* Clear Filters Button */}
            {(startDate || endDate || appliedStartDate || appliedEndDate) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                Limpar
              </Button>
            )}
          </div>
        </div>
        
        <RNCStats stats={stats} isLoading={loading} error={error} />
      </div>

      
      <footer className="bottom-0 w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4">
        <div className="container mx-auto flex justify-center items-center bg-background/80 backdrop-blur-sm gap-3">
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
            <a href="https://admingehfer.github.io/gehfer-portal-docs/license" rel="noreferrer" target="_blank"> © {new Date().getFullYear()} GeHfer Industrial - Todos os direitos reservados. </a>
          </Button>
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
            <a href="https://admingehfer.github.io/gehfer-portal-docs" rel="noreferrer" target="_blank"> Sobre </a>
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default DashboardHome;
