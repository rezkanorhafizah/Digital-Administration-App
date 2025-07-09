export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "staf" | "hode"
  department?: string
  createdAt: string
  isActive: boolean
}

export interface Document {
  id: string
  type: "surat" | "sertifikat"
  title: string
  code?: string
  number?: string
  content: string
  status: "draft" | "pending" | "approved" | "rejected"
  createdBy: string
  createdByName: string
  approvedBy?: string
  approvedByName?: string
  createdAt: string
  updatedAt: string
  participants?: string[]
}

export interface Activity {
  id: string
  userId: string
  userName: string
  action: string
  target: string
  timestamp: string
  details?: string
}
