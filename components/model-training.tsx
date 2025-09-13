"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Brain, Play, Pause, BarChart3, Target, TrendingUp } from "lucide-react"
import { TrainingMetrics } from "./training-metrics"
import { ModelComparison } from "./model-comparison"

interface TrainingProgress {
  epoch: number
  totalEpochs: number
  accuracy: number
  loss: number
  valAccuracy: number
  valLoss: number
  isTraining: boolean
}

interface ModelConfig {
  algorithm: string
  hyperparameters: Record<string, any>
  features: string[]
}

export function ModelTraining() {
  const [trainingProgress, setTrainingProgress] = useState<TrainingProgress>({
    epoch: 0,
    totalEpochs: 100,
    accuracy: 0,
    loss: 0,
    valAccuracy: 0,
    valLoss: 0,
    isTraining: false,
  })

  const [selectedModel, setSelectedModel] = useState("random-forest")
  const [modelConfig, setModelConfig] = useState<ModelConfig>({
    algorithm: "Random Forest",
    hyperparameters: {
      n_estimators: 100,
      max_depth: 10,
      min_samples_split: 2,
    },
    features: ["peak_wavelengths", "peak_intensities", "mean_absorbance", "variance"],
  })

  const [trainedModels, setTrainedModels] = useState([
    {
      id: "rf_v1",
      name: "Random Forest v1",
      accuracy: 0.94,
      precision: 0.92,
      recall: 0.91,
      f1Score: 0.915,
      status: "completed",
      trainedAt: "2024-01-15T10:30:00Z",
    },
    {
      id: "xgb_v1",
      name: "XGBoost v1",
      accuracy: 0.96,
      precision: 0.95,
      recall: 0.94,
      f1Score: 0.945,
      status: "completed",
      trainedAt: "2024-01-15T14:20:00Z",
    },
  ])

  // Simulate training progress
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (trainingProgress.isTraining) {
      interval = setInterval(() => {
        setTrainingProgress((prev) => {
          if (prev.epoch >= prev.totalEpochs) {
            return { ...prev, isTraining: false }
          }

          const progress = (prev.epoch + 1) / prev.totalEpochs
          return {
            ...prev,
            epoch: prev.epoch + 1,
            accuracy: Math.min(0.98, 0.6 + progress * 0.35 + Math.random() * 0.05),
            loss: Math.max(0.02, 0.8 - progress * 0.75 + Math.random() * 0.1),
            valAccuracy: Math.min(0.96, 0.55 + progress * 0.38 + Math.random() * 0.05),
            valLoss: Math.max(0.03, 0.85 - progress * 0.78 + Math.random() * 0.1),
          }
        })
      }, 200)
    }
    return () => clearInterval(interval)
  }, [trainingProgress.isTraining])

  const startTraining = () => {
    setTrainingProgress((prev) => ({
      ...prev,
      epoch: 0,
      isTraining: true,
    }))
  }

  const stopTraining = () => {
    setTrainingProgress((prev) => ({
      ...prev,
      isTraining: false,
    }))
  }

  const modelOptions = [
    { value: "random-forest", label: "Random Forest", icon: "🌳" },
    { value: "xgboost", label: "XGBoost", icon: "🚀" },
    { value: "svm", label: "Support Vector Machine", icon: "📊" },
    { value: "neural-network", label: "Neural Network", icon: "🧠" },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Training Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Model Configuration
            </CardTitle>
            <CardDescription>Configure training parameters and model selection</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Algorithm</label>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {modelOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <span className="flex items-center gap-2">
                        <span>{option.icon}</span>
                        {option.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Training Data</label>
              <div className="text-sm text-muted-foreground">
                <div>• 2,847 labeled samples</div>
                <div>• 15 microplastic types</div>
                <div>• 8 color categories</div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Features</label>
              <div className="flex flex-wrap gap-1">
                {modelConfig.features.map((feature) => (
                  <Badge key={feature} variant="secondary" className="text-xs">
                    {feature.replace("_", " ")}
                  </Badge>
                ))}
              </div>
            </div>

            <Button
              onClick={trainingProgress.isTraining ? stopTraining : startTraining}
              className="w-full"
              variant={trainingProgress.isTraining ? "destructive" : "default"}
            >
              {trainingProgress.isTraining ? (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Stop Training
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Start Training
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Training Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Training Progress
            </CardTitle>
            <CardDescription>Real-time training metrics and progress</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Epoch Progress</span>
                <span>
                  {trainingProgress.epoch}/{trainingProgress.totalEpochs}
                </span>
              </div>
              <Progress value={(trainingProgress.epoch / trainingProgress.totalEpochs) * 100} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-sm font-medium">Training Accuracy</div>
                <div className="text-2xl font-bold text-green-600">{(trainingProgress.accuracy * 100).toFixed(1)}%</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium">Validation Accuracy</div>
                <div className="text-2xl font-bold text-blue-600">
                  {(trainingProgress.valAccuracy * 100).toFixed(1)}%
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium">Training Loss</div>
                <div className="text-2xl font-bold text-red-600">{trainingProgress.loss.toFixed(3)}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium">Validation Loss</div>
                <div className="text-2xl font-bold text-orange-600">{trainingProgress.valLoss.toFixed(3)}</div>
              </div>
            </div>

            {trainingProgress.isTraining && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                Training in progress...
              </div>
            )}
          </CardContent>
        </Card>

        {/* Model Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Best Model
            </CardTitle>
            <CardDescription>Current best performing model metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <Badge variant="default" className="mb-2">
                XGBoost v1
              </Badge>
              <div className="text-3xl font-bold text-primary">96.0%</div>
              <div className="text-sm text-muted-foreground">Overall Accuracy</div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Precision</span>
                <span className="text-sm font-medium">95.0%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Recall</span>
                <span className="text-sm font-medium">94.0%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">F1-Score</span>
                <span className="text-sm font-medium">94.5%</span>
              </div>
            </div>

            <div className="pt-2 border-t">
              <div className="text-xs text-muted-foreground">Trained on 2,278 samples • Validated on 569 samples</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Training Analytics */}
      <Tabs defaultValue="metrics" className="w-full">
        <TabsList>
          <TabsTrigger value="metrics">Training Metrics</TabsTrigger>
          <TabsTrigger value="comparison">Model Comparison</TabsTrigger>
          <TabsTrigger value="confusion">Confusion Matrix</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics">
          <TrainingMetrics trainingProgress={trainingProgress} />
        </TabsContent>

        <TabsContent value="comparison">
          <ModelComparison models={trainedModels} />
        </TabsContent>

        <TabsContent value="confusion">
          <Card>
            <CardHeader>
              <CardTitle>Confusion Matrix</CardTitle>
              <CardDescription>Model performance across different microplastic types</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Confusion matrix visualization</p>
                  <p className="text-sm">Will be generated after training completion</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
