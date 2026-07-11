'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/* ── Three.js: Morphing Geometry + Particles ── */
function HeroGeometry() {
  const mesh = useRef<THREE.Mesh>(null!)
  const wireframe = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (mesh.current) {
      mesh.current.rotation.x = t * 0.15
      mesh.current.rotation.y = t * 0.2
      mesh.current.scale.setScalar(1 + Math.sin(t * 0.5) * 0.08)
    }
    if (wireframe.current) {
      wireframe.current.rotation.x = t * 0.15
      wireframe.current.rotation.y = t * 0.2
      wireframe.current.scale.setScalar(1.02 + Math.sin(t * 0.5) * 0.08)
    }
  })

  return (
    <group position={[0, 0, 0]}>
      <mesh ref={mesh}>
        <torusKnotGeometry args={[1.2, 0.4, 128, 32]} />
        <meshStandardMaterial
          color="#5e6ad2"
          transparent
          opacity={0.15}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>
      <mesh ref={wireframe}>
        <torusKnotGeometry args={[1.2, 0.4, 32, 8]} />
        <meshBasicMaterial
          color="#7170ff"
          wireframe
          transparent
          opacity={0.25}
        />
      </mesh>
    </group>
  )
}

function FloatingParticles() {
  const mesh = useRef<THREE.InstancedMesh>(null!)
  const count = 120

  useEffect(() => {
    const dummy = new THREE.Object3D()
    for (let i = 0; i < count; i++) {
      dummy.position.set(
        (Math.random() - 0.5) * 25,
        (Math.random() - 0.5) * 25,
        (Math.random() - 0.5) * 15
      )
      dummy.scale.setScalar(Math.random() * 0.02 + 0.005)
      dummy.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.matrix)
    }
    mesh.current.instanceMatrix.needsUpdate = true
  }, [])

  useFrame((state) => {
    if (!mesh.current) return
    const dummy = new THREE.Object3D()
    const t = state.clock.elapsedTime
    for (let i = 0; i < count; i++) {
      const speed = 0.02 + (i % 5) * 0.01
      const x = Math.sin(t * speed + i * 0.7) * 3 + ((i % 12) - 6) * 3.5
      const y = Math.cos(t * speed * 0.8 + i * 0.5) * 2 + (Math.floor(i / 12) - 5) * 3
      const z = Math.sin(t * 0.03 + i * 0.3) * 3
      dummy.position.set(x, y, z)
      dummy.scale.setScalar(Math.sin(t * 0.5 + i) * 0.008 + 0.015)
      dummy.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.matrix)
    }
    mesh.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color="#5e6ad2" transparent opacity={0.4} />
    </instancedMesh>
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={0.5} color="#7170ff" />
      <pointLight position={[-5, -5, 3]} intensity={0.3} color="#5e6ad2" />
      <HeroGeometry />
      <FloatingParticles />
    </>
  )
}

/* ── Scroll Animation Hook ── */
function useScrollReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])

  return { ref, visible }
}

function RevealSection({ children, className = '', delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) {
  const { ref, visible } = useScrollReveal()
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(50px) scale(0.97)',
        transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
      }}
    >
      {children}
    </div>
  )
}

/* ── Animated Counter ── */
function AnimatedNumber({ target, suffix = '' }: { target: number, suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true) },
      { threshold: 0.5 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [started])

  useEffect(() => {
    if (!started) return
    let start = 0
    const duration = 1500
    const startTime = Date.now()
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [started, target])

  return <span ref={ref}>{count}{suffix}</span>
}

/* ── Typing Effect ── */
function TypingText({ text, delay = 0 }: { text: string, delay?: number }) {
  const [displayed, setDisplayed] = useState('')
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true) },
      { threshold: 0.5 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [started])

  useEffect(() => {
    if (!started) return
    let i = 0
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1))
        i++
      } else {
        clearInterval(timer)
      }
    }, 30)
    return () => clearInterval(timer)
  }, [started, text])

  return <span ref={ref}>{displayed}<span className="animate-pulse">|</span></span>
}

/* ── Main Page ── */
export default function Home() {
  const [scrollY, setScrollY] = useState(0)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    const handleMouse = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      })
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('mousemove', handleMouse, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', handleMouse)
    }
  }, [])

  return (
    <main className="min-h-screen">
      {/* ── Nav ── */}
      <nav className="fixed top-0 left-0 right-0 z-50" style={{
        background: 'rgba(250,250,250,0.8)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
      }}>
        <div className="max-w-[1100px] mx-auto h-16 flex items-center justify-between px-5 md:px-12">
          <span className="text-[16px] font-bold tracking-[-0.3px]">Hermes</span>
          <div className="hidden md:flex items-center gap-6">
            <a href="#demo" className="text-[14px] font-medium text-gray-500 hover:text-black transition-colors duration-200">Demo</a>
            <a href="#recursos" className="text-[14px] font-medium text-gray-500 hover:text-black transition-colors duration-200">Recursos</a>
            <a href="#preco" className="text-[14px] font-medium text-gray-500 hover:text-black transition-colors duration-200">Preco</a>
            <a href="#contato" className="text-[14px] font-semibold px-5 py-2.5 rounded-lg bg-black text-white hover:opacity-80 transition-all duration-200 hover:scale-[1.02]">Comecar</a>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Three.js Background — parallax layer 1 */}
        <div className="absolute inset-0 z-0" style={{
          transform: `translateY(${scrollY * 0.4}px) translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px)`,
          transition: 'transform 0.1s ease-out',
        }}>
          <Canvas camera={{ position: [0, 0, 6], fov: 50 }} dpr={[1, 1.5]}>
            <Suspense fallback={null}>
              <Scene />
            </Suspense>
          </Canvas>
        </div>

        {/* Gradient overlay — parallax layer 2 */}
        <div className="absolute inset-0 z-[1]" style={{
          background: 'radial-gradient(ellipse at 50% 30%, transparent 0%, rgba(250,250,250,0.4) 50%, rgba(250,250,250,1) 100%)',
          transform: `translateY(${scrollY * 0.15}px)`,
        }} />

        {/* Grid pattern — parallax layer 3 */}
        <div className="absolute inset-0 z-[2] opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          transform: `translateY(${scrollY * 0.1}px)`,
        }} />

        {/* Hero Content — parallax layer 4 */}
        <div className="relative z-10 max-w-[800px] mx-auto px-5 text-center" style={{
          transform: `translateY(${scrollY * -0.2}px)`,
        }}>
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full mb-10" style={{
            background: 'rgba(255,255,255,0.7)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.8)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
            animation: 'fadeInUp 0.6s ease-out',
          }}>
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[13px] font-medium text-gray-500">Online agora — 24/7</span>
          </div>

          <h1 className="text-[clamp(38px,7vw,68px)] font-bold leading-[1.02] tracking-[-3px] mb-7" style={{
            animation: 'fadeInUp 0.7s ease-out 0.1s both',
          }}>
            Seu assistente IA<br />
            <span className="gradient-text">trabalha por voce</span>
          </h1>

          <p className="text-[18px] md:text-[20px] text-gray-500 leading-[1.7] max-w-[540px] mx-auto mb-11" style={{
            animation: 'fadeInUp 0.7s ease-out 0.2s both',
          }}>
            Um agente que <strong className="text-gray-700">tem o computador dele</strong>, conecta com suas ferramentas e <strong className="text-gray-700">executa tarefas reais</strong> pelo Telegram.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap" style={{
            animation: 'fadeInUp 0.7s ease-out 0.3s both',
          }}>
            <a href="#contato" className="group px-7 py-3.5 rounded-xl bg-black text-white text-[15px] font-semibold hover:opacity-85 transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-black/10">
              Quero meu Hermes →
            </a>
            <a href="#demo" className="px-7 py-3.5 rounded-xl text-[15px] font-medium text-gray-600 hover:text-black transition-all duration-300 hover:scale-[1.02]" style={{
              background: 'rgba(255,255,255,0.6)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(0,0,0,0.08)',
            }}>
              Ver como funciona
            </a>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 z-[3] bg-gradient-to-t from-[#fafafa] to-transparent" />
      </section>

      {/* ── Social Proof ── */}
      <RevealSection>
        <section className="max-w-[1100px] mx-auto px-5 md:px-12 py-10">
          <p className="text-[12px] text-gray-400 uppercase tracking-[0.15em] mb-5 font-medium">Ja esta rodando</p>
          <div className="flex gap-16 flex-wrap">
            <div className="text-[15px] text-gray-500"><strong className="text-black font-bold text-[20px]"><AnimatedNumber target={3} /></strong> empresas usando</div>
            <div className="text-[15px] text-gray-500"><strong className="text-black font-bold text-[20px]"><AnimatedNumber target={2400} suffix="+" /></strong> mensagens processadas</div>
            <div className="text-[15px] text-gray-500"><strong className="text-black font-bold text-[20px]"><AnimatedNumber target={98} suffix="%" /></strong> taxa de resolucao</div>
          </div>
        </section>
      </RevealSection>

      {/* ── Demo: Telegram Mockup ── */}
      <section id="demo" className="max-w-[1100px] mx-auto px-5 md:px-12 py-28">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <RevealSection>
            <div>
              <div className="inline-block px-3 py-1 rounded-full bg-brand/10 text-brand text-[12px] font-semibold mb-4 uppercase tracking-wider">Demo ao vivo</div>
              <h2 className="text-[clamp(26px,4vw,40px)] font-bold tracking-[-1.5px] mb-5 leading-tight">
                Voce pede,<br/>ele faz.
              </h2>
              <p className="text-[17px] text-gray-500 leading-[1.7] mb-7">
                Nao e so um chatbot que responde. O Hermes <strong className="text-gray-700">executa</strong>. Manda email, agenda reuniao, gerencia WhatsApp, busca informacao. Tudo pelo Telegram.
              </p>
              <ul className="space-y-3.5">
                {['WhatsApp automatizado', 'Email inteligente', 'Calendario e lembretes', 'Pesquisa na web', 'Organizacao de dados', 'Trabalha 24/7'].map((item, i) => (
                  <li key={item} className="flex items-center gap-3 text-[15px] text-gray-600">
                    <span className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 text-[12px] font-bold flex-shrink-0">✓</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </RevealSection>

          <RevealSection delay={0.15}>
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute -inset-4 bg-gradient-to-br from-brand/20 to-accent/10 rounded-[24px] blur-2xl opacity-50" />
              <div className="relative rounded-[16px] overflow-hidden" style={{
                background: 'rgba(255,255,255,0.8)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(255,255,255,0.9)',
                boxShadow: '0 24px 48px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.02)',
              }}>
                {/* Telegram Header */}
                <div className="px-5 py-3.5 flex items-center gap-3.5" style={{ background: 'rgba(240,240,240,0.8)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-brand to-accent flex items-center justify-center text-white font-bold text-[17px] shadow-sm">H</div>
                  <div>
                    <div className="text-[15px] font-semibold">Hermes</div>
                    <div className="text-[12px] text-green-500 font-medium">online agora</div>
                  </div>
                </div>
                {/* Messages */}
                <div className="p-5 space-y-3.5 min-h-[340px]" style={{ background: 'rgba(255,255,255,0.5)' }}>
                  <div className="tg-msg tg-user">Manda um resumo dos meus emails de hoje</div>
                  <div className="tg-msg tg-bot">
                    <strong>Resumo do dia:</strong><br/>
                    • Pedro (Nubank) — proposta pendente<br/>
                    • Maria (Agencia) — reuniao amanha 14h<br/>
                    • 2 spam ignorados<br/><br/>
                    Quer que eu responda o Pedro?
                  </div>
                  <div className="tg-msg tg-user">Sim, manda que vou aceitar</div>
                  <div className="tg-msg tg-bot">
                    ✓ Email enviado pro Pedro.<br/>
                    ✓ Lembrete criado: reuniao amanha 14h
                  </div>
                </div>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="recursos" className="py-28" style={{ background: 'linear-gradient(180deg, #f5f5f5 0%, #fafafa 100%)' }}>
        <div className="max-w-[1100px] mx-auto px-5 md:px-12">
          <RevealSection>
            <div className="mb-14">
              <div className="inline-block px-3 py-1 rounded-full bg-brand/10 text-brand text-[12px] font-semibold mb-4 uppercase tracking-wider">Recursos</div>
              <h2 className="text-[clamp(26px,4vw,40px)] font-bold tracking-[-1.5px] mb-3">O que o Hermes faz</h2>
              <p className="text-[17px] text-gray-500">Um assistente que realmente executa tarefas.</p>
            </div>
          </RevealSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon: '💬', title: 'WhatsApp automatico', desc: 'Responde clientes, faz follow-up e fecha vendas 24/7.' },
              { icon: '📧', title: 'Email inteligente', desc: 'Le, resume e responde emails importantes automaticamente.' },
              { icon: '📅', title: 'Calendario', desc: 'Agenda reunioes, envia lembretes e gerencia seu tempo.' },
              { icon: '🔍', title: 'Pesquisa', desc: 'Busca informacoes na web e traz resumo pra voce.' },
              { icon: '📊', title: 'Dados e organizacao', desc: 'Cria planilhas, databases e organiza informacoes.' },
              { icon: '🤖', title: '24/7 ativo', desc: 'Monitora, avisa e executa sem parar, sem reclamar.' },
            ].map((f, i) => (
              <RevealSection key={f.title} delay={i * 0.08}>
                <div className="group p-7 rounded-[16px] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/[0.04]" style={{
                  background: 'rgba(255,255,255,0.7)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255,255,255,0.8)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                }}>
                  <div className="w-13 h-13 rounded-[12px] flex items-center justify-center text-[24px] mb-5 transition-transform duration-300 group-hover:scale-110" style={{
                    background: 'rgba(94,106,210,0.08)',
                  }}>{f.icon}</div>
                  <h3 className="text-[17px] font-semibold mb-2.5">{f.title}</h3>
                  <p className="text-[14px] text-gray-500 leading-[1.65]">{f.desc}</p>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── Comparison ── */}
      <section className="py-28" style={{ background: 'linear-gradient(180deg, #f5f5f5 0%, #fafafa 100%)' }}>
        <div className="max-w-[1100px] mx-auto px-5 md:px-12">
          <RevealSection>
            <div className="mb-12">
              <h2 className="text-[clamp(26px,4vw,40px)] font-bold tracking-[-1.5px] mb-3">ChatGPT so responde.<br/><span className="gradient-text">Hermes executa.</span></h2>
            </div>
          </RevealSection>

          <RevealSection delay={0.1}>
            <div className="rounded-[16px] overflow-hidden" style={{
              background: 'rgba(255,255,255,0.7)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.8)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.04)',
            }}>
              <table className="w-full text-[14px]">
                <thead>
                  <tr style={{ borderBottom: '2px solid rgba(0,0,0,0.06)' }}>
                    <th className="text-left p-5 font-semibold text-gray-700">Funcionalidade</th>
                    <th className="text-center p-5 font-semibold text-gray-400 w-[150px]">ChatGPT / Copilot</th>
                    <th className="text-center p-5 font-semibold w-[150px]">
                      <span className="gradient-text">Hermes</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Responde perguntas', true, true],
                    ['Gerencia WhatsApp', false, true],
                    ['Le e responde emails', false, true],
                    ['Agenda reunioes', false, true],
                    ['Executa tarefas reais', false, true],
                    ['Mensalidade', 'R$100+/mes', 'R$0'],
                    ['Privacidade', 'Dados na nuvem', 'Servidor proprio'],
                  ].map(([label, chatgpt, hermes], i) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                      <td className="p-5 text-gray-600 font-medium">{label}</td>
                      <td className="p-5 text-center">
                        {typeof chatgpt === 'boolean' ? (
                          <span className={chatgpt ? 'text-green-500 font-semibold' : 'text-red-400 font-semibold'}>{chatgpt ? '✓' : '✗'}</span>
                        ) : (
                          <span className="text-gray-400 font-medium">{chatgpt}</span>
                        )}
                      </td>
                      <td className="p-5 text-center">
                        {typeof hermes === 'boolean' ? (
                          <span className="text-green-500 font-semibold">{hermes ? '✓' : '✗'}</span>
                        ) : (
                          <span className="text-green-500 font-bold">{hermes}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="preco" className="py-28">
        <div className="max-w-[1100px] mx-auto px-5 md:px-12">
          <RevealSection>
            <div className="mb-14 text-center">
              <div className="inline-block px-3 py-1 rounded-full bg-brand/10 text-brand text-[12px] font-semibold mb-4 uppercase tracking-wider">Preco</div>
              <h2 className="text-[clamp(26px,4vw,40px)] font-bold tracking-[-1.5px] mb-3">Setup one-time. Assistente pra sempre.</h2>
              <p className="text-[17px] text-gray-500">Paga uma vez, usa pra sempre. Sem mensalidade.</p>
            </div>
          </RevealSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { name: 'Basico', price: 'R$500', desc: 'Pra quem quer testar', features: ['Instalacao completa', '3 integracoes', 'Suporte 7 dias'], cta: 'Comecar', featured: false },
              { name: 'Profissional', price: 'R$2.000', desc: 'Pra quem quer resultados', features: ['Integracoes ilimitadas', 'Suporte 30 dias', 'WhatsApp automatizado', 'Automacoes sob medida'], cta: 'Melhor custo-beneficio', featured: true },
              { name: 'Empresa', price: 'R$5.000', desc: 'Pra equipes', features: ['Multi-usuario', 'Integracoes ilimitadas', 'Suporte prioritario', 'Treinamento'], cta: 'Falar com vendas', featured: false },
            ].map((p, i) => (
              <RevealSection key={p.name} delay={i * 0.1}>
                <div className={`relative p-9 flex flex-col rounded-[16px] transition-all duration-300 hover:-translate-y-1 ${p.featured ? 'ring-2 ring-brand shadow-xl shadow-brand/10' : ''}`} style={{
                  background: p.featured ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.6)',
                  backdropFilter: 'blur(16px)',
                  border: p.featured ? 'none' : '1px solid rgba(255,255,255,0.8)',
                  boxShadow: p.featured ? undefined : '0 4px 16px rgba(0,0,0,0.03)',
                }}>
                  {p.featured && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-brand text-white text-[11px] font-bold uppercase tracking-wider">Mais popular</div>}
                  <h3 className="text-[17px] font-semibold mb-1">{p.name}</h3>
                  <p className="text-[13px] text-gray-400 mb-6">{p.desc}</p>
                  <div className="text-[42px] font-bold tracking-[-2px] mb-1">{p.price} <span className="text-[14px] font-normal text-gray-400 tracking-normal">one-time</span></div>
                  <ul className="space-y-2.5 my-7 flex-1">
                    {p.features.map((f) => (
                      <li key={f} className="text-[14px] text-gray-600 flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 text-[11px] font-bold flex-shrink-0">✓</span> {f}
                      </li>
                    ))}
                  </ul>
                  <a href="#contato" className={`block text-center py-3.5 rounded-xl text-[15px] font-semibold transition-all duration-300 hover:scale-[1.02] ${p.featured ? 'bg-black text-white hover:opacity-85' : 'text-gray-700 hover:text-black'}`} style={!p.featured ? { background: 'rgba(0,0,0,0.04)' } : {}}>
                    {p.cta}
                  </a>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section id="contato" className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(94,106,210,0.15) 0%, transparent 70%)',
        }} />
        <div className="relative max-w-[600px] mx-auto px-5 text-center">
          <RevealSection>
            <h2 className="text-[clamp(26px,5vw,44px)] font-bold tracking-[-1.5px] mb-5 leading-tight">
              Seu assistente IA<br/><span className="gradient-text">trabalhando por voce</span>
            </h2>
            <p className="text-[17px] text-gray-500 mb-10 leading-relaxed">
              Em 24 horas voce ja ta com o Hermes no seu Telegram, trabalhando.
            </p>
            <a href="https://instagram.com/jazzautomations" target="_blank" rel="noopener" className="inline-block px-9 py-4 rounded-xl bg-black text-white text-[16px] font-semibold hover:opacity-85 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-black/10">
              Falar no Instagram →
            </a>
          </RevealSection>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-200/60 py-7">
        <div className="max-w-[1100px] mx-auto px-5 md:px-12 flex items-center justify-between">
          <p className="text-[13px] text-gray-400">© 2026 Hermes</p>
          <a href="https://instagram.com/jazzautomations" target="_blank" rel="noopener" className="text-[13px] text-gray-400 hover:text-black transition-colors">@jazzautomations</a>
        </div>
      </footer>
    </main>
  )
}
