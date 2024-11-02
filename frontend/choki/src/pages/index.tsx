import { useState } from 'react';
import CommonInput from '@/components/Common/Input';
export default function Home() {
	const [value, setValue] = useState('');

	return (
		<CommonInput
			placeholder="텍스트를 입력하세요"
			value={value}
			onChange={e => setValue(e.target.value)}
		/>
	);
}
