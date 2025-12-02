"use client"
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CirclePlus, PackageCheck, ClipboardList } from 'lucide-react';

const SideBar = () => {
    const pathname = usePathname()
    const menuItems = [
        {
            name: 'Add Product',
            path: '/seller',
            icon: CirclePlus
        },


        {
            name: 'Product List',
            path: '/seller/product-list',
            icon: ClipboardList
        },

        {
            name: 'Orders',
            path: '/seller/orders',
            icon: PackageCheck
        },
    ];

    return (
        <div className='mt-16 bg-background lg:w-64 w-16 border-r sticky left-0 min-h-screen text-base border-gray-500/30 py-2 flex flex-col z-50'>
            {menuItems.map((item) => {

                const isActive = pathname === item.path;

                return (
                    <Link href={item.path} key={item.name} passHref>
                        <div
                            className={
                                `flex items-center py-3 px-4 gap-3 ${isActive
                                    ? "border-r-4 lg:border-r-[6px] bg-orange-600/50 border-orange-500"
                                    : "hover:bg-accent border-white"
                                }`
                            }
                        >
                            <item.icon size={25} strokeWidth={1.5} />
                            <p className='lg:block hidden text-center'>{item.name}</p>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
};

export default SideBar;
