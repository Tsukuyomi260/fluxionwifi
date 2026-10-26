import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#F5F7FA]">
      <div className="hidden lg:flex lg:w-1/2 bg-[#0B1E4D] items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B1E4D] via-[#132d6b] to-[#2B7FFF]/30" />
        <div className="relative z-10 text-center text-white space-y-6 px-12">
          <Image
            src="/logo.jpg"
            alt="FLUXIONWIFI"
            width={120}
            height={120}
            className="mx-auto rounded-2xl"
          />
          <h1 className="text-3xl font-bold">FLUXIONWIFI</h1>
          <p className="text-lg text-white/80 leading-relaxed">
            La plateforme de gestion de zones WiFi avec paiement Mobile Money
            pour l&apos;Afrique.
          </p>
          <p className="text-sm text-white/50">Connecte votre monde</p>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
