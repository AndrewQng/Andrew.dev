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
      angle: number;
      speed: number;
      history: { x: number; y: number }[];
      maxHistory: number;
      opacity: number;
      lineWidth: number;
      turnSpeed: number;
    }

    let fibers: Fiber[] = [];
    const numFibers = 120; // Richer density of strands

    const createFiber = (randomizePosition = true): Fiber => {
      let x = 0;
      let y = 0;
      let angle = Math.random() * Math.PI * 2;

      if (randomizePosition) {
        x = Math.random() * width;
        y = Math.random() * height;
      } else {
        // Spawn on random edges for continuous flow
        const edge = Math.floor(Math.random() * 4);
        if (edge === 0) { // left
          x = -30;
          y = Math.random() * height;
          angle = (Math.random() - 0.5) * Math.PI * 0.5;
        } else if (edge === 1) { // right
          x = width + 30;
          y = Math.random() * height;
          angle = Math.PI + (Math.random() - 0.5) * Math.PI * 0.5;
        } else if (edge === 2) { // top
          x = Math.random() * width;
          y = -30;
          angle = Math.PI * 0.5 + (Math.random() - 0.5) * Math.PI * 0.5;
        } else { // bottom
          x = Math.random() * width;
          y = height + 30;
          angle = -Math.PI * 0.5 + (Math.random() - 0.5) * Math.PI * 0.5;
        }
      }

      return {
        x,
        y,
        angle,
        speed: 0.8 + Math.random() * 1.6,
        history: [{ x, y }],
        maxHistory: 15 + Math.floor(Math.random() * 25), // trail length (15 to 40)
        opacity: 0.05 + Math.random() * 0.18, // random opacity for depth
        lineWidth: 0.6 + Math.random() * 1.0,
        turnSpeed: 0.01 + Math.random() * 0.035 // slow turning rate for elegant curves
      };
    };

    const initFibers = () => {
      fibers = [];
      for (let i = 0; i < numFibers; i++) {
        fibers.push(createFiber(true));
      }
    };

    initFibers();

    const render = () => {
      // Semi-transparent clearing for a subtle motion trail (if desired, but clearRect is cleaner for pure CSS overlay)
      ctx.clearRect(0, 0, width, height);

      fibers.forEach((fiber, index) => {
        // Update position
        fiber.x += Math.cos(fiber.angle) * fiber.speed;
        fiber.y += Math.sin(fiber.angle) * fiber.speed;

        // Wander the angle smoothly
        fiber.angle += (Math.random() - 0.5) * fiber.turnSpeed;

        // Add history point
        fiber.history.push({ x: fiber.x, y: fiber.y });
        if (fiber.history.length > fiber.maxHistory) {
          fiber.history.shift();
        }

        // Draw trail with gradient opacity
        const len = fiber.history.length;
        if (len > 1) {
          for (let j = 1; j < len; j++) {
            const p1 = fiber.history[j - 1];
            const p2 = fiber.history[j];
            const ratio = j / len;

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${ratio * fiber.opacity})`;
            ctx.lineWidth = ratio * fiber.lineWidth;
            ctx.lineCap = 'round';
            ctx.stroke();
          }
        }

        // Draw glowing head point
        ctx.beginPath();
        ctx.arc(fiber.x, fiber.y, fiber.lineWidth * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1.0, fiber.opacity * 3.5)})`;
        ctx.fill();

        // Respawn if went out of bounds
        const margin = 50;
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

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
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

// SVG Icons
const CodeLogoIcon = ({ size = 24, strokeWidth = 2, style = {} }: { size?: number; strokeWidth?: number; style?: React.CSSProperties }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="var(--primary)" 
    strokeWidth={strokeWidth} 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    style={style}
  >
    <polyline points="16 18 22 12 16 6"></polyline>
    <polyline points="8 6 2 12 8 18"></polyline>
    <line x1="14" y1="4" x2="10" y2="20"></line>
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

const TerminalIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>
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
  const roles = ["Backend Intern", "Unity Developer", "Software Engineering Student", "AI & Agent Enthusiast"];
  const [roleText, setRoleText] = useState("");
  const [roleIndex, setRoleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Game Play Zone toggles
  const [activeTab, setActiveTab] = useState<'clicker' | 'unity'>('clicker');
  
  // Clicker Game State
  const [loc, setLoc] = useState(0);
  const [compiledProjects, setCompiledProjects] = useState(0);
  const [aiCopilots, setAiCopilots] = useState(0);
  const [clickPower, setClickPower] = useState(1);
  const [developerLevel, setDeveloperLevel] = useState("Junior Intern");
  const [gameLogs, setGameLogs] = useState<string[]>([
    "System initialized. Welcome to the Cyber Clicker...",
    "Objective: Compile Lines of Code (LOC) and hire AI Copilots to automate writing code."
  ]);

  const addLog = (msg: string) => {
    setGameLogs(prev => [msg, ...prev.slice(0, 7)]);
  };

  const handleCompileCode = () => {
    const locEarned = clickPower;
    setLoc(prev => prev + locEarned);
    addLog(`+${locEarned} LOC compiled successfully.`);
  };

  const handleBuyCopilot = () => {
    const cost = Math.floor(10 + Math.pow(1.5, aiCopilots) * 10);
    if (loc >= cost) {
      setLoc(prev => prev - cost);
      setAiCopilots(prev => prev + 1);
      addLog(`Hired AI Copilot! Cost: ${cost} LOC. Passive production +5 LOC/sec.`);
    } else {
      addLog(`Not enough LOC! Need ${cost} LOC to hire AI Copilot.`);
    }
  };

  // Passive production loop
  useEffect(() => {
    if (aiCopilots === 0) return;
    const interval = setInterval(() => {
      setLoc(prev => prev + aiCopilots * 5);
    }, 1000);
    return () => clearInterval(interval);
  }, [aiCopilots]);

  // Dev Level updates
  useEffect(() => {
    if (loc >= 10000) {
      setDeveloperLevel("Senior Software Architect");
      setClickPower(10);
    } else if (loc >= 2000) {
      setDeveloperLevel("Backend Developer");
      setClickPower(5);
    } else if (loc >= 200) {
      setDeveloperLevel("Advanced Intern");
      setClickPower(2);
    } else {
      setDeveloperLevel("Junior Intern");
      setClickPower(1);
    }
  }, [loc]);

  const handleManualCompileProject = () => {
    if (loc >= 100) {
      setLoc(prev => prev - 100);
      setCompiledProjects(prev => prev + 1);
      addLog("Successfully shipped a Web Monolith Project! (+1 Project)");
    } else {
      addLog("Needs at least 100 LOC to ship a project.");
    }
  };

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
            <CodeLogoIcon size={20} strokeWidth={2.5} style={{ marginRight: '8px', display: 'inline-block', verticalAlign: 'middle' }} />
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
          <CodeLogoIcon size={64} strokeWidth={1.5} style={{ marginBottom: '24px' }} />
          <span className="welcome-tag">XIN CHÀO, TÔI LÀ NGUYỄN MẠNH QUYỀN</span>
          <h1 className="name-title">
            Sinh viên <span className="highlight-coral">Backend Intern</span>,<br />
            đam mê <span className="highlight-cyan">AI & Unity</span>.
          </h1>
          <div className="role-container">
            <span className="role-text">{roleText}</span>
            <span className="typewriter-cursor"></span>
          </div>
          <p className="hero-desc">
            Sinh viên năm 3 chuyên ngành Công nghệ phần mềm tại Đại học Xây dựng Hà Nội. 
            Đam mê thiết kế hệ thống backend hiệu năng cao, tự học công nghệ mới và xây dựng giải pháp tự động hóa bằng AI.
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
          {/* Tabs header */}
          <div className="play-tabs">
            <button 
              className={`tab-btn ${activeTab === 'clicker' ? 'active' : ''}`}
              onClick={() => setActiveTab('clicker')}
            >
              <TerminalIcon /> React Cyber Clicker (Demo có sẵn)
            </button>
            <button 
              className={`tab-btn ${activeTab === 'unity' ? 'active' : ''}`}
              onClick={() => setActiveTab('unity')}
            >
              <GamepadIcon /> Game Unity WebGL (Nơi upload game)
            </button>
          </div>

          {/* Console Area */}
          <div className="console-display">
            {activeTab === 'clicker' ? (
              <div className="clicker-game-screen">
                <div className="clicker-header">
                  <div className="terminal-dots">
                    <span className="dot-red"></span>
                    <span className="dot-yellow"></span>
                    <span className="dot-green"></span>
                  </div>
                  <span className="console-title">CYBER_CODE_CLICKER.EXE</span>
                  <span className="dev-rank">Cấp độ: {developerLevel}</span>
                </div>

                <div className="clicker-stats-grid">
                  <div className="stat-box">
                    <span className="stat-label">Lines of Code (LOC)</span>
                    <span className="stat-val glow-text">{loc}</span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-label">AI Copilots</span>
                    <span className="stat-val">{aiCopilots}</span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-label">Code / Click</span>
                    <span className="stat-val">{clickPower} LOC</span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-label">Shipped Projects</span>
                    <span className="stat-val glow-text-primary">{compiledProjects}</span>
                  </div>
                </div>

                <div className="clicker-actions">
                  <button className="btn-primary click-btn" onClick={handleCompileCode}>
                    💻 COMPILE LINES OF CODE
                  </button>
                  <button className="btn-secondary" onClick={handleBuyCopilot}>
                    🤖 Thuê AI Copilot (Giá: {Math.floor(10 + Math.pow(1.5, aiCopilots) * 10)} LOC)
                  </button>
                  <button className="btn-secondary" onClick={handleManualCompileProject}>
                    🚀 Gửi Dự Án (Giá: 100 LOC)
                  </button>
                </div>

                <div className="clicker-terminal">
                  <div className="terminal-header">Nhật ký Biên dịch (Console Logs):</div>
                  <div className="terminal-body">
                    {gameLogs.map((log, index) => (
                      <div key={index} className="log-line">
                        <span className="log-prefix">&gt;</span> {log}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
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
                      
                      <div className="instructions-card">
                        <h4>Hướng dẫn tải game lên dành cho Bạn:</h4>
                        <ol>
                          <li>Build game Unity dưới dạng <strong>WebGL</strong>.</li>
                          <li>Tạo một thư mục trong project tại đường dẫn: <code>public/unity-games/</code>.</li>
                          <li>Copy toàn bộ file build (bao gồm file <code>index.html</code> và các thư mục <code>Build</code>, <code>TemplateData</code>) vào thư mục đó.</li>
                          <li>File game sẽ tự động được hiển thị tại khung này mà không cần build lại code website!</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
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
