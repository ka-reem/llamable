import "jsr:@supabase/functions-js/edge-runtime.d.ts"

console.log("Generate code function started!")

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' } })
  }

  try {
    const { prompt } = await req.json()
    
    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { headers: { "Content-Type": "application/json" }, status: 400 }
      )
    }

    const apiKey = Deno.env.get('LLAMA_API_KEY')
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'LLAMA_API_KEY not configured' }),
        { headers: { "Content-Type": "application/json" }, status: 500 }
      )
    }

    // Determine if this is a website clone request
    const isWebsiteClone = prompt.toLowerCase().includes('clone') || 
                          prompt.toLowerCase().includes('website') || 
                          prompt.toLowerCase().includes('site') ||
                          prompt.toLowerCase().includes('html');

    const systemPrompt = isWebsiteClone ? 
      `You are a web developer. Create a complete HTML website clone. CRITICAL REQUIREMENTS:
      
      1. STRUCTURE: Generate a complete HTML document with DOCTYPE, html, head, and body tags
      2. STYLING: Include ALL CSS styles in a <style> tag within the <head> section
      3. INTERACTIVITY: Include ALL JavaScript in a <script> tag before closing </body>
      4. COMPLETENESS: The HTML must be self-contained and render a complete, functional website
      5. NO EXPLANATIONS: Return ONLY the HTML code, no text, no markdown, no comments outside the code
      6. RESPONSIVE: Make it mobile-friendly with proper viewport meta tag
      7. MODERN DESIGN: Use modern CSS features like flexbox, grid, animations, gradients
      
      Example structure:
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Website Title</title>
          <style>
              /* ALL CSS HERE */
          </style>
      </head>
      <body>
          <!-- ALL HTML CONTENT HERE -->
          <script>
              // ALL JAVASCRIPT HERE
          </script>
      </body>
      </html>`
      :
      `You are a React/TypeScript developer. Generate clean, working code based on user requests.
      
      CRITICAL REQUIREMENTS:
      1. Return ONLY code, no explanations or markdown
      2. Use proper TypeScript interfaces
      3. Include all necessary imports
      4. Use Tailwind CSS for styling
      5. Make components functional and interactive
      6. NO text outside the code block`;

    const response = await fetch('https://api.llama.com/compat/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'Llama-4-Scout-17B-16E-Instruct-FP8',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 4000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`Llama API error: ${response.status}`)
    }

    const data = await response.json()
    let generatedCode = data.choices[0]?.message?.content || '';
    
    // Clean up the response - remove any markdown or explanations
    if (generatedCode.includes('```')) {
      const codeMatch = generatedCode.match(/```(?:html|javascript|typescript|jsx|tsx)?\n?([\s\S]*?)\n?```/);
      if (codeMatch) {
        generatedCode = codeMatch[1];
      }
    }

    return new Response(
      JSON.stringify({ 
        code: generatedCode,
        isWebsiteClone 
      }),
      { 
        headers: { 
          "Content-Type": "application/json",
          'Access-Control-Allow-Origin': '*'
        } 
      }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { 
          "Content-Type": "application/json",
          'Access-Control-Allow-Origin': '*'
        }, 
        status: 500 
      }
    )
  }
})