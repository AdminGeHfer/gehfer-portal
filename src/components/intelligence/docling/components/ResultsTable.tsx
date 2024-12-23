import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Result {
  file: string;
  processingTime: number;
  numChunks: number;
  docSize: number;
}

interface ResultsTableProps {
  results: Result[];
}

export const ResultsTable = ({ results }: ResultsTableProps) => {
  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4">Results</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>File</TableHead>
            <TableHead>Processing Time (ms)</TableHead>
            <TableHead>Chunks</TableHead>
            <TableHead>Doc Size</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map((result, index) => (
            <TableRow key={index}>
              <TableCell>{result.file}</TableCell>
              <TableCell>{result.processingTime.toFixed(2)}</TableCell>
              <TableCell>{result.numChunks}</TableCell>
              <TableCell>{result.docSize}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};