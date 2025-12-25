import { GoogleGenAI } from '@google/genai'
import { env } from '~/config/environment'
import ApiError from '~/utils/ApiError'

const GEMINI_API_KEY = env.GEMINI_API_KEY
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY })

async function askQuestion(question) {
  // console.log('\n=== New Chat Question ===')
  // console.log('Question:', question)

  try {
    if (!GEMINI_API_KEY) {
      // console.error('ERROR: GEMINI_API_KEY is not configured')
      throw new ApiError(500, 'AI service is not configured properly.')
    }

    const prompt = `
      You are acting as a university professor with deep academic knowledge across multiple fields, like an encyclopedia.

      I will provide you with a JSON object representing a quiz question, including:
      - The question content
      - The answer options
      - The correct answer(s)
      - The answer(s) selected by the user

      Your task is to analyze the question and explain the answers in **Vietnamese**.

      Please follow these rules strictly:
      1. Clearly state which answer is correct.
      2. Explain **why the correct answer is correct**, based on technical definitions and concepts.
      3. Explain **why each incorrect option is wrong** or misleading.
      4. If the user selected a wrong answer, explain **why that choice is incorrect** and clarify the misunderstanding.
      5. Use clear, structured, and educational language suitable for university-level students.
      6. If helpful, include short examples or explanations of related concepts.
      7. Use simple formatting:
        - Use ONLY ONE line break (\\n) between paragraphs
        - Do NOT use bullet points with indentation or nested lists
        - Use **bold text** for important terms or correct answers
        - Use code blocks syntax of react-md-editor for code snippets or definitions
        - Keep formatting flat and simple without deep indentation

      8. Do NOT mention internal IDs or database fields in your explanation.
      9. Focus on teaching and conceptual understanding, not just stating the answer.
      10. Keep your explanation concise, ideally within max 60 words, and don't yapping.
      11. ALWAYS respond in Vietnamese.
      12. Format your response as a simple, flat text with single line breaks between sections.
      Here is the quiz question data in JSON format: ${JSON.stringify(question)}
    `

    // console.log('Sending request to Gemini AI...')
    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }]
        }
      ]
    })

    if (!result || !result.candidates || !result.candidates.length) {
      // console.error('ERROR: Invalid response from Gemini AI:', result)
      throw new ApiError(500, 'Invalid AI response')
    }

    // console.log('Got response from AI')
    const answer =
      result?.candidates?.[0]?.content?.parts?.[0]?.text ||
      'Không có phản hồi từ AI.'
    return answer
      .replace(/\r\n/g, '') // Chuẩn hóa line breaks
      .replace(/\r/g, '') // Xử lý carriage return
      .replace(/\n<br>\n/g, '\n') // Thay thế \n<br>\n thành \n
      .replace(/\n{3,}/g, '\n') // Giới hạn tối đa 2 xuống dòng liên tiếp
      .trim()
  } catch (error) {
    // console.error('\nERROR in askQuestion:', {
    //   name: error.name,
    //   message: error.message,
    //   stack: error.stack
    // })
    return '<p style="color: red;">Xin lỗi, hiện tại tôi không thể xử lý yêu cầu của bạn. Vui lòng thử lại sau!</p>'
  }
}

export const geminiProvider = {
  askQuestion
}