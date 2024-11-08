import Link from 'next/link';
import Image from 'next/image';
import homeIcon from '../../../assets/icons/home_nav.svg';
import mapIcon from '../../../assets/icons/child_nav_map.svg';
import profileIcon from '../../../assets/icons/child_nav_mypage.svg';

const ChildNavBar = () => {
	return (
		<div className="flex justify-around p-4 rounded-lg w-full max-w-md mx-auto mt-6">
			<Link href="/child/main">
				<div className="bg-light_yellow_nav p-1.5 rounded-xl flex items-center justify-center">
					<div className="bg-white p-2 rounded-xl">
						<Image src={homeIcon} alt="Home" width={50} height={50} />
					</div>
				</div>
			</Link>
			<Link href="/child/map">
				<div className="bg-light_yellow_nav p-1.5 rounded-xl flex items-center justify-center">
					<div className="bg-white p-2 rounded-xl">
						<Image src={mapIcon} alt="Map" width={50} height={50} />
					</div>
				</div>
			</Link>
			<Link href="/child/profile">
				<div className="bg-light_yellow_nav p-1.5 rounded-xl flex items-center justify-center">
					<div className="bg-white p-2 rounded-xl">
						<Image src={profileIcon} alt="Profile" width={50} height={50} />
					</div>
				</div>
			</Link>
		</div>
	);
};

export default ChildNavBar;
