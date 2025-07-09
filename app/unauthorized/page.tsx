import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldX, ArrowLeft } from "lucide-react"

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <img src="/images/logo-hafecs.png" alt="HAFECS Logo" className="h-12 w-auto mb-4" />
          </div>
          <div className="flex justify-center mb-4">
            <ShieldX className="h-16 w-16 text-red-500" />
          </div>
          <CardTitle className="text-2xl text-red-700">Akses Ditolak</CardTitle>
          <CardDescription>Anda tidak memiliki izin untuk mengakses halaman ini</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-6">
            Silakan hubungi administrator jika Anda merasa ini adalah kesalahan.
          </p>
          <Link href="/">
            <Button className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Dashboard
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
