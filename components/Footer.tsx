"use client"

import { Heart } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-zinc-200/70 bg-[#FAFAF7] mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between text-xs text-zinc-500">
          <div className="flex items-center gap-1.5">
            <span>נבנה עם</span>
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
            <span>על ידי</span>
            <span className="font-pacifico text-zinc-900">
              Quick crm
            </span>
          </div>
          <div className="flex items-center gap-5">
            <span>© {new Date().getFullYear()} כל הזכויות שמורות</span>
            <a href="#" className="text-zinc-500 hover:text-zinc-900 transition-colors">
              תנאי שימוש
            </a>
            <a href="#" className="text-zinc-500 hover:text-zinc-900 transition-colors">
              מדיניות פרטיות
            </a>
            <a href="#" className="text-zinc-500 hover:text-zinc-900 transition-colors">
              צור קשר
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

