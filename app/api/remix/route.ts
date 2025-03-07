import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export async function POST(request: Request) {
  try {
    const { content, prompt } = await request.json();

    const anthropic = new Anthropic({
      apiKey: process.env.CLAUDE_API_KEY!
    });

    const message = await anthropic.messages.create({
      model: 'claude-3-7-sonnet-latest',
      max_tokens: 300,
      messages: [{
        role: 'user',
        content: `${prompt} "${content}"`
      }]
    });

    return NextResponse.json({ 
      message: message.content[0].text 
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
} 