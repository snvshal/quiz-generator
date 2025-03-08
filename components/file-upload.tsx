"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { FileText, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { generateMCQsFromPDF } from "@/app/actions"

export function FileUpload() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null
    setError(null)

    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        setError("Please upload a valid PDF file.")
        setFile(null)
        return
      }

      if (selectedFile.size > 2 * 1024 * 1024) {
        // 5MB max limit
        setError("File size must be less than 2MB.")
        setFile(null)
        return
      }

      if (selectedFile.size < 2 * 1024) {
        // 2KB min limit
        setError("File size must be more than 2KB.")
        setFile(null)
        return
      }

      setFile(selectedFile)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      setError("Please select a PDF file.")
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Call action function directly with the selected file
      const response = await generateMCQsFromPDF(file)

      if (!response.success) {
        throw new Error(response.message || "Failed to generate MCQs.")
      }

      const data = response.questions

      if (!Array.isArray(data) || data.length === 0) {
        throw new Error("Invalid MCQ data received from the server.")
      }

      // Store the questions in localStorage for use on the quiz page
      localStorage.setItem("mcqQuestions", JSON.stringify(data))

      // Navigate to the quiz page
      router.push("/quiz")
    } catch (err) {
      console.error("Error:", err)
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="pdf-upload">Upload PDF</Label>
          <div className="flex items-center gap-2">
            <Input
              id="pdf-upload"
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="cursor-pointer"
            />
          </div>
          {file && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span>{file.name}</span>
            </div>
          )}
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
        <Button type="submit" className="w-full" disabled={!file || loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating MCQs...
            </>
          ) : (
            "Generate MCQs"
          )}
        </Button>
      </form>
    </Card>
  )
}
