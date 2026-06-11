import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// Dynamic Flowing Lines Background Component - Random Wandering Curves
const FlowingLinesBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
      initFibers();
    };
    window.addEventListener('resize', handleResize);

    interface Fiber {
      x: number;
      y: number;
      prevX: number;
      prevY: number;
      speed: number;
      color: string;
      lineWidth: number;
    }

    let fibers: Fiber[] = [];
    const numFibers = 220; // Increased density for more visible flow field lines

    const createFiber = (randomizePosition = true): Fiber => {
      let x = randomizePosition ? Math.random() * width : -20;
      let y = Math.random() * height;

      // Color scheme matching Odysseus landing page (with enhanced opacity and vibrancy)
      const isCoral = Math.random() < 0.15;
      const color = isCoral
        ? `rgba(240, 124, 124, ${0.12 + Math.random() * 0.15})` // vibrant coral
        : `rgba(100, 165, 150, ${0.08 + Math.random() * 0.14})`; // vibrant slate-teal

      return {
        x,
        y,
        prevX: x,
        prevY: y,
        speed: 0.4 + Math.random() * 0.8, // slow flowing movement
        color,
        lineWidth: 0.6 + Math.random() * 1.0, // slightly thicker lines for visibility
      };
    };

    const initFibers = () => {
      fibers = [];
      for (let i = 0; i < numFibers; i++) {
        fibers.push(createFiber(true));
      }
    };

    initFibers();

    let time = 0;
    let isVisible = false;

    const render = () => {
      if (!isVisible) return;

      // Very slow fade to build up a high-density flowing vector field texture over time
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.018)'; // slightly faster fade to keep paths sharp and clear
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'source-over';

      time += 0.001; // Flow field animation tick speed

      fibers.forEach((fiber, index) => {
        fiber.prevX = fiber.x;
        fiber.prevY = fiber.y;

        // Flow field vector math:
        // Combined overlapping wave frequencies to create curved wind/hair currents
        const angle = (
          Math.sin(fiber.x * 0.002 + time * 2) * 1.2 + 
          Math.cos(fiber.y * 0.003 - time) * 1.5
        ) * Math.PI;

        fiber.x += Math.cos(angle) * fiber.speed;
        fiber.y += Math.sin(angle) * fiber.speed;

        // Draw the segment
        ctx.beginPath();
        ctx.moveTo(fiber.prevX, fiber.prevY);
        ctx.lineTo(fiber.x, fiber.y);
        ctx.strokeStyle = fiber.color;
        ctx.lineWidth = fiber.lineWidth;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Respawn if went out of bounds
        const margin = 30;
        if (
          fiber.x < -margin ||
          fiber.x > width + margin ||
          fiber.y < -margin ||
          fiber.y > height + margin
        ) {
          fibers[index] = createFiber(false);
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        const wasVisible = isVisible;
        isVisible = entry.isIntersecting;
        if (isVisible && !wasVisible) {
          render();
        } else if (!isVisible) {
          cancelAnimationFrame(animationFrameId);
        }
      },
      { threshold: 0.01 }
    );

    observer.observe(canvas);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.75
      }}
    />
  );
};

// Halftone 3D Ripple Wave Background Component - Optimized Dot Grid Waves
const HalftoneWaveBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const spacing = 28; // Spacing between dots
    const levels = 5; // Halftone size levels
    let time = 0;

    let isVisible = false;

    const render = () => {
      if (!isVisible) return;

      ctx.clearRect(0, 0, width, height);

      const cols = Math.ceil(width / spacing) + 1;
      const rows = Math.ceil(height / spacing) + 1;

      // Group dots by size levels to draw them in batches (batching optimization)
      const dotGroups: { px: number; py: number }[][] = Array.from({ length: levels }, () => []);

      time += 0.04; // Animation wave speed

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * spacing;
          const y = r * spacing;

          // Combined sine-cosine wave to create 3D surface illusion matching user image
          const waveValue = (
            Math.sin(x * 0.005 + y * 0.003 - time) + 
            Math.cos(y * 0.006 + time * 0.8)
          ) / 2;

          const scale = (waveValue + 1) / 2; // Normalize to [0, 1]
          const level = Math.max(0, Math.min(levels - 1, Math.floor(scale * levels)));

          // Shift positions slightly to create the bended 3D wave lines
          const px = x + waveValue * 8;
          const py = y + waveValue * 12;

          dotGroups[level].push({ px, py });
        }
      }

      // Draw dot groups (only 5 fill calls per frame instead of thousands)
      for (let l = 0; l < levels; l++) {
        if (dotGroups[l].length === 0) continue;

        ctx.beginPath();
        const rx = 0.8 + (l / (levels - 1)) * 1.5; // X radius (thickness)
        const ry = 1.2 + (l / (levels - 1)) * 2.8; // Y radius (stretched vertically like halftone style)

        dotGroups[l].forEach(dot => {
          ctx.moveTo(dot.px + rx, dot.py);
          ctx.ellipse(dot.px, dot.py, rx, ry, 0, 0, Math.PI * 2);
        });

        // Use a subtle white dot color that matches the premium theme
        ctx.fillStyle = `rgba(255, 255, 255, ${0.02 + (l / (levels - 1)) * 0.06})`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        const wasVisible = isVisible;
        isVisible = entry.isIntersecting;
        if (isVisible && !wasVisible) {
          render();
        } else if (!isVisible) {
          cancelAnimationFrame(animationFrameId);
        }
      },
      { threshold: 0.01 }
    );

    observer.observe(canvas);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
};

// Floating Code Snippets Background Component for Projects section (Typewriter & Continuous Scroll Simulator)
const FloatingCodeBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const codeFiles = [
      {
        name: "ProductService.java",
        lines: [
          "@Service",
          "@Slf4j",
          "public class ProductService implements IProductService {",
          "  @Autowired",
          "  private ProductRepository repo;",
          "  @Autowired",
          "  private CacheManager cacheManager;",
          "  ",
          "  @Transactional",
          "  public Product save(Product p) {",
          "    log.info(\"Saving product to DB: \" + p.getName());",
          "    Product saved = repo.save(p);",
          "    cacheManager.evict(\"products\", saved.getId());",
          "    return saved;",
          "  }",
          "  public List<Product> findAll() {",
          "    return repo.findAllActive();",
          "  }",
          "}"
        ]
      },
      {
        name: "PlayerController.cs",
        lines: [
          "using UnityEngine;",
          "using System.Collections;",
          "",
          "public class PlayerController : MonoBehaviour {",
          "  public float speed = 8.5f;",
          "  public float jumpForce = 12.0f;",
          "  private Rigidbody2D rb;",
          "  private bool isGrounded;",
          "  ",
          "  void Start() {",
          "    rb = GetComponent<Rigidbody2D>();",
          "  }",
          "  void Update() {",
          "    float move = Input.GetAxisRaw(\"Horizontal\");",
          "    rb.velocity = new Vector2(move * speed, rb.velocity.y);",
          "    ",
          "    if (Input.GetButtonDown(\"Jump\") && isGrounded) {",
          "      rb.AddForce(Vector2.up * jumpForce, ForceMode2D.Impulse);",
          "    }",
          "  }",
          "}"
        ]
      },
      {
        name: "ai_agent.py",
        lines: [
          "from langchain_google_genai import ChatGoogleGenerativeAI",
          "from langchain.agents import AgentExecutor",
          "from agent_tools import WebSearch, DatabaseQuery",
          "import os",
          "",
          "llm = ChatGoogleGenerativeAI(model=\"gemini-1.5-flash\", temperature=0.3)",
          "tools = [WebSearch(), DatabaseQuery()]",
          "agent = create_openai_tools_agent(llm, tools)",
          "executor = AgentExecutor(agent=agent, tools=tools, verbose=True)",
          "",
          "async def handle_user_query(user_input):",
          "    result = await executor.ainvoke({\"input\": user_input})",
          "    return result[\"output\"]"
        ]
      },
      {
        name: "ChatBot.tsx",
        lines: [
          "import React, { useState, useEffect, useRef } from 'react';",
          "import { api } from './services/api';",
          "",
          "export const ChatBot: React.FC = () => {",
          "  const [messages, setMessages] = useState<Msg[]>([]);",
          "  const scrollRef = useRef<HTMLDivElement>(null);",
          "  ",
          "  const sendMessage = async (text: string) => {",
          "    if (!text.trim()) return;",
          "    const userMsg = { id: Date.now(), text, sender: 'user' };",
          "    setMessages(prev => [...prev, userMsg]);",
          "    const res = await api.post(\"/chat\", { text });",
          "    setMessages(prev => [...prev, res.data]);",
          "  };",
          "  return <ChatWindow messages={messages} onSend={sendMessage} ref={scrollRef} />;",
          "};"
        ]
      }
    ];

    interface Editor {
      relX: number;
      relY: number;
      fileIndex: number;
      currentLineIndex: number;
      currentCharIndex: number;
      typedLines: string[];
      typingSpeed: number; // frames per action
      frameCounter: number;
      isDelaying: boolean;
      delayCounter: number;
      delayLimit: number;
      color: string;
      offsetY: number;
    }

    // Function to pre-load a segment of lines from a file
    const createPreloadedLines = (fileIndex: number, lineCount: number): string[] => {
      const file = codeFiles[fileIndex];
      return file.lines.slice(0, Math.min(file.lines.length, lineCount));
    };

    // Two column layout strictly framing the center content (Left and Right)
    let editors: Editor[] = [
      {
        relX: 0.02, // 2% from Left edge
        relY: 0.12,
        fileIndex: 0,
        currentLineIndex: 9, // Start typing from line 10
        currentCharIndex: 0,
        typedLines: createPreloadedLines(0, 9), // pre-load first 9 lines
        typingSpeed: 1, // hyper active frame rate
        frameCounter: 0,
        isDelaying: false,
        delayCounter: 0,
        delayLimit: 0,
        color: 'rgba(158, 229, 232, 0.035)', // Teal (dimmed opacity for elegance)
        offsetY: 0
      },
      {
        relX: 0.74, // 74% from Left edge (Right side)
        relY: 0.12,
        fileIndex: 1,
        currentLineIndex: 9, // Start typing from line 10
        currentCharIndex: 0,
        typedLines: createPreloadedLines(1, 9), // pre-load first 9 lines
        typingSpeed: 1,
        frameCounter: 0,
        isDelaying: false,
        delayCounter: 0,
        delayLimit: 0,
        color: 'rgba(240, 124, 124, 0.038)', // Coral (dimmed opacity for elegance)
        offsetY: 0
      }
    ];

    let cursorBlink = true;
    let cursorCounter = 0;
    let isVisible = false;

    const render = () => {
      if (!isVisible) return;

      ctx.clearRect(0, 0, width, height);
      const lineHeight = 21;

      // Handle cursor blink
      cursorCounter++;
      if (cursorCounter >= 25) {
        cursorBlink = !cursorBlink;
        cursorCounter = 0;
      }

      editors.forEach((editor, idx) => {
        // Hide right-side column on mobile viewports to prevent overlapping with content
        if (width < 950 && idx === 1) return;

        const file = codeFiles[editor.fileIndex];
        
        // Update typing logic
        if (editor.isDelaying) {
          editor.delayCounter++;
          if (editor.delayCounter >= editor.delayLimit) {
            editor.isDelaying = false;
            editor.delayCounter = 0;
            
            // If file fully typed, load another random one continuously (without clearing screen history!)
            if (editor.currentLineIndex >= file.lines.length) {
              editor.fileIndex = (editor.fileIndex + 1) % codeFiles.length;
              editor.currentLineIndex = 0;
              editor.currentCharIndex = 0;
              // Do NOT clear editor.typedLines so scrolling is uninterrupted!
            }
          }
        } else {
          editor.frameCounter++;
          if (editor.frameCounter >= editor.typingSpeed) {
            editor.frameCounter = 0;
            const currentLine = file.lines[editor.currentLineIndex];

            if (editor.currentCharIndex < currentLine.length) {
              // Type 2-3 characters at a time for hyper-speed typing
              const charsToType = Math.min(
                currentLine.length - editor.currentCharIndex,
                Math.floor(Math.random() * 2) + 2
              );
              editor.currentCharIndex += charsToType;
            } else {
              // Finish typing current line -> Add it and Go down (xuống dòng)
              editor.typedLines.push(currentLine);
              if (editor.typedLines.length > 20) {
                editor.typedLines.shift(); // keep memory clean
              }
              
              // Set scroll offset to translate text down, then we will lerp it back to 0
              editor.offsetY = lineHeight;

              editor.currentLineIndex++;
              editor.currentCharIndex = 0;
              editor.isDelaying = true;
              editor.delayCounter = 0;

              // Check if file finished
              if (editor.currentLineIndex >= file.lines.length) {
                editor.delayLimit = 35; // short pause at end of file (about 0.5s) to avoid noticeable delays
              } else {
                editor.delayLimit = 2; // virtually instant pause on Newline (30ms) for continuous flow
              }
            }
          }
        }

        // Interpolate smooth scroll Y offset continuously (lerp to 0)
        editor.offsetY += (0 - editor.offsetY) * 0.08;

        // Position coordinates
        let startX = editor.relX * width;
        let startY = editor.relY * height;
        const boxWidth = width < 1200 ? 240 : 320;
        const boxHeight = height * 0.72;
        const bottomY = startY + boxHeight;

        // On mobile, position Editor 0 centered and more faded
        if (width < 950) {
          startX = 0.05 * width;
          startY = 0.12 * height;
        }

        ctx.font = "500 14px 'JetBrains Mono', monospace";

        // Draw virtual tab file header (Static - does not scroll)
        ctx.fillStyle = editor.color.replace('0.035', '0.095').replace('0.038', '0.098');
        ctx.fillText(`/* ${file.name} */`, startX, startY);

        // Apply Clipping Mask
        ctx.save();
        ctx.beginPath();
        // Safe rect starting below the header tab and extending slightly below bottomY for entrance animation
        ctx.rect(startX - 10, startY + lineHeight * 0.6, boxWidth + 20, boxHeight + 30);
        ctx.clip();

        // Draw active typing line at the very bottom, offset downwards by editor.offsetY
        if (editor.currentLineIndex < file.lines.length) {
          const typedText = file.lines[editor.currentLineIndex].substring(0, editor.currentCharIndex);
          const cursor = cursorBlink ? " |" : "  ";
          ctx.fillText(typedText + cursor, startX, bottomY + editor.offsetY);
        }

        // Draw fully typed lines going upwards from the active line
        let currentY = bottomY - lineHeight + editor.offsetY;
        for (let i = editor.typedLines.length - 1; i >= 0; i--) {
          ctx.fillText(editor.typedLines[i], startX, currentY);
          currentY -= lineHeight;
        }

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        const wasVisible = isVisible;
        isVisible = entry.isIntersecting;
        if (isVisible && !wasVisible) {
          render();
        } else if (!isVisible) {
          cancelAnimationFrame(animationFrameId);
        }
      },
      { threshold: 0.01 }
    );

    observer.observe(canvas);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        filter: 'blur(1px)', // increased blur to make it softer and out-of-focus
      }}
    />
  );
};


// SVG Icons
const SailLogoIcon = ({ size = 24, style = {} }: { size?: number; style?: React.CSSProperties }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    style={style}
  >
    {/* Left small sail */}
    <path d="M48 20C40 45 25 65 25 75H48V20Z" fill="var(--primary)" opacity="0.65" />
    {/* Right big sail */}
    <path d="M52 20C62 45 75 65 75 75H52V20Z" fill="var(--primary)" />
  </svg>
);

const GithubIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
);

const LinkedinIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
);

const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
);

const PhoneIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
);

const CalendarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
);

const MapPinIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
);

const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);



const GamepadIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="6" y1="12" x2="10" y2="12"></line><line x1="8" y1="10" x2="8" y2="14"></line><line x1="15" y1="13" x2="15.01" y2="13"></line><line x1="18" y1="11" x2="18.01" y2="11"></line><rect x="2" y="6" width="20" height="12" rx="3"></rect></svg>
);

// CodeIcon removed

const GraduationCapIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"></path></svg>
);

function App() {
  // Typewriter roles
  const roles = ["Backend Developer.", "Unity Developer.", "Software Engineering Student.", "AI & Agent Enthusiast."];
  const [roleText, setRoleText] = useState("");
  const [roleIndex, setRoleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 900);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  


  // Typewriter animation logic
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const currentFullText = roles[roleIndex];
    const typingSpeed = isDeleting ? 30 : 80;

    const handleType = () => {
      if (!isDeleting) {
        setRoleText(currentFullText.substring(0, roleText.length + 1));
        if (roleText === currentFullText) {
          timer = setTimeout(() => setIsDeleting(true), 2000);
          return;
        }
      } else {
        setRoleText(currentFullText.substring(0, roleText.length - 1));
        if (roleText === "") {
          setIsDeleting(false);
          setRoleIndex((roleIndex + 1) % roles.length);
          return;
        }
      }
      timer = setTimeout(handleType, typingSpeed);
    };

    timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [roleText, isDeleting, roleIndex]);

  // Simple contact form submit handler
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Contact form submitted:", formData);
    setFormSubmitted(true);
    setFormData({ name: '', email: '', message: '' });
    setTimeout(() => setFormSubmitted(false), 5000);
  };
  return (
    <div className="app-container">
      {/* Navigation Bar */}
      <header className="navbar">
        <div className="nav-content">
          <div className="logo-group">
            <SailLogoIcon size={24} style={{ marginRight: '6px', display: 'inline-block', verticalAlign: 'middle' }} />
            <a href="#hero" className="logo-text">Andrew<span className="dot">.</span></a>
          </div>
          <nav className="nav-links">
            <a href="#about">Giới thiệu</a>
            <a href="#skills">Kỹ năng</a>
            <a href="#projects">Dự án</a>
            <a href="#play-zone">Play Zone</a>
            <a href="#contact">Liên hệ</a>
          </nav>
          <div className="nav-actions">
            <a href="https://github.com/AndrewQng" target="_blank" rel="noopener noreferrer" className="github-btn-nav">
              <GithubIcon /> <span>GitHub</span>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" className="section hero-section">
        <div className="hero-glow"></div>
        <FlowingLinesBackground />
        <div className="hero-content">
          <div className="hero-brand">
            <SailLogoIcon size={36} style={{ marginRight: '10px' }} />
            <span className="brand-name">Andrew</span>
          </div>
          <div className="tagline-container">
            <span className="tagline-dynamic">{roleText}</span>
            <span className="typewriter-cursor"></span>
          </div>
          <h1 className="name-title">
            Sinh viên <span className="highlight-coral">IT</span>,<br />
            đam mê <span className="highlight-cyan">AI & Unity</span>.
          </h1>
          <p className="hero-desc">
            Sinh viên năm 3 chuyên ngành Công nghệ phần mềm tại Đại học Xây dựng Hà Nội. 
            Đam mê thiết kế hệ thống backend hiệu năng cao, tự học công nghệ mới và xây dựng giải pháp tự động hóa bằng AI.
          </p>
          <p className="hero-subdesc">
            (nếu bạn đang tìm kiếm một thực tập sinh chủ động và tự học tốt - tôi luôn sẵn sàng...)
          </p>
          <div className="cta-buttons">
            <a href="#play-zone" className="btn-primary">
              <GamepadIcon /> Chơi Game Thử Nghiệm
            </a>
            <a href="#about" className="btn-secondary">
              <UserIcon /> Về Bản Thân
            </a>
          </div>
        </div>
      </section>

      {/* About Me Section */}
      <section id="about" className="section">
        <h2 className="section-title"><span>01.</span> Giới thiệu bản thân</h2>
        <div className="grid-2">
          <div className="glass-panel about-panel">
            <h3 className="panel-title">Thông tin cá nhân</h3>
            <ul className="info-list">
              <li>
                <CalendarIcon />
                <div>
                  <strong>Ngày sinh:</strong>
                  <span>06/02/2005</span>
                </div>
              </li>
              <li>
                <UserIcon />
                <div>
                  <strong>Giới tính:</strong>
                  <span>Nam</span>
                </div>
              </li>
              <li>
                <PhoneIcon />
                <div>
                  <strong>Số điện thoại:</strong>
                  <span>0962489069</span>
                </div>
              </li>
              <li>
                <MailIcon />
                <div>
                  <strong>Email:</strong>
                  <a href="mailto:nguyenquyenforwork@gmail.com">nguyenquyenforwork@gmail.com</a>
                </div>
              </li>
              <li>
                <MapPinIcon />
                <div>
                  <strong>Địa chỉ:</strong>
                  <span>Hoàng Mai, Hà Nội</span>
                </div>
              </li>
              <li>
                <LinkedinIcon />
                <div>
                  <strong>LinkedIn:</strong>
                  <a href="https://www.linkedin.com/in/nguyenquyenwork/" target="_blank" rel="noopener noreferrer">nguyenquyenwork</a>
                </div>
              </li>
            </ul>
            <p className="about-bio">
              Có thế mạnh đặc biệt về tư duy phân tích hệ thống, khả năng tự học tốt và thói quen làm việc độc lập. 
              Tôi luôn chủ động áp dụng các trợ lý AI và Agent skills vào quy trình phát triển để tối ưu hóa năng suất lập trình.
            </p>
          </div>

          <div className="glass-panel education-panel">
            <h3 className="panel-title">Học vấn</h3>
            <div className="education-card">
              <div className="edu-icon"><GraduationCapIcon /></div>
              <div className="edu-details">
                <h4>TRƯỜNG ĐẠI HỌC XÂY DỰNG HÀ NỘI</h4>
                <span className="edu-time">09/2023 - Hiện tại</span>
                <p className="edu-major">Chuyên ngành: Công nghệ thông tin / Công nghệ phần mềm</p>
                <p className="edu-desc">Sinh viên năm 3, tích lũy kiến thức nền tảng vững vàng về OOP, cấu trúc dữ liệu, thuật toán và quy trình sản xuất phần mềm.</p>
              </div>
            </div>
            
            <div className="cv-download-box">
              <p>Muốn tìm hiểu chi tiết hơn về kỹ năng & định hướng công việc của tôi?</p>
              <a href="./cv.pdf" target="_blank" rel="noopener noreferrer" className="btn-primary">Tải CV (Bản đầy đủ)</a>
            </div>

          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="section">
        <HalftoneWaveBackground />
        <h2 className="section-title"><span>02.</span> Kỹ năng chuyên môn</h2>
        <div className="grid-2">
          {/* Skill Groups Left */}
          <div className="skills-column">
            <div className="glass-panel skill-card">
              <h3 className="skill-group-title glow-text-primary">Ngôn ngữ lập trình</h3>
              <p className="skill-group-desc">Thành thạo cơ bản và làm việc linh hoạt trên nhiều môi trường khác nhau:</p>
              <div className="tags-container">
                <span className="tag">Java</span>
                <span className="tag">C# (.NET)</span>
                <span className="tag">Node.js (JavaScript/TypeScript)</span>
                <span className="tag">PHP</span>
              </div>
            </div>

            <div className="glass-panel skill-card">
              <h3 className="skill-group-title glow-text-primary">Nền tảng & Framework</h3>
              <p className="skill-group-desc">Có kinh nghiệm làm việc thực tế với các framework và thư viện giao diện:</p>
              <div className="tags-container">
                <span className="tag">Spring Boot 3</span>
                <span className="tag">.NET Core</span>
                <span className="tag">ReactJS</span>
                <span className="tag">TailwindCSS</span>
                <span className="tag">Ant Design</span>
                <span className="tag">Express.js</span>
              </div>
            </div>
          </div>

          {/* Skill Groups Right */}
          <div className="skills-column">
            <div className="glass-panel skill-card">
              <h3 className="skill-group-title glow-text-primary">Kiến trúc & Hệ thống</h3>
              <p className="skill-group-desc">Nắm chắc tư duy thiết kế hệ thống và mô hình phát triển hiện đại:</p>
              <div className="tags-container">
                <span className="tag">OOP (Hướng đối tượng)</span>
                <span className="tag">Nguyên lý SOLID</span>
                <span className="tag">Design Patterns (Singleton, Service Locator)</span>
                <span className="tag">MVC Architecture</span>
                <span className="tag">Clean Architecture</span>
                <span className="tag">Domain-Driven Design (DDD)</span>
                <span className="tag">Modulith Architecture</span>
              </div>
            </div>

            <div className="glass-panel skill-card">
              <h3 className="skill-group-title glow-text-primary">Tư duy & Công cụ làm việc</h3>
              <p className="skill-group-desc">Kỹ năng mềm và các công cụ bổ trợ phát triển phần mềm:</p>
              <div className="tags-container">
                <span className="tag">Tư duy logic nhạy bén</span>
                <span className="tag">Khả năng tự học công nghệ mới</span>
                <span className="tag">Giải quyết vấn đề độc lập</span>
                <span className="tag">Sử dụng AI & Agent skills</span>
                <span className="tag">Git & GitHub</span>
                <span className="tag">MongoDB / SQL</span>
                <span className="tag">Docker</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="section">
        <FloatingCodeBackground />
        <h2 className="section-title"><span>03.</span> Dự án thực tế</h2>
        
        <div className="glass-panel project-detail-card">
          <div className="project-badge">Dự án tiêu biểu</div>
          <div className="project-header">
            <h3>Website Bán Hàng Trực Tuyến Ecommerce (Đồ Thể Thao)</h3>
            <span className="project-date">02/2026 - 05/2026</span>
          </div>
          
          <p className="project-brief">
            Phát triển ứng dụng thương mại điện tử Full-stack theo mô hình Monolith, tối ưu hóa quy trình đặt hàng, 
            bảo mật người dùng và tích hợp trí tuệ nhân tạo tư vấn khách hàng trực tiếp.
          </p>

          <h4 className="project-sub-heading">Tính năng nổi bật đã hoàn thành:</h4>
          <ul className="project-bullets">
            <li><strong>Full-stack Monolith:</strong> Backend sử dụng Java 17, Spring Boot 3, cơ sở dữ liệu MongoDB. Frontend xây dựng bằng React 18 và thư viện giao diện Ant Design.</li>
            <li><strong>Xác thực an toàn:</strong> Triển khai xác thực qua JWT, tích hợp đăng nhập qua mạng xã hội (Google, Facebook) và hệ thống gửi mã OTP qua Email phục vụ bảo mật.</li>
            <li><strong>Tích hợp AI:</strong> Xây dựng AI Chatbot tư vấn khách hàng thông minh bằng Tiếng Việt trực quan ngay trên website.</li>
            <li><strong>Giao diện Responsive:</strong> Thiết kế thân thiện, tương thích tối đa trên màn hình máy tính, máy tính bảng và điện thoại di động.</li>
          </ul>

          <div className="project-tech-tags">
            <span className="tech-tag">Java 17</span>
            <span className="tech-tag">Spring Boot 3</span>
            <span className="tech-tag">MongoDB</span>
            <span className="tech-tag">React 18</span>
            <span className="tech-tag">Ant Design</span>
            <span className="tech-tag">JWT</span>
            <span className="tech-tag">OTP Authentication</span>
            <span className="tech-tag">AI Chatbot</span>
          </div>

          <div className="project-links">
            <a href="https://github.com/AndrewQng/AndrewSport-Web-E-commerce" target="_blank" rel="noopener noreferrer" className="btn-secondary">
              <GithubIcon /> Xem Repository trên GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Unity Play Zone Section */}
      <section id="play-zone" className="section">
        <h2 className="section-title"><span>04.</span> Unity Play Zone</h2>
        <p className="section-subtitle">
          Dành riêng cho nhà tuyển dụng chơi thử các sản phẩm game WebGL do tôi xây dựng.
        </p>

        <div className="play-zone-container glass-panel">
          {isMobile ? (
            <div className="mobile-play-zone-fallback">
              <GamepadIcon />
              <h3>Khu vực chơi game không hỗ trợ di động</h3>
              <p>Trải nghiệm chơi game (React Clicker & Unity WebGL) hiện không tương thích với màn hình di động hoặc thiết bị cảm ứng.</p>
              <p className="fallback-note">Vui lòng truy cập trang web bằng máy tính (Desktop/Laptop) để trải nghiệm trò chơi!</p>
            </div>
          ) : (
            <div className="console-display" style={{ minHeight: '520px' }}>
              <div className="unity-iframe-screen">
                {/* Check if game is uploaded, else show mock UI / instructions */}
                <div className="iframe-wrapper">
                  <iframe 
                    src="./unity-games/index.html" 
                    title="Unity WebGL Game"
                    className="unity-iframe"
                    onError={() => console.log('Iframe failed to load')}
                  />
                  {/* Overlay instructions in case game doesn't exist yet */}
                  <div className="unity-fallback-overlay">
                    <div className="fallback-content">
                      <GamepadIcon />
                      <h3>KHU VỰC CHỜ GAME UNITY</h3>
                      <p>Hiện tại chưa có game WebGL nào được upload lên website.</p>
                      
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section contact-section">
        <h2 className="section-title"><span>05.</span> Liên hệ công việc</h2>
        <div className="grid-2">
          <div className="contact-details glass-panel">
            <h3>Hãy cùng tạo nên những sản phẩm tuyệt vời!</h3>
            <p className="contact-pitch">
              Tôi hiện đang tìm kiếm cơ hội thực tập sinh (Intern) vị trí Backend Developer hoặc Fullstack Developer. 
              Nếu bạn có dự án phù hợp, hãy gửi lời nhắn hoặc liên hệ trực tiếp với tôi qua các kênh bên cạnh.
            </p>
            
            <div className="contact-cards-stack">
              <div className="contact-info-card">
                <div className="contact-card-icon"><MailIcon /></div>
                <div>
                  <h4>Gửi Email trực tiếp</h4>
                  <a href="mailto:nguyenquyenforwork@gmail.com" className="glow-text-primary">nguyenquyenforwork@gmail.com</a>
                </div>
              </div>

              <div className="contact-info-card">
                <div className="contact-card-icon"><PhoneIcon /></div>
                <div>
                  <h4>Số điện thoại</h4>
                  <span>0962 489 069</span>
                </div>
              </div>

              <div className="contact-info-card">
                <div className="contact-card-icon"><LinkedinIcon /></div>
                <div>
                  <h4>Kết nối mạng xã hội</h4>
                  <a href="https://www.linkedin.com/in/nguyenquyenwork/" target="_blank" rel="noopener noreferrer" className="glow-text-primary">
                    linkedin.com/in/nguyenquyenwork
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-form-panel glass-panel">
            <h3 className="panel-title">Gửi tin nhắn nhanh</h3>
            {formSubmitted ? (
              <div className="form-success-message">
                <span className="success-icon">✓</span>
                <h4>Cảm ơn bạn đã liên hệ!</h4>
                <p>Tin nhắn của bạn đã được gửi thành công (đã ghi log hệ thống). Tôi sẽ phản hồi lại sớm nhất có thể.</p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="contact-form">
                <div className="form-group">
                  <label htmlFor="name">Họ và Tên</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    required 
                    value={formData.name}
                    onChange={handleFormChange}
                    placeholder="Ví dụ: Nguyễn Văn A" 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Địa chỉ Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    required 
                    value={formData.email}
                    onChange={handleFormChange}
                    placeholder="example@gmail.com" 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="message">Nội dung tin nhắn</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    rows={4} 
                    required 
                    value={formData.message}
                    onChange={handleFormChange}
                    placeholder="Nhập nội dung bạn muốn trao đổi..." 
                  />
                </div>
                <button type="submit" className="btn-primary submit-btn">Gửi Lời Nhắn</button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p>© 2026 Nguyễn Mạnh Quyền. Thiết kế & Phát triển với React & Vite.</p>
          <div className="footer-links">
            <a href="https://github.com/AndrewQng" target="_blank" rel="noopener noreferrer"><GithubIcon /></a>
            <a href="https://www.linkedin.com/in/nguyenquyenwork/" target="_blank" rel="noopener noreferrer"><LinkedinIcon /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
