import PseduoComponent from "@/components/pseudo-component/pseudo-component";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="pt-18">
        <PseduoComponent />
        {children}
      </div>
    </>
  );
}
