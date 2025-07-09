import html2canvas from "html2canvas"
import jsPDF from "jspdf"

export interface PDFOptions {
  filename: string
  format?: "a4" | "letter"
  orientation?: "portrait" | "landscape"
  quality?: number
}

export const generatePDF = async (elementId: string, options: PDFOptions): Promise<void> => {
  try {
    const element = document.getElementById(elementId)
    if (!element) {
      throw new Error(`Element with id "${elementId}" not found`)
    }

    // Show loading state
    const loadingElement = document.createElement("div")
    loadingElement.innerHTML = `
      <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                  background: rgba(0,0,0,0.5); display: flex; align-items: center; 
                  justify-content: center; z-index: 9999; color: white; font-size: 18px;">
        <div style="background: white; padding: 20px; border-radius: 8px; color: black;">
          <div style="text-align: center;">
            <div style="border: 4px solid #f3f3f3; border-top: 4px solid #3498db; 
                        border-radius: 50%; width: 40px; height: 40px; 
                        animation: spin 2s linear infinite; margin: 0 auto 10px;"></div>
            <p>Generating PDF...</p>
          </div>
        </div>
      </div>
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    `
    document.body.appendChild(loadingElement)

    // Configure canvas options for better quality
    const canvas = await html2canvas(element, {
      scale: 2, // Higher resolution
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      width: element.scrollWidth,
      height: element.scrollHeight,
    })

    // Calculate PDF dimensions
    const imgWidth = 210 // A4 width in mm
    const pageHeight = 295 // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight

    // Create PDF
    const pdf = new jsPDF({
      orientation: options.orientation || "portrait",
      unit: "mm",
      format: options.format || "a4",
    })

    let position = 0

    // Add first page
    pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, position, imgWidth, imgHeight, undefined, "FAST")
    heightLeft -= pageHeight

    // Add additional pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, position, imgWidth, imgHeight, undefined, "FAST")
      heightLeft -= pageHeight
    }

    // Save the PDF
    pdf.save(options.filename)

    // Remove loading state
    document.body.removeChild(loadingElement)
  } catch (error) {
    console.error("Error generating PDF:", error)
    // Remove loading state on error
    const loadingElement = document.querySelector('[style*="position: fixed"]')
    if (loadingElement) {
      document.body.removeChild(loadingElement)
    }
    alert("Terjadi kesalahan saat membuat PDF. Silakan coba lagi.")
  }
}

export const generateBatchPDF = async (
  elements: { id: string; filename: string }[],
  options: Omit<PDFOptions, "filename">,
): Promise<void> => {
  try {
    // Show loading state
    const loadingElement = document.createElement("div")
    loadingElement.innerHTML = `
      <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                  background: rgba(0,0,0,0.5); display: flex; align-items: center; 
                  justify-content: center; z-index: 9999; color: white; font-size: 18px;">
        <div style="background: white; padding: 20px; border-radius: 8px; color: black;">
          <div style="text-align: center;">
            <div style="border: 4px solid #f3f3f3; border-top: 4px solid #3498db; 
                        border-radius: 50%; width: 40px; height: 40px; 
                        animation: spin 2s linear infinite; margin: 0 auto 10px;"></div>
            <p>Generating ${elements.length} PDFs...</p>
            <p id="progress">0 / ${elements.length}</p>
          </div>
        </div>
      </div>
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    `
    document.body.appendChild(loadingElement)

    for (let i = 0; i < elements.length; i++) {
      const { id, filename } = elements[i]

      // Update progress
      const progressElement = document.getElementById("progress")
      if (progressElement) {
        progressElement.textContent = `${i + 1} / ${elements.length}`
      }

      await generatePDF(id, { ...options, filename })

      // Small delay between generations
      await new Promise((resolve) => setTimeout(resolve, 500))
    }

    // Remove loading state
    document.body.removeChild(loadingElement)
  } catch (error) {
    console.error("Error generating batch PDF:", error)
    // Remove loading state on error
    const loadingElement = document.querySelector('[style*="position: fixed"]')
    if (loadingElement) {
      document.body.removeChild(loadingElement)
    }
    alert("Terjadi kesalahan saat membuat PDF. Silakan coba lagi.")
  }
}
