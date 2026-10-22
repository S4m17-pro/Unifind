export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="flex min-h-[calc(100vh-8rem)] flex-col lg:pr-0">{children}</div>;
}
