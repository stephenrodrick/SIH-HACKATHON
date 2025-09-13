"use client"

import type React from "react"
import { useState, useCallback, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, FileSpreadsheet, CheckCircle, AlertTriangle, X, ImageIcon, FileText } from "lucide-react"

interface DatasetUploadProps {
  onFileUpload: (file: File) => void
  isUploading: boolean
  uploadProgress: number
}

export function DatasetUpload({ onFileUpload, isUploading, uploadProgress }: DatasetUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const files = Array.from(e.dataTransfer.files)
        validateAndUploadFiles(files)
      }
    },
    [onFileUpload],
  )

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      validateAndUploadFiles(files)
      // Reset input value to allow re-uploading same file
      e.target.value = ""
    }
  }

  const handleBrowseClick = () => {
    fileInputRef.current?.click()
  }

  const validateAndUploadFiles = (files: File[]) => {
    console.log("[v0] Starting file validation for", files.length, "files")
    const errors: string[] = []
    const validFiles: File[] = []

    files.forEach((file) => {
      console.log("[v0] Validating file:", file.name, "Type:", file.type, "Size:", file.size)

      if (!file.name.match(/\.(csv|xlsx|xls|png|jpg|jpeg|tiff|bmp)$/i)) {
        errors.push(`${file.name}: Unsupported file type. Please use CSV, Excel, or image files (PNG, JPG, TIFF, BMP).`)
        return
      }

      // Validate file size (max 50MB for images, 10MB for data files)
      const maxSize = file.type.startsWith("image/") ? 50 * 1024 * 1024 : 10 * 1024 * 1024
      if (file.size > maxSize) {
        errors.push(`${file.name}: File too large. Maximum size is ${maxSize / (1024 * 1024)}MB.`)
        return
      }

      validFiles.push(file)
    })

    console.log("[v0] Validation complete. Valid files:", validFiles.length, "Errors:", errors.length)
    setValidationErrors(errors)
    setUploadedFiles(validFiles)

    // Upload valid files immediately
    validFiles.forEach((file) => {
      console.log("[v0] Uploading file:", file.name)
      onFileUpload(file)
    })
  }

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) {
      return <ImageIcon className="h-4 w-4 text-blue-600" />
    }
    return <FileSpreadsheet className="h-4 w-4 text-green-600" />
  }

  const downloadSampleCSV = () => {
    const sampleData = `wavelength,absorbance,type,polymer,color
400,0.12,PET Fragment,Polyethylene Terephthalate,Clear
450,0.15,PET Fragment,Polyethylene Terephthalate,Clear
500,0.89,PET Fragment,Polyethylene Terephthalate,Clear
550,0.45,PET Fragment,Polyethylene Terephthalate,Clear
600,0.23,PET Fragment,Polyethylene Terephthalate,Clear
650,0.18,PET Fragment,Polyethylene Terephthalate,Clear
700,0.34,PET Fragment,Polyethylene Terephthalate,Clear
750,0.67,PET Fragment,Polyethylene Terephthalate,Clear
800,0.12,PET Fragment,Polyethylene Terephthalate,Clear`

    const blob = new Blob([sampleData], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "sample_microplastic_data.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Upload className="h-5 w-5" />
            Upload Dataset & Spectrograph Images
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Upload CSV files with spectral data or spectrograph images for automated analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            className={`relative border-2 border-dashed rounded-lg p-4 sm:p-8 text-center transition-colors ${
              dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-muted-foreground/50"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="flex justify-center gap-2 sm:gap-4 mb-4">
              <FileSpreadsheet className="h-8 w-8 sm:h-12 sm:w-12 text-green-600" />
              <ImageIcon className="h-8 w-8 sm:h-12 sm:w-12 text-blue-600" />
            </div>
            <div className="space-y-2">
              <p className="text-base sm:text-lg font-medium">Drop your files here</p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                CSV data files or spectrograph images (PNG, JPG, TIFF)
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".csv,.xlsx,.xls,.png,.jpg,.jpeg,.tiff,.bmp"
              onChange={handleFileInput}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Button
              className="mt-4 bg-transparent"
              variant="outline"
              onClick={handleBrowseClick}
              disabled={isUploading}
            >
              {isUploading ? "Processing..." : "Browse Files"}
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Alert>
              <FileText className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <div className="font-medium">CSV File Format:</div>
                  <ul className="text-xs sm:text-sm space-y-1 ml-4">
                    <li>
                      • <strong>wavelength:</strong> Wavelength values (nm)
                    </li>
                    <li>
                      • <strong>absorbance:</strong> Absorbance values
                    </li>
                    <li>
                      • <strong>type:</strong> Microplastic type (optional)
                    </li>
                    <li>
                      • <strong>polymer:</strong> Polymer type (optional)
                    </li>
                    <li>
                      • <strong>color:</strong> Color description (optional)
                    </li>
                  </ul>
                </div>
              </AlertDescription>
            </Alert>

            <Alert>
              <ImageIcon className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <div className="font-medium">Spectrograph Images:</div>
                  <ul className="text-xs sm:text-sm space-y-1 ml-4">
                    <li>• Clear spectral plots with visible peaks</li>
                    <li>• Wavelength axis labeled (nm)</li>
                    <li>• Absorbance/intensity axis visible</li>
                    <li>• High resolution (min 800x600)</li>
                    <li>• Formats: PNG, JPG, TIFF, BMP</li>
                  </ul>
                </div>
              </AlertDescription>
            </Alert>
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Processing files...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-1">
                  <div className="font-medium">Upload errors:</div>
                  {validationErrors.map((error, index) => (
                    <div key={index} className="text-xs sm:text-sm">
                      {error}
                    </div>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Uploaded Files List */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-2">
              <div className="font-medium text-sm sm:text-base">Files ready for processing:</div>
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted rounded text-sm">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    {getFileIcon(file)}
                    <span className="truncate">{file.name}</span>
                    <span className="text-xs text-muted-foreground flex-shrink-0">
                      ({(file.size / 1024).toFixed(1)} KB) • {file.type.startsWith("image/") ? "Image" : "Data"}
                    </span>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => removeFile(index)} className="flex-shrink-0">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Sample Files & Templates</CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Download sample files and templates for proper formatting
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button variant="outline" className="justify-start bg-transparent" onClick={downloadSampleCSV}>
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              CSV Template
            </Button>
            <Button
              variant="outline"
              className="justify-start bg-transparent"
              onClick={() => window.open("/sample-spectrograph-with-peaks.jpg", "_blank")}
            >
              <ImageIcon className="h-4 w-4 mr-2" />
              Sample Spectrograph
            </Button>
            <Button
              variant="outline"
              className="justify-start bg-transparent"
              onClick={() =>
                alert(
                  "Format guide: CSV should have wavelength,absorbance columns. Images should show clear spectral peaks with labeled axes.",
                )
              }
            >
              <FileText className="h-4 w-4 mr-2" />
              Format Guide
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
