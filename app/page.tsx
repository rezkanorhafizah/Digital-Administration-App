"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { Navbar } from "@/components/navbar"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Award, Users } from "lucide-react"
import { RoleBasedDashboard } from "@/components/role-based-dashboard"
import { useAuth } from "@/contexts/auth-context"
import { Activity } from "lucide-react"

export default function Dashboard() {
  const { user } = useAuth()

  return (
    <ProtectedRoute>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <img src="/images/logo-hafecs.png" alt="HAFECS Logo" className="h-16 w-auto" />
            </div>
            <p className="text-xl text-gray-600 mb-2">Sistem Administrasi Digital</p>
            <p className="text-sm text-gray-500">Yayasan Hasnur Centre - Pelatihan Kompetensi Guru</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Surat</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">245</div>
                <p className="text-xs text-muted-foreground">+12% dari bulan lalu</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sertifikat Dibuat</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,234</div>
                <p className="text-xs text-muted-foreground">+8% dari bulan lalu</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Peserta Aktif</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">456</div>
                <p className="text-xs text-muted-foreground">+15% dari bulan lalu</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle>Pembuatan Surat Otomatis</CardTitle>
                    <CardDescription>Buat surat resmi dengan template otomatis berdasarkan kode surat</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    Kode Surat: SEC, TCCD, PRT, TLC
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    Template otomatis dengan kop surat
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    Export ke PDF
                  </div>
                </div>
                <Link href="/surat">
                  <Button className="w-full">Buat Surat Baru</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Award className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <CardTitle>Pembuatan Sertifikat Otomatis</CardTitle>
                    <CardDescription>Generate sertifikat pelatihan untuk peserta secara otomatis</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Input nama peserta dan kegiatan
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Template sertifikat profesional
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Batch processing untuk multiple peserta
                  </div>
                </div>
                <Link href="/sertifikat">
                  <Button className="w-full bg-green-600 hover:bg-green-700">Buat Sertifikat Baru</Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Role-based Quick Actions */}
          {user && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Akses Cepat</CardTitle>
                <CardDescription>Fitur berdasarkan role Anda</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {user.role === "admin" && (
                    <>
                      <Link href="/admin/users">
                        <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                          <Users className="h-6 w-6" />
                          <span>Kelola Pengguna</span>
                        </Button>
                      </Link>
                      <Link href="/admin/documents">
                        <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                          <FileText className="h-6 w-6" />
                          <span>Kelola Dokumen</span>
                        </Button>
                      </Link>
                      <Link href="/admin/activities">
                        <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                          <Activity className="h-6 w-6" />
                          <span>Log Aktivitas</span>
                        </Button>
                      </Link>
                    </>
                  )}
                  {user.role === "staf" && (
                    <Link href="/staf/documents">
                      <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                        <FileText className="h-6 w-6" />
                        <span>Dokumen Saya</span>
                      </Button>
                    </Link>
                  )}
                  {user.role === "hode" && (
                    <Link href="/hode/approvals">
                      <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                        <Award className="h-6 w-6" />
                        <span>Persetujuan</span>
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Activity */}
          <Card className="mt-12">
            <CardHeader>
              <CardTitle>Aktivitas Terbaru</CardTitle>
              <CardDescription>Dokumen yang baru saja dibuat</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Surat Undangan Pelatihan</p>
                      <p className="text-sm text-gray-500">Kode: SEC/001/2024</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">2 jam yang lalu</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Award className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">Sertifikat Pelatihan Digital</p>
                      <p className="text-sm text-gray-500">25 peserta</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">5 jam yang lalu</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Surat Pemberitahuan</p>
                      <p className="text-sm text-gray-500">Kode: PRT/045/2024</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">1 hari yang lalu</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <RoleBasedDashboard />
        </div>
      </div>
    </ProtectedRoute>
  )
}
