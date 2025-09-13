"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Database,
  Download,
  Search,
  Plus,
  Trash2,
  FileSpreadsheet,
  CheckCircle,
  AlertTriangle,
  ImageIcon,
} from "lucide-react"
import { DatasetUpload } from "./dataset-upload"
import { DatasetViewer } from "./dataset-viewer"
import { DatasetStats } from "./dataset-stats"
import { CSVProcessor, type ProcessedSpectralData } from "@/lib/csv-processor"
import { ImageProcessor, type ImageAnalysisResult } from "@/lib/image-processor"

interface MicroplasticSample {
  id: string
  type: string
  color: string
  polymer: string
  colorant: string
  peakWavelengths: number[]
  spectralData: number[]
  source: string
  dateAdded: string
  verified: boolean
  confidence: number
  dataSource: "csv" | "image" | "manual"
  rawData?: ProcessedSpectralData | ImageAnalysisResult
}

export function DatasetManager() {
  const [samples, setSamples] = useState<MicroplasticSample[]>([
    {
      id: "mp_001",
      type: "PET Bottle Fragment",
      color: "Clear Blue",
      polymer: "Polyethylene Terephthalate",
      colorant: "Cobalt Blue",
      peakWavelengths: [500, 740],
      spectralData: Array.from({ length: 200 }, (_, i) => Math.random()),
      source: "Laboratory Standard",
      dateAdded: "2024-01-15",
      verified: true,
      confidence: 0.95,
      dataSource: "manual",
    },
    {
      id: "mp_002",
      type: "PE Film Fragment",
      color: "Translucent White",
      polymer: "Polyethylene",
      colorant: "Titanium Dioxide",
      peakWavelengths: [460, 680],
      spectralData: Array.from({ length: 200 }, (_, i) => Math.random()),
      source: "Field Collection",
      dateAdded: "2024-01-14",
      verified: true,
      confidence: 0.88,
      dataSource: "manual",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterColor, setFilterColor] = useState("all")
  const [selectedSample, setSelectedSample] = useState<MicroplasticSample | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [processingStatus, setProcessingStatus] = useState<string>("")

  const handleFileUpload = async (file: File) => {
    setIsUploading(true)
    setUploadProgress(0)
    setProcessingStatus(`Processing ${file.name}...`)

    try {
      if (file.type === "text/csv" || file.name.endsWith(".csv")) {
        setProcessingStatus("Parsing CSV data...")
        setUploadProgress(25)

        const processedData = await CSVProcessor.processCSVFile(file)
        setUploadProgress(75)

        const newSample: MicroplasticSample = {
          id: `csv_${Date.now()}`,
          type: processedData.metadata.type || "Unknown Type",
          color: processedData.metadata.color || "Unknown Color",
          polymer: processedData.metadata.polymer || "Unknown Polymer",
          colorant: "Unknown",
          peakWavelengths: processedData.metadata.peakWavelengths,
          spectralData: processedData.data.map((d) => d.absorbance),
          source: `CSV Upload: ${file.name}`,
          dateAdded: new Date().toISOString().split("T")[0],
          verified: false,
          confidence: processedData.metadata.totalPoints > 50 ? 0.8 : 0.6,
          dataSource: "csv",
          rawData: processedData,
        }

        setSamples((prev) => [...prev, newSample])
        setProcessingStatus("CSV processed successfully!")
      } else if (file.type.startsWith("image/")) {
        setProcessingStatus("Analyzing spectrograph image...")
        setUploadProgress(25)

        const analysisResult = await ImageProcessor.processSpectrographImage(file)
        setUploadProgress(75)

        const newSample: MicroplasticSample = {
          id: `img_${Date.now()}`,
          type: "Image Analysis",
          color: "Unknown",
          polymer: "Unknown",
          colorant: "Unknown",
          peakWavelengths: analysisResult.detectedPeaks,
          spectralData: analysisResult.spectralData.map((d) => d.absorbance),
          source: `Image Analysis: ${file.name}`,
          dateAdded: new Date().toISOString().split("T")[0],
          verified: false,
          confidence: analysisResult.confidence,
          dataSource: "image",
          rawData: analysisResult,
        }

        setSamples((prev) => [...prev, newSample])
        setProcessingStatus("Image analysis completed!")
      } else {
        throw new Error("Unsupported file type")
      }

      setUploadProgress(100)
    } catch (error) {
      console.error("File processing error:", error)
      setProcessingStatus(`Error: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setTimeout(() => {
        setIsUploading(false)
        setUploadProgress(0)
        setProcessingStatus("")
      }, 2000)
    }
  }

  const exportDataset = () => {
    const csvContent = [
      "ID,Type,Color,Polymer,Colorant,Peak Wavelengths,Source,Date Added,Verified,Confidence,DataSource",
      ...samples.map((sample) =>
        [
          sample.id,
          sample.type,
          sample.color,
          sample.polymer,
          sample.colorant,
          sample.peakWavelengths.join(";"),
          sample.source,
          sample.dateAdded,
          sample.verified,
          sample.confidence.toFixed(3),
          sample.dataSource,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `microplastic_dataset_${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const deleteSample = (id: string) => {
    setSamples((prev) => prev.filter((sample) => sample.id !== id))
    if (selectedSample?.id === id) {
      setSelectedSample(null)
    }
  }

  const verifySample = (id: string) => {
    setSamples((prev) =>
      prev.map((sample) => (sample.id === id ? { ...sample, verified: true, confidence: 0.95 } : sample)),
    )
  }

  const getTypeOptions = () => {
    const types = Array.from(new Set(samples.map((s) => s.type)))
    return types.map((type) => ({ value: type, label: type }))
  }

  const getColorOptions = () => {
    const colors = Array.from(new Set(samples.map((s) => s.color)))
    return colors.map((color) => ({ value: color.toLowerCase(), label: color }))
  }

  const getDataSourceIcon = (sample: MicroplasticSample) => {
    switch (sample.dataSource) {
      case "csv":
        return <FileSpreadsheet className="h-4 w-4 text-green-600" />
      case "image":
        return <ImageIcon className="h-4 w-4 text-blue-600" />
      default:
        return <Database className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Database className="h-5 w-5 text-blue-600" />
            </div>
            Dataset Management
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage microplastic reference data and training samples
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <Button onClick={exportDataset} variant="outline" className="font-medium bg-transparent">
            <Download className="h-4 w-4 mr-2" />
            Export Dataset
          </Button>
          <Button className="font-medium">
            <Plus className="h-4 w-4 mr-2" />
            Add Sample
          </Button>
        </div>
      </div>

      <Tabs defaultValue="browse" className="w-full">
        <div className="overflow-x-auto scrollbar-hide">
          <TabsList className="grid w-full grid-cols-4 min-w-[400px] sm:min-w-0 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border shadow-lg">
            <TabsTrigger
              value="browse"
              className="font-medium data-[state=active]:bg-white data-[state=active]:shadow-md dark:data-[state=active]:bg-slate-700"
            >
              Browse Samples
            </TabsTrigger>
            <TabsTrigger
              value="upload"
              className="font-medium data-[state=active]:bg-white data-[state=active]:shadow-md dark:data-[state=active]:bg-slate-700"
            >
              Upload Data
            </TabsTrigger>
            <TabsTrigger
              value="statistics"
              className="font-medium data-[state=active]:bg-white data-[state=active]:shadow-md dark:data-[state=active]:bg-slate-700"
            >
              Statistics
            </TabsTrigger>
            <TabsTrigger
              value="viewer"
              className="font-medium data-[state=active]:bg-white data-[state=active]:shadow-md dark:data-[state=active]:bg-slate-700"
            >
              Data Viewer
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="browse" className="space-y-4 sm:space-y-6 mt-6">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm dark:bg-slate-900/80">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Search & Filter
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="search" className="font-medium">
                    Search
                  </Label>
                  <Input
                    id="search"
                    placeholder="Search samples..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-white/50 dark:bg-slate-800/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-medium">Filter by Type</Label>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="bg-white/50 dark:bg-slate-800/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {getTypeOptions().map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="font-medium">Filter by Color</Label>
                  <Select value={filterColor} onValueChange={setFilterColor}>
                    <SelectTrigger className="bg-white/50 dark:bg-slate-800/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Colors</SelectItem>
                      {getColorOptions().map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="font-medium">Results</Label>
                  <div className="text-2xl font-bold text-primary bg-primary/10 rounded-lg p-3 text-center">
                    {
                      samples.filter(
                        (s) =>
                          s.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.polymer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.color.toLowerCase().includes(searchTerm.toLowerCase()),
                      ).length
                    }
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm dark:bg-slate-900/80">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Sample Database
              </CardTitle>
              <CardDescription>
                {
                  samples.filter(
                    (s) =>
                      s.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      s.polymer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      s.color.toLowerCase().includes(searchTerm.toLowerCase()),
                  ).length
                }{" "}
                of {samples.length} samples shown
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {samples
                    .filter((sample) => {
                      const matchesSearch =
                        sample.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        sample.polymer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        sample.color.toLowerCase().includes(searchTerm.toLowerCase())
                      return matchesSearch
                    })
                    .map((sample) => (
                      <div
                        key={sample.id}
                        className={`p-4 border rounded-xl cursor-pointer transition-all hover:bg-muted/50 hover:shadow-md ${
                          selectedSample?.id === sample.id
                            ? "border-primary bg-primary/5 shadow-md"
                            : "bg-white/50 dark:bg-slate-800/50"
                        }`}
                        onClick={() => setSelectedSample(sample)}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div className="flex items-center gap-3">
                            {getDataSourceIcon(sample)}
                            <div className="text-center">
                              <div className="text-sm font-mono text-muted-foreground bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                                {sample.id}
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold flex items-center gap-2">
                                {sample.type}
                                {sample.verified ? (
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                ) : (
                                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {sample.color} • {sample.polymer} • {sample.source}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge
                              variant={sample.confidence > 0.8 ? "default" : "secondary"}
                              className={
                                sample.confidence > 0.8
                                  ? "bg-green-100 text-green-800 border-green-300"
                                  : sample.confidence > 0.6
                                    ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                                    : "bg-red-100 text-red-800 border-red-300"
                              }
                            >
                              {(sample.confidence * 100).toFixed(0)}%
                            </Badge>
                            <div className="flex items-center gap-1">
                              {!sample.verified && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 w-8 p-0 bg-transparent"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    verifySample(sample.id)
                                  }}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 w-8 p-0 hover:bg-red-50 hover:border-red-200 bg-transparent"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  deleteSample(sample.id)
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                          <div>
                            <div className="font-medium text-slate-700 dark:text-slate-300">Peak Wavelengths</div>
                            <div className="text-muted-foreground">
                              {sample.peakWavelengths.length > 0
                                ? sample.peakWavelengths.join(", ") + "nm"
                                : "No peaks detected"}
                            </div>
                          </div>
                          <div>
                            <div className="font-medium text-slate-700 dark:text-slate-300">Data Source</div>
                            <div className="text-muted-foreground capitalize">{sample.dataSource}</div>
                          </div>
                          <div>
                            <div className="font-medium text-slate-700 dark:text-slate-300">Date Added</div>
                            <div className="text-muted-foreground">{sample.dateAdded}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upload">
          <DatasetUpload onFileUpload={handleFileUpload} isUploading={isUploading} uploadProgress={uploadProgress} />
        </TabsContent>

        <TabsContent value="statistics">
          <DatasetStats samples={samples} />
        </TabsContent>

        <TabsContent value="viewer">
          <DatasetViewer selectedSample={selectedSample} />
        </TabsContent>
      </Tabs>

      {(isUploading || processingStatus) && (
        <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
          <FileSpreadsheet className="h-4 w-4 text-blue-600" />
          <AlertDescription>
            <div className="space-y-2">
              <div className="font-medium text-blue-800 dark:text-blue-200">
                {processingStatus || "Processing file..."}
              </div>
              {isUploading && <Progress value={uploadProgress} className="h-2" />}
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
