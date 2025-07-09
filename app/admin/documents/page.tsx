"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Search, ArrowLeft, Eye, Trash2, FileText, Award } from "lucide-react"
import { mockDocuments } from "@/lib/mock-data"
import type { Document } from "@/types"
import Link from "next/link"

export default function DocumentManagementPage() {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.number?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === "all" || doc.type === selectedType
    const matchesStatus = selectedStatus === "all" || doc.status === selectedStatus
    return matchesSearch && matchesType && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    const colors = {
      draft: "bg-gray-100 text-gray-800",
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    }
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const getStatusLabel = (status: string) => {
    const labels = {
      draft: "Draft",
      pending: "Menunggu Persetujuan",
      approved: "Disetujui",
      rejected: "Ditolak",
    }
    return labels[status as keyof typeof labels] || status
  }

  const handleDelete = (docId: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus dokumen ini?")) {
      setDocuments(documents.filter((doc) => doc.id !== docId))
    }
  }

  const updateDocumentStatus = (docId: string, newStatus: Document["status"]) => {
    setDocuments(
      documents.map((doc) =>
        doc.id === docId ? { ...doc, status: newStatus, updatedAt: new Date().toISOString() } : doc,
      ),
    )
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center mb-8">
            <Link href="/">
              <Button variant="ghost" size="sm" className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manajemen Dokumen</h1>
              <p className="text-gray-600">Kelola semua surat dan sertifikat</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Dokumen</p>
                    <p className="text-2xl font-bold">{documents.length}</p>
                  </div>
                  <FileText className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Menunggu Persetujuan</p>
                    <p className="text-2xl font-bold">{documents.filter((d) => d.status === "pending").length}</p>
                  </div>
                  <Award className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Disetujui</p>
                    <p className="text-2xl font-bold">{documents.filter((d) => d.status === "approved").length}</p>
                  </div>
                  <Award className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Draft</p>
                    <p className="text-2xl font-bold">{documents.filter((d) => d.status === "draft").length}</p>
                  </div>
                  <FileText className="h-8 w-8 text-gray-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Daftar Dokumen</CardTitle>
              <CardDescription>Semua surat dan sertifikat dalam sistem</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Cari judul atau nomor dokumen..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Tipe</SelectItem>
                    <SelectItem value="surat">Surat</SelectItem>
                    <SelectItem value="sertifikat">Sertifikat</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="pending">Menunggu Persetujuan</SelectItem>
                    <SelectItem value="approved">Disetujui</SelectItem>
                    <SelectItem value="rejected">Ditolak</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tipe</TableHead>
                      <TableHead>Judul</TableHead>
                      <TableHead>Nomor</TableHead>
                      <TableHead>Pembuat</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Dibuat</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocuments.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {doc.type === "surat" ? (
                              <FileText className="h-4 w-4 text-blue-600" />
                            ) : (
                              <Award className="h-4 w-4 text-green-600" />
                            )}
                            <span className="capitalize">{doc.type}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{doc.title}</TableCell>
                        <TableCell>{doc.number || "-"}</TableCell>
                        <TableCell>{doc.createdByName}</TableCell>
                        <TableCell>
                          <Badge className={getStatusBadge(doc.status)}>{getStatusLabel(doc.status)}</Badge>
                        </TableCell>
                        <TableCell>{new Date(doc.createdAt).toLocaleDateString("id-ID")}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => setSelectedDocument(doc)}>
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>{selectedDocument?.title}</DialogTitle>
                                  <DialogDescription>
                                    {selectedDocument?.type === "surat" ? "Detail Surat" : "Detail Sertifikat"}
                                  </DialogDescription>
                                </DialogHeader>
                                {selectedDocument && (
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <p className="text-sm font-medium">Tipe</p>
                                        <p className="text-sm text-gray-600 capitalize">{selectedDocument.type}</p>
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium">Nomor</p>
                                        <p className="text-sm text-gray-600">{selectedDocument.number || "-"}</p>
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium">Status</p>
                                        <Badge className={getStatusBadge(selectedDocument.status)}>
                                          {getStatusLabel(selectedDocument.status)}
                                        </Badge>
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium">Pembuat</p>
                                        <p className="text-sm text-gray-600">{selectedDocument.createdByName}</p>
                                      </div>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium mb-2">Konten</p>
                                      <div className="bg-gray-50 p-3 rounded text-sm">{selectedDocument.content}</div>
                                    </div>
                                    {selectedDocument.participants && (
                                      <div>
                                        <p className="text-sm font-medium mb-2">
                                          Peserta ({selectedDocument.participants.length})
                                        </p>
                                        <div className="bg-gray-50 p-3 rounded text-sm">
                                          {selectedDocument.participants.join(", ")}
                                        </div>
                                      </div>
                                    )}
                                    <div className="flex gap-2 pt-4">
                                      {selectedDocument.status === "pending" && (
                                        <>
                                          <Button
                                            onClick={() => {
                                              updateDocumentStatus(selectedDocument.id, "approved")
                                              setSelectedDocument(null)
                                            }}
                                            className="bg-green-600 hover:bg-green-700"
                                          >
                                            Setujui
                                          </Button>
                                          <Button
                                            onClick={() => {
                                              updateDocumentStatus(selectedDocument.id, "rejected")
                                              setSelectedDocument(null)
                                            }}
                                            variant="outline"
                                            className="text-red-600 hover:text-red-700"
                                          >
                                            Tolak
                                          </Button>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(doc.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredDocuments.length === 0 && (
                <div className="text-center py-8 text-gray-500">Tidak ada dokumen yang ditemukan</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
