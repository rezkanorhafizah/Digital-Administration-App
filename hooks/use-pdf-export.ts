"use client"

import { useState } from "react"
import { generatePDF, generateBatchPDF, type PDFOptions } from "@/lib/pdf-utils"

export function usePDFExport() {
  const [isGenerating, setIsGenerating] = useState(false)

  const exportSinglePDF = async (elementId: string, options: PDFOptions) => {
    setIsGenerating(true)
    try {
      await generatePDF(elementId, options)
    } finally {
      setIsGenerating(false)
    }
  }

  const exportBatchPDF = async (
    elements: { id: string; filename: string }[],
    options: Omit<PDFOptions, "filename">,
  ) => {
    setIsGenerating(true)
    try {
      await generateBatchPDF(elements, options)
    } finally {
      setIsGenerating(false)
    }
  }

  return {
    isGenerating,
    exportSinglePDF,
    exportBatchPDF,
  }
}
