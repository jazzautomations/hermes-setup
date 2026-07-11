'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import {
  MessageSquare, Mail, Calendar, Search, LayoutDashboard,
  Users, Palette, Bot, Zap, Server, Lock, Wrench,
  ArrowRight, ArrowUpRight, Check, X, Terminal, Plug, GraduationCap, LifeBuoy
} from 'lucide-react'

const WA = 'https://wa.me/5511910376040?text=' +
  encodeURIComponent('Oi! Vim do site do Hermes e quero saber como funciona o setup.')

/* ── Three.js ── */
function HeroGeometry() {
  const mesh = useRef<THREE.Mesh>(null!)
  const wireframe = useRef<THREE.Mesh>(null!)
  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (mesh.current) { mesh.current.rotation.x = t * 0.15; mesh.current.rotation.y = t * 0.2; mesh.current.scale.setScalar(1 + Math.sin(t * 0.5) * 0.08) }
    if (wireframe.current) { wireframe.current.rotation.x = t * 0.15; wireframe.current.rotation.y = t * 0.2; wireframe.current.scale.setScalar(1.02 + Math.sin(t * 0.5) * 0.08) }
  })
  return (
    <group>
      <mesh ref={mesh}><torusKnotGeometry args={[1.2, 0.4, 128, 32]} /><meshStandardMaterial color="#5e6ad2" transparent opacity={0.14} roughness={0.15} metalness={0.85} /></mesh>
      <mesh ref={wireframe}><torusKnotGeometry args={[1.2, 0.4, 32, 8]} /><meshBasicMaterial color="#d97757" wireframe transparent opacity={0.28} /></mesh>
    </group>
  )
}
function FloatingParticles() {
  const mesh = useRef<THREE.InstancedMesh>(null!)
  const count = 120
  useEffect(() => {
    const d = new THREE.Object3D()
    for (let i = 0; i < count; i++) { d.position.set((Math.random()-0.5)*25,(Math.random()-0.5)*25,(Math.random()-0.5)*15); d.scale.setScalar(Math.random()*0.02+0.005); d.updateMatrix(); mesh.current.setMatrixAt(i,d.matrix) }
    mesh.current.instanceMatrix.needsUpdate = true
  }, [])
  useFrame((state) => {
    if (!mesh.current) return; const d = new THREE.Object3D(); const t = state.clock.elapsedTime
    for (let i = 0; i < count; i++) { const s=0.02+(i%5)*0.01; d.position.set(Math.sin(t*s+i*0.7)*3+((i%12)-6)*3.5, Math.cos(t*s*0.8+i*0.5)*2+(Math.floor(i/12)-5)*3, Math.sin(t*0.03+i*0.3)*3); d.scale.setScalar(Math.sin(t*0.5+i)*0.008+0.015); d.updateMatrix(); mesh.current.setMatrixAt(i,d.matrix) }
    mesh.current.instanceMatrix.needsUpdate = true
  })
  return <instancedMesh ref={mesh} args={[undefined,undefined,count]}><sphereGeometry args={[1,6,6]} /><meshBasicMaterial color="#5e6ad2" transparent opacity={0.35} /></instancedMesh>
}
function Scene() { return <><ambientLight intensity={0.35} /><pointLight position={[5,5,5]} intensity={0.6} color="#d97757" /><pointLight position={[-5,-5,3]} intensity={0.3} color="#5e6ad2" /><HeroGeometry /><FloatingParticles /></> }

/* ── Hooks ── */
function useReveal(threshold=0.12) {
  const ref = useRef<HTMLDivElement>(null); const [v, setV] = useState(false)
  useEffect(() => {
    const e = ref.current; if (!e) return
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true) }, { threshold })
    o.observe(e); return () => o.disconnect()
  }, [threshold])
  return { ref, visible: v }
}
function Reveal({ children, className='', delay=0, y=32 }:{ children: React.ReactNode; className?: string; delay?: number; y?: number }) {
  const { ref, visible } = useReveal()
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : `translateY(${y}px)`,
        transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  )
}

/* ═══ PAGE ═══ */
export default function Home() {
  const [scrollY, setScrollY] = useState(0)
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  useEffect(() => {
    const hs = () => setScrollY(window.scrollY)
    const hm = (e: MouseEvent) => setMouse({ x: (e.clientX/window.innerWidth-0.5)*20, y: (e.clientY/window.innerHeight-0.5)*20 })
    window.addEventListener('scroll', hs, { passive: true })
    window.addEventListener('mousemove', hm, { passive: true })
    return () => { window.removeEventListener('scroll', hs); window.removeEventListener('mousemove', hm) }
  }, [])

  return (
    <main className="min-h-screen">

      {/* ═══ NAV (assimétrica, sem border, single CTA) ═══ */}
      <nav className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
        <div className="max-w-[1180px] mx-auto flex items-center justify-between px-5 md:px-10 py-5">
          <a href="#" className="pointer-events-auto flex items-center gap-2.5 pl-1.5 pr-4 py-1.5 rounded-full"
             style={{
               background: 'rgba(247,245,240,0.85)',
               backdropFilter: 'blur(16px) saturate(180%)',
               WebkitBackdropFilter: 'blur(16px) saturate(180%)',
               border: '1px solid rgba(13,13,15,0.08)',
               boxShadow: '0 6px 20px rgba(13,13,15,0.06)',
             }}>
            <span className="w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold text-[var(--paper)]"
                  style={{ background: 'var(--ink)' }}>H</span>
            <span className="hidden sm:inline text-[13.5px] font-semibold tracking-[-0.2px]" style={{ whiteSpace: 'nowrap' }}>
              Hermes <span className="font-normal text-[var(--ink-mute)]">· assistente pessoal</span>
            </span>
          </a>

          <a href={WA} target="_blank" rel="noopener"
             className="pointer-events-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-[13px] font-semibold"
             style={{
               background: 'rgba(247,245,240,0.85)',
               backdropFilter: 'blur(16px) saturate(180%)',
               WebkitBackdropFilter: 'blur(16px) saturate(180%)',
               border: '1px solid rgba(13,13,15,0.08)',
               boxShadow: '0 6px 20px rgba(13,13,15,0.06)',
               whiteSpace: 'nowrap',
             }}>
            <span className="ember" />
            Falar no WhatsApp
          </a>
        </div>
      </nav>

      {/* ═══ HERO (assimétrico, não 100vh centralizado) ═══ */}
      <section className="relative overflow-hidden pt-32 md:pt-40 pb-24 md:pb-32">
        <div className="absolute inset-0 z-0"
             style={{
               transform: `translateY(${scrollY*0.4}px) translate(${mouse.x*0.5}px,${mouse.y*0.5}px)`,
               transition: 'transform 0.1s ease-out',
             }}>
          <Canvas camera={{ position: [0,0,6], fov: 50 }} dpr={[1,1.5]}>
            <Suspense fallback={null}><Scene /></Suspense>
          </Canvas>
        </div>
        <div className="absolute inset-0 z-[1]"
             style={{ background: 'radial-gradient(ellipse at 65% 40%, transparent 0%, rgba(247,245,240,0.55) 55%, rgba(247,245,240,0.98) 100%)' }} />
        <div className="absolute inset-0 z-[2] opacity-[0.035] pointer-events-none"
             style={{
               backgroundImage: 'linear-gradient(rgba(13,13,15,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(13,13,15,0.6) 1px, transparent 1px)',
               backgroundSize: '64px 64px',
             }} />

        <div className="relative z-10 max-w-[1180px] mx-auto px-5 md:px-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
          <div className="md:col-span-8" style={{ transform: `translateY(${scrollY*-0.12}px)` }}>
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full mb-8"
                 style={{
                   background: 'rgba(255,253,248,0.75)',
                   backdropFilter: 'blur(16px)',
                   border: '1px solid rgba(13,13,15,0.08)',
                   animation: 'fadeInUp 0.6s ease-out',
                 }}>
              <span className="ember" />
              <span className="text-[12px] font-medium text-[var(--ink-soft)]">
                Rodando 24/7 no seu servidor — não no meu, não no da OpenAI
              </span>
            </div>

            <h1 className="text-[clamp(40px,7.2vw,74px)] font-bold leading-[1.02] tracking-[-2.5px] mb-7"
                style={{ animation: 'fadeInUp 0.7s ease-out 0.1s both', maxWidth: '18ch' }}>
              Um assistente pessoal <span className="display-it text-[var(--hot)]" style={{fontWeight:400, letterSpacing:'-0.5px'}}>de verdade</span>,
              instalado no seu servidor e treinado no seu negócio.
            </h1>

            <p className="text-[17px] md:text-[19px] text-[var(--ink-mute)] leading-[1.65] max-w-[620px] mb-10"
               style={{ animation: 'fadeInUp 0.7s ease-out 0.2s both' }}>
              O Hermes vive no seu <strong className="text-[var(--ink-soft)]">Telegram</strong>.
              Você fala como fala com um sócio — <em className="display-it">&ldquo;puxa a agenda dessa semana&rdquo;</em>,
              <em className="display-it"> &ldquo;responde essa cliente&rdquo;</em>,
              <em className="display-it"> &ldquo;monta um CRM pros leads do Instagram&rdquo;</em> —
              e ele executa. <strong className="text-[var(--ink-soft)]">Eu instalo, configuro e treino tudo pra você em 24 horas.</strong>
              Zero conhecimento técnico da sua parte.
            </p>

            <div className="flex items-center gap-4 flex-wrap"
                 style={{ animation: 'fadeInUp 0.7s ease-out 0.3s both' }}>
              <a href={WA} target="_blank" rel="noopener"
                 className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-[15px] font-semibold text-[var(--paper)] hover:opacity-90 transition-opacity"
                 style={{ background: 'var(--ink)', boxShadow: '0 8px 24px rgba(13,13,15,0.14)', whiteSpace: 'nowrap' }}>
                Quero meu Hermes <ArrowRight size={16} />
              </a>
              <a href="#o-que-e"
                 className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-[15px] font-medium text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors"
                 style={{
                   background: 'rgba(255,253,248,0.6)',
                   backdropFilter: 'blur(12px)',
                   border: '1px solid rgba(13,13,15,0.08)',
                   whiteSpace: 'nowrap',
                 }}>
                Entender melhor <ArrowUpRight size={15} />
              </a>
            </div>
          </div>

          <div className="hidden md:block md:col-span-4 relative">
            <div className="flex flex-col gap-3 text-[12px] text-[var(--ink-mute)] pl-6 border-l"
                 style={{ borderColor: 'rgba(13,13,15,0.1)', animation: 'fadeInUp 0.9s ease-out 0.4s both' }}>
              <div className="flex items-center gap-2"><Server size={12} className="text-[var(--hot)]" /> Motor: OpenClaw open-source</div>
              <div className="flex items-center gap-2"><MessageSquare size={12} className="text-[var(--hot)]" /> Interface: Telegram</div>
              <div className="flex items-center gap-2"><Lock size={12} className="text-[var(--hot)]" /> Dados: só seus, no seu servidor</div>
              <div className="flex items-center gap-2"><Wrench size={12} className="text-[var(--hot)]" /> Setup: eu faço tudo em 24h</div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ O QUE É (nova seção — explicando o Hermes) ═══ */}
      <section id="o-que-e" className="py-24 md:py-32 relative">
        <div className="max-w-[1180px] mx-auto px-5 md:px-10 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
          <Reveal className="md:col-span-5">
            <div className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--ink-mute)] mb-5">
              O que é o Hermes
            </div>
            <h2 className="text-[clamp(28px,4.2vw,44px)] font-bold tracking-[-1.4px] leading-[1.05] mb-6">
              Não é um chatbot.
              <br />
              <span className="display-it text-[var(--hot)]" style={{fontWeight:400}}>É um funcionário digital</span>
              <br />
              que mora com você.
            </h2>
            <p className="text-[16px] text-[var(--ink-mute)] leading-[1.7]">
              O Hermes é um agente autônomo. Ele lê, escreve, pesquisa, executa comandos,
              controla suas ferramentas, cria arquivos, monta dashboards, responde WhatsApp,
              limpa e-mail — tudo sob demanda, tudo no Telegram.
            </p>
          </Reveal>

          <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: Bot,          title: 'Autônomo',     body: 'Você dá o objetivo. Ele decide as etapas, chama as ferramentas, corrige, tenta de novo — como um humano competente.' },
              { icon: Terminal,     title: 'Executor real', body: 'Não só responde: escreve código, salva arquivo, dispara requisição, faz agendamento. Ação, não conselho.' },
              { icon: MessageSquare, title: 'Via Telegram',  body: 'Aplicativo que você já tem. Texto, áudio, foto, PDF — ele entende tudo. Sem app novo, sem painel.' },
              { icon: Server,       title: 'Seu servidor',   body: 'Roda no seu Zo Computer ou VPS. Seus dados não passam pela minha mão. Você é dono do ambiente inteiro.' },
            ].map((f, i) => (
              <Reveal key={f.title} delay={i * 0.06}>
                <div className="p-6 rounded-[14px] h-full"
                     style={{
                       background: 'rgba(255,253,248,0.6)',
                       border: '1px solid rgba(13,13,15,0.06)',
                       backdropFilter: 'blur(12px)',
                     }}>
                  <f.icon size={22} className="text-[var(--hot)] mb-4" />
                  <h3 className="text-[16px] font-semibold mb-2">{f.title}</h3>
                  <p className="text-[13.5px] text-[var(--ink-mute)] leading-[1.65]">{f.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ OPENCLAW (o motor por baixo) ═══ */}
      <section className="py-24 md:py-32 relative overflow-hidden"
               style={{ background: 'linear-gradient(180deg, var(--paper-warm) 0%, var(--paper) 100%)' }}>
        <div className="max-w-[1180px] mx-auto px-5 md:px-10 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14 items-start">
          <Reveal className="md:col-span-6">
            <div className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--ink-mute)] mb-5">
              O motor: OpenClaw <span className="text-[var(--hot)]">🦞</span>
            </div>
            <h2 className="text-[clamp(28px,4.2vw,44px)] font-bold tracking-[-1.4px] leading-[1.05] mb-6">
              Por baixo do Hermes tem
              <br />
              <span className="mark-under">um framework open-source</span>
              <br />
              chamado <span className="display-it">OpenClaw</span>.
            </h2>
            <p className="text-[16px] text-[var(--ink-mute)] leading-[1.7] mb-6">
              O OpenClaw é o &ldquo;jeito lagosta&rdquo; de fazer assistente pessoal:
              modular, portátil, roda em qualquer sistema, encima de qualquer modelo
              (Claude, GPT, Gemini, Grok, DeepSeek). Ele traz as garras — tools,
              memória persistente, skills, planejamento de multi-passos, execução
              de código. Sem depender de uma única empresa.
            </p>
            <p className="text-[15px] text-[var(--ink-mute)] leading-[1.7]">
              O <strong className="text-[var(--ink-soft)]">Hermes</strong> é a personalidade,
              o conjunto de skills e as integrações que eu monto <em>em cima</em> desse motor —
              afinado no jeito que você fala, nas ferramentas que você usa, no fluxo do seu negócio.
            </p>

            <div className="mt-8 flex items-center gap-6 flex-wrap text-[13px] text-[var(--ink-mute)]">
              <div className="flex items-center gap-2"><Check size={14} className="text-[var(--green)]" /> Open source auditável</div>
              <div className="flex items-center gap-2"><Check size={14} className="text-[var(--green)]" /> Trocar de modelo sem quebrar nada</div>
              <div className="flex items-center gap-2"><Check size={14} className="text-[var(--green)]" /> Sem lock-in de plataforma</div>
            </div>
          </Reveal>

          <Reveal className="md:col-span-6" delay={0.15}>
            <div className="term p-5 md:p-6 relative overflow-hidden"
                 style={{ boxShadow: '0 24px 48px rgba(13,13,15,0.18)', overflowWrap: 'anywhere' }}>
              <div className="flex items-center gap-2 mb-4 opacity-60">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]"></span>
                <span className="ml-3 text-[11px]">hermes@seu-servidor</span>
              </div>
              <div style={{ whiteSpace: 'pre-wrap' }}>
                <span className="text-[#a3a09a]">$</span> <span className="text-[#e8b46b]">openclaw</span> init hermes<br />
                <span className="opacity-60">→ instalando core.........</span> <span className="text-[#7fc4a6]">ok</span><br />
                <span className="opacity-60">→ carregando skills:</span><br />
                <span className="opacity-60">  · whatsapp   · email     · calendar</span><br />
                <span className="opacity-60">  · crm        · dashboards · search</span><br />
                <span className="opacity-60">  · subagentes · memory    · code-exec</span><br />
                <span className="opacity-60">→ treinando no seu tom....</span> <span className="text-[#7fc4a6]">ok</span><br />
                <span className="opacity-60">→ conectando ao Telegram..</span> <span className="text-[#7fc4a6]">ok</span><br />
                <br />
                <span className="text-[#e8b46b]">hermes de pé.</span> <span className="opacity-60">manda oi no bot.</span><br />
                <span className="text-[#a3a09a]">$</span> <span className="animate-pulse">▊</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ O QUE EU INSTALO E CONFIGURO (a "brisa") ═══ */}
      <section className="py-24 md:py-32 relative">
        <div className="max-w-[1180px] mx-auto px-5 md:px-10">
          <Reveal>
            <div className="max-w-[720px] mb-14">
              <div className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--ink-mute)] mb-5">
                O serviço
              </div>
              <h2 className="text-[clamp(28px,4.2vw,44px)] font-bold tracking-[-1.4px] leading-[1.05] mb-6">
                Você não instala nada.
                <br />
                <span className="display-it text-[var(--hot)]">Eu monto a brisa inteira</span> pra você.
              </h2>
              <p className="text-[17px] text-[var(--ink-mute)] leading-[1.7]">
                A maior parte das ferramentas de AI hoje te vende acesso e te larga.
                Aqui é o oposto. Você me manda uma mensagem, eu levanto o servidor,
                instalo o OpenClaw, configuro o Hermes, plugo as suas integrações,
                treino nos seus dados e te entrego pronto no Telegram.
                <strong className="text-[var(--ink-soft)]"> Você só usa.</strong>
              </p>
            </div>
          </Reveal>

          {/* Layout assimétrico: 1 card grande + 2 pequenos + 1 grande — quebra o grid 3-uniforme */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 md:gap-5">

            <Reveal className="md:col-span-4">
              <div className="p-8 md:p-10 rounded-[18px] h-full flex flex-col"
                   style={{
                     background: 'var(--ink)',
                     color: 'var(--paper)',
                     boxShadow: '0 20px 40px rgba(13,13,15,0.14)',
                   }}>
                <Server size={26} className="text-[var(--hot)] mb-6" />
                <h3 className="text-[22px] font-semibold mb-3 tracking-[-0.5px]">
                  Servidor + OpenClaw + Hermes de pé
                </h3>
                <p className="text-[14.5px] leading-[1.7] opacity-75 max-w-[54ch]">
                  Levanto seu servidor (Zo Computer ou VPS), instalo o OpenClaw, subo o Hermes
                  como serviço supervisionado, conecto ao Telegram, configuro logs, backup e
                  restart automático. Você recebe a conta pronta com seu bot ativo.
                </p>
                <div className="mt-6 flex flex-wrap gap-2 text-[11.5px] opacity-70">
                  <span className="px-2.5 py-1 rounded-md" style={{ background: 'rgba(255,253,248,0.08)' }}>zo computer</span>
                  <span className="px-2.5 py-1 rounded-md" style={{ background: 'rgba(255,253,248,0.08)' }}>vps linux</span>
                  <span className="px-2.5 py-1 rounded-md" style={{ background: 'rgba(255,253,248,0.08)' }}>supervisord</span>
                  <span className="px-2.5 py-1 rounded-md" style={{ background: 'rgba(255,253,248,0.08)' }}>telegram bot API</span>
                </div>
              </div>
            </Reveal>

            <Reveal className="md:col-span-2" delay={0.08}>
              <div className="p-7 rounded-[18px] h-full glass-card">
                <Plug size={22} className="text-[var(--hot)] mb-4" />
                <h3 className="text-[17px] font-semibold mb-2">Integrações plugadas</h3>
                <p className="text-[13.5px] text-[var(--ink-mute)] leading-[1.65]">
                  WhatsApp (Evolution API), Gmail, Google Calendar, Drive, Notion, Airtable,
                  Stripe — o que você usa, eu conecto e testo.
                </p>
              </div>
            </Reveal>

            <Reveal className="md:col-span-2" delay={0.14}>
              <div className="p-7 rounded-[18px] h-full glass-card">
                <Users size={22} className="text-[var(--hot)] mb-4" />
                <h3 className="text-[17px] font-semibold mb-2">CRM montado do zero</h3>
                <p className="text-[13.5px] text-[var(--ink-mute)] leading-[1.65]">
                  Pipeline, tags, follow-up automático, seus dados importados —
                  desenhado no fluxo do seu negócio, não num template genérico.
                </p>
              </div>
            </Reveal>

            <Reveal className="md:col-span-4" delay={0.2}>
              <div className="p-7 rounded-[18px] h-full glass-card grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <LayoutDashboard size={22} className="text-[var(--hot)] mb-4" />
                  <h3 className="text-[17px] font-semibold mb-2">Dashboards em tempo real</h3>
                  <p className="text-[13.5px] text-[var(--ink-mute)] leading-[1.65]">
                    Vendas, leads, receita, agenda — o que você olha toda manhã,
                    exibido como você quer ver.
                  </p>
                </div>
                <div>
                  <Bot size={22} className="text-[var(--hot)] mb-4" />
                  <h3 className="text-[17px] font-semibold mb-2">Sub-agentes especializados</h3>
                  <p className="text-[13.5px] text-[var(--ink-mute)] leading-[1.65]">
                    Um agente vendedor, um agente pesquisador, um agente de suporte —
                    cada um com suas skills e seu tom.
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal className="md:col-span-3" delay={0.26}>
              <div className="p-7 rounded-[18px] h-full glass-card">
                <GraduationCap size={22} className="text-[var(--hot)] mb-4" />
                <h3 className="text-[17px] font-semibold mb-2">Treinamento no seu negócio</h3>
                <p className="text-[13.5px] text-[var(--ink-mute)] leading-[1.65]">
                  Escrevo as skills, alimento a memória com seus documentos e regras,
                  te mostro por vídeo como pedir as coisas. Zero curva de aprendizado.
                </p>
              </div>
            </Reveal>

            <Reveal className="md:col-span-3" delay={0.32}>
              <div className="p-7 rounded-[18px] h-full glass-card">
                <LifeBuoy size={22} className="text-[var(--hot)] mb-4" />
                <h3 className="text-[17px] font-semibold mb-2">30 dias de suporte prioritário</h3>
                <p className="text-[13.5px] text-[var(--ink-mute)] leading-[1.65]">
                  Se algo quebrar, se você quiser ajustar comportamento, adicionar skill nova —
                  respondo no WhatsApp e resolvo. Sem fila, sem ticket.
                </p>
              </div>
            </Reveal>

          </div>
        </div>
      </section>

      {/* ═══ COMO FUNCIONA (3 passos) ═══ */}
      <section id="como-funciona" className="max-w-[1180px] mx-auto px-5 md:px-10 py-24 md:py-32">
        <Reveal>
          <div className="mb-14 max-w-[720px]">
            <div className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--ink-mute)] mb-5">
              Como funciona
            </div>
            <h2 className="text-[clamp(28px,4.2vw,44px)] font-bold tracking-[-1.4px] leading-[1.05]">
              Você me manda mensagem no WhatsApp.
              <br />
              <span className="display-it text-[var(--hot)]">Em 24h, o Hermes está no seu Telegram.</span>
            </h2>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {[
            { step: '01', title: 'Conversa inicial', desc: 'A gente conversa 20 minutos pra eu entender seu negócio, suas ferramentas, o que você quer que o Hermes faça no dia a dia. Sem lero-lero.' },
            { step: '02', title: 'Eu monto tudo',    desc: 'Levanto seu servidor, instalo o OpenClaw, configuro o Hermes, plugo suas integrações, importo seus dados e testo antes de te entregar.' },
            { step: '03', title: 'Você abre o Telegram', desc: 'Manda a primeira mensagem pro seu bot. Ele responde no seu tom, com acesso ao seu negócio. E não para mais de trabalhar por você.' },
          ].map((s, i) => (
            <Reveal key={s.step} delay={i * 0.1}>
              <div className="relative p-8 rounded-[18px] h-full glass-card">
                <div className="text-[52px] font-bold display-it text-[var(--hot)] leading-none mb-4"
                     style={{ opacity: 0.9 }}>
                  {s.step}
                </div>
                <h3 className="text-[18px] font-semibold mb-3 tracking-[-0.3px]">{s.title}</h3>
                <p className="text-[14.5px] text-[var(--ink-mute)] leading-[1.7]">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ═══ DEMO Telegram ═══ */}
      <section className="max-w-[1180px] mx-auto px-5 md:px-10 py-24 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-center">
          <Reveal className="md:col-span-5">
            <div className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--ink-mute)] mb-5">
              Como se fala com o Hermes
            </div>
            <h2 className="text-[clamp(26px,3.8vw,40px)] font-bold tracking-[-1.3px] leading-[1.08] mb-6">
              Você fala como fala
              <br />
              com um sócio.
              <br />
              <span className="display-it text-[var(--hot)]">Ele resolve.</span>
            </h2>
            <p className="text-[15.5px] text-[var(--ink-mute)] leading-[1.7] mb-6">
              Chatbot responde. O Hermes <strong className="text-[var(--ink-soft)]">executa</strong> —
              cria arquivos, dispara integração, monta estrutura, gera relatório.
              E te dá conta em segundos.
            </p>
            <ul className="space-y-2.5">
              {[
                '&ldquo;Cria um CRM com meus contatos do WhatsApp&rdquo;',
                '&ldquo;Resume os e-mails novos e me diz o que responder&rdquo;',
                '&ldquo;Automatiza follow-up dos leads do Instagram&rdquo;',
                '&ldquo;Bloqueia agenda toda quinta 14h-16h pra deep work&rdquo;',
                '&ldquo;Puxa receita do mês do Stripe e compara com mês passado&rdquo;',
              ].map((t, i) => (
                <li key={i} className="text-[14.5px] text-[var(--ink-soft)] flex items-start gap-2.5">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--hot)] flex-shrink-0"></span>
                  <span dangerouslySetInnerHTML={{ __html: t }} />
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal className="md:col-span-7" delay={0.15}>
            <div className="relative">
              <div className="absolute -inset-4 rounded-[24px] blur-2xl opacity-40 pointer-events-none"
                   style={{ background: 'radial-gradient(ellipse at 40% 40%, rgba(217,119,87,0.28), transparent 65%)' }} />
              <div className="relative rounded-[16px] overflow-hidden glass">
                <div className="px-5 py-4 flex items-center gap-3.5"
                     style={{ background: 'rgba(13,13,15,0.04)', borderBottom: '1px solid var(--line)' }}>
                  <div className="w-11 h-11 rounded-full flex items-center justify-center text-[var(--paper)] font-bold text-[17px]"
                       style={{ background: 'var(--ink)' }}>
                    H
                  </div>
                  <div>
                    <div className="text-[15px] font-semibold">Hermes</div>
                    <div className="text-[11.5px] text-[var(--hot)] font-medium flex items-center gap-1.5">
                      <span className="ember" style={{ width: 6, height: 6 }} /> trabalhando agora
                    </div>
                  </div>
                </div>
                <div className="p-5 space-y-3.5 min-h-[400px]"
                     style={{ background: 'rgba(255,253,248,0.5)' }}>
                  <div className="tg-msg tg-user">Cria um CRM pros meus 50 clientes do WhatsApp</div>
                  <div className="tg-msg tg-bot">
                    <strong>CRM criado.</strong><br /><br />
                    • <strong>50 contatos</strong> importados e organizados<br />
                    • Tags automáticas por status (ativo, pendente, inativo)<br />
                    • Pipeline de vendas com 4 etapas<br />
                    • Dashboard com métricas em tempo real<br /><br />
                    Quer que eu configure follow-up automático pra cada etapa?
                  </div>
                  <div className="tg-msg tg-user">Sim, e me manda resumo do dashboard</div>
                  <div className="tg-msg tg-bot">
                    ✓ <strong>12 leads quentes</strong> (interação nos últimos 3 dias)<br />
                    ✓ Follow-up agendado em 24h pra 8 contatos parados<br />
                    ✓ Ticket médio: <strong>R$ 850</strong><br />
                    ✓ Taxa de conversão: <strong>23%</strong> — acima da média do setor<br /><br />
                    Receita potencial do pipeline atual: <strong>R$ 42.500</strong> este mês.
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ RECURSOS (Lucide + grid variado) ═══ */}
      <section id="recursos" className="py-24 md:py-32"
               style={{ background: 'linear-gradient(180deg, var(--paper-warm) 0%, var(--paper) 100%)' }}>
        <div className="max-w-[1180px] mx-auto px-5 md:px-10">
          <Reveal>
            <div className="mb-14 max-w-[680px]">
              <div className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--ink-mute)] mb-5">
                O que o Hermes faz
              </div>
              <h2 className="text-[clamp(28px,4.2vw,44px)] font-bold tracking-[-1.4px] leading-[1.05]">
                Tudo o que você repete <span className="display-it">todo dia</span>,
                ele passa a fazer.
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon: MessageSquare,   title: 'WhatsApp automatizado',    desc: 'Responde clientes, faz follow-up, agenda reuniões e qualifica leads no seu tom.' },
              { icon: Mail,            title: 'E-mail inteligente',        desc: 'Lê, resume, prioriza e responde por você. Filtra o ruído e destaca o que importa.' },
              { icon: Calendar,        title: 'Agenda proativa',           desc: 'Bloqueia foco, resolve conflitos, marca reuniões — integrado ao Google Calendar.' },
              { icon: Search,          title: 'Pesquisa em tempo real',    desc: 'Busca preço, notícia, dado de mercado, informação de concorrente — e resume.' },
              { icon: LayoutDashboard, title: 'Dashboards sob medida',     desc: 'Vendas, leads, KPIs — atualizados em tempo real, no formato que você quer ver.' },
              { icon: Users,           title: 'CRM próprio',                desc: 'Pipeline, tags, automações. Sem pagar licença de Salesforce ou HubSpot.' },
              { icon: Palette,         title: 'Design system',              desc: 'Cria e mantém a identidade visual da sua marca em todos os canais.' },
              { icon: Bot,             title: 'Sub-agentes',                desc: 'Um agente por função. Vendedor, pesquisador, suporte — cada um afiado no que faz.' },
              { icon: Zap,             title: 'Autônomo 24/7',              desc: 'Monitora, avisa, executa. Sem férias, sem atestado, sem esquecer.' },
            ].map((f, i) => (
              <Reveal key={f.title} delay={i * 0.05}>
                <div className="group p-7 rounded-[16px] h-full glass-card">
                  <div className="w-12 h-12 rounded-[12px] flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-105"
                       style={{ background: 'rgba(217,119,87,0.1)' }}>
                    <f.icon size={22} className="text-[var(--hot)]" />
                  </div>
                  <h3 className="text-[16.5px] font-semibold mb-2 tracking-[-0.2px]">{f.title}</h3>
                  <p className="text-[13.5px] text-[var(--ink-mute)] leading-[1.65]">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ COMPARAÇÃO ═══ */}
      <section className="py-24 md:py-32">
        <div className="max-w-[1180px] mx-auto px-5 md:px-10">
          <Reveal>
            <div className="mb-12 max-w-[720px]">
              <div className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--ink-mute)] mb-5">
                Comparação
              </div>
              <h2 className="text-[clamp(28px,4.2vw,44px)] font-bold tracking-[-1.4px] leading-[1.05] mb-4">
                O ChatGPT responde.
                <br />
                <span className="display-it text-[var(--hot)]">O Hermes resolve.</span>
              </h2>
              <p className="text-[16px] text-[var(--ink-mute)] leading-[1.7]">
                Você já paga R$ 100/mês numa assinatura que só conversa.
                O Hermes executa, roda no seu servidor e você paga uma única vez.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-[16px] overflow-hidden glass">
              <table className="w-full text-[13.5px]" style={{ minWidth: 0 }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--line)' }}>
                    <th className="text-left p-5 font-semibold text-[var(--ink-soft)]">Funcionalidade</th>
                    <th className="text-center p-5 font-semibold text-[var(--ink-mute)]" style={{ minWidth: 140 }}>ChatGPT / Copilot</th>
                    <th className="text-center p-5 font-semibold" style={{ minWidth: 140 }}>
                      <span className="display-it text-[var(--hot)]" style={{ fontSize: '18px' }}>Hermes</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {([
                    ['Responde perguntas',              true,               true],
                    ['Executa ações no mundo real',     false,              true],
                    ['Roda no seu servidor',            false,              true],
                    ['Monta CRM sob medida',            false,              true],
                    ['Constrói dashboards ao vivo',     false,              true],
                    ['Automatiza WhatsApp e e-mail',    false,              true],
                    ['Sub-agentes especializados',      false,              true],
                    ['Setup completo incluso',          false,              true],
                    ['Mensalidade',                     'R$ 100+/mês',      'R$ 0'],
                    ['Privacidade dos dados',           'Nuvem do fornecedor', 'Seu servidor'],
                  ] as [string, boolean|string, boolean|string][]).map(([label, a, b], i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--line)' }}>
                      <td className="p-5 text-[var(--ink-soft)] font-medium">{label}</td>
                      <td className="p-5 text-center">
                        {typeof a === 'boolean'
                          ? (a ? <Check size={16} className="inline text-[var(--green)]" /> : <X size={16} className="inline text-[var(--ink-mute)] opacity-40" />)
                          : <span className="text-[var(--ink-mute)] font-medium">{a}</span>}
                      </td>
                      <td className="p-5 text-center">
                        {typeof b === 'boolean'
                          ? (b ? <Check size={16} className="inline text-[var(--green)]" /> : <X size={16} className="inline text-[var(--ink-mute)] opacity-40" />)
                          : <span className="font-semibold text-[var(--green)]">{b}</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ OFERTA ═══ */}
      <section id="oferta" className="py-24 md:py-32"
               style={{ background: 'linear-gradient(180deg, var(--paper) 0%, var(--paper-warm) 100%)' }}>
        <div className="max-w-[1180px] mx-auto px-5 md:px-10">
          <Reveal>
            <div className="mb-14 max-w-[720px]">
              <div className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--ink-mute)] mb-5">
                Oferta de lançamento
              </div>
              <h2 className="text-[clamp(28px,4.2vw,44px)] font-bold tracking-[-1.4px] leading-[1.05] mb-4">
                Paga uma vez.
                <br />
                <span className="display-it text-[var(--hot)]">Usa pra sempre.</span>
              </h2>
              <p className="text-[16.5px] text-[var(--ink-mute)] leading-[1.7]">
                Setup, instalação, integrações, treinamento e 30 dias de suporte — tudo incluso.
                Não existe mensalidade. Existe o preço do OpenAI ou Anthropic (ou zero, se você usar modelo local).
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                name: 'Básico',
                price: 'R$ 500',
                desc: 'Pra quem quer sentir o poder do Hermes.',
                features: [
                  'Setup completo em 24h',
                  '3 integrações (WhatsApp, e-mail, agenda)',
                  'Dashboard básico',
                  'Treinamento de uso',
                  '30 dias de suporte',
                ],
                featured: false,
                cta: 'Começar pelo básico',
              },
              {
                name: 'Profissional',
                price: 'R$ 2.000',
                badge: 'Mais escolhido',
                desc: 'O pacote que mais entrega valor real.',
                features: [
                  'Setup completo em 24h',
                  'Integrações ilimitadas',
                  'CRM e dashboards sob medida',
                  'WhatsApp com follow-up inteligente',
                  'Sub-agentes especializados',
                  'Treinamento da equipe',
                  '30 dias de suporte prioritário',
                ],
                featured: true,
                cta: 'Quero o Profissional',
              },
              {
                name: 'Empresa',
                price: 'R$ 5.000',
                desc: 'Time inteiro operando no Hermes.',
                features: [
                  'Setup completo em 24h',
                  'Multi-usuário simultâneo',
                  'Integrações ilimitadas',
                  'Design system completo',
                  'Treinamento personalizado da equipe',
                  '90 dias de suporte prioritário',
                ],
                featured: false,
                cta: 'Falar comigo',
              },
            ].map((p, i) => (
              <Reveal key={p.name} delay={i * 0.1}>
                <div className={`relative p-8 md:p-9 flex flex-col h-full rounded-[18px] transition-transform duration-300 hover:-translate-y-1
                                ${p.featured ? '' : 'glass-card'}`}
                     style={p.featured
                       ? { background: 'var(--ink)', color: 'var(--paper)', boxShadow: '0 24px 48px rgba(13,13,15,0.18)' }
                       : {}}>
                  {p.badge && (
                    <div className="absolute -top-3 left-6 px-3 py-1 rounded-full text-[10.5px] font-bold uppercase tracking-[0.12em]"
                         style={{ background: 'var(--hot)', color: 'var(--paper)' }}>
                      {p.badge}
                    </div>
                  )}
                  <h3 className="text-[17px] font-semibold mb-1">{p.name}</h3>
                  <p className={`text-[13px] mb-6 ${p.featured ? 'opacity-60' : 'text-[var(--ink-mute)]'}`}>{p.desc}</p>
                  <div className="mb-6">
                    <span className="text-[42px] font-bold tracking-[-1.5px]">{p.price}</span>
                    <span className={`text-[13px] ml-2 ${p.featured ? 'opacity-55' : 'text-[var(--ink-mute)]'}`}>
                      pagamento único
                    </span>
                  </div>
                  <ul className="space-y-2.5 my-2 flex-1">
                    {p.features.map(f => (
                      <li key={f} className={`text-[14px] flex items-start gap-2.5 ${p.featured ? 'opacity-90' : 'text-[var(--ink-soft)]'}`}>
                        <Check size={14} className={`mt-1 flex-shrink-0 ${p.featured ? 'text-[var(--hot)]' : 'text-[var(--green)]'}`} />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <a href={WA} target="_blank" rel="noopener"
                     className={`mt-6 inline-flex items-center justify-center gap-2 py-3.5 rounded-xl text-[14.5px] font-semibold transition-opacity hover:opacity-90 ${p.featured ? '' : ''}`}
                     style={p.featured
                       ? { background: 'var(--hot)', color: 'var(--paper)', whiteSpace: 'nowrap' }
                       : { background: 'rgba(13,13,15,0.06)', color: 'var(--ink)', whiteSpace: 'nowrap' }}>
                    {p.cta} <ArrowRight size={15} />
                  </a>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.3}>
            <div className="mt-12 flex items-center justify-center gap-3 text-[13.5px] text-[var(--ink-mute)] max-w-[560px] mx-auto text-center">
              <Lock size={14} className="flex-shrink-0" />
              <span>
                Garantia de 7 dias. Se não fizer sentido, devolvo 100% do seu dinheiro sem
                perguntar nada.
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="py-24 md:py-32">
        <div className="max-w-[760px] mx-auto px-5">
          <Reveal>
            <div className="mb-12">
              <div className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--ink-mute)] mb-5">
                Perguntas frequentes
              </div>
              <h2 className="text-[clamp(28px,4vw,42px)] font-bold tracking-[-1.4px] leading-[1.05]">
                O que costumam me perguntar
                <br />
                <span className="display-it text-[var(--hot)]">antes de fechar</span>.
              </h2>
            </div>
          </Reveal>

          <div className="space-y-4">
            {[
              {
                q: 'Preciso saber programar?',
                a: 'Não. O trabalho técnico é meu. Você só me manda mensagem no WhatsApp e depois usa o Hermes no Telegram como usa qualquer conversa. Se você digita, você usa.',
              },
              {
                q: 'O que é OpenClaw exatamente?',
                a: 'É um framework open-source pra assistente pessoal AI — modular, portátil, roda em qualquer sistema, em cima de qualquer modelo (Claude, GPT, Gemini, DeepSeek). Ele traz as skills e a orquestração. Como é open source, você não fica preso a nenhuma empresa. O Hermes é a configuração que eu monto em cima disso pra você.',
              },
              {
                q: 'Onde meus dados ficam?',
                a: 'No seu servidor. Zo Computer ou uma VPS que você contrata. Eu configuro o ambiente, mas você é dono. Nada passa pelas minhas máquinas.',
              },
              {
                q: 'O Hermes usa meu WhatsApp atual?',
                a: 'Sim. Conecto via Evolution API no seu número. Não precisa de chip novo, número novo, nem trocar nada. Ele atende, responde, faz follow-up — como se fosse você.',
              },
              {
                q: 'Quanto tempo demora?',
                a: '24 horas depois da nossa conversa inicial, o Hermes já está de pé com as integrações principais funcionando. Nas semanas seguintes ajustamos as skills conforme você usa.',
              },
              {
                q: 'E se eu não gostar?',
                a: 'Garantia de 7 dias. Devolvo 100% do dinheiro sem perguntar. Você não tem risco nenhum nessa conversa.',
              },
              {
                q: 'Tem custo depois?',
                a: 'Só o custo de rodar o modelo (OpenAI, Anthropic, ou local — você escolhe) e o servidor. Isso costuma ficar entre R$ 50 e R$ 300/mês, dependendo do uso. Sem mensalidade pra mim.',
              },
              {
                q: 'Posso adicionar skills novas depois?',
                a: 'Pode. Nos 30 dias de suporte, ajusto o que precisar. Depois disso, cada skill nova é orçada à parte.',
              },
            ].map((faq, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <details className="p-6 rounded-[14px] glass-card cursor-pointer">
                  <summary className="text-[15.5px] font-semibold list-none flex items-center justify-between gap-4">
                    {faq.q}
                    <span className="text-[var(--hot)] transition-transform">+</span>
                  </summary>
                  <p className="text-[14.5px] text-[var(--ink-mute)] leading-[1.7] mt-3">{faq.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA FINAL ═══ */}
      <section id="contato" className="py-28 md:py-36 relative overflow-hidden">
        <div className="absolute inset-0 opacity-70 pointer-events-none"
             style={{ background: 'radial-gradient(ellipse at 50% 60%, rgba(217,119,87,0.12) 0%, transparent 65%)' }} />
        <div className="absolute inset-0 grain pointer-events-none" />
        <div className="relative max-w-[760px] mx-auto px-5 text-center">
          <Reveal>
            <h2 className="text-[clamp(32px,5.5vw,54px)] font-bold tracking-[-2px] leading-[1.02] mb-7">
              Amanhã você acorda
              <br />
              e o Hermes já
              <br />
              <span className="display-it text-[var(--hot)]">trabalhou a noite inteira</span> por você.
            </h2>
            <p className="text-[17px] text-[var(--ink-mute)] mb-10 leading-[1.7] max-w-[540px] mx-auto">
              Setup em 24 horas. Pagamento único. Rodando no seu servidor. Sem app novo pra aprender.
              Manda um oi no WhatsApp que a gente conversa.
            </p>
            <a href={WA} target="_blank" rel="noopener"
               className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-[16px] font-semibold text-[var(--paper)] hover:opacity-90 transition-opacity"
               style={{
                 background: 'var(--ink)',
                 boxShadow: '0 16px 40px rgba(13,13,15,0.2)',
                 whiteSpace: 'nowrap',
               }}>
              <span className="ember" />
              Falar no WhatsApp — (11) 91037-6040
              <ArrowRight size={17} />
            </a>
          </Reveal>
        </div>
      </section>

      {/* ═══ FOOTER (assimétrico, sem 4-col + border-top) ═══ */}
      <footer className="pt-14 pb-10 relative"
              style={{ background: 'var(--paper-warm)' }}>
        <div className="max-w-[1180px] mx-auto px-5 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 mb-10">
            <div className="md:col-span-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-[10px] flex items-center justify-center text-[15px] font-bold text-[var(--paper)]"
                     style={{ background: 'var(--ink)' }}>H</div>
                <span className="text-[15px] font-semibold">Hermes</span>
              </div>
              <p className="text-[13.5px] text-[var(--ink-mute)] leading-[1.7] max-w-[380px]">
                Assistente pessoal AI instalado, configurado e treinado no seu negócio.
                Feito com <span className="display-it">carinho</span> e OpenClaw 🦞.
              </p>
            </div>

            <div className="md:col-span-3">
              <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--ink-mute)] mb-3">
                Contato
              </div>
              <a href={WA} target="_blank" rel="noopener"
                 className="text-[13.5px] text-[var(--ink)] hover:text-[var(--hot)] transition-colors block mb-1">
                WhatsApp (11) 91037-6040
              </a>
              <a href="https://instagram.com/jazzautomations" target="_blank" rel="noopener"
                 className="text-[13.5px] text-[var(--ink-mute)] hover:text-[var(--ink)] transition-colors block">
                @jazzautomations
              </a>
            </div>

            <div className="md:col-span-3">
              <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--ink-mute)] mb-3">
                Feito com
              </div>
              <a href="https://github.com/openclaw/openclaw" target="_blank" rel="noopener"
                 className="text-[13.5px] text-[var(--ink-mute)] hover:text-[var(--ink)] transition-colors block mb-1">
                OpenClaw ↗
              </a>
              <a href="https://zo.computer" target="_blank" rel="noopener"
                 className="text-[13.5px] text-[var(--ink-mute)] hover:text-[var(--ink)] transition-colors block">
                Zo Computer ↗
              </a>
            </div>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-3 pt-6"
               style={{ borderTop: '1px dashed rgba(13,13,15,0.12)' }}>
            <p className="text-[12px] text-[var(--ink-mute)]">© 2026 Hermes</p>
            <p className="text-[12px] text-[var(--ink-mute)]">
              Feito no Brasil, roda em qualquer lugar.
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
