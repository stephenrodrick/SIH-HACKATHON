"use client"

import { ArrowLeft, Calendar, Download, Eye, Trash2, Search, BarChart3 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useState } from "react"

// Mock data for demonstration
const mockResults = [
  {
    id: "1",
    date: "2024-01-15T10:30:00Z",
    sampleName: "Ocean Sample #1",
    identifiedMaterial: "Polyethylene",
    confidence: 94.5,
    spectralSimilarity: 0.89,
    peaksMatched: 12,
    totalPeaks: 15,
    status: "completed",
  },
  {
    id: "2",
    date: "2024-01-14T15:45:00Z",
    sampleName: "Beach Sediment A",
    identifiedMaterial: "Polystyrene",
    confidence: 87.2,
    spectralSimilarity: 0.82,
    peaksMatched: 9,
    totalPeaks: 11,
    status: "completed",
  },
  {
    id: "3",
    date: "2024-01-14T09:15:00Z",
    sampleName: "River Water Sample",
    identifiedMaterial: "PVC",
    confidence: 76.8,
    spectralSimilarity: 0.74,
    peaksMatched: 8,
    totalPeaks: 12,
    status: "completed",
  },
  {
    id: "4",
    date: "2024-01-13T14:20:00Z",
    sampleName: "Microfiber Analysis",
    identifiedMaterial: "Polyester",
    confidence: 91.3,
    spectralSimilarity: 0.86,
    peaksMatched: 14,
    totalPeaks: 16,
    status: "completed",
  },
  {
    id: "5",
    date: "2024-01-12T11:00:00Z",
    sampleName: "Unknown Particle",
    identifiedMaterial: "No Match Found",
    confidence: 23.1,
    spectralSimilarity: 0.31,
    peaksMatched: 3,
    totalPeaks: 10,
    status: "low_confidence",
  },
]

export default function ResultsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")

  const filteredResults = mockResults.filter((result) => {
    const matchesSearch =
      result.sampleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.identifiedMaterial.toLowerCase().includes(searchTerm.toLowerCase())

    if (selectedFilter === "all") return matchesSearch
    if (selectedFilter === "high") return matchesSearch && result.confidence >= 80
    if (selectedFilter === "medium") return matchesSearch && result.confidence >= 50 && result.confidence < 80
    if (selectedFilter === "low") return matchesSearch && result.confidence < 50

    return matchesSearch
  })

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 80) return <Badge className="bg-green-100 text-green-800">High Confidence</Badge>
    if (confidence >= 50) return <Badge className="bg-yellow-100 text-yellow-800">Medium Confidence</Badge>
    return <Badge className="bg-red-100 text-red-800">Low Confidence</Badge>
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-slate-200/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">MP</span>
              </div>
              <span className="text-xl font-bold text-slate-800">MicroPlastic Detector</span>
            </Link>
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Analyzer
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-800 mb-6">Analysis Results</h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            View and manage your microplastic analysis history with detailed results and confidence scores.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total Analyses</p>
                  <p className="text-2xl font-bold text-slate-800">{mockResults.length}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">High Confidence</p>
                  <p className="text-2xl font-bold text-green-600">
                    {mockResults.filter((r) => r.confidence >= 80).length}
                  </p>
                </div>
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-green-600 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Average Confidence</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {Math.round(mockResults.reduce((acc, r) => acc + r.confidence, 0) / mockResults.length)}%
                  </p>
                </div>
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Materials Found</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {
                      new Set(
                        mockResults
                          .filter((r) => r.identifiedMaterial !== "No Match Found")
                          .map((r) => r.identifiedMaterial),
                      ).size
                    }
                  </p>
                </div>
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-purple-600 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50 mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Search by sample name or material..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={selectedFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter("all")}
                >
                  All Results
                </Button>
                <Button
                  variant={selectedFilter === "high" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter("high")}
                >
                  High Confidence
                </Button>
                <Button
                  variant={selectedFilter === "medium" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter("medium")}
                >
                  Medium
                </Button>
                <Button
                  variant={selectedFilter === "low" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter("low")}
                >
                  Low
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results List */}
        <div className="space-y-4">
          {filteredResults.map((result) => (
            <Card
              key={result.id}
              className="bg-white/80 backdrop-blur-sm border-slate-200/50 hover:shadow-lg transition-all duration-300"
            >
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-slate-800">{result.sampleName}</h3>
                      {getConfidenceBadge(result.confidence)}
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-slate-600">Identified Material</p>
                        <p className="font-medium text-slate-800">{result.identifiedMaterial}</p>
                      </div>
                      <div>
                        <p className="text-slate-600">Confidence Score</p>
                        <p className="font-medium text-slate-800">{result.confidence.toFixed(1)}%</p>
                      </div>
                      <div>
                        <p className="text-slate-600">Spectral Similarity</p>
                        <p className="font-medium text-slate-800">{result.spectralSimilarity.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-slate-600">Peaks Matched</p>
                        <p className="font-medium text-slate-800">
                          {result.peaksMatched}/{result.totalPeaks}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-3 text-sm text-slate-600">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(result.date)}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredResults.length === 0 && (
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50">
            <CardContent className="p-12 text-center">
              <Search className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-800 mb-2">No Results Found</h3>
              <p className="text-slate-600">Try adjusting your search terms or filters.</p>
            </CardContent>
          </Card>
        )}

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-12 text-white mt-12">
          <h2 className="text-3xl font-bold mb-4">Analyze More Samples</h2>
          <p className="text-xl mb-8 text-blue-100">Continue building your microplastic analysis database.</p>
          <Link href="/">
            <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
              New Analysis
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
