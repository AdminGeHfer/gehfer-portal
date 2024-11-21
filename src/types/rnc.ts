export interface RNC {
  id: string;
  title: string;
  description: string;
  status: "open" | "in_progress" | "closed";
  priority: "low" | "medium" | "high";
  department: string;
  contact: string;
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
  assignedTo?: string;
  attachments?: string[];
  timeline: TimelineEvent[];
}

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  type: "creation" | "update" | "status" | "comment";
  userId: string;
}

export interface RNCFormData {
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  department: string;
  contact: string;
  attachments?: File[];
}