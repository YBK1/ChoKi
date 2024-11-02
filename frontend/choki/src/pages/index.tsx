import { useState } from 'react';
import CommonModal from '@/components/Common/Modal';
export default function Home() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	return (
		<div>
			<button onClick={() => setIsModalOpen(true)}>Open Modal</button>

			<CommonModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				size="large"
			>
				<div>Modal Content Here</div>
			</CommonModal>
		</div>
	);
}
