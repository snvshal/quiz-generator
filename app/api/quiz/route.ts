import { z } from "zod"
import { generateObject } from "ai"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { NextRequest, NextResponse } from "next/server"

// Initialize the Google Generative AI provider
const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
})

// Define the MCQ schema
const MCQSchema = z
  .array(
    z.object({
      id: z.string().describe("Unique identifier for the question"),
      question: z.string().describe("The question text"),
      options: z
        .array(
          z.object({
            id: z.string().describe("Unique identifier for the option"),
            text: z.string().describe("The option text"),
          })
        )
        .describe("List of answer options"),
      correctOptionId: z.string().describe("The ID of the correct option"),
    })
  )
  .min(1)
  .max(10)
  .describe("An array of multiple-choice questions")

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "100mb",
    },
  },
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const pdfFile = formData.get("pdf") as File

    if (!pdfFile) {
      return NextResponse.json(
        { error: "No PDF file provided" },
        { status: 400 }
      )
    }

    // Check file type
    if (!pdfFile.type.includes("pdf")) {
      return NextResponse.json({ error: "File must be a PDF" }, { status: 400 })
    }

    // Convert the file to a base64 string
    const fileBuffer = await pdfFile.arrayBuffer()
    const fileBase64 = Buffer.from(fileBuffer).toString("base64")

    if (!fileBase64.trim()) {
      return NextResponse.json(
        { error: "No text found in PDF" },
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      )
    }

    // Create a prompt based on the PDF content
    const prompt = `Generate min-5 and max-20 multiple-choice questions based on the following pdf file's content text, it could be a poem, a story, a science books chapter, a marksheet, a resume read the text of pdf properly and generate mcq question as you are a teacher and you have question about the content of pdf to students and don't use metadata of this pdf file to generate any mcq question.`

    // Generate structured MCQs using the Google model
    const { object } = await generateObject({
      model: google("gemini-1.5-flash"),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt,
            },
            {
              type: "file",
              data: fileBase64,
              mimeType: "application/pdf",
            },
          ],
        },
      ],
      schema: MCQSchema,
    })

    // Return the structured output as JSON
    return NextResponse.json(object, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Error generating MCQs from PDF:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    )
  }
}

export const dynamic = "force-dynamic" // Ensure dynamic rendering
