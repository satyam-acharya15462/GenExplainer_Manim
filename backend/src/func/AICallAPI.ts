import "dotenv/config" 
import { StructuredOutputParser } from "@langchain/core/output_parsers"
import { ChatPromptTemplate } from "@langchain/core/prompts"
import { RunnableLambda } from "@langchain/core/runnables";   
import { ChatModelProvider } from "langchain/chat_models/universal"
import {ChatGoogleGenerativeAI } from "@langchain/google-genai"
import * as z from "zod"

const AI_Test_API_Call = async(prompt : String) =>{
    const model = new ChatGoogleGenerativeAI({
         model: "gemini-2.5-flash",
         temperature: 0,
         maxOutputTokens: 5024,
         apiKey: process.env.GOOGLE_API_KEY,
     })

    const outputSchema = z.object({
        narration: z
        .string()
        .describe(`1-4 spoken sentences in the targated language . pure speech : no Latex , no symbols like √ or ² : write formulas as spoke words`),
        pauseAfterMs : z
        .number()
        .describe(`silenc after this beat in milliseconds , 300-1500.`),
        code :z
        .string()
        .describe(`body of an async js function with params (scene , d , M). no imports  , no function wrapper ,  no markdown fences , no export , no comments , no extra spaces`)
    })
  const lessonSchema = z.object({
    title : z.string().describe(`title of the lesson in the target language`),
    beats  : z.array(outputSchema).describe(`4 to 8 beats , in teaching order`)
  })
  type lesson  = z.infer<typeof lessonSchema>

  
  const structured = model.withStructuredOutput(lessonSchema, {
    method: "jsonMode"
  })

   const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor
   const FORBIDEN = /\b(import|export|require|module|process|global|window|document)\b/;
   function validateLesson(lesson: lesson): lesson {
     lesson.beats.forEach((b , i )=>{
        b.code = b.code.replace(/^```(?:js|javascript|ts)?\n?|```$/g, "").trim()
        if(FORBIDEN.test(b.code)){
            try{
                new AsyncFunction( "scene" , "d" , "M", b.code)
            } catch (e) {
                throw new Error(`beat ${i}: syntax error : ${(e as Error).message}`)
            }
        }
     })
     return lesson
   }

//    const lessonchain  = prompt.pipe(strutured).pipe(new RunnableLambda({func : validateLesson})).withRetry({stopAfterAttempts: 4})

 
}

