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
import { Search, ArrowLeft, Eye, Edit, Trash2, FileText, Award, Plus } from "lucide-react"
import { mockDocuments } from "@/lib/mock-data"
import { useAuth } from "@/contexts/auth-context"
import type { Document } from "@/types"
import Link from "next/link"

export default function StafDocumentsPage() {
  const { user } = useAuth()
  const [documents, setDocuments] = useState<Document[]>(mockDocuments)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)

  // Filter documents created by current user
  const userDocuments = documents.filter((doc) => doc.createdBy === user?.id)

  const filteredDocuments = userDocuments.filter((doc) => {
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

  const submitForApproval = (docId: string) => {
    setDocuments(
      documents.map((doc) =>
        doc.id === docId ? { ...doc, status: "pending" as const, updatedAt: new Date().toISOString() } : doc,
      ),
    )
  }

  return (
    <ProtectedRoute allowedRoles={["staf"]}>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Link href="/">
                <Button variant="ghost" size="sm" className="mr-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dokumen Saya</h1>
                <p className="text-gray-600">Kelola surat dan sertifikat yang Anda buat</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href="/surat">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Buat Surat
                </Button>
              </Link>
              <Link href="/sertifikat">
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Buat Sertifikat
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Dokumen</p>
                    <p className="text-2xl font-bold">{userDocuments.length}</p>
                  </div>
                  <FileText className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Draft</p>
                    <p className="text-2xl font-bold">{userDocuments.filter((d) => d.status === "draft").length}</p>
                  </div>
                  <Edit className="h-8 w-8 text-gray-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Menunggu Persetujuan</p>
                    <p className="text-2xl font-bold">{userDocuments.filter((d) => d.status === "pending").length}</p>
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
                    <p className="text-2xl font-bold">{userDocuments.filter((d) => d.status === "approved").length}</p>
                  </div>
                  <Award className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Daftar Dokumen</CardTitle>
              <CardDescription>Semua dokumen yang telah Anda buat</CardDescription>
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
              {filteredDocuments.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tipe</TableHead>
                        <TableHead>Judul</TableHead>
                        <TableHead>Nomor</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Dibuat</TableHead>
                        <TableHead>Diupdate</TableHead>
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
                          <TableCell>
                            <Badge className={getStatusBadge(doc.status)}>{getStatusLabel(doc.status)}</Badge>
                          </TableCell>
                          <TableCell>{new Date(doc.createdAt).toLocaleDateString("id-ID")}</TableCell>
                          <TableCell>{new Date(doc.updatedAt).toLocaleDateString("id-ID")}</TableCell>
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
                                      Detail {selectedDocument?.type === "surat" ? "surat" : "sertifikat"}
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
                                          <p className="text-sm font-medium">Disetujui oleh</p>
                                          <p className="text-sm text-gray-600">
                                            {selectedDocument.approvedByName || "-"}
                                          </p>
                                        </div>
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium mb-2">Konten</p>
                                        <div className="bg-gray-50 p-3 rounded text-sm max-h-40 overflow-y-auto">
                                          {selectedDocument.content}
                                        </div>
                                      </div>
                                      {selectedDocument.participants && (
                                        <div>
                                          <p className="text-sm font-medium mb-2">
                                            Peserta ({selectedDocument.participants.length})
                                          </p>
                                          <div className="bg-gray-50 p-3 rounded text-sm max-h-32 overflow-y-auto">
                                            {selectedDocument.participants.join(", ")}
                                          </div>
                                        </div>
                                      )}
                                      <div className="flex gap-2 pt-4">
                                        {selectedDocument.status === "draft" && (
                                          <Button
                                            onClick={() => submitForApproval(selectedDocument.id)}
                                            className="bg-blue-600 hover:bg-blue-700"
                                          >
                                            Ajukan Persetujuan
                                          </Button>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>
                              {doc.status === "draft" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDelete(doc.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Belum Ada Dokumen</h3>
                  <p className="text-gray-500 mb-4">Mulai buat surat atau sertifikat pertama Anda</p>
                  <div className="flex gap-2 justify-center">
                    <Link href="/surat">
                      <Button>Buat Surat</Button>
                    </Link>
                    <Link href="/sertifikat">
                      <Button variant="outline">Buat Sertifikat</Button>
                    </Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
