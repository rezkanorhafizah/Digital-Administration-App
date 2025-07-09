"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Download, Eye, Plus, Trash2 } from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"
import { Navbar } from "@/components/navbar"
import { generatePDF, generateBatchPDF } from "@/lib/pdf-utils"

interface Peserta {
  id: string
  nama: string
}

export default function SertifikatPage() {
  const [formData, setFormData] = useState({
    namaKegiatan: "",
    tanggalKegiatan: "",
    durasi: "",
    tempat: "HAFECS - Yayasan Hasnur Centre",
    penandatangan: "",
    jabatanPenandatangan: "",
  })

  const [pesertaList, setPesertaList] = useState<Peserta[]>([{ id: "1", nama: "" }])

  const [showPreview, setShowPreview] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addPeserta = () => {
    const newId = (pesertaList.length + 1).toString()
    setPesertaList((prev) => [...prev, { id: newId, nama: "" }])
  }

  const removePeserta = (id: string) => {
    if (pesertaList.length > 1) {
      setPesertaList((prev) => prev.filter((p) => p.id !== id))
    }
  }

  const updatePeserta = (id: string, nama: string) => {
    setPesertaList((prev) => prev.map((p) => (p.id === id ? { ...p, nama } : p)))
  }

  const importFromText = (text: string) => {
    const names = text.split("\n").filter((name) => name.trim() !== "")
    const newPeserta = names.map((nama, index) => ({
      id: (index + 1).toString(),
      nama: nama.trim(),
    }))
    setPesertaList(newPeserta)
  }

  const handleDownloadSinglePDF = async () => {
    if (!formData.namaKegiatan || !pesertaList[0]?.nama) {
      alert("Mohon lengkapi nama kegiatan dan minimal satu peserta")
      return
    }

    const filename = `Sertifikat_${pesertaList[0].nama.replace(/\s+/g, "_")}_${formData.namaKegiatan.replace(/\s+/g, "_")}.pdf`

    await generatePDF("sertifikat-preview", {
      filename,
      format: "a4",
      orientation: "landscape",
    })
  }

  const handleDownloadAllPDF = async () => {
    if (!formData.namaKegiatan || pesertaList.some((p) => !p.nama.trim())) {
      alert("Mohon lengkapi nama kegiatan dan semua nama peserta")
      return
    }

    // Create individual certificate elements for each participant
    const elements = pesertaList.map((peserta, index) => {
      // Create a temporary certificate element for each participant
      const tempElement = document.createElement("div")
      tempElement.id = `temp-certificate-${index}`
      tempElement.innerHTML = document.getElementById("sertifikat-preview")?.innerHTML || ""

      // Update the name in the temporary element
      const nameElement = tempElement.querySelector("[data-participant-name]")
      if (nameElement) {
        nameElement.textContent = peserta.nama
      }

      // Hide the element and add to body
      tempElement.style.position = "absolute"
      tempElement.style.left = "-9999px"
      tempElement.style.width = "800px"
      tempElement.style.height = "600px"
      document.body.appendChild(tempElement)

      return {
        id: `temp-certificate-${index}`,
        filename: `Sertifikat_${peserta.nama.replace(/\s+/g, "_")}_${formData.namaKegiatan.replace(/\s+/g, "_")}.pdf`,
      }
    })

    try {
      await generateBatchPDF(elements, {
        format: "a4",
        orientation: "landscape",
      })
    } finally {
      // Clean up temporary elements
      elements.forEach(({ id }) => {
        const element = document.getElementById(id)
        if (element) {
          document.body.removeChild(element)
        }
      })
    }
  }

  return (
    <ProtectedRoute>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
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
              <h1 className="text-3xl font-bold text-gray-900">Pembuatan Sertifikat</h1>
              <p className="text-gray-600">Generate sertifikat pelatihan untuk peserta</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form */}
            <div className="space-y-6">
              {/* Data Kegiatan */}
              <Card>
                <CardHeader>
                  <CardTitle>Data Kegiatan</CardTitle>
                  <CardDescription>Informasi pelatihan atau kegiatan</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="namaKegiatan">Nama Kegiatan</Label>
                    <Input
                      id="namaKegiatan"
                      value={formData.namaKegiatan}
                      onChange={(e) => handleInputChange("namaKegiatan", e.target.value)}
                      placeholder="Pelatihan Kompetensi Guru Digital"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tanggalKegiatan">Tanggal Kegiatan</Label>
                      <Input
                        id="tanggalKegiatan"
                        type="date"
                        value={formData.tanggalKegiatan}
                        onChange={(e) => handleInputChange("tanggalKegiatan", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="durasi">Durasi</Label>
                      <Input
                        id="durasi"
                        value={formData.durasi}
                        onChange={(e) => handleInputChange("durasi", e.target.value)}
                        placeholder="32 Jam"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tempat">Tempat</Label>
                    <Input
                      id="tempat"
                      value={formData.tempat}
                      onChange={(e) => handleInputChange("tempat", e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="penandatangan">Penandatangan</Label>
                      <Input
                        id="penandatangan"
                        value={formData.penandatangan}
                        onChange={(e) => handleInputChange("penandatangan", e.target.value)}
                        placeholder="Dr. Ahmad Hasnur"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="jabatanPenandatangan">Jabatan</Label>
                      <Input
                        id="jabatanPenandatangan"
                        value={formData.jabatanPenandatangan}
                        onChange={(e) => handleInputChange("jabatanPenandatangan", e.target.value)}
                        placeholder="Direktur HAFECS"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Data Peserta */}
              <Card>
                <CardHeader>
                  <CardTitle>Data Peserta</CardTitle>
                  <CardDescription>Daftar peserta yang akan mendapat sertifikat</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Import Text Area */}
                  <div className="space-y-2">
                    <Label>Import Nama (Opsional)</Label>
                    <Textarea
                      placeholder="Paste daftar nama peserta di sini (satu nama per baris)&#10;Contoh:&#10;Ahmad Budiman&#10;Siti Nurhaliza&#10;Budi Santoso"
                      rows={4}
                      onChange={(e) => {
                        if (e.target.value.trim()) {
                          importFromText(e.target.value)
                        }
                      }}
                    />
                  </div>

                  {/* Individual Inputs */}
                  <div className="space-y-3">
                    {pesertaList.map((peserta, index) => (
                      <div key={peserta.id} className="flex gap-2">
                        <div className="flex-1">
                          <Input
                            value={peserta.nama}
                            onChange={(e) => updatePeserta(peserta.id, e.target.value)}
                            placeholder={`Nama peserta ${index + 1}`}
                          />
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removePeserta(peserta.id)}
                          disabled={pesertaList.length === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <Button type="button" variant="outline" onClick={addPeserta} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah Peserta
                  </Button>

                  <div className="flex gap-3 pt-4">
                    <Button onClick={() => setShowPreview(true)} variant="outline" className="flex-1">
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                    {pesertaList.length === 1 ? (
                      <Button onClick={handleDownloadSinglePDF} className="flex-1 bg-green-600 hover:bg-green-700">
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </Button>
                    ) : (
                      <Button onClick={handleDownloadAllPDF} className="flex-1 bg-green-600 hover:bg-green-700">
                        <Download className="h-4 w-4 mr-2" />
                        Download Semua PDF ({pesertaList.length})
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Preview Sertifikat</CardTitle>
                <CardDescription>Pratinjau sertifikat yang akan dibuat</CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  id="sertifikat-preview"
                  className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 border-4 border-yellow-400 rounded-lg min-h-[600px] text-center relative"
                >
                  {/* Decorative Border */}
                  <div className="absolute inset-4 border-2 border-yellow-300 rounded-lg"></div>

                  <div className="relative z-10 space-y-6">
                    {/* Header */}
                    <div className="space-y-2">
                      <div className="flex justify-center mb-4">
                        <img src="/images/logo-hafecs.png" alt="HAFECS Logo" className="h-12 w-auto" />
                      </div>
                      <h2 className="text-2xl font-bold text-blue-800">SERTIFIKAT</h2>
                      <p className="text-lg text-blue-600">CERTIFICATE OF COMPLETION</p>
                    </div>

                    {/* Logo/Emblem Area */}

                    {/* Content */}
                    <div className="space-y-4">
                      <p className="text-sm">Diberikan kepada:</p>
                      <h3
                        className="text-xl font-bold text-gray-800 border-b-2 border-gray-300 pb-2 mx-8"
                        data-participant-name
                      >
                        {pesertaList[0]?.nama || "[Nama Peserta]"}
                      </h3>

                      <p className="text-sm">Telah mengikuti dan menyelesaikan:</p>
                      <h4 className="text-lg font-semibold text-blue-700">
                        {formData.namaKegiatan || "[Nama Kegiatan]"}
                      </h4>

                      <div className="text-sm space-y-1">
                        <p>Durasi: {formData.durasi || "[Durasi]"}</p>
                        <p>
                          Tanggal:{" "}
                          {formData.tanggalKegiatan
                            ? new Date(formData.tanggalKegiatan).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })
                            : "[Tanggal]"}
                        </p>
                        <p>Tempat: {formData.tempat}</p>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-8 space-y-2">
                      <p className="text-xs">
                        Banjarmasin,{" "}
                        {new Date().toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                      <div className="pt-8">
                        <p className="font-semibold">{formData.penandatangan || "[Nama Penandatangan]"}</p>
                        <p className="text-sm">{formData.jabatanPenandatangan || "[Jabatan]"}</p>
                        <p className="text-xs font-semibold text-blue-600 mt-2">HAFECS - Yayasan Hasnur Centre</p>
                      </div>
                    </div>
                  </div>
                </div>

                {pesertaList.length > 1 && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">
                      <strong>Total: {pesertaList.length} sertifikat</strong> akan dibuat untuk semua peserta
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
