import React from 'react';

const inviteCodeModal = ({ size = 'medium', children }: ModalProps) => {
	const sizeStyles = {
		small: 'w-[300PX] h-[300px]',
		medium: 'w-[300px] h-[500px]',
		large: 'w-[300px] h-[700px]',
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			{/* Modal */}
			<div
				className={`
          relative 
          bg-white 
          rounded-lg 
          shadow-lg 
          ${sizeStyles[size]}
          p-6
        `}
			>
				{/* Content */}
				<div className="h-full w-full">{children}</div>
			</div>
		</div>
	);
};

export default inviteCodeModal;
