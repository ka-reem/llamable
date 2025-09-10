import "jsr:@supabase/functions-js/edge-runtime.d.ts"

console.log("Generate code function started!")

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' } })
  }

  try {
    const { prompt, image } = await req.json()
    
    if (!prompt && !image) {
      return new Response(
        JSON.stringify({ error: 'Prompt or image is required' }),
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
      `You are an EXPERT web designer and developer who creates STUNNING, PREMIUM websites. ${image ? 'ANALYZE the provided screenshot/image and recreate it as a modern, functional website while maintaining the visual design, layout, colors, and overall aesthetic.' : ''} Create a complete HTML website that looks AMAZING and PROFESSIONAL. CRITICAL REQUIREMENTS:

      🎨 DESIGN EXCELLENCE:
      - Use BEAUTIFUL color palettes (gradients, modern colors, NOT basic colors)
      - Implement STUNNING visual effects: glassmorphism, neumorphism, beautiful shadows
      - Add SMOOTH animations and micro-interactions (hover effects, transitions, parallax)
      - Use PREMIUM typography with Google Fonts (multiple font weights)
      - Create VISUALLY STRIKING layouts with proper whitespace and hierarchy
      - Include BEAUTIFUL backgrounds: gradients, patterns, or subtle textures
      
      🚀 CREATIVE DESIGN REQUIREMENTS:
      - Hero section MUST be creative: split-screen, angled backgrounds, blob shapes, or full-screen gradient animations
      - Use CSS shapes and clip-path: diagonal section dividers, wavy SVG separators between sections
      - Add background animations: subtle moving gradients, floating blobs, or parallax scroll effects
      - Custom typography: Use 2 Google Fonts via <link> - one display font, one body font
      - Include interactive elements: accordion, tabs, modal, or animated buttons in pure JS/CSS
      - Non-standard layouts: masonry grid, card carousel, timeline, or split-columns with sticky elements
      - Rich hover effects: cards tilt, text underline animations, buttons with ripple effects
      - Consider dark/light mode toggle with JavaScript
      - Break from rectangles: use rounded, angled, or irregular container shapes
      - Navbar should be well-spaced, modern, with proper padding and typography
      
      🎯 LAYOUT STRUCTURE:
      - Navbar: Clean, spacious, modern design with proper spacing between items
      - Hero: Take up full viewport height with creative design elements
      - Sections: Use creative dividers, varied layouts, interesting shapes
      - Cards: Use shadows, hover effects, unique shapes (not just rectangles)
      - Buttons: Animated, with hover states and modern styling
      
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
      
      🏗️ WEBSITE STRUCTURE REQUIREMENTS:
      - ALWAYS create a navigation bar at the top
      - Limit navbar to 3–5 items maximum
      - Every section mentioned in the navbar MUST appear on the main page
      - Use anchor links (#section-id) for navbar navigation to scroll to sections
      - Structure: Header/Nav → Hero → Sections (About, Services, Portfolio, etc.) → Footer
      - Each section should have proper IDs matching the navbar links
      - Implement smooth scrolling: html { scroll-behavior: smooth; }
      
      🔗 NAVIGATION RULES:
      - Navbar links should use href="#section-id" format (e.g., href="#about", href="#services")
      - Create corresponding sections with matching IDs (e.g., <section id="about">)
      - External links should open in new tabs (target="_blank")
      - Copyright should always use year 2025
      
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
          <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
          <style>
              :root {
                  /* Beautiful color scheme with CSS custom properties */
                  --primary: #6366f1;
                  --secondary: #8b5cf6;
                  --accent: #06b6d4;
                  --text: #1e293b;
                  --bg: #ffffff;
              }
              html { scroll-behavior: smooth; }
              body { font-family: 'Inter', sans-serif; margin: 0; padding: 0; }
              .display-font { font-family: 'Playfair Display', serif; }
              
              /* MODERN NAVBAR WITH PROPER SPACING */
              nav { 
                  display: flex; 
                  justify-content: space-between; 
                  align-items: center; 
                  padding: 1rem 2rem; 
                  background: rgba(255,255,255,0.95);
                  backdrop-filter: blur(10px);
                  position: fixed;
                  top: 0;
                  width: 100%;
                  z-index: 1000;
                  box-shadow: 0 2px 20px rgba(0,0,0,0.1);
              }
              nav a { 
                  margin: 0 1.5rem; 
                  text-decoration: none; 
                  color: var(--text);
                  font-weight: 500;
                  transition: all 0.3s ease;
                  position: relative;
              }
              nav a:hover { color: var(--primary); transform: translateY(-2px); }
              
              /* CREATIVE HERO SECTION */
              .hero { 
                  height: 100vh; 
                  background: linear-gradient(135deg, var(--primary), var(--secondary));
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  position: relative;
                  overflow: hidden;
              }
              
              /* ANIMATED BACKGROUND ELEMENTS */
              .floating-blob {
                  position: absolute;
                  border-radius: 50%;
                  background: rgba(255,255,255,0.1);
                  animation: float 6s ease-in-out infinite;
              }
              
              @keyframes float {
                  0%, 100% { transform: translateY(0px) rotate(0deg); }
                  50% { transform: translateY(-20px) rotate(180deg); }
              }
              
              /* SECTION DIVIDERS */
              .wave-divider {
                  position: relative;
                  background: white;
                  clip-path: polygon(0 20px, 100% 0, 100% 100%, 0 100%);
                  margin-top: -20px;
              }
              
              /* HOVER EFFECTS */
              .card {
                  background: white;
                  border-radius: 20px;
                  padding: 2rem;
                  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                  transition: all 0.3s ease;
                  transform-style: preserve-3d;
              }
              .card:hover {
                  transform: translateY(-10px) rotateX(5deg);
                  box-shadow: 0 20px 50px rgba(0,0,0,0.2);
              }
              
              /* BUTTON ANIMATIONS */
              .btn {
                  background: linear-gradient(135deg, var(--primary), var(--accent));
                  color: white;
                  padding: 1rem 2rem;
                  border: none;
                  border-radius: 50px;
                  font-weight: 600;
                  cursor: pointer;
                  position: relative;
                  overflow: hidden;
                  transition: all 0.3s ease;
              }
              .btn:hover { transform: scale(1.05); }
              .btn::before {
                  content: '';
                  position: absolute;
                  top: 0; left: -100%;
                  width: 100%; height: 100%;
                  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
                  transition: left 0.5s;
              }
              .btn:hover::before { left: 100%; }
              
              /* PREMIUM STYLING */
              section { padding: 5rem 2rem; }
              .container { max-width: 1200px; margin: 0 auto; }
              h1, h2, h3 { font-family: 'Playfair Display', serif; }
              .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; }
          </style>
      </head>
      <body>
          <!-- MODERN NAVIGATION -->
          <nav>
              <div class="display-font" style="font-size: 1.5rem; font-weight: 700;">Brand</div>
              <div>
                  <a href="#home">Home</a>
                  <a href="#about">About</a>
                  <a href="#services">Services</a>
                  <a href="#contact">Contact</a>
              </div>
          </nav>
          
          <!-- CREATIVE HERO SECTION -->
          <section id="home" class="hero">
              <div class="floating-blob" style="width: 200px; height: 200px; top: 10%; left: 10%;"></div>
              <div class="floating-blob" style="width: 150px; height: 150px; top: 60%; right: 15%; animation-delay: 2s;"></div>
              <div style="text-align: center; color: white; z-index: 10;">
                  <h1 class="display-font" style="font-size: 4rem; margin-bottom: 1rem;">Welcome</h1>
                  <p style="font-size: 1.25rem; margin-bottom: 2rem;">Experience the future of web design</p>
                  <button class="btn">Get Started</button>
              </div>
          </section>
          
          <!-- SECTIONS WITH CREATIVE LAYOUTS -->
          <section id="about" class="wave-divider">
              <div class="container">
                  <h2 class="display-font" style="text-align: center; font-size: 3rem; margin-bottom: 3rem;">About Us</h2>
                  <div class="grid">
                      <div class="card">
                          <h3>Innovation</h3>
                          <p>Content about innovation</p>
                      </div>
                      <div class="card">
                          <h3>Quality</h3>
                          <p>Content about quality</p>
                      </div>
                      <div class="card">
                          <h3>Excellence</h3>
                          <p>Content about excellence</p>
                      </div>
                  </div>
              </div>
          </section>
          
          <section id="services">
              <div class="container">
                  <h2 class="display-font" style="text-align: center; font-size: 3rem; margin-bottom: 3rem;">Services</h2>
                  <!-- Add your services content -->
              </div>
          </section>
          
          <section id="contact">
              <div class="container">
                  <h2 class="display-font" style="text-align: center; font-size: 3rem; margin-bottom: 3rem;">Contact</h2>
                  <!-- Add your contact content -->
              </div>
          </section>
          
          <!-- FOOTER WITH 2025 COPYRIGHT -->
          <footer style="background: #1e293b; color: white; text-align: center; padding: 2rem;">
              <p>&copy; 2025 Company Name. All rights reserved.</p>
          </footer>
          
          <script>
              // SMOOTH INTERACTIONS AND ANIMATIONS
              document.addEventListener('DOMContentLoaded', function() {
                  // Add any interactive JavaScript here
                  console.log('Website loaded successfully!');
              });
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
        model: 'Llama-4-Maverick-17B-128E-Instruct-FP8',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: image ? [
              {
                type: 'text',
                text: prompt || 'Analyze this screenshot and create a website clone that matches the design, layout, colors, and overall aesthetic.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: image
                }
              }
            ] : prompt
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
    const tokens = data.usage?.total_tokens;
    
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
        isWebsiteClone,
        tokens 
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