"use client";

import { useState } from "react";
import Image from "next/image";
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/routing';

export default function Home() {
  const [email, setEmail] = useState("");
  const t = useTranslations('HomePage');
  const nt = useTranslations('Navigation');
  const ft = useTranslations('Footer');

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
        <div className="flex items-center gap-2 text-2xl font-bold tracking-tighter">
          <span className="bg-black text-white px-2 py-1 rounded">Sell</span>
          <span>Masr</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="/products" className="hover:text-blue-600 transition-colors">{nt('products')}</Link>
          <span className="text-gray-300 cursor-not-allowed opacity-50">{nt('about')}</span>
          <span className="text-gray-300 cursor-not-allowed opacity-50">{nt('contact')}</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium hover:text-blue-600 transition-colors">{nt('login')}</Link>
          <Link href="/register" className="bg-black text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl">
            {nt('startSelling')}
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative overflow-hidden px-8 py-20 lg:py-32 flex flex-col lg:flex-row items-center justify-between max-w-7xl mx-auto gap-12">
        <div className="flex-1 space-y-8 z-10 text-center lg:text-left rtl:lg:text-right">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
            {t('tagline')}
          </div>
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
            {t.rich('title', {
              spanInner: (chunks) => <span className="text-blue-600">{chunks}</span>
            })}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0">
            {t('subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start rtl:lg:justify-start pt-4">
            <Link href="/register" className="w-full sm:w-auto bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-blue-700 transition-all shadow-xl hover:scale-105">
              {t('getStarted')}
            </Link>
            <span className="w-full sm:w-auto bg-white border border-gray-200 text-gray-400 px-8 py-4 rounded-full text-lg font-bold cursor-not-allowed opacity-50">
              {t('howItWorks')}
            </span>
          </div>
          <div className="flex items-center gap-8 pt-8 justify-center lg:justify-start rtl:lg:justify-start">
            <div>
              <p className="text-2xl font-bold">10k+</p>
              <p className="text-sm text-gray-500">{t('stats.vendors')}</p>
            </div>
            <div className="w-px h-10 bg-gray-200"></div>
            <div>
              <p className="text-2xl font-bold">50k+</p>
              <p className="text-sm text-gray-500">{t('stats.products')}</p>
            </div>
            <div className="w-px h-10 bg-gray-200"></div>
            <div>
              <p className="text-2xl font-bold">24h</p>
              <p className="text-sm text-gray-500">{t('stats.delivery')}</p>
            </div>
          </div>
        </div>
        <div className="flex-1 relative w-full aspect-square max-w-[600px]">
          <div className="absolute -inset-4 bg-gradient-to-tr from-blue-100 to-purple-100 rounded-[3rem] blur-2xl opacity-50 animate-pulse"></div>
          <div className="relative h-full w-full rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white">
            <Image 
              src="/hero.png" 
              alt="Sell Masr Hero" 
              fill 
              className="object-cover"
              priority
            />
          </div>
        </div>
      </header>

      {/* Trust Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-8">
          <p className="text-center text-sm font-bold text-gray-400 uppercase tracking-widest mb-12">Trusted by industry leaders</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-50 grayscale hover:grayscale-0 transition-all">
            <div className="text-2xl font-black italic">PAYMOB</div>
            <div className="text-2xl font-black italic">ARAMEX</div>
            <div className="text-2xl font-black italic">BOSTA</div>
            <div className="text-2xl font-black italic">FAWRY</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-8 max-w-7xl mx-auto">
        <div className="text-center mb-20 space-y-4">
          <h2 className="text-4xl font-bold tracking-tight">{t('features.title')}</h2>
          <p className="text-xl text-gray-600">{t('features.subtitle')}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-12">
          {[
            {
              key: 'suppliers',
              icon: "📦"
            },
            {
              key: 'cod',
              icon: "💵"
            },
            {
              key: 'shipping',
              icon: "🚚"
            }
          ].map((feature, i) => (
            <div key={i} className="p-8 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
              <div className="text-4xl mb-6 group-hover:scale-110 transition-transform inline-block">{feature.icon}</div>
              <h3 className="text-2xl font-bold mb-4">{t(`features.${feature.key}.title`)}</h3>
              <p className="text-gray-600 leading-relaxed">{t(`features.${feature.key}.desc`)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-20 px-8 mt-20">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <div className="text-3xl font-bold tracking-tighter">SellMasr</div>
            <p className="text-gray-400">{ft('description')}</p>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-lg">{ft('platform')}</h4>
            <ul className="space-y-4 text-gray-400">
              <li><Link href="/products" className="hover:text-white transition-colors">{nt('products')}</Link></li>
              <li><span className="opacity-50 cursor-not-allowed">Suppliers</span></li>
              <li><span className="opacity-50 cursor-not-allowed">Shipping</span></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-lg">{ft('company')}</h4>
            <ul className="space-y-4 text-gray-400">
              <li><span className="opacity-50 cursor-not-allowed">{nt('about')}</span></li>
              <li><span className="opacity-50 cursor-not-allowed">{nt('contact')}</span></li>
              <li><span className="opacity-50 cursor-not-allowed">Careers</span></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-lg">{ft('newsletter')}</h4>
            <p className="text-gray-400 mb-6 text-sm">{ft('newsletterDesc')}</p>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (email) {
                  alert(ft('newsletterSuccess'));
                  setEmail("");
                }
              }}
              className="flex gap-2"
            >
              <input 
                type="email" 
                placeholder="Your email" 
                className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 w-full focus:outline-none focus:border-blue-500" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="bg-white text-black font-bold px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">{ft('join')}</button>
            </form>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-gray-900 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Sell Masr. {ft('rights')}
        </div>
      </footer>
    </div>
  );
}
