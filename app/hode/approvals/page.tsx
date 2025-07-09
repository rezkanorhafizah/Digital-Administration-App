"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Eye, Check, X, Clock, FileText, Award } from "lucide-react"
import { mockDocuments } from "@/lib/mock-data"
import type { Document } from "@/types"
import Link from "next/link"

export default function ApprovalsPage() {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments)
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")

  const pendingDocuments = documents.filter((doc) => doc.status === "pending")

  const handleApprove = (docId: string) => {
    setDocuments(
      documents.map((doc) =>
        doc.id === docId
          ? {
              ...doc,
              status: "approved" as const,
              approvedBy: "3",
              approvedByName: "Budi Santoso",
              updatedAt: new Date().toISOString(),
            }
          : doc,
      ),
    )
    setSelectedDocument(null)
  }

  const handleReject = (docId: string, reason: string) => {
    setDocuments(
      documents.map((doc) =>
        doc.id === docId
          ? {
              ...doc,
              status: "rejected" as const,
              approvedBy: "3",
              approvedByName: "Budi Santoso",
              updatedAt: new Date().toISOString(),
            }
          : doc,
      ),
    )
    setSelectedDocument(null)
    setRejectionReason("")
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    }
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  return (
    <ProtectedRoute allowedRoles={["hode"]}>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
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
              <h1 className="text-3xl font-bold text-gray-900">Persetujuan Dokumen</h1>
              <p className="text-gray-600">Kelola persetujuan surat dan sertifikat</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Menunggu Persetujuan</p>
                    <p className="text-3xl font-bold text-yellow-600">{pendingDocuments.length}</p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Disetujui Bulan Ini</p>
                    <p className="text-3xl font-bold text-green-600">
                      {documents.filter((d) => d.status === "approved").length}
                    </p>
                  </div>
                  <Check className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Ditolak</p>
                    <p className="text-3xl font-bold text-red-600">
                      {documents.filter((d) => d.status === "rejected").length}
                    </p>
                  </div>
                  <X className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Dokumen Menunggu Persetujuan</CardTitle>
              <CardDescription>{pendingDocuments.length} dokumen memerlukan persetujuan Anda</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingDocuments.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tipe</TableHead>
                        <TableHead>Judul</TableHead>
                        <TableHead>Nomor</TableHead>
                        <TableHead>Pembuat</TableHead>
                        <TableHead>Tanggal Dibuat</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingDocuments.map((doc) => (
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
                          <TableCell>{new Date(doc.createdAt).toLocaleDateString("id-ID")}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm" onClick={() => setSelectedDocument(doc)}>
                                    <Eye className="h-4 w-4 mr-2" />
                                    Review
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-3xl">
                                  <DialogHeader>
                                    <DialogTitle>{selectedDocument?.title}</DialogTitle>
                                    <DialogDescription>
                                      Review dan berikan persetujuan untuk dokumen ini
                                    </DialogDescription>
                                  </DialogHeader>
                                  {selectedDocument && (
                                    <div className="space-y-6">
                                      {/* Document Info */}
                                      <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                                        <div>
                                          <p className="text-sm font-medium">Tipe Dokumen</p>
                                          <p className="text-sm text-gray-600 capitalize">{selectedDocument.type}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm font-medium">Nomor</p>
                                          <p className="text-sm text-gray-600">{selectedDocument.number || "-"}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm font-medium">Pembuat</p>
                                          <p className="text-sm text-gray-600">{selectedDocument.createdByName}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm font-medium">Tanggal Dibuat</p>
                                          <p className="text-sm text-gray-600">
                                            {new Date(selectedDocument.createdAt).toLocaleDateString("id-ID")}
                                          </p>
                                        </div>
                                      </div>

                                      {/* Document Content */}
                                      <div>
                                        <p className="text-sm font-medium mb-2">Konten Dokumen</p>
                                        <div className="bg-white border rounded-lg p-4 max-h-60 overflow-y-auto">
                                          <div className="whitespace-pre-line text-sm">{selectedDocument.content}</div>
                                        </div>
                                      </div>

                                      {/* Participants for certificates */}
                                      {selectedDocument.participants && (
                                        <div>
                                          <p className="text-sm font-medium mb-2">
                                            Peserta Sertifikat ({selectedDocument.participants.length})
                                          </p>
                                          <div className="bg-gray-50 p-3 rounded text-sm max-h-32 overflow-y-auto">
                                            {selectedDocument.participants.join(", ")}
                                          </div>
                                        </div>
                                      )}

                                      {/* Action Buttons */}
                                      <div className="flex gap-3 pt-4 border-t">
                                        <Button
                                          onClick={() => handleApprove(selectedDocument.id)}
                                          className="flex-1 bg-green-600 hover:bg-green-700"
                                        >
                                          <Check className="h-4 w-4 mr-2" />
                                          Setujui Dokumen
                                        </Button>

                                        <Dialog>
                                          <DialogTrigger asChild>
                                            <Button
                                              variant="outline"
                                              className="flex-1 text-red-600 hover:text-red-700"
                                            >
                                              <X className="h-4 w-4 mr-2" />
                                              Tolak Dokumen
                                            </Button>
                                          </DialogTrigger>
                                          <DialogContent>
                                            <DialogHeader>
                                              <DialogTitle>Tolak Dokumen</DialogTitle>
                                              <DialogDescription>
                                                Berikan alasan penolakan untuk dokumen ini
                                              </DialogDescription>
                                            </DialogHeader>
                                            <div className="space-y-4">
                                              <div>
                                                <Label htmlFor="reason">Alasan Penolakan</Label>
                                                <Textarea
                                                  id="reason"
                                                  value={rejectionReason}
                                                  onChange={(e) => setRejectionReason(e.target.value)}
                                                  placeholder="Masukkan alasan penolakan..."
                                                  rows={4}
                                                />
                                              </div>
                                              <div className="flex gap-2">
                                                <Button
                                                  variant="outline"
                                                  onClick={() => setRejectionReason("")}
                                                  className="flex-1"
                                                >
                                                  Batal
                                                </Button>
                                                <Button
                                                  onClick={() => handleReject(selectedDocument.id, rejectionReason)}
                                                  className="flex-1 bg-red-600 hover:bg-red-700"
                                                  disabled={!rejectionReason.trim()}
                                                >
                                                  Tolak Dokumen
                                                </Button>
                                              </div>
                                            </div>
                                          </DialogContent>
                                        </Dialog>
                                      </div>
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak Ada Dokumen Pending</h3>
                  <p className="text-gray-500">Semua dokumen telah diproses</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Approved/Rejected Documents */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Riwayat Persetujuan</CardTitle>
              <CardDescription>Dokumen yang baru saja Anda proses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tipe</TableHead>
                      <TableHead>Judul</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Diproses</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documents
                      .filter((doc) => doc.status !== "pending" && doc.status !== "draft")
                      .slice(0, 5)
                      .map((doc) => (
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
                          <TableCell>
                            <Badge className={getStatusBadge(doc.status)}>
                              {doc.status === "approved" ? "Disetujui" : "Ditolak"}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(doc.updatedAt).toLocaleDateString("id-ID")}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
