import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth } from "@/lib/auth";
import { currentUser } from "@clerk/nextjs/server";

const genAI = new GoogleGenerativeAI(
  process.env.GOOGLE_GENERATIVE_AI_API_KEY || ""
);

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const user = await currentUser();
    
    if (!session?.userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { message, chatHistory } = await req.json();

    if (!message || message.trim() === "") {
      return NextResponse.json(
        { error: "Message cannot be empty" },
        { status: 400 }
      );
    }

    // Check if API key is configured
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      console.error("Gemini API key not configured");
      return NextResponse.json(
        { error: "AI service not configured. Please add GOOGLE_GENERATIVE_AI_API_KEY to your environment variables." },
        { status: 500 }
      );
    }

    // Use the same model as other working AI features
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    // System context about the platform
    const systemContext = `You are a helpful AI assistant for OpenPulse, an all-in-one API development platform. 

Platform Features:
1. REST API Testing - Send HTTP requests, test APIs, and debug endpoints with powerful request/response tools
2. Realtime Communication - Test WebSocket connections, Socket.io, and other realtime protocols with live monitoring
3. API Design Studio - Design and visualize API architecture with AI-powered design assistant and templates
4. Code Editor - Write, edit, and test code snippets with syntax highlighting and multi-language support
5. Code Review - Collaborate on code reviews, provide feedback, and maintain code quality standards

Current User Information:
- User ID: ${session.userId}
- User Email: ${user?.emailAddresses?.[0]?.emailAddress || "N/A"}
- User Name: ${user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.username || "N/A"}

You should help users with:
- Understanding how to use the platform features
- API testing best practices
- WebSocket and realtime communication guidance
- API design patterns and architecture
- Code review tips and standards
- General programming questions
- Troubleshooting platform issues
- Feature explanations

Be friendly, concise, and helpful. If asked about specific user data, provide relevant information based on the user context above.`;

    // Build conversation prompt with history
    let conversationPrompt = systemContext + "\n\n";
    
    if (chatHistory && chatHistory.length > 0) {
      conversationPrompt += "Conversation History:\n";
      chatHistory.forEach((msg: any) => {
        conversationPrompt += `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}\n`;
      });
      conversationPrompt += "\n";
    }
    
    conversationPrompt += `User: ${message}\n\nAssistant:`;

    console.log("Sending message to Gemini (length):", conversationPrompt.length);
    
    // Generate response directly without chat history
    const result = await model.generateContent(conversationPrompt);
    
    const response = await result.response;
    const text = response.text();

    console.log("Received response from Gemini:", text.substring(0, 50) + "...");

    return NextResponse.json({
      success: true,
      message: text,
    });
  } catch (error: any) {
    console.error("Chatbot error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    
    // Provide more specific error messages
    let errorMessage = "Failed to process message";
    
    if (error.message?.includes("API key")) {
      errorMessage = "Invalid API key. Please check your Gemini API configuration.";
    } else if (error.message?.includes("quota")) {
      errorMessage = "API quota exceeded. Please try again later.";
    } else if (error.message?.includes("model")) {
      errorMessage = "AI model unavailable. Please contact support.";
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: error.message 
      },
      { status: 500 }
    );
  }
}
