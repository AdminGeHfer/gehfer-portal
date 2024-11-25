import { RNC } from "@/types/rnc";

// Temporary mock data for development
const mockRNCs: RNC[] = [
  {
    id: "1",
    description: "Description for RNC 1",
    status: "open",
    priority: "high",
    type: "client",
    department: "Expedição",
    contact: {
      name: "John Doe",
      phone: "123456789",
      email: "john@example.com"
    },
    company: "Test Company",
    cnpj: "12345678901234",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    timeline: []
  }
];

export const getRNCs = async (): Promise<RNC[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return mockRNCs;
};