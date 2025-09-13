"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Play, BarChart3, Database, Brain, Pause, Wifi, WifiOff } from "lucide-react"
import { SpectralChart } from "./spectral-chart"
import { DatasetManager } from "./dataset-manager"
import { ModelTraining } from "./model-training"
import { RealTimePrediction } from "./real-time-prediction"

export function SpectralAnalysisDashboard() {
  const [activeTab, setActiveTab] = useState("data-processing")
  const [isProcessing, setIsProcessing] = useState(false)
  const [systemStatus, setSystemStatus] = useState<"online" | "offline" | "processing">("online")
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [realTimeMetrics, setRealTimeMetrics] = useState({
    samplesProcessed: 0,
    avgProcessingTime: 0,
    detectionAccuracy: 0,
    activeModels: 0,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date())
      // Simulate system health check and metrics updates
      setSystemStatus(Math.random() > 0.1 ? "online" : "offline")
      setRealTimeMetrics((prev) => ({
        samplesProcessed: prev.samplesProcessed + Math.floor(Math.random() * 3),
        avgProcessingTime: Math.floor(Math.random() * 50) + 20,
        detectionAccuracy: Math.floor(Math.random() * 20) + 80,
        activeModels: Math.floor(Math.random() * 10) + 5,
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const getStatusBadge = () => {
    switch (systemStatus) {
      case "online":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Wifi className="h-3 w-3 mr-1" />
            System Online
          </Badge>
        )
      case "offline":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <WifiOff className="h-3 w-3 mr-1" />
            System Offline
          </Badge>
        )
      case "processing":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <div className="animate-spin h-3 w-3 mr-1 border border-blue-600 border-t-transparent rounded-full" />
            Processing
          </Badge>
        )
    }
  }

  return (
    <div className="container mx-auto p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 max-w-7xl">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-teal-600/10 rounded-2xl blur-3xl" />
        <Card className="relative border-0 shadow-xl bg-white/80 backdrop-blur-sm dark:bg-slate-900/80">
          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                    Microplastic Detection System
                  </h1>
                </div>
                <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl">
                  Advanced AI-powered spectral analysis for real-time microplastic identification and classification
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  {getStatusBadge()}
                  <Badge variant="outline" className="text-xs bg-slate-50 dark:bg-slate-800">
                    Last Update: {lastUpdate.toLocaleTimeString()}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                  <div className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-lg font-bold text-blue-600">{realTimeMetrics.samplesProcessed}</div>
                    <div className="text-xs text-muted-foreground">Samples</div>
                  </div>
                  <div className="px-3 py-1 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-lg font-bold text-green-600">{realTimeMetrics.avgProcessingTime}ms</div>
                    <div className="text-xs text-muted-foreground">Avg Time</div>
                  </div>
                  <div className="px-3 py-1 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="text-lg font-bold text-purple-600">{realTimeMetrics.detectionAccuracy}%</div>
                    <div className="text-xs text-muted-foreground">Accuracy</div>
                  </div>
                  <div className="px-3 py-1 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <div className="text-lg font-bold text-orange-600">{realTimeMetrics.activeModels}</div>
                    <div className="text-xs text-muted-foreground">Models</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="relative">
          <div className="overflow-x-auto scrollbar-hide">
            <TabsList className="grid w-full grid-cols-4 min-w-[500px] sm:min-w-0 h-12 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border shadow-lg">
              <TabsTrigger
                value="data-processing"
                className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-md dark:data-[state=active]:bg-slate-700"
              >
                <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Data Processing</span>
                <span className="sm:hidden">Process</span>
              </TabsTrigger>
              <TabsTrigger
                value="dataset"
                className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-md dark:data-[state=active]:bg-slate-700"
              >
                <Database className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Dataset</span>
                <span className="sm:hidden">Data</span>
              </TabsTrigger>
              <TabsTrigger
                value="training"
                className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-md dark:data-[state=active]:bg-slate-700"
              >
                <Brain className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">ML Training</span>
                <span className="sm:hidden">Train</span>
              </TabsTrigger>
              <TabsTrigger
                value="prediction"
                className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-md dark:data-[state=active]:bg-slate-700"
              >
                <Play className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Real-Time</span>
                <span className="sm:hidden">Live</span>
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent value="data-processing" className="space-y-4 sm:space-y-6 mt-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm dark:bg-slate-900/80">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                  <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <BarChart3 className="h-4 w-4 text-blue-600" />
                  </div>
                  Spectral Data Input
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Upload or stream real-time spectral absorption data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SpectralChart />
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm dark:bg-slate-900/80">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                  <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <Brain className="h-4 w-4 text-green-600" />
                  </div>
                  Processing Pipeline
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Data preprocessing and feature extraction status
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                      <span className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        Noise Filtering
                      </span>
                      <span className="text-green-600 font-semibold">Complete</span>
                    </div>
                    <Progress value={100} className="h-2 bg-green-100" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                      <span className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                        Peak Detection
                      </span>
                      <span className="text-blue-600 font-semibold">Processing...</span>
                    </div>
                    <Progress value={Math.random() * 100} className="h-2 bg-blue-100" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                      <span className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full" />
                        Feature Extraction
                      </span>
                      <span className="text-orange-600 font-semibold">Queued</span>
                    </div>
                    <Progress value={Math.random() * 60} className="h-2 bg-orange-100" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                      <span className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full" />
                        ML Classification
                      </span>
                      <span className="text-gray-600 font-semibold">Waiting</span>
                    </div>
                    <Progress value={0} className="h-2 bg-gray-100" />
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    size="sm"
                    variant={isProcessing ? "destructive" : "default"}
                    onClick={() => setIsProcessing(!isProcessing)}
                    className="flex-1 font-medium"
                  >
                    {isProcessing ? (
                      <>
                        <Pause className="h-3 w-3 mr-1" />
                        Stop Processing
                      </>
                    ) : (
                      <>
                        <Play className="h-3 w-3 mr-1" />
                        Start Processing
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="dataset">
          <DatasetManager />
        </TabsContent>

        <TabsContent value="training">
          <ModelTraining />
        </TabsContent>

        <TabsContent value="prediction">
          <RealTimePrediction />
        </TabsContent>
      </Tabs>
    </div>
  )
}
