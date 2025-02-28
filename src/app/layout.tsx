import '@/app/globals.css';
import { Poppins } from 'next/font/google'

const poppins = Poppins({ subsets: ['latin'], weight: ['300', '400', '600', '700'] })

export const metadata = {
    title: 'To-do',
    description: 'Simple to-do app by S',
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
        <body><div className={poppins.className}>{children}</div></body>
        </html>
    );
}
