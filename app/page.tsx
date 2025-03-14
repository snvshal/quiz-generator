import { FileUpload } from "@/components/file-upload"
import { ThemeSwitch } from "@/components/theme-provider"

export default function Home() {
  return (
    <div className="flex flex-col min-h-dvh">
      <header className="border-b">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <h1 className="text-lg font-semibold">Quiz Generator</h1>
          <ThemeSwitch />
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center box-border space-y-8 px-4 py-8 sm:px-6 lg:px-8">
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
