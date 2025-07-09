"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Download, Eye } from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"
import { Navbar } from "@/components/navbar"
import { generatePDF } from "@/lib/pdf-utils"

export default function SuratPage() {
  const [formData, setFormData] = useState({
    kodeSurat: "",
    nomorSurat: "",
    tujuan: "",
    perihal: "",
    isiSurat: "",
    tanggal: new Date().toISOString().split("T")[0],
    penandatangan: "",
  })

  const [showPreview, setShowPreview] = useState(false)

  // Update kodeSuratOptions dengan penjelasan yang benar
  const kodeSuratOptions = [
    { value: "SEC", label: "SEC - Secretary (Sekretariat)" },
    { value: "TCCD", label: "TCCD - Teacher Curriculum Content Development" },
    { value: "TLC", label: "TLC - Training Learning Certification" },
    { value: "PRT", label: "PRT - Partnership (Kemitraan)" },
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const generateNomorSurat = () => {
    if (formData.kodeSurat) {
      const tahun = new Date().getFullYear()
      const bulan = String(new Date().getMonth() + 1).padStart(2, "0")
      const nomor = Math.floor(Math.random() * 999) + 1
      const nomorSurat = `${formData.kodeSurat}/${String(nomor).padStart(3, "0")}/${bulan}/${tahun}`
      handleInputChange("nomorSurat", nomorSurat)
    }
  }

  const handleDownloadPDF = async () => {
    if (!formData.nomorSurat || !formData.perihal) {
      alert("Mohon lengkapi nomor surat dan perihal terlebih dahulu")
      return
    }

    const filename = `Surat_${formData.kodeSurat || "DOC"}_${formData.nomorSurat.replace(/\//g, "-")}.pdf`

    await generatePDF("surat-preview", {
      filename,
      format: "a4",
      orientation: "portrait",
    })
  }

  return (
    <ProtectedRoute allowedRoles={["admin", "staf"]}>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center mb-8">
            <Link href="/">
              <Button variant="ghost" size="sm" className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Pembuatan Surat</h1>
              <p className="text-gray-600">Buat surat resmi dengan template otomatis</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form */}
            <Card>
              <CardHeader>
                <CardTitle>Form Pembuatan Surat</CardTitle>
                <CardDescription>Isi data berikut untuk membuat surat otomatis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="kodeSurat">Kode Surat</Label>
                    <Select value={formData.kodeSurat} onValueChange={(value) => handleInputChange("kodeSurat", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kode surat" />
                      </SelectTrigger>
                      <SelectContent>
                        {kodeSuratOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nomorSurat">Nomor Surat</Label>
                    <div className="flex gap-2">
                      <Input
                        id="nomorSurat"
                        value={formData.nomorSurat}
                        onChange={(e) => handleInputChange("nomorSurat", e.target.value)}
                        placeholder="Akan di-generate otomatis"
                      />
                      <Button type="button" variant="outline" onClick={generateNomorSurat}>
                        Generate
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tujuan">Tujuan Surat</Label>
                  <Input
                    id="tujuan"
                    value={formData.tujuan}
                    onChange={(e) => handleInputChange("tujuan", e.target.value)}
                    placeholder="Kepada Yth. Bapak/Ibu..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="perihal">Perihal</Label>
                  <Input
                    id="perihal"
                    value={formData.perihal}
                    onChange={(e) => handleInputChange("perihal", e.target.value)}
                    placeholder="Undangan Pelatihan, Pemberitahuan, dll"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="isiSurat">Isi Surat</Label>
                  <Textarea
                    id="isiSurat"
                    value={formData.isiSurat}
                    onChange={(e) => handleInputChange("isiSurat", e.target.value)}
                    placeholder="Tulis isi surat di sini..."
                    rows={6}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tanggal">Tanggal</Label>
                    <Input
                      id="tanggal"
                      type="date"
                      value={formData.tanggal}
                      onChange={(e) => handleInputChange("tanggal", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="penandatangan">Penandatangan</Label>
                    <Input
                      id="penandatangan"
                      value={formData.penandatangan}
                      onChange={(e) => handleInputChange("penandatangan", e.target.value)}
                      placeholder="Nama dan jabatan"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button onClick={() => setShowPreview(true)} variant="outline" className="flex-1">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button onClick={handleDownloadPDF} className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Preview Surat</CardTitle>
                <CardDescription>Pratinjau surat yang akan dibuat</CardDescription>
              </CardHeader>
              <CardContent>
                <div id="surat-preview" className="bg-white p-6 border rounded-lg min-h-[600px] text-sm">
                  {/* Kop Surat */}
                  <div className="text-center border-b-2 border-blue-600 pb-4 mb-6">
                    <div className="flex justify-center mb-2">
                      <img src="/images/logo-hafecs.png" alt="HAFECS Logo" className="h-12 w-auto" />
                    </div>
                    <p className="text-xs">Yayasan Hasnur Centre</p>
                    <p className="text-xs">Jl. Pendidikan No. 123, Banjarmasin</p>
                    <p className="text-xs">Telp: (0511) 123456 | Email: info@hafecs.org</p>
                  </div>

                  {/* Nomor dan Tanggal */}
                  <div className="mb-4">
                    <p>Nomor: {formData.nomorSurat || "_______________"}</p>
                    <p>Perihal: {formData.perihal || "_______________"}</p>
                    <p className="text-right">
                      Banjarmasin,{" "}
                      {new Date(formData.tanggal).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  {/* Tujuan */}
                  <div className="mb-4">
                    <p>{formData.tujuan || "Kepada Yth. _______________"}</p>
                    <p>di tempat</p>
                  </div>

                  {/* Isi Surat */}
                  <div className="mb-6">
                    <p className="mb-2">Dengan hormat,</p>
                    <div className="whitespace-pre-line">{formData.isiSurat || "Isi surat akan muncul di sini..."}</div>
                  </div>

                  {/* Penutup */}
                  <div className="mb-4">
                    <p>
                      Demikian surat ini kami sampaikan. Atas perhatian dan kerjasamanya, kami ucapkan terima kasih.
                    </p>
                  </div>

                  {/* Penandatangan */}
                  <div className="text-right">
                    <p className="mb-16">Hormat kami,</p>
                    <p className="font-semibold">{formData.penandatangan || "_______________"}</p>
                    <p>HAFECS</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
