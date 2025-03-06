import { FileUpload } from "@/components/file-upload"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-lg font-semibold">Quiz Generator</h1>
        </div>
      </header>
      <main className="flex-1">
        <div className="flex flex-col items-center justify-center space-y-8 px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-1 text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              PDF to Quiz Generator
            </h2>
            <p className="text-muted-foreground">
              Upload a PDF book or chapter to generate multiple-choice
              questions.
            </p>
          </div>
          <FileUpload />
        </div>
      </main>
      <footer className="border-t py-4">
        <div className="flex flex-col items-center justify-center gap-2 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-muted-foreground">
            Powered by Vercel AI SDK and Google Gemini
          </p>
        </div>
      </footer>
    </div>
  )
}
