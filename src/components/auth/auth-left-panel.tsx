import Image from 'next/image'

export default function AuthLeftPanel() {
  return (
    <div className="relative hidden lg:flex flex-col w-1/2 bg-[#3535C8] overflow-hidden">
      <div className="relative z-10 p-10">
        <Image src="/logo-white.png" alt="SAKTI AI" width={130} height={44} priority />
      </div>

      <div className="relative z-10 px-10 mt-auto mb-10">
        <span className="text-white text-7xl font-serif leading-none select-none">&ldquo;</span>
        <p className="text-white text-3xl font-bold leading-tight -mt-4">
          Temukan talentamu dengan exclusive talent mapper SAKTI.Ai
        </p>
        <span className="text-white text-7xl font-serif leading-none select-none flex justify-end -mt-2">&rdquo;</span>
      </div>

      <div className="absolute bottom-0 right-0 w-[75%]">
        <Image
          src="/woman-login.png"
          alt="SAKTI AI"
          width={500}
          height={600}
          className="object-contain object-bottom w-full"
        />
      </div>
    </div>
  )
}
