import Unity, { UnityContext } from 'react-unity-webgl';

const unityContext = new UnityContext({
	loaderUrl: 'Build/Build.loader.js',
	dataUrl: 'Build/Build.data',
	frameworkUrl: 'Build/Build.framework.js',
	codeUrl: 'Build/Build.wasm',
});
export default function ChildMainPage() {
    return{ 
<div>
        return <Unity unityContext={unityContext} />
        </div>
    }
}
