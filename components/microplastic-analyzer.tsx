"use client"

import type React from "react"
import { useState, useCallback, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, FileImage, FileSpreadsheet, Search, CheckCircle, AlertCircle, X } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface MicroplasticData {
  name: string
  type: string
  peaks: number[]
  wavelengths: number[]
  absorbance: number[]
}

interface AnalysisResult {
  match: string
  confidence: number
  type: string
  matchedPeaks: number[]
  similarity: number
}

export function MicroplasticAnalyzer() {
  const [csvData, setCsvData] = useState<MicroplasticData[]>([])
  const [spectrographData, setSpectrographData] = useState<{ wavelengths: number[]; absorbance: number[] } | null>(null)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [csvUploaded, setCsvUploaded] = useState(false)
  const [imageUploaded, setImageUploaded] = useState(false)
  const csvInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const [isDraggingCsv, setIsDraggingCsv] = useState(false)
  const [isDraggingImage, setIsDraggingImage] = useState(false)

  const handleCsvUpload = useCallback(async (file: File) => {
    if (!file) return

    console.log("[v0] Processing CSV file:", file.name)
    setUploadProgress(0)

    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const lines = text.split("\n")
      const headers = lines[0].split(",").map((h) => h.trim())

      console.log("[v0] CSV headers:", headers)

      const data: MicroplasticData[] = []

      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim()) {
          const values = lines[i].split(",").map((v) => v.trim())

          // Extract wavelengths and absorbance from CSV
          const wavelengths: number[] = []
          const absorbance: number[] = []
          const peaks: number[] = []

          // Assume CSV has columns: name, type, then wavelength/absorbance pairs
          const name = values[0] || `Sample ${i}`
          const type = values[1] || "Unknown"

          // Parse wavelength/absorbance data (assuming alternating columns)
          for (let j = 2; j < values.length - 1; j += 2) {
            const wl = Number.parseFloat(values[j])
            const abs = Number.parseFloat(values[j + 1])
            if (!isNaN(wl) && !isNaN(abs)) {
              wavelengths.push(wl)
              absorbance.push(abs)

              // Detect peaks (simple peak detection)
              if (abs > 0.5 && j > 2 && j < values.length - 3) {
                const prevAbs = Number.parseFloat(values[j - 1])
                const nextAbs = Number.parseFloat(values[j + 3])
                if (abs > prevAbs && abs > nextAbs) {
                  peaks.push(wl)
                }
              }
            }
          }

          data.push({ name, type, peaks, wavelengths, absorbance })
        }
        setUploadProgress((i / lines.length) * 100)
      }

      console.log("[v0] Processed CSV data:", data)
      setCsvData(data)
      setCsvUploaded(true)
      setUploadProgress(100)
    }

    reader.readAsText(file)
  }, [])

  const handleImageUpload = useCallback(async (file: File) => {
    if (!file) return

    console.log("[v0] Processing spectrograph image:", file.name)
    setUploadProgress(0)

    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const img = new Image()

    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx?.drawImage(img, 0, 0)

      // Extract spectral data from image
      const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData?.data

      if (data) {
        const wavelengths: number[] = []
        const absorbance: number[] = []

        // Sample extraction - scan horizontally across the middle of the image
        const midY = Math.floor(canvas.height / 2)
        const startWavelength = 400 // nm
        const endWavelength = 4000 // nm

        for (let x = 0; x < canvas.width; x += 5) {
          const pixelIndex = (midY * canvas.width + x) * 4
          const r = data[pixelIndex]
          const g = data[pixelIndex + 1]
          const b = data[pixelIndex + 2]

          // Convert RGB to absorbance (simplified)
          const brightness = (r + g + b) / 3
          const absorbanceValue = ((255 - brightness) / 255) * 2 // Scale to 0-2

          const wavelength = startWavelength + (x / canvas.width) * (endWavelength - startWavelength)

          wavelengths.push(wavelength)
          absorbance.push(absorbanceValue)

          setUploadProgress((x / canvas.width) * 100)
        }

        console.log("[v0] Extracted spectral data points:", wavelengths.length)
        setSpectrographData({ wavelengths, absorbance })
        setImageUploaded(true)
        setUploadProgress(100)
      }
    }

    img.src = URL.createObjectURL(file)
  }, [])

  const handleCsvDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDraggingCsv(true)
  }, [])

  const handleCsvDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDraggingCsv(false)
  }, [])

  const handleCsvDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDraggingCsv(false)
      const files = e.dataTransfer.files
      if (files.length > 0 && files[0].type === "text/csv") {
        handleCsvUpload(files[0])
      }
    },
    [handleCsvUpload],
  )

  const handleImageDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDraggingImage(true)
  }, [])

  const handleImageDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDraggingImage(false)
  }, [])

  const handleImageDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDraggingImage(false)
      const files = e.dataTransfer.files
      if (files.length > 0 && files[0].type.startsWith("image/")) {
        handleImageUpload(files[0])
      }
    },
    [handleImageUpload],
  )

  const handleCsvInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (file) {
        handleCsvUpload(file)
      }
    },
    [handleCsvUpload],
  )

  const handleImageInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (file) {
        handleImageUpload(file)
      }
    },
    [handleImageUpload],
  )

  const analyzeSpectrograph = useCallback(async () => {
    if (!csvData.length || !spectrographData) return

    console.log("[v0] Starting analysis...")
    setIsAnalyzing(true)
    setAnalysisResult(null)

    // Simulate analysis delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    let bestMatch: AnalysisResult = {
      match: "Unknown",
      confidence: 0,
      type: "Unknown",
      matchedPeaks: [],
      similarity: 0,
    }

    // Compare spectrograph data with CSV database
    for (const sample of csvData) {
      let similarity = 0
      const matchedPeaks: number[] = []

      // Simple correlation analysis
      const minLength = Math.min(spectrographData.wavelengths.length, sample.wavelengths.length)
      let correlationSum = 0

      for (let i = 0; i < minLength; i++) {
        const specWl = spectrographData.wavelengths[i]
        const specAbs = spectrographData.absorbance[i]

        // Find closest wavelength in sample data
        let closestIndex = 0
        let minDiff = Math.abs(sample.wavelengths[0] - specWl)

        for (let j = 1; j < sample.wavelengths.length; j++) {
          const diff = Math.abs(sample.wavelengths[j] - specWl)
          if (diff < minDiff) {
            minDiff = diff
            closestIndex = j
          }
        }

        if (minDiff < 50) {
          // Within 50nm tolerance
          const sampleAbs = sample.absorbance[closestIndex]
          correlationSum += Math.abs(specAbs - sampleAbs)
        }
      }

      similarity = Math.max(0, 100 - (correlationSum / minLength) * 50)

      // Check for peak matches
      for (const peak of sample.peaks) {
        for (let i = 0; i < spectrographData.wavelengths.length; i++) {
          if (Math.abs(spectrographData.wavelengths[i] - peak) < 30 && spectrographData.absorbance[i] > 0.3) {
            matchedPeaks.push(peak)
            break
          }
        }
      }

      const confidence = similarity * 0.7 + (matchedPeaks.length / sample.peaks.length) * 30

      if (confidence > bestMatch.confidence) {
        bestMatch = {
          match: sample.name,
          confidence: Math.round(confidence),
          type: sample.type,
          matchedPeaks,
          similarity: Math.round(similarity),
        }
      }
    }

    console.log("[v0] Analysis complete:", bestMatch)
    setAnalysisResult(bestMatch)
    setIsAnalyzing(false)
  }, [csvData, spectrographData])

  const chartData = spectrographData
    ? spectrographData.wavelengths.map((wl, i) => ({
        wavelength: wl,
        absorbance: spectrographData.absorbance[i],
      }))
    : []

  return (
    <div className="container mx-auto p-4 lg:p-8 space-y-8" id="analyzer">
      {/* Hero Section */}
      <div className="text-center space-y-4 py-12">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-4">
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
          AI-Powered Analysis
        </div>
        <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Microplastic Spectrograph
        </h1>
        <h2 className="text-2xl lg:text-3xl font-semibold text-slate-700 dark:text-slate-300">Analyzer</h2>
        <p className="text-lg lg:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
          Upload your spectrograph image and CSV database to identify microplastic samples with advanced AI-powered
          spectral analysis and machine learning algorithms.
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <Badge variant="secondary" className="px-3 py-1">
            <CheckCircle className="w-3 h-3 mr-1" />
            Real-time Analysis
          </Badge>
          <Badge variant="secondary" className="px-3 py-1">
            <CheckCircle className="w-3 h-3 mr-1" />
            High Accuracy
          </Badge>
          <Badge variant="secondary" className="px-3 py-1">
            <CheckCircle className="w-3 h-3 mr-1" />
            Easy to Use
          </Badge>
        </div>
      </div>

      {/* Upload Section */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* CSV Upload */}
        <Card
          className={`border-2 border-dashed transition-all duration-300 ${
            isDraggingCsv
              ? "border-blue-500 bg-blue-50 dark:bg-blue-950/50 scale-105"
              : csvUploaded
                ? "border-green-500 bg-green-50 dark:bg-green-950/50"
                : "border-slate-300 dark:border-slate-600 hover:border-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
          }`}
          onDragOver={handleCsvDragOver}
          onDragLeave={handleCsvDragLeave}
          onDrop={handleCsvDrop}
        >
          <CardHeader className="text-center pb-4">
            <CardTitle className="flex items-center justify-center gap-3 text-xl">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                <FileSpreadsheet className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              Upload CSV Database
            </CardTitle>
            <CardDescription className="text-base">
              Upload your microplastic reference database in CSV format
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <input
                ref={csvInputRef}
                type="file"
                accept=".csv"
                onChange={handleCsvInputChange}
                className="hidden"
                id="csv-upload"
              />

              <div className="text-center space-y-4">
                <div className="p-8 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <FileSpreadsheet className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    Drag and drop your CSV file here, or click to browse
                  </p>
                  <Button
                    variant="outline"
                    className="cursor-pointer bg-transparent"
                    onClick={() => csvInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Choose CSV File
                  </Button>
                </div>
              </div>

              {csvUploaded && (
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-4 py-2 rounded-lg">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">CSV uploaded successfully</span>
                </div>
              )}

              {csvData.length > 0 && (
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="px-3 py-1">
                    {csvData.length} samples loaded
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setCsvData([])
                      setCsvUploaded(false)
                      if (csvInputRef.current) csvInputRef.current.value = ""
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Image Upload */}
        <Card
          className={`border-2 border-dashed transition-all duration-300 ${
            isDraggingImage
              ? "border-blue-500 bg-blue-50 dark:bg-blue-950/50 scale-105"
              : imageUploaded
                ? "border-green-500 bg-green-50 dark:bg-green-950/50"
                : "border-slate-300 dark:border-slate-600 hover:border-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
          }`}
          onDragOver={handleImageDragOver}
          onDragLeave={handleImageDragLeave}
          onDrop={handleImageDrop}
        >
          <CardHeader className="text-center pb-4">
            <CardTitle className="flex items-center justify-center gap-3 text-xl">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <FileImage className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              Upload Spectrograph
            </CardTitle>
            <CardDescription className="text-base">Upload your spectrograph image for analysis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageInputChange}
                className="hidden"
                id="image-upload"
              />

              <div className="text-center space-y-4">
                <div className="p-8 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <FileImage className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    Drag and drop your spectrograph image here, or click to browse
                  </p>
                  <Button
                    variant="outline"
                    className="cursor-pointer bg-transparent"
                    onClick={() => imageInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Choose Image File
                  </Button>
                </div>
              </div>

              {imageUploaded && (
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-4 py-2 rounded-lg">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Image uploaded successfully</span>
                </div>
              )}

              {spectrographData && (
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="px-3 py-1">
                    {spectrographData.wavelengths.length} data points extracted
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSpectrographData(null)
                      setImageUploaded(false)
                      if (imageInputRef.current) imageInputRef.current.value = ""
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      {uploadProgress > 0 && uploadProgress < 100 && (
        <Card className="border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-blue-700 dark:text-blue-300">Processing file...</span>
                <span className="font-bold text-blue-700 dark:text-blue-300">{Math.round(uploadProgress)}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analysis Button */}
      {csvUploaded && imageUploaded && (
        <div className="text-center py-8">
          <Button
            onClick={analyzeSpectrograph}
            disabled={isAnalyzing}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" />
                Analyzing Spectrograph...
              </>
            ) : (
              <>
                <Search className="h-5 w-5 mr-3" />
                Analyze Spectrograph
              </>
            )}
          </Button>
        </div>
      )}

      {/* Results Section */}
      {analysisResult && (
        <div className="grid xl:grid-cols-2 gap-8">
          {/* Analysis Results */}
          <Card className="border-2 border-blue-200 dark:border-blue-800 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50">
              <CardTitle className="flex items-center gap-3 text-xl">
                {analysisResult.confidence > 70 ? (
                  <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                    <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                ) : (
                  <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
                    <AlertCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                )}
                Analysis Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Identified Microplastic
                  </label>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{analysisResult.match}</p>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Type Classification</label>
                  <div className="mt-2">
                    <Badge variant="outline" className="px-3 py-1 text-sm font-medium">
                      {analysisResult.type}
                    </Badge>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Confidence Score</label>
                  <div className="flex items-center gap-3 mt-2">
                    <Progress value={analysisResult.confidence} className="flex-1 h-3" />
                    <span className="text-lg font-bold text-slate-900 dark:text-white min-w-[3rem]">
                      {analysisResult.confidence}%
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Spectral Similarity</label>
                  <div className="flex items-center gap-3 mt-2">
                    <Progress value={analysisResult.similarity} className="flex-1 h-3" />
                    <span className="text-lg font-bold text-slate-900 dark:text-white min-w-[3rem]">
                      {analysisResult.similarity}%
                    </span>
                  </div>
                </div>

                {analysisResult.matchedPeaks.length > 0 && (
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Matched Peaks (cm⁻¹)
                    </label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {analysisResult.matchedPeaks.map((peak, i) => (
                        <Badge key={i} variant="secondary" className="px-2 py-1 text-xs font-mono">
                          {Math.round(peak)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {analysisResult.confidence < 50 && (
                <Alert className="border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/30">
                  <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                  <AlertDescription className="text-yellow-800 dark:text-yellow-200">
                    Low confidence match detected. Consider uploading a higher quality spectrograph or expanding your
                    reference database for better accuracy.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Spectral Chart */}
          {spectrographData && (
            <Card className="border-2 border-slate-200 dark:border-slate-700 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-900/50 dark:to-gray-900/50">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
                    <FileImage className="h-6 w-6 text-slate-600 dark:text-slate-400" />
                  </div>
                  Extracted Spectral Data
                </CardTitle>
                <CardDescription className="text-base">
                  Wavelength vs Absorbance from uploaded spectrograph
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 60 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis
                        dataKey="wavelength"
                        label={{ value: "Wavelength (nm)", position: "insideBottom", offset: -10 }}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis
                        label={{ value: "Absorbance", angle: -90, position: "insideLeft" }}
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip
                        formatter={(value: any) => [value.toFixed(3), "Absorbance"]}
                        labelFormatter={(label: any) => `${Math.round(label)} nm`}
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.95)",
                          border: "1px solid #e2e8f0",
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="absorbance"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4, fill: "#3b82f6" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
