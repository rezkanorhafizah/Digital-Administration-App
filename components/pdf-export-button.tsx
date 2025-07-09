"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Download, Loader2 } from "lucide-react"
import { usePDFExport } from "@/hooks/use-pdf-export"
import type { PDFOptions } from "@/lib/pdf-utils"

interface PDFExportButtonProps {
  elementId: string
  filename: string
  options?: Partial<PDFOptions>
  children?: React.ReactNode
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  disabled?: boolean
}

export function PDFExportButton({
  elementId,
  filename,
  options = {},
  children,
  variant = "default",
  size = "default",
  className = "",
  disabled = false,
}: PDFExportButtonProps) {
  const { isGenerating, exportSinglePDF } = usePDFExport()

  const handleExport = async () => {
    await exportSinglePDF(elementId, {
      filename,
      format: "a4",
      orientation: "portrait",
      ...options,
    })
  }

  return (
    <Button
      onClick={handleExport}
      disabled={disabled || isGenerating}
      variant={variant}
      size={size}
      className={className}
    >
      {isGenerating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
      {children || (isGenerating ? "Generating..." : "Download PDF")}
    </Button>
  )
}
