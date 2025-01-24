import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Download } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface RelationalInfoTabProps {
  isEditing: boolean;
}

export function RelationalInfoTab({ isEditing }: RelationalInfoTabProps) {
  return (
    <div className="space-y-8 p-4">
      {/* Products Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Produtos</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produto</TableHead>
              <TableHead>Peso</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Produto A</TableCell>
              <TableCell>100kg</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        {isEditing && (
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => {
              // Handle add product
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Produto
          </Button>
        )}
      </div>

      {/* Contact Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Contato</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Nome <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              disabled={!isEditing}
              className="border-blue-200 focus:border-blue-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">
              Telefone <span className="text-red-500">*</span>
            </Label>
            <Input
              id="phone"
              disabled={!isEditing}
              className="border-blue-200 focus:border-blue-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              disabled={!isEditing}
              className="border-blue-200 focus:border-blue-400"
            />
          </div>
        </div>
      </div>

      {/* Attachments Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Anexos</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-2 bg-muted rounded">
            <span>documento1.pdf</span>
            <Button variant="ghost" size="sm">
              <Download className="h-4 w-4" />
            </Button>
          </div>
          {isEditing && (
            <Button
              variant="outline"
              onClick={() => {
                // Handle file upload
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Anexo
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}