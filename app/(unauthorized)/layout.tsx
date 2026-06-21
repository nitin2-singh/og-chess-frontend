export default function UnAuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="pt-18">{children}</div>
    </>
  );
}
