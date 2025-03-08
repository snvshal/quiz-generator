"use server"

import { z } from "zod"
import { generateObject } from "ai"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { Question } from "./quiz/page"

// Initialize the Google Generative AI provider
const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
})

// Define the MCQ schema
const MCQSchema = z
  .array(
    z.object({
      id: z.string(),
      question: z.string(),
      options: z.array(
        z.object({
          id: z.string(),
          text: z.string(),
        })
      ),
      correctOptionId: z.string(),
    })
  )
  .min(1)
  .max(20)

export const generateMCQsFromPDF = async (
  file: File
): Promise<{
  success: boolean
  questions?: Question[]
  message?: string
}> => {
  try {
    if (!file) {
      return { success: false, message: "No PDF file provided" }
    }

    if (!file.type.includes("pdf")) {
      return { success: false, message: "File must be a PDF" }
    }

    // Convert the file to a base64 string
    const fileBuffer = await file.arrayBuffer()
    const fileBase64 = Buffer.from(fileBuffer).toString("base64")

    if (!fileBase64.trim()) {
      return { success: false, message: "No text found in PDF" }
    }

    const prompt = `Generate min-5 and max-20 multiple-choice questions based on the following pdf file's content text, it could be a poem, a story, a science books chapter, a marksheet, a resume read the text of pdf properly and generate mcq question as you are a teacher and you have question about the content of pdf to students and don't use metadata of this pdf file to generate any mcq question.`

    // Generate structured MCQs using the Google model
    const { object } = await generateObject({
      model: google("gemini-1.5-flash"),
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "file", data: fileBase64, mimeType: "application/pdf" },
          ],
        },
      ],
      schema: MCQSchema,
    })

    return { success: true, questions: object }
  } catch (error) {
    console.error("Error generating MCQs from PDF:", error)
    return { success: false, message: "Internal Server Error" }
  }
}
