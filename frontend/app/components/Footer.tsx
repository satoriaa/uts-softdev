import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#0F0F0F] text-white mt-auto border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Grid - 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Left Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-black tracking-tighter leading-tight">
              Central Creative Hub
            </h3>
            <p className="text-sm leading-relaxed text-white/70 max-w-xs">
              Digital ecosystem platform for the Faculty of Art and Design.
              <br /> <br />
              Jln Letjen S. Parman No. 1, Grogol Petamburan Jakarta Barat, 11440 Gedung R, Lt. 4 , Kampus I
            </p>
          </div>

          {/* Center Left - Navigation */}
          <div className="space-y-6">
            <h4 className="text-xs font-black tracking-widest uppercase text-white/50">
              Navigation
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/dashboard_user" className="text-sm text-white/70 hover:text-white transition-colors duration-300 flex items-center gap-2">
                  <span className="text-[#EF6145]">•</span> Home
                </Link>
              </li>
              <li>
                <Link href="/dashboard_user/showcase" className="text-sm text-white/70 hover:text-white transition-colors duration-300 flex items-center gap-2">
                  <span className="text-[#EF6145]">•</span> Showcase
                </Link>
              </li>
              <li>
                <Link href="/dashboard_user/Ruangan" className="text-sm text-white/70 hover:text-white transition-colors duration-300 flex items-center gap-2">
                  <span className="text-[#EF6145]">•</span> Rooms
                </Link>
              </li>
              <li>
                <Link href="/dashboard_user/event" className="text-sm text-white/70 hover:text-white transition-colors duration-300 flex items-center gap-2">
                  <span className="text-[#EF6145]">•</span> Activity
                </Link>
              </li>
              <li>
                <Link href="/dashboard_user/proker" className="text-sm text-white/70 hover:text-white transition-colors duration-300 flex items-center gap-2">
                  <span className="text-[#EF6145]">•</span> Proker
                </Link>
              </li>
              <li>
                <Link href="/dashboard_user/profil" className="text-sm text-white/70 hover:text-white transition-colors duration-300 flex items-center gap-2">
                  <span className="text-[#EF6145]">•</span> Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Center Right - Academic */}
          <div className="space-y-6">
            <h4 className="text-xs font-black tracking-widest uppercase text-white/50">
              Academic
            </h4>
            <ul className="space-y-3">
              <li className="text-sm text-white/70 hover:text-white transition-colors duration-300">
                  Visual Communication Design
              </li>
              <li className="text-sm text-white/70 hover:text-white transition-colors duration-300">
                  Interior Design
              </li>
            </ul>
          </div>

          {/* Right Section - Contact */}
          <div className="space-y-6">
            <h4 className="text-xs font-black tracking-widest uppercase text-white/50">
              Contact
            </h4>
            <div className="space-y-2 text-sm">
              <p className="text-sm text-white/70 hover:text-white transition-colors duration-300">
                <span className="font-semibold text-white/90">Email:</span><br />
                fsrd@untar.ac.id
              </p>
              <p className="text-sm text-white/70 hover:text-white transition-colors duration-300">
                <span className="font-semibold text-white/90">Phone:</span><br />
                021-5671748, 5663279, 5604477
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/5 pt-8 mt-12"></div>

        {/* Bottom Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Bottom Left - Copyright */}
          <div className="text-xs text-white/50 font-medium">
            @2026 Central Creative Hub - FSRD University. All rights reserved.
          </div>

          {/* Bottom Right - Legal Links */}
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-xs text-white/50 hover:text-white/70 transition-colors duration-300">
              Privacy Policy
            </Link>
            <span className="text-white/20">|</span>
            <Link href="/terms" className="text-xs text-white/50 hover:text-white/70 transition-colors duration-300">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}