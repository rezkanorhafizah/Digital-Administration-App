"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, ArrowLeft, User, FileText, Award } from "lucide-react"
import { mockActivities } from "@/lib/mock-data"
import type { ActivityType } from "@/types"
import Link from "next/link"

export default function ActivitiesPage() {
  const [activities] = useState<ActivityType[]>(mockActivities)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAction, setSelectedAction] = useState<string>("all")

  const filteredActivities = activities.filter((activity) => {
    const matchesSearch =
      activity.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.target.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesAction =
      selectedAction === "all" || activity.action.toLowerCase().includes(selectedAction.toLowerCase())
    return matchesSearch && matchesAction
  })

  const getActionIcon = (action: string) => {
    if (action.includes("surat")) return <FileText className="h-4 w-4 text-blue-600" />
    if (action.includes("sertifikat")) return <Award className="h-4 w-4 text-green-600" />
    if (action.includes("user") || action.includes("pengguna")) return <User className="h-4 w-4 text-purple-600" />
    return <span className="h-4 w-4 text-gray-600">Activity</span>
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
              <h1 className="text-3xl font-bold text-gray-900">Log Aktivitas</h1>
              <p className="text-gray-600">Pantau semua aktivitas pengguna dalam sistem</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Riwayat Aktivitas</CardTitle>
              <CardDescription>Semua aktivitas pengguna tercatat di sini</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Cari pengguna, aksi, atau target..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedAction} onValueChange={setSelectedAction}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Aktivitas</SelectItem>
                    <SelectItem value="membuat">Membuat</SelectItem>
                    <SelectItem value="menyetujui">Menyetujui</SelectItem>
                    <SelectItem value="menolak">Menolak</SelectItem>
                    <SelectItem value="menghapus">Menghapus</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pengguna</TableHead>
                      <TableHead>Aktivitas</TableHead>
                      <TableHead>Target</TableHead>
                      <TableHead>Detail</TableHead>
                      <TableHead>Waktu</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredActivities.map((activity) => (
                      <TableRow key={activity.id}>
                        <TableCell className="font-medium">{activity.userName}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getActionIcon(activity.action)}
                            {activity.action}
                          </div>
                        </TableCell>
                        <TableCell>{activity.target}</TableCell>
                        <TableCell className="text-gray-600">{activity.details || "-"}</TableCell>
                        <TableCell>{activity.timestamp}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredActivities.length === 0 && (
                <div className="text-center py-8 text-gray-500">Tidak ada aktivitas yang ditemukan</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
