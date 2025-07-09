"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download, Eye } from "lucide-react"
import { generatePDF } from "@/lib/pdf-utils"

interface PDFPreviewModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  filename: string
  orientation?: "portrait" | "landscape"
}

export function PDFPreviewModal({
  isOpen,
  onClose,
  title,
  children,
  filename,
  orientation = "portrait",
}: PDFPreviewModalProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleDownload = async () => {
    setIsGenerating(true)
    try {
      await generatePDF("pdf-preview-content", {
        filename,
        format: "a4",
        orientation,
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            {title}
          </DialogTitle>
          <DialogDescription>Preview dokumen sebelum download PDF</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div id="pdf-preview-content" className="bg-white">
            {children}
          </div>

          <div className="flex gap-2 justify-end pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Tutup
            </Button>
            <Button onClick={handleDownload} disabled={isGenerating} className="bg-blue-600 hover:bg-blue-700">
              <Download className="h-4 w-4 mr-2" />
              {isGenerating ? "Generating..." : "Download PDF"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
