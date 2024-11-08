export const Toast = ({ message }: { message: string }) => (
	<div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 animate-fade-up">
		<div className="bg-black bg-opacity-80 text-white px-6 py-3 rounded-full shadow-lg">
			{message}
		</div>
	</div>
);
