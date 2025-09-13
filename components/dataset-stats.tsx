"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, PieChart, TrendingUp, Database } from "lucide-react"

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
}

interface DatasetStatsProps {
  samples: MicroplasticSample[]
}

export function DatasetStats({ samples }: DatasetStatsProps) {
  const getTypeDistribution = () => {
    const distribution: Record<string, number> = {}
    samples.forEach((sample) => {
      distribution[sample.type] = (distribution[sample.type] || 0) + 1
    })
    return Object.entries(distribution).sort(([, a], [, b]) => b - a)
  }

  const getColorDistribution = () => {
    const distribution: Record<string, number> = {}
    samples.forEach((sample) => {
      distribution[sample.color] = (distribution[sample.color] || 0) + 1
    })
    return Object.entries(distribution).sort(([, a], [, b]) => b - a)
  }

  const getPolymerDistribution = () => {
    const distribution: Record<string, number> = {}
    samples.forEach((sample) => {
      distribution[sample.polymer] = (distribution[sample.polymer] || 0) + 1
    })
    return Object.entries(distribution).sort(([, a], [, b]) => b - a)
  }

  const getSourceDistribution = () => {
    const distribution: Record<string, number> = {}
    samples.forEach((sample) => {
      distribution[sample.source] = (distribution[sample.source] || 0) + 1
    })
    return Object.entries(distribution).sort(([, a], [, b]) => b - a)
  }

  const getQualityStats = () => {
    const verified = samples.filter((s) => s.verified).length
    const highConfidence = samples.filter((s) => s.confidence > 0.8).length
    const mediumConfidence = samples.filter((s) => s.confidence > 0.6 && s.confidence <= 0.8).length
    const lowConfidence = samples.filter((s) => s.confidence <= 0.6).length

    return { verified, highConfidence, mediumConfidence, lowConfidence }
  }

  const typeDistribution = getTypeDistribution()
  const colorDistribution = getColorDistribution()
  const polymerDistribution = getPolymerDistribution()
  const sourceDistribution = getSourceDistribution()
  const qualityStats = getQualityStats()

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-primary">{samples.length}</div>
            <div className="text-sm text-muted-foreground">Total Samples</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-green-600">{qualityStats.verified}</div>
            <div className="text-sm text-muted-foreground">Verified Samples</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-blue-600">{typeDistribution.length}</div>
            <div className="text-sm text-muted-foreground">Unique Types</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-purple-600">{polymerDistribution.length}</div>
            <div className="text-sm text-muted-foreground">Polymer Classes</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Type Distribution
            </CardTitle>
            <CardDescription>Distribution of microplastic types in the dataset</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {typeDistribution.map(([type, count], index) => (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full bg-chart-${(index % 5) + 1}`} />
                    <span className="text-sm font-medium">{type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{count} samples</span>
                    <Badge variant="secondary">{((count / samples.length) * 100).toFixed(1)}%</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Color Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Color Distribution
            </CardTitle>
            <CardDescription>Distribution of colors in the dataset</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {colorDistribution.map(([color, count], index) => (
                <div key={color} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full bg-chart-${(index % 5) + 1}`} />
                    <span className="text-sm font-medium">{color}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{count} samples</span>
                    <Badge variant="secondary">{((count / samples.length) * 100).toFixed(1)}%</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Polymer Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Polymer Distribution
            </CardTitle>
            <CardDescription>Distribution of polymer types</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {polymerDistribution.map(([polymer, count], index) => (
                <div key={polymer} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full bg-chart-${(index % 5) + 1}`} />
                    <span className="text-sm font-medium">{polymer}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{count} samples</span>
                    <Badge variant="secondary">{((count / samples.length) * 100).toFixed(1)}%</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quality Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Data Quality
            </CardTitle>
            <CardDescription>Quality and confidence distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Verified Samples</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{qualityStats.verified}</span>
                  <Badge className="bg-green-100 text-green-800 border-green-300">
                    {((qualityStats.verified / samples.length) * 100).toFixed(1)}%
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">High Confidence &gt;80%</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{qualityStats.highConfidence}</span>
                  <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                    {((qualityStats.highConfidence / samples.length) * 100).toFixed(1)}%
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Medium Confidence 60-80%</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{qualityStats.mediumConfidence}</span>
                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                    {((qualityStats.mediumConfidence / samples.length) * 100).toFixed(1)}%
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Low Confidence &lt;60%</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{qualityStats.lowConfidence}</span>
                  <Badge className="bg-red-100 text-red-800 border-red-300">
                    {((qualityStats.lowConfidence / samples.length) * 100).toFixed(1)}%
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Source Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Data Sources</CardTitle>
          <CardDescription>Distribution of samples by data source</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sourceDistribution.map(([source, count], index) => (
              <div key={source} className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-3 h-3 rounded-full bg-chart-${(index % 5) + 1}`} />
                  <span className="font-medium">{source}</span>
                </div>
                <div className="text-2xl font-bold text-primary">{count}</div>
                <div className="text-sm text-muted-foreground">
                  {((count / samples.length) * 100).toFixed(1)}% of dataset
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
