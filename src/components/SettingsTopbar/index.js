import Link from 'next/link';
import { useRouter } from 'next/router';

const influencerMenus = [
  {
    href: '/settings/profile',
    name: 'Profile',
  },
  {
    href: '/settings/socials',
    name: 'Socials',
  },
  {
    href: '/settings/niches',
    name: 'Niches',
  },
  {
    href: '/settings/packages',
    name: 'Packages',
  },
  {
    href: '/settings/bank',
    name: 'Bank',
  },
];

const brandMenus = [
  {
    href: '/settings/profile',
    name: 'Profile',
  },
];

const SettingsTopbar = ({ influencer, brand }) => {
  const router = useRouter();
  const menus = influencer ? influencerMenus : brandMenus;
  return (
    <div className='flex no-scrollbar overflow-y-auto w-full'>
      {menus.map(menu => {
        const active = router.pathname === menu.href;
        return (
          <div key={menu.href}>
            <Link href={menu.href}>
              <a
                className={`px-6 py-3 ${
                  active ? 'font-semibold border-b-2 border-gray-900' : 'hover:bg-gray-100'
                } text-gray-900 block`}
              >
                {menu.name}
              </a>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default SettingsTopbar;
