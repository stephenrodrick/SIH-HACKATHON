"use client"

import { MicroplasticAnalyzer } from "@/components/microplastic-analyzer"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useState } from "react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />

      {/* Header */}
      <header className="relative border-b border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm bg-white/95 dark:bg-slate-900/95 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg drop-shadow-sm">MP</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">MicroPlastic Detector</h1>
                <p className="text-xs text-slate-600 dark:text-slate-400">AI-Powered Spectral Analysis</p>
              </div>
            </Link>

            <nav className="hidden md:flex items-center space-x-1">
              <Link href="/">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                >
                  Analyzer
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                >
                  About
                </Button>
              </Link>
              <Link href="/docs">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                >
                  Documentation
                </Button>
              </Link>
              <Link href="/results">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                >
                  Results
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                >
                  Contact
                </Button>
              </Link>
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <MobileMenu />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative">
        <MicroplasticAnalyzer />
      </main>

      <footer className="relative border-t border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm bg-white/80 dark:bg-slate-900/80 mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">MP</span>
                </div>
                <span className="text-lg font-bold text-slate-900 dark:text-white">MicroPlastic Detector</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md">
                Advanced spectral analysis system for accurate microplastic identification using AI-powered image
                processing and database matching.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Navigation</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/"
                    className="text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                  >
                    Analyzer
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/docs"
                    className="text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                  >
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link
                    href="/results"
                    className="text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                  >
                    Results
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Support</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/contact"
                    className="text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/docs"
                    className="text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                  >
                    User Guide
                  </Link>
                </li>
                <li>
                  <a
                    href="mailto:support@microplastic-detector.com"
                    className="text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                  >
                    Email Support
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-200/50 dark:border-slate-700/50 mt-8 pt-8 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              © 2024 MicroPlastic Detector. Advanced spectral analysis for environmental research.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)} className="md:hidden">
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-200/50 dark:border-slate-700/50 md:hidden">
          <nav className="container mx-auto px-4 py-4 space-y-2">
            <Link href="/" onClick={() => setIsOpen(false)}>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
              >
                Analyzer
              </Button>
            </Link>
            <Link href="/about" onClick={() => setIsOpen(false)}>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
              >
                About
              </Button>
            </Link>
            <Link href="/docs" onClick={() => setIsOpen(false)}>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
              >
                Documentation
              </Button>
            </Link>
            <Link href="/results" onClick={() => setIsOpen(false)}>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
              >
                Results
              </Button>
            </Link>
            <Link href="/contact" onClick={() => setIsOpen(false)}>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
              >
                Contact
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </>
  )
}
