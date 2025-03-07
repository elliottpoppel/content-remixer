A webpage content remixing tool using React.

## Initial scope / Features

1. Paste in text we want to remix
2. Click a button to apply the remixing
3. Remix by transforming content into a tweet, written in the same voice and tone as the original content but shortened to standard tweet length (280 char or less)
3. Send the request to an AI API endpoint
4. See the remix in an output box
5. Add other styling and features that we want as we go

## Styling
Simple UI that looks similar to Claude, but with the simplest fonts / buttons / etc possible. Do not waste time on style.

## Tech Stack

1. React
2. TailwindCSS
3. Vercel
4. Claude API

## Potential future scope (DO NOT START)

1. Add in another AI API
2. Add a way to upload audio files to have them transcribed
3. Click to post to LinkedIn or schedule a LinkedIn post from the output
4. Add a way to save the remixed output to a database 

## Project Structure

```
remix-tool/
├── app/
│   ├── page.tsx           # Main page
│   ├── layout.tsx         # Root layout
│   ├── components/        # React components
│   │   ├── TextInput.tsx  # Text input component
│   │   ├── RemixButton.tsx# Action button
│   │   └── Output.tsx     # Output display
│   └── api/              # API routes
│       └── remix/route.ts # API endpoint for Claude
``` 