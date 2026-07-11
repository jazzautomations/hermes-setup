import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Hermes — seu assistente pessoal AI no Telegram',
  description: 'Um agente pessoal rodando no seu servidor. Configuramos OpenClaw + Hermes + integrações (WhatsApp, e-mail, calendário, CRM). Você fala no Telegram, ele executa. Setup em 24h, pagamento único.',
  openGraph: {
    title: 'Hermes — assistente pessoal AI no Telegram',
    description: 'OpenClaw + Hermes instalado, configurado e treinado pra sua operação. Você fala, ele executa.',
    type: 'website',
    locale: 'pt_BR',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
