import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Hermes — Assistente IA no Telegram',
  description: 'Um agente IA que trabalha por voce. Conecta com WhatsApp, email, calendario e mais. Setup one-time, sem mensalidade.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
