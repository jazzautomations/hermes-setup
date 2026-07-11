'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

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
      <mesh ref={mesh}><torusKnotGeometry args={[1.2, 0.4, 128, 32]} /><meshStandardMaterial color="#5e6ad2" transparent opacity={0.15} roughness={0.1} metalness={0.8} /></mesh>
      <mesh ref={wireframe}><torusKnotGeometry args={[1.2, 0.4, 32, 8]} /><meshBasicMaterial color="#7170ff" wireframe transparent opacity={0.25} /></mesh>
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
  return <instancedMesh ref={mesh} args={[undefined,undefined,count]}><sphereGeometry args={[1,6,6]} /><meshBasicMaterial color="#5e6ad2" transparent opacity={0.4} /></instancedMesh>
}
function Scene() { return <><ambientLight intensity={0.3} /><pointLight position={[5,5,5]} intensity={0.5} color="#7170ff" /><pointLight position={[-5,-5,3]} intensity={0.3} color="#5e6ad2" /><HeroGeometry /><FloatingParticles /></> }

/* ── Hooks ── */
function useReveal(threshold=0.15) {
  const ref=useRef<HTMLDivElement>(null); const [v,setV]=useState(false)
  useEffect(()=>{const e=ref.current;if(!e)return;const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)setV(true)},{threshold});o.observe(e);return()=>o.disconnect()},[threshold])
  return{ref,visible:v}
}
function Reveal({children,className='',delay=0}:{children:React.ReactNode;className?:string;delay?:number}) {
  const{ref,visible}=useReveal()
  return <div ref={ref} className={className} style={{opacity:visible?1:0,transform:visible?'translateY(0) scale(1)':'translateY(50px) scale(0.97)',transition:`all 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s`}}>{children}</div>
}
function Counter({target,suffix=''}:{target:number;suffix?:string}) {
  const[c,setC]=useState(0); const ref=useRef<HTMLSpanElement>(null); const [started,setStarted]=useState(false)
  useEffect(()=>{const e=ref.current;if(!e)return;const o=new IntersectionObserver(([e])=>{if(e.isIntersecting&&!started)setStarted(true)},{threshold:0.5});o.observe(e);return()=>o.disconnect()},[started])
  useEffect(()=>{if(!started)return;const dur=1500;const start=Date.now();const anim=()=>{const p=Math.min((Date.now()-start)/dur,1);setC(Math.floor((1-Math.pow(1-p,3))*target));if(p<1)requestAnimationFrame(anim)};requestAnimationFrame(anim)},[started,target])
  return <span ref={ref}>{c}{suffix}</span>
}

/* ═══ PAGE ═══ */
export default function Home() {
  const [scrollY,setScrollY]=useState(0); const [mouse,setMouse]=useState({x:0,y:0})
  useEffect(()=>{
    const hs=()=>setScrollY(window.scrollY)
    const hm=(e:MouseEvent)=>setMouse({x:(e.clientX/window.innerWidth-0.5)*20,y:(e.clientY/window.innerHeight-0.5)*20})
    window.addEventListener('scroll',hs,{passive:true}); window.addEventListener('mousemove',hm,{passive:true})
    return()=>{window.removeEventListener('scroll',hs);window.removeEventListener('mousemove',hm)}
  },[])

  return (
    <main className="min-h-screen">

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50" style={{background:'rgba(250,250,250,0.8)',backdropFilter:'blur(20px) saturate(180%)',WebkitBackdropFilter:'blur(20px) saturate(180%)',borderBottom:'1px solid rgba(0,0,0,0.06)'}}>
        <div className="max-w-[1100px] mx-auto h-16 flex items-center justify-between px-5 md:px-12">
          <span className="text-[16px] font-bold tracking-[-0.3px]">Hermes</span>
          <div className="hidden md:flex items-center gap-6">
            <a href="#como-funciona" className="text-[14px] font-medium text-gray-500 hover:text-black transition-colors">Como funciona</a>
            <a href="#recursos" className="text-[14px] font-medium text-gray-500 hover:text-black transition-colors">Recursos</a>
            <a href="#oferta" className="text-[14px] font-medium text-gray-500 hover:text-black transition-colors">Oferta</a>
            <a href="#contato" className="text-[14px] font-semibold px-5 py-2.5 rounded-lg bg-black text-white hover:opacity-80 transition-all hover:scale-[1.02]">Comece agora</a>
          </div>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0" style={{transform:`translateY(${scrollY*0.4}px) translate(${mouse.x*0.5}px,${mouse.y*0.5}px)`,transition:'transform 0.1s ease-out'}}>
          <Canvas camera={{position:[0,0,6],fov:50}} dpr={[1,1.5]}><Suspense fallback={null}><Scene /></Suspense></Canvas>
        </div>
        <div className="absolute inset-0 z-[1]" style={{background:'radial-gradient(ellipse at 50% 30%, transparent 0%, rgba(250,250,250,0.4) 50%, rgba(250,250,250,1) 100%)',transform:`translateY(${scrollY*0.15}px)`}}/>
        <div className="absolute inset-0 z-[2] opacity-[0.03]" style={{backgroundImage:'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)',backgroundSize:'60px 60px',transform:`translateY(${scrollY*0.1}px)`}}/>

        <div className="relative z-10 max-w-[800px] mx-auto px-5 text-center" style={{transform:`translateY(${scrollY*-0.2}px)`}}>
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full mb-10" style={{background:'rgba(255,255,255,0.7)',backdropFilter:'blur(16px)',border:'1px solid rgba(255,255,255,0.8)',boxShadow:'0 4px 16px rgba(0,0,0,0.04)',animation:'fadeInUp 0.6s ease-out'}}>
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/>
            <span className="text-[13px] font-medium text-gray-500">Ativo agora &mdash; trabalhando 24 horas por dia, 7 dias por semana</span>
          </div>

          <h1 className="text-[clamp(38px,7vw,68px)] font-bold leading-[1.02] tracking-[-3px] mb-7" style={{animation:'fadeInUp 0.7s ease-out 0.1s both'}}>
            Voce perde 3 horas por dia<br/>em tarefas repetitivas.<br/>
            <span className="gradient-text">Agora tem alguem fazendo isso por voce.</span>
          </h1>

          <p className="text-[18px] md:text-[20px] text-gray-500 leading-[1.7] max-w-[620px] mx-auto mb-11" style={{animation:'fadeInUp 0.7s ease-out 0.2s both'}}>
            O Hermes e um assistente inteligente que mora no seu <strong className="text-gray-700">Telegram</strong> e faz o que voce faz &mdash; so que mais rapido, sem esquecer nada e sem precisar dormir. Ele <strong className="text-gray-700">cria CRMs sob medida</strong>, <strong className="text-gray-700">monta dashboards interativos</strong>, <strong className="text-gray-700">gerencia WhatsApp</strong>, <strong className="text-gray-700">responde emails</strong> e ainda <strong className="text-gray-700">constroi design systems</strong> pro seu negocio. E tudo isso sem voce precisar abrir um unico app novo.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap" style={{animation:'fadeInUp 0.7s ease-out 0.3s both'}}>
            <a href="#oferta" className="px-7 py-3.5 rounded-xl bg-black text-white text-[15px] font-semibold hover:opacity-85 transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-black/10">Quero meu Hermes &rarr;</a>
            <a href="#como-funciona" className="px-7 py-3.5 rounded-xl text-[15px] font-medium text-gray-600 hover:text-black transition-all duration-300 hover:scale-[1.02]" style={{background:'rgba(255,255,255,0.6)',backdropFilter:'blur(12px)',border:'1px solid rgba(0,0,0,0.08)'}}>Ver como funciona</a>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 z-[3] bg-gradient-to-t from-[#fafafa] to-transparent"/>
      </section>

      {/* Prova Social */}
      <Reveal><section className="max-w-[1100px] mx-auto px-5 md:px-12 py-10">
        <div className="flex gap-16 flex-wrap">
          <div className="text-[15px] text-gray-500"><strong className="text-black font-bold text-[20px]"><Counter target={3}/></strong> empresas confiando</div>
          <div className="text-[15px] text-gray-500"><strong className="text-black font-bold text-[20px]"><Counter target={2400} suffix="+"/></strong> mensagens processadas</div>
          <div className="text-[15px] text-gray-500"><strong className="text-black font-bold text-[20px]"><Counter target={98} suffix="%"/></strong> taxa de satisfacao</div>
        </div>
      </section></Reveal>

      {/* ═══ PROBLEMA ═══ */}
      <section className="py-28" style={{background:'linear-gradient(180deg, #f5f5f5 0%, #fafafa 100%)'}}>
        <div className="max-w-[1100px] mx-auto px-5 md:px-12">
          <Reveal><div className="max-w-[700px] mx-auto text-center mb-16">
            <h2 className="text-[clamp(26px,4vw,40px)] font-bold tracking-[-1.5px] mb-6 leading-tight">O problema nao e falta de ferramenta.<br/>E sobrar trabalho.</h2>
            <p className="text-[17px] text-gray-500 leading-[1.8]">
              Voce ja tem WhatsApp, email, calendario, planilha, Instagram, site. Cada um pede atencao. Cada um gera trabalho. E no final do dia, voce gastou 3 horas respondendo mensagem que um sistema poderia ter resolvido em 3 minutos.
              <br/><br/>
              <strong className="text-gray-700">E pior:</strong> quando voce ta dormindo, seus clientes mandam mensagem e ninguem responde. O lead esfria. O cliente vai embora. O dinheiro Some.
              <br/><br/>
              <strong className="text-gray-700">A solucao nao e contratar alguem.</strong> E ter um sistema inteligente que trabalha por voce &mdash; enquanto voce foca no que realmente importa: vender e crescer.
            </p>
          </div></Reveal>
        </div>
      </section>

      {/* ═══ COMO FUNCIONA ═══ */}
      <section id="como-funciona" className="max-w-[1100px] mx-auto px-5 md:px-12 py-28">
        <Reveal><div className="mb-16 text-center">
          <div className="inline-block px-3 py-1 rounded-full bg-brand/10 text-brand text-[12px] font-semibold mb-4 uppercase tracking-wider">Como funciona</div>
          <h2 className="text-[clamp(26px,4vw,40px)] font-bold tracking-[-1.5px] mb-4">Voce manda uma mensagem.<br/>O Hermes resolve.</h2>
          <p className="text-[17px] text-gray-500 max-w-[600px] mx-auto">Sem app novo. Sem painel complicado. Sem curva de aprendizado. So o Telegram que voce ja usa todo dia.</p>
        </div></Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {step:'1',title:'Voce pede pelo Telegram',desc:'Manda uma mensagem como se fosse pra um funcionario: "Cria um CRM pros meus clientes" ou "Automatiza meu WhatsApp". O Hermes entende e comeca a trabalhar na hora.'},
            {step:'2',title:'O Hermes cria e executa',desc:'Ele monta o CRM, configura os agentes de WhatsApp, cria dashboards com seus dados, conecta com suas ferramentas existentes. Tudo automatico, tudo sob medida pro seu negocio.'},
            {step:'3',title:'Voce recebe o resultado',desc:'Em minutos, o Hermes te manda o resultado no Telegram: "CRM pronto com 50 clientes. Agentes configurados. Dashboard atualizado. Follow-up automatico em 24h." Voce so confere e aproveita.'},
          ].map((item,i)=>(
            <Reveal key={item.step} delay={i*0.12}>
              <div className="relative p-8 rounded-[16px] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/[0.04]" style={{background:'rgba(255,255,255,0.7)',backdropFilter:'blur(16px)',border:'1px solid rgba(255,255,255,0.8)',boxShadow:'0 4px 16px rgba(0,0,0,0.03)'}}>
                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-[14px] font-bold mb-5">{item.step}</div>
                <h3 className="text-[18px] font-semibold mb-3">{item.title}</h3>
                <p className="text-[15px] text-gray-500 leading-[1.7]">{item.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ═══ DEMO ═══ */}
      <section className="max-w-[1100px] mx-auto px-5 md:px-12 py-28">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <Reveal><div>
            <div className="inline-block px-3 py-1 rounded-full bg-brand/10 text-brand text-[12px] font-semibold mb-4 uppercase tracking-wider">Demonstracao</div>
            <h2 className="text-[clamp(26px,4vw,40px)] font-bold tracking-[-1.5px] mb-5 leading-tight">Nao e um chatbot que responde perguntas.<br/><span className="gradient-text">E um sistema que constroi coisas.</span></h2>
            <p className="text-[16px] text-gray-500 leading-[1.7] mb-6">
              Quando voce pede algo pro Hermes, ele nao so responde &mdash; ele <strong className="text-gray-700">executa</strong>. Cria arquivos, configura integracoes, monta estruturas, gera relatorios. E faz tudo isso em tempo real, enquanto voce toma seu cafe.
            </p>
            <div className="space-y-4">
              {[
                {text:'"Cria um dashboard de vendas com os meus dados"',icon:'📊'},
                {text:'"Monta um CRM pros leads do Instagram"',icon:'💼'},
                {text:'"Automatiza o follow-up no WhatsApp"',icon:'🔄'},
                {text:'"Cria um design system pro meu app"',icon:'🎨'},
                {text:'"Resumo dos meus emails de hoje"',icon:'📧'},
              ].map((ex,i)=>(<div key={i} className="flex items-center gap-3 text-[15px] text-gray-600"><span className="text-[18px]">{ex.icon}</span> {ex.text}</div>))}
            </div>
            <p className="text-[14px] text-gray-400 mt-6 italic">Coisas que o Hermes ja fez de verdade pra clientes.</p>
          </div></Reveal>

          <Reveal delay={0.15}><div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-br from-brand/20 to-accent/10 rounded-[24px] blur-2xl opacity-50"/>
            <div className="relative rounded-[16px] overflow-hidden" style={{background:'rgba(255,255,255,0.8)',backdropFilter:'blur(24px)',border:'1px solid rgba(255,255,255,0.9)',boxShadow:'0 24px 48px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.02)'}}>
              <div className="px-5 py-3.5 flex items-center gap-3.5" style={{background:'rgba(240,240,240,0.8)',borderBottom:'1px solid rgba(0,0,0,0.06)'}}>
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-brand to-accent flex items-center justify-center text-white font-bold text-[17px] shadow-sm">H</div>
                <div><div className="text-[15px] font-semibold">Hermes</div><div className="text-[12px] text-green-500 font-medium">trabalhando agora</div></div>
              </div>
              <div className="p-5 space-y-3.5 min-h-[380px]" style={{background:'rgba(255,255,255,0.5)'}}>
                <div className="tg-msg tg-user">Cria um CRM pros meus 50 clientes do WhatsApp</div>
                <div className="tg-msg tg-bot"><strong>CRM criado com sucesso!</strong><br/><br/>📋 <strong>50 clientes</strong> importados e organizados<br/>🏷️ Tags automaticas por status (ativo, pendente, inativo)<br/>📊 Pipeline de vendas com 4 etapas<br/>📈 Dashboard com metricas em tempo real<br/><br/>Quer que eu crie automacoes de follow-up pra cada etapa?</div>
                <div className="tg-msg tg-user">Sim, e manda um resumo do dashboard</div>
                <div className="tg-msg tg-bot">✅ <strong>12 leads quentes</strong> identificados (interacao recente)<br/>✅ <strong>Follow-up automatico</strong> agendado em 24h pra 8 clientes<br/>✅ <strong>Ticket medio:</strong> R$850<br/>✅ <strong>Taxa de conversao:</strong> 23% (acima da media do setor)<br/>✅ <strong>Receita potencial:</strong> R$42.500 este mes</div>
              </div>
            </div>
          </div></Reveal>
        </div>
      </section>

      {/* ═══ RECURSOS ═══ */}
      <section id="recursos" className="py-28" style={{background:'linear-gradient(180deg, #f5f5f5 0%, #fafafa 100%)'}}>
        <div className="max-w-[1100px] mx-auto px-5 md:px-12">
          <Reveal><div className="mb-14">
            <h2 className="text-[clamp(26px,4vw,40px)] font-bold tracking-[-1.5px] mb-3">Tudo que voce imaginar, o Hermes constroi.</h2>
            <p className="text-[17px] text-gray-500">O Hermes nao so executa tarefas &mdash; ele cria ferramentas inteiras sob medida pro seu negocio. CRMs, dashboards, agentes, design systems. Tudo customizado, tudo funcionando.</p>
          </div></Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {icon:'💬',title:'WhatsApp automatizado',desc:'Responde clientes 24h, faz follow-up inteligente, agenda reunioes e fecha vendas. Seu WhatsApp trabalhando enquanto voce dorme. Nao perde mais nenhum lead.'},
              {icon:'📧',title:'Email inteligente',desc:'Le, resume e responde emails importantes na hora. Ignora spam e emails irrelevantes. Responde no seu tom, na sua ausencia. Nunca mais deixa email sem resposta.'},
              {icon:'📅',title:'Calendario',desc:'Agenda reunioes automaticamente, envia lembretes, resolve conflito de horarios. Integrado com Google Calendar. Voce so aparece na hora certa.'},
              {icon:'🔍',title:'Pesquisa web',desc:'Busca informacao na internet em tempo real e traz o resumo. Preco de produto, noticia do mercado, dados de concorrencia. Tudo atualizado, tudo rapido.'},
              {icon:'📊',title:'Dashboards interativos',desc:'Cria dashboards completos com seus dados em tempo real. Vendas, leads, metricas, KPIs. Tudo visual, tudo bonito, tudo atualizado automaticamente.'},
              {icon:'💼',title:'CRMs sob medida',desc:'Monta CRM completo do zero pros seus clientes. Pipeline de vendas, tags inteligentes, automacoes de follow-up. Sem pagar licenca de Salesforce ou HubSpot.'},
              {icon:'🎨',title:'Design systems',desc:'Cria e mantem seu design system completo. Cores, tipografia, componentes, iconografia. Consistencia total em todos os seus canais e produtos.'},
              {icon:'🤖',title:'Subagentes especializados',desc:'O Hermes cria agentes dedicados pra cada tarefa. Um agente pra vender, outro pra suporte, outro pra marketing. Cada um focado no que faz de melhor.'},
              {icon:'⚡',title:'Autonomo 24/7',desc:'Monitora tudo, avisa quando precisa e executa sem parar. Se algo precisa de atencao as 3h da manha, o Hermes ta la. Sem ferias, sem atestado, sem reclamacao.'},
            ].map((f,i)=>(
              <Reveal key={f.title} delay={i*0.06}>
                <div className="group p-7 rounded-[16px] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/[0.04]" style={{background:'rgba(255,255,255,0.7)',backdropFilter:'blur(16px)',border:'1px solid rgba(255,255,255,0.8)',boxShadow:'0 4px 16px rgba(0,0,0,0.03)'}}>
                  <div className="w-13 h-13 rounded-[12px] flex items-center justify-center text-[24px] mb-5 transition-transform duration-300 group-hover:scale-110" style={{background:'rgba(94,106,210,0.08)'}}>{f.icon}</div>
                  <h3 className="text-[17px] font-semibold mb-2.5">{f.title}</h3>
                  <p className="text-[14px] text-gray-500 leading-[1.65]">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ COMPARACAO ═══ */}
      <section className="py-28" style={{background:'linear-gradient(180deg, #f5f5f5 0%, #fafafa 100%)'}}>
        <div className="max-w-[1100px] mx-auto px-5 md:px-12">
          <Reveal><div className="mb-12">
            <h2 className="text-[clamp(26px,4vw,40px)] font-bold tracking-[-1.5px] mb-3">O ChatGPT responde.<br/><span className="gradient-text">O Hermes constroi.</span></h2>
            <p className="text-[17px] text-gray-500 max-w-[600px]">Voce ja paga R$100/mes no ChatGPT Plus. Mas pra que, se ele so responde perguntas? O Hermes faz o trabalho real.</p>
          </div></Reveal>
          <Reveal delay={0.1}><div className="rounded-[16px] overflow-hidden" style={{background:'rgba(255,255,255,0.7)',backdropFilter:'blur(16px)',border:'1px solid rgba(255,255,255,0.8)',boxShadow:'0 8px 32px rgba(0,0,0,0.04)'}}>
            <table className="w-full text-[14px]">
              <thead><tr style={{borderBottom:'2px solid rgba(0,0,0,0.06)'}}>
                <th className="text-left p-5 font-semibold text-gray-700">Funcionalidade</th>
                <th className="text-center p-5 font-semibold text-gray-400 w-[150px]">ChatGPT / Copilot</th>
                <th className="text-center p-5 font-semibold w-[150px]"><span className="gradient-text">Hermes</span></th>
              </tr></thead>
              <tbody>
                {([['Responde perguntas',true,true],['Cria CRMs sob medida',false,true],['Monta dashboards interativos',false,true],['Automatiza WhatsApp',false,true],['Le e responde emails',false,true],['Cria subagentes especializados',false,true],['Constroi design systems',false,true],['Trabalha 24/7 autonomo',false,true],['Mensalidade','R$100+/mes','R$0'],['Privacidade','Dados na nuvem','Servidor proprio']] as [string,boolean|string,boolean|string][]).map(([label,chatgpt,hermes],i)=>(
                  <tr key={i} style={{borderBottom:'1px solid rgba(0,0,0,0.04)'}}>
                    <td className="p-5 text-gray-600 font-medium">{label}</td>
                    <td className="p-5 text-center">{typeof chatgpt==='boolean'?<span className={chatgpt?'text-green-500 font-semibold':'text-red-400 font-semibold'}>{chatgpt?'✓':'✗'}</span>:<span className="text-gray-400 font-medium">{chatgpt}</span>}</td>
                    <td className="p-5 text-center">{typeof hermes==='boolean'?<span className="text-green-500 font-semibold">{hermes?'✓':'✗'}</span>:<span className="text-green-500 font-bold">{hermes}</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div></Reveal>
        </div>
      </section>

      {/* ═══ OFERTA ═══ */}
      <section id="oferta" className="py-28">
        <div className="max-w-[1100px] mx-auto px-5 md:px-12">
          <Reveal><div className="mb-14 text-center">
            <div className="inline-block px-3 py-1 rounded-full bg-brand/10 text-brand text-[12px] font-semibold mb-4 uppercase tracking-wider">Oferta de lancamento</div>
            <h2 className="text-[clamp(26px,4vw,40px)] font-bold tracking-[-1.5px] mb-3">Setup completo. Paga uma vez. Usa pra sempre.</h2>
            <p className="text-[17px] text-gray-500">Sem mensalidade. Sem surpresa. Em 24 horas voce ja ta com o Hermes trabalhando por voce.</p>
          </div></Reveal>

          <Reveal delay={0.05}><div className="max-w-[600px] mx-auto mb-10 p-6 rounded-[14px] text-center" style={{background:'linear-gradient(135deg, rgba(94,106,210,0.08) 0%, rgba(113,112,255,0.08) 100%)',border:'1px solid rgba(94,106,210,0.15)'}}>
            <p className="text-[15px] text-gray-600 font-medium leading-[1.7]">🎁 <strong>Bonus de lancamento:</strong> 30 dias de suporte prioritario incluso em qualquer plano.<br/>Aproveite antes que essa oferta acabe &mdash; o preco vai subir depois.</p>
          </div></Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {name:'Basico',price:'R$500',desc:'Pra quem quer testar o poder do Hermes',features:['Instalacao completa em 24 horas','3 integracoes (WhatsApp, email, calendario)','Dashboard basico com metricas','30 dias de suporte incluso'],cta:'Comecar agora',featured:false},
              {name:'Profissional',price:'R$2.000',badge:'Mais vendido',desc:'O plano que mais converte e mais entrega',features:['Integracoes ilimitadas','CRMs e dashboards sob medida','WhatsApp automatizado completo','Subagentes especializados','30 dias de suporte prioritario'],cta:'Quero o Profissional',featured:true},
              {name:'Empresa',price:'R$5.000',desc:'Pra equipes e escritorios que querem escalar',features:['Multi-usuario simultaneo','Integracoes ilimitadas','Design system completo','Treinamento da equipe','Suporte prioritario por 90 dias'],cta:'Falar com vendas',featured:false},
            ].map((p,i)=>(
              <Reveal key={p.name} delay={i*0.1}>
                <div className={`relative p-9 flex flex-col rounded-[16px] transition-all duration-300 hover:-translate-y-1 ${p.featured?'ring-2 ring-brand shadow-xl shadow-brand/10':''}`} style={{background:p.featured?'rgba(255,255,255,0.9)':'rgba(255,255,255,0.6)',backdropFilter:'blur(16px)',border:p.featured?'none':'1px solid rgba(255,255,255,0.8)'}}>
                  {p.badge&&<div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-brand text-white text-[11px] font-bold uppercase tracking-wider">{p.badge}</div>}
                  <h3 className="text-[17px] font-semibold mb-1">{p.name}</h3>
                  <p className="text-[13px] text-gray-400 mb-6">{p.desc}</p>
                  <div className="text-[42px] font-bold tracking-[-2px] mb-1">{p.price} <span className="text-[14px] font-normal text-gray-400 tracking-normal">pagamento unico</span></div>
                  <ul className="space-y-2.5 my-7 flex-1">
                    {p.features.map(f=>(<li key={f} className="text-[14px] text-gray-600 flex items-center gap-2.5"><span className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 text-[11px] font-bold flex-shrink-0">✓</span> {f}</li>))}
                  </ul>
                  <a href="#contato" className={`block text-center py-3.5 rounded-xl text-[15px] font-semibold transition-all duration-300 hover:scale-[1.02] ${p.featured?'bg-black text-white hover:opacity-85':'text-gray-700 hover:text-black'}`} style={!p.featured?{background:'rgba(0,0,0,0.04)'}:{}}>{p.cta}</a>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.3}><div className="mt-10 text-center">
            <p className="text-[14px] text-gray-400">🛡️ <strong>Garantia incondicional de 7 dias:</strong> Se nao gostar, devolvemos 100% do seu dinheiro. Sem perguntas, sem burocracia.</p>
          </div></Reveal>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="py-28" style={{background:'linear-gradient(180deg, #f5f5f5 0%, #fafafa 100%)'}}>
        <div className="max-w-[700px] mx-auto px-5">
          <Reveal><h2 className="text-[clamp(26px,4vw,40px)] font-bold tracking-[-1.5px] mb-12 text-center">Perguntas frequentes</h2></Reveal>
          <div className="space-y-4">
            {[
              {q:'Preciso saber programar pra usar o Hermes?',a:'Nao. O Hermes e feito pra quem nao quer programar. Voce so manda mensagem no Telegram e ele faz tudo. Se voce sabe mandar uma mensagem no WhatsApp, voce sabe usar o Hermes.'},
              {q:'O Hermes funciona com meu WhatsApp atual?',a:'Sim. O Hermes se conecta ao seu WhatsApp existente e comeca a trabalhar. Nao precisa de numero novo, chip novo ou nada do tipo.'},
              {q:'E se eu nao gostar?',a:'Devolvemos 100% do dinheiro em ate 7 dias. Sem perguntas, sem burocracia. Voce nao tem nada a perder.'},
              {q:'Quanto tempo demora pra estar funcionando?',a:'O setup completo leva 24 horas. Em menos de 1 dia voce ja ta com o Hermes trabalhando por voce.'},
              {q:'Meus dados ficam seguros?',a:'Sim. Tudo roda em servidor proprio. Seus dados nao saem do Brasil e nao sao compartilhados com ninguem. Privacidade total.'},
            ].map((faq,i)=>(
              <Reveal key={i} delay={i*0.08}>
                <div className="p-6 rounded-[14px]" style={{background:'rgba(255,255,255,0.7)',backdropFilter:'blur(16px)',border:'1px solid rgba(255,255,255,0.8)'}}>
                  <h3 className="text-[16px] font-semibold mb-2">{faq.q}</h3>
                  <p className="text-[15px] text-gray-500 leading-[1.7]">{faq.a}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA FINAL ═══ */}
      <section id="contato" className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{background:'radial-gradient(ellipse at 50% 50%, rgba(94,106,210,0.15) 0%, transparent 70%)'}}/>
        <div className="relative max-w-[600px] mx-auto px-5 text-center">
          <Reveal>
            <h2 className="text-[clamp(26px,5vw,44px)] font-bold tracking-[-1.5px] mb-5 leading-tight">Amanha voce acorda<br/>e o Hermes ja trabalhou<br/><span className="gradient-text">a noite inteira por voce.</span></h2>
            <p className="text-[17px] text-gray-500 mb-10 leading-relaxed">Setup completo em 24 horas. Sem mensalidade. Paga uma vez, usa pra sempre. Comece hoje.</p>
            <a href="https://instagram.com/jazzautomations" target="_blank" rel="noopener" className="inline-block px-9 py-4 rounded-xl bg-black text-white text-[16px] font-semibold hover:opacity-85 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-black/10">Comecar agora &rarr;</a>
          </Reveal>
        </div>
      </section>

      <footer className="border-t border-gray-200/60 py-7">
        <div className="max-w-[1100px] mx-auto px-5 md:px-12 flex items-center justify-between">
          <p className="text-[13px] text-gray-400">&copy; 2026 Hermes</p>
          <a href="https://instagram.com/jazzautomations" target="_blank" rel="noopener" className="text-[13px] text-gray-400 hover:text-black transition-colors">@jazzautomations</a>
        </div>
      </footer>
    </main>
  )
}
