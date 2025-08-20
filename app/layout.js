import './globals.css';

export const metadata = {
  title: 'DAS STOK AKRAB',
  description: 'Dashboard Management Stok Paket Kuota',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />
      </head>
      <body className="content-wrapper">
        <div className="layout-vert">
          <main>
            {children}
          </main>
          <footer className="bg-brand text-white py-3">
            <div className="container text-center">
              <p className="mb-0">oodana store &copy; 2025</p>
            </div>
          </footer>
        </div>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
      </body>
    </html>
  );
}


