import PseduoComponent from "@/components/pseudo-component/pseudo-component";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="">
        <PseduoComponent />
        {children}
      </div>
    </>
  );
}
