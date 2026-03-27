import { Link, usePage } from '@inertiajs/react';
import Navbar from '@/Components/Navigation/Navbar';
import Footer from '@/Components/Navigation/Footer';

export default function GuestLayout({ children }) {
    return (
        <div className="guest-layout">
            <Navbar />
            <main>
                {children}
            </main>
            <Footer />
        </div>
    );
}
