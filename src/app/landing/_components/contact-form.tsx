'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { EASE, Reveal } from './primitives'

const ROLES = [
  'Pencari kerja',
  'Perwakilan perusahaan',
  'Instansi pemerintah / partnership',
  'Lainnya',
]

const field =
  'w-full rounded-2xl border border-[var(--l-line)] bg-[var(--l-bg-alt)] px-4 py-3 text-[0.95rem] text-[var(--l-ink)] outline-none transition-colors placeholder:text-[var(--l-ink-3)] focus:border-[var(--l-ink)]'
const label =
  'text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-[var(--l-ink-3)]'

export function ContactForm() {
  const [role, setRole] = useState(ROLES[0])
  const [sent, setSent] = useState(false)

  return (
    <section className="l-section scroll-mt-28 pt-[calc(var(--l-nav-h)+clamp(1.25rem,5vw,3.75rem))]">
      <div className="l-shell grid gap-12 md:grid-cols-[1fr_1.1fr] md:gap-16">
        <div>
          <Reveal variant="left" distance={16}>
            <span className="l-eyebrow">Mulai dalam 2 menit</span>
          </Reveal>
          <h1 className="l-h2 mt-5 max-w-[16ch]">
            Ceritakan kebutuhanmu, kami sesuaikan langkah selanjutnya.
          </h1>
          <Reveal delay={0.1} variant="blur">
            <p className="l-lead mt-6">
              Baik kamu mau upload CV, jadwalkan demo untuk perusahaan, atau
              diskusi kolaborasi kelembagaan, isi form di samping dan tim kami
              akan menghubungi.
            </p>
          </Reveal>
          <dl className="mt-10 grid grid-cols-1 gap-6 border-t border-[var(--l-line)] pt-8 sm:grid-cols-3">
            {[
              { v: '<24 jam', l: 'Waktu respons rata-rata' },
              { v: 'Gratis', l: 'Konsultasi awal semua kebutuhan' },
              { v: 'Tanpa komitmen', l: 'Sekadar diskusi juga boleh' },
            ].map((s) => (
              <div key={s.l}>
                <dt className="text-[1.1rem] font-medium tracking-[-0.02em] [font-family:var(--font-space-grotesk)]">
                  {s.v}
                </dt>
                <dd className="mt-1 text-[0.82rem] leading-snug text-[var(--l-ink-3)]">
                  {s.l}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <Reveal variant="up" distance={32} className="block">
          <div className="rounded-[28px] border border-[var(--l-line)] bg-[var(--l-bg)] p-6 sm:p-9">
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="flex flex-col items-start gap-3 py-8"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-[var(--l-accent)] text-white">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M4 10.5 8 14.5 16 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <h2 className="text-[1.3rem] font-semibold tracking-[-0.02em] [font-family:var(--font-space-grotesk)]">
                    Terima kasih, pesanmu tercatat.
                  </h2>
                  <p className="text-[0.95rem] leading-relaxed text-[var(--l-ink-2)]">
                    Ini demo, jadi belum ada yang benar-benar terkirim. Di produk
                    aslinya tim kami akan menghubungi dalam 24 jam.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSent(false)}
                    className="l-link mt-2 text-[0.9rem]"
                  >
                    <span className="l-link__line">Isi form lagi</span>
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={(e) => {
                    e.preventDefault()
                    setSent(true)
                  }}
                  className="flex flex-col gap-5"
                >
                  <div className="grid gap-5 sm:grid-cols-2">
                    <label className="flex flex-col gap-2">
                      <span className={label}>Nama lengkap</span>
                      <input required className={field} placeholder="Nama kamu" />
                    </label>
                    <label className="flex flex-col gap-2">
                      <span className={label}>Email</span>
                      <input
                        required
                        type="email"
                        className={field}
                        placeholder="kamu@email.com"
                      />
                    </label>
                  </div>

                  <label className="flex flex-col gap-2">
                    <span className={label}>Perusahaan / institusi (opsional)</span>
                    <input className={field} placeholder="Nama organisasi" />
                  </label>

                  <div className="flex flex-col gap-2.5">
                    <span className={label}>Saya adalah</span>
                    <div className="flex flex-wrap gap-2">
                      {ROLES.map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setRole(r)}
                          className={`rounded-full border px-3.5 py-2 text-[0.85rem] transition-colors ${
                            role === r
                              ? 'border-[var(--l-ink)] bg-[var(--l-ink)] text-[var(--l-bg)]'
                              : 'border-[var(--l-line)] text-[var(--l-ink-2)] hover:border-[var(--l-ink)]'
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>

                  <label className="flex flex-col gap-2">
                    <span className={label}>Ceritakan kebutuhanmu</span>
                    <textarea
                      required
                      rows={4}
                      className={`${field} resize-none`}
                      placeholder="Contoh: mau jadwalkan demo untuk tim rekrutmen 5 orang."
                    />
                  </label>

                  <button
                    type="submit"
                    className="l-btn l-btn--accent mt-1 w-full justify-center"
                  >
                    <span className="l-btn__label">Kirim & Hubungi Saya</span>
                  </button>
                  <p className="text-center text-[0.75rem] text-[var(--l-ink-3)]">
                    Demo landing page, form tidak mengirim data ke mana pun.
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
