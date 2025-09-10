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
      `You are an EXPERT web designer and developer who creates STUNNING, PREMIUM websites. Create a complete HTML website that looks AMAZING and PROFESSIONAL. CRITICAL REQUIREMENTS:

      🎨 DESIGN EXCELLENCE:
      - Use BEAUTIFUL color palettes (gradients, modern colors, NOT basic colors)
      - Implement STUNNING visual effects: glassmorphism, neumorphism, beautiful shadows
      - Add SMOOTH animations and micro-interactions (hover effects, transitions, parallax)
      - Use PREMIUM typography with Google Fonts (multiple font weights)
      - Create VISUALLY STRIKING layouts with proper whitespace and hierarchy
      - Include BEAUTIFUL backgrounds: gradients, patterns, or subtle textures
      
      🚀 MODERN FEATURES:
      - Responsive design that looks perfect on all devices
      - CSS Grid and Flexbox for perfect layouts
      - Modern CSS features: backdrop-filter, clamp(), custom properties
      - Smooth scrolling and scroll-triggered animations
      - Interactive elements with engaging hover states
      - Beautiful loading states and micro-animations
      
      ✨ UI/UX EXCELLENCE:
      - Professional navigation with smooth transitions
      - Cards with beautiful shadows and hover effects
      - Buttons with premium styling and animations
      - Forms with modern styling and validation states
      - Hero sections with compelling visuals
      - Footer with organized content and social links
      
      📱 TECHNICAL REQUIREMENTS:
      1. Complete HTML document with DOCTYPE, html, head, and body
      2. ALL CSS in <style> tag within <head> (use CSS custom properties for theming)
      3. ALL JavaScript in <script> tag before closing </body>
      4. Self-contained and fully functional
      5. Mobile-first responsive design
      6. NO explanations - ONLY the HTML code
      
      🎯 INSPIRATION: Think Stripe, Apple, Vercel, Linear - clean, modern, premium feel
      
      Structure:
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Premium Website</title>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
          <style>
              :root {
                  /* Define beautiful color scheme with CSS custom properties */
              }
              /* PREMIUM CSS WITH MODERN EFFECTS */
          </style>
      </head>
      <body>
          <!-- BEAUTIFUL, PROFESSIONAL HTML STRUCTURE -->
          <script>
              // SMOOTH INTERACTIONS AND ANIMATIONS
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