import Image from 'next/image'

export default function AuthLeftPanel() {
  return (
    <div className="relative hidden lg:flex w-1/2 bg-[#3535C8] overflow-hidden min-h-screen">

      {/* Logo — top left */}
      <div className="absolute top-8 left-8 z-20">
        <Image
          src="/logo-white.png"
          alt="SAKTI AI"
          width={140}
          height={48}
          style={{ width: 140, height: 'auto' }}
          priority
        />
      </div>

      {/* Quote — left half, vertically centered */}
      <div className="absolute inset-y-0 left-0 w-[52%] flex flex-col justify-center px-8 z-20">
        <span className="text-white font-bold leading-none select-none" style={{ fontSize: '5rem' }}>
          &ldquo;
        </span>
        <p className="text-white text-2xl font-bold leading-snug -mt-3">
          Temukan talentamu dengan exclusive talent mapper SAKTI.Ai
        </p>
        <div className="flex justify-end mt-3">
          <span className="text-white font-bold leading-none select-none" style={{ fontSize: '5rem' }}>
            &rdquo;
          </span>
        </div>
      </div>

      {/* Woman photo — right portion, full height */}
      <div className="absolute right-0 inset-y-0 w-[62%]">
        <Image
          src="/woman-login.png"
          alt=""
          fill
          className="object-contain object-right-bottom"
          priority
        />
      </div>
    </div>
  )
}
