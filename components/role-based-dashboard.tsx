"use client"

import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Users, FileText, Award, Settings, BarChart3 } from "lucide-react"

export function RoleBasedDashboard() {
  const { user } = useAuth()

  if (!user) return null

  const getPermissions = (role: string) => {
    switch (role) {
      case "admin":
        return [
          { icon: Shield, label: "Kelola Pengguna", description: "Tambah, edit, hapus pengguna" },
          { icon: FileText, label: "Semua Surat", description: "Buat dan kelola semua jenis surat" },
          { icon: Award, label: "Semua Sertifikat", description: "Buat dan kelola sertifikat" },
          { icon: Settings, label: "Pengaturan Sistem", description: "Konfigurasi sistem" },
          { icon: BarChart3, label: "Laporan Lengkap", description: "Akses semua laporan dan statistik" },
        ]
      case "staf":
        return [
          { icon: FileText, label: "Buat Surat", description: "Buat surat sesuai kewenangan" },
          { icon: Award, label: "Buat Sertifikat", description: "Generate sertifikat pelatihan" },
          { icon: BarChart3, label: "Laporan Terbatas", description: "Lihat laporan yang relevan" },
        ]
      case "hode":
        return [
          { icon: FileText, label: "Approve Surat", description: "Setujui dan tanda tangani surat" },
          { icon: Award, label: "Approve Sertifikat", description: "Validasi sertifikat" },
          { icon: Users, label: "Kelola Tim", description: "Kelola anggota departemen" },
          { icon: BarChart3, label: "Laporan Departemen", description: "Laporan khusus departemen" },
        ]
      default:
        return []
    }
  }

  const permissions = getPermissions(user.role)

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Hak Akses Anda
        </CardTitle>
        <CardDescription>
          Sebagai <Badge variant="outline">{user.role.toUpperCase()}</Badge>, Anda memiliki akses berikut:
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {permissions.map((permission, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <permission.icon className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-sm">{permission.label}</h4>
                <p className="text-xs text-gray-600">{permission.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
