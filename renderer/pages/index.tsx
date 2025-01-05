/**
 * @author Remco Stoeten
 * @description Main page component for the Snip application
 */

import React from 'react'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-4">
          Welcome to Snip
        </h1>
        <p className="text-muted-foreground">
          Your personal code snippet manager
        </p>
      </main>
    </div>
  )
} 