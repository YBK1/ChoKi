import React from 'react';

interface ModalProps {
	children: React.ReactNode;
}

const InviteCodeModal = ({ children }: ModalProps) => {
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			{/* Modal */}
			<div
				className="
          relative 
          bg-white 
          rounded-lg 
          shadow-lg 
          p-6
        "
				style={{ width: '316px', height: '464px' }}
			>
				{/* Content */}
				<div className="h-full w-full">{children}</div>
			</div>
		</div>
	);
};

export default InviteCodeModal;
