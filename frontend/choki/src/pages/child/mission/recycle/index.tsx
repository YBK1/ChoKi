import BottomNavbar from '@/components/Common/Navbar/BottomNavbar';

const RecyclePage = () => {
	return (
		<div
			style={{
				backgroundImage: "url('/icons/recycle_background.svg')", // Adjust path if it's in a subfolder, like `/images/recycle_background.svg`
				backgroundSize: 'cover',
				backgroundPosition: 'center',
				minHeight: '100vh',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'space-between',
			}}
		>
			{/* Main content */}
			<div style={{ flex: 1 }}>
				<h1 className="text-center text-2xl font-bold">Recycle Page</h1>
				<p className="text-center mt-4">Content goes here...</p>
			</div>

			{/* Bottom Navbar */}
			<BottomNavbar />
		</div>
	);
};

export default RecyclePage;
