import { Providers } from './providers';
import './globals.css';

export const metadata = {
  title: 'Test App - Next.js & Laravel',
  description: 'Authentification avec JWT',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}