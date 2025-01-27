export interface Complaint {
  id: number;
  date: string;
  company: string;
  status: string;
  description: string;
  protocol: string;
  daysOpen: number;
  rootCause: string;
  solution: string;
}