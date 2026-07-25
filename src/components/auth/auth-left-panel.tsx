import Image from 'next/image'

export default function AuthLeftPanel() {
  return (
    <section className="relative hidden min-h-screen w-[46.75%] shrink-0 overflow-hidden bg-[#2701C3] lg:block">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[56%] bg-[#3212C8] [clip-path:polygon(0_0,100%_0,77%_13%,0_45%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[58%] bg-[#3010C8] [clip-path:polygon(0_42%,100%_0,100%_100%,0_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 h-[31%] w-[70%] bg-[#3717C9] [clip-path:polygon(0_54%,100%_0,54%_100%,0_100%)]"
      />

      <div className="absolute left-6 top-8 z-20">
        <Image
          src="/logo.png"
          alt="SAKTI AI"
          width={584}
          height={211}
          className="h-auto w-[150px] brightness-0 invert"
          priority
        />
      </div>

      <blockquote className="absolute left-[10.5%] top-[18.5%] z-10 w-[50%] text-white">
        <span
          aria-hidden="true"
          className="block h-14 select-none font-sans text-[84px] font-bold leading-[0.95]"
        >
          &ldquo;
        </span>
        <p className="mt-2 text-[34px] font-medium leading-[1.1] tracking-[-0.025em]">
          Temukan talentamu dengan exclusive talent mapper SAKTI.Ai
        </p>
        <span
          aria-hidden="true"
          className="ml-auto mr-8 mt-2 block w-fit select-none font-sans text-[84px] font-bold leading-[0.65]"
        >
          &rdquo;
        </span>
      </blockquote>

      <div className="absolute inset-y-0 right-0 z-10 w-[68%]">
        <Image
          src="/woman-login.png"
          alt="Profesional muda SAKTI AI"
          fill
          sizes="47vw"
          className="object-contain object-right-bottom"
          priority
        />
      </div>
    </section>
  )
}
