"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Settings, Palette, Grid, Eye, RotateCcw } from "lucide-react"

interface ViewSettings {
  wavelengthRange: [number, number]
  absorbanceRange: [number, number]
  showGrid: boolean
  showPeaks: boolean
  showBaseline: boolean
  colorScheme: string
}

interface SpectralControlsProps {
  viewSettings: ViewSettings
  onSettingsChange: (settings: ViewSettings) => void
}

export function SpectralControls({ viewSettings, onSettingsChange }: SpectralControlsProps) {
  const updateSetting = (key: keyof ViewSettings, value: any) => {
    onSettingsChange({
      ...viewSettings,
      [key]: value,
    })
  }

  const resetToDefaults = () => {
    onSettingsChange({
      wavelengthRange: [400, 800],
      absorbanceRange: [0, 1],
      showGrid: true,
      showPeaks: true,
      showBaseline: false,
      colorScheme: "default",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Visualization Settings</h3>
          <p className="text-sm text-muted-foreground">Customize the spectral chart appearance and behavior</p>
        </div>
        <Button onClick={resetToDefaults} variant="outline" size="sm">
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset Defaults
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Display Options */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Display Options
            </CardTitle>
            <CardDescription>Control what elements are visible on the chart</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="show-grid">Show Grid Lines</Label>
              <Switch
                id="show-grid"
                checked={viewSettings.showGrid}
                onCheckedChange={(checked) => updateSetting("showGrid", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="show-peaks">Show Peak Markers</Label>
              <Switch
                id="show-peaks"
                checked={viewSettings.showPeaks}
                onCheckedChange={(checked) => updateSetting("showPeaks", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="show-baseline">Show Baseline</Label>
              <Switch
                id="show-baseline"
                checked={viewSettings.showBaseline}
                onCheckedChange={(checked) => updateSetting("showBaseline", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Color Scheme */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Color Scheme
            </CardTitle>
            <CardDescription>Choose the visual style for the spectral data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Chart Color Scheme</Label>
              <Select value={viewSettings.colorScheme} onValueChange={(value) => updateSetting("colorScheme", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default Blue</SelectItem>
                  <SelectItem value="scientific">Scientific Green</SelectItem>
                  <SelectItem value="thermal">Thermal Red</SelectItem>
                  <SelectItem value="monochrome">Monochrome</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="h-8 bg-gradient-to-r from-blue-500 to-blue-200 rounded border-2 border-transparent hover:border-blue-500 cursor-pointer" />
              <div className="h-8 bg-gradient-to-r from-green-600 to-green-200 rounded border-2 border-transparent hover:border-green-600 cursor-pointer" />
              <div className="h-8 bg-gradient-to-r from-red-600 to-red-200 rounded border-2 border-transparent hover:border-red-600 cursor-pointer" />
              <div className="h-8 bg-gradient-to-r from-gray-600 to-gray-200 rounded border-2 border-transparent hover:border-gray-600 cursor-pointer" />
            </div>
          </CardContent>
        </Card>

        {/* Wavelength Range */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Wavelength Range
            </CardTitle>
            <CardDescription>Adjust the visible wavelength range (nm)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>
                Range: {viewSettings.wavelengthRange[0]}nm - {viewSettings.wavelengthRange[1]}nm
              </Label>
              <div className="px-2">
                <Slider
                  value={viewSettings.wavelengthRange}
                  onValueChange={(value) => updateSetting("wavelengthRange", value as [number, number])}
                  min={350}
                  max={850}
                  step={10}
                  className="w-full"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <Button variant="outline" size="sm" onClick={() => updateSetting("wavelengthRange", [400, 700])}>
                Visible Light
              </Button>
              <Button variant="outline" size="sm" onClick={() => updateSetting("wavelengthRange", [350, 850])}>
                Extended Range
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Absorbance Range */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Grid className="h-5 w-5" />
              Absorbance Range
            </CardTitle>
            <CardDescription>Adjust the visible absorbance range</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>
                Range: {viewSettings.absorbanceRange[0].toFixed(1)} - {viewSettings.absorbanceRange[1].toFixed(1)}
              </Label>
              <div className="px-2">
                <Slider
                  value={viewSettings.absorbanceRange}
                  onValueChange={(value) => updateSetting("absorbanceRange", value as [number, number])}
                  min={0}
                  max={2}
                  step={0.1}
                  className="w-full"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <Button variant="outline" size="sm" onClick={() => updateSetting("absorbanceRange", [0, 1])}>
                Standard (0-1)
              </Button>
              <Button variant="outline" size="sm" onClick={() => updateSetting("absorbanceRange", [0, 2])}>
                Extended (0-2)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
