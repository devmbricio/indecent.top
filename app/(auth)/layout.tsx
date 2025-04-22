function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="relative w-[30%] h-[30%] bg-center">
        {/* Este contêiner será o fundo centralizado */}
      </div>
      <div className="absolute">{children}</div>
    </div>
  );
}

export default AuthLayout;


/*
function AuthLayout({ children }: { children: React.ReactNode }) {
  return <div className="grid place-items-center h-screen overflow-hidden md:bg-fixed bg-auto bg-fixed bg-center md:mr-0 md:ml-0  bg-[url('/indecent-top-logo.png')] md:bg-[url('/indecent-top-logo.png')] ">{children}</div>;
}

export default AuthLayout;
*/