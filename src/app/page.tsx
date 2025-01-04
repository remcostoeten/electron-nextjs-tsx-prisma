/**
 * @author Remco Stoeten
 * @description Main page component that renders the SnippetCreator
 */

import { SnippetCreator } from '@/components/snippet-creator'

export default function Home() {
  return (
    <main className="min-h-screen bg-[#121212] p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <SnippetCreator />
      </div>
    </main>
  )
} 