export const metadata = { title: "Yousef Admin", description: "Free Next.js Admin Panel" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
