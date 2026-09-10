export function generateStaticParams() {
  // ponytail: one placeholder so `output: export` can emit /dashboard/:id
  return [{ id: "_" }];
}

export default function BusinessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
