interface IconProps {
	src: IconSource
	theme?: string
	size?: string
	[key: string]: any
}

export interface IconSource {
	default: any
	[key: string]: any
}

const reactifyProps = (props: any) => {
	const newProps: any = {}
	for (const key in props) {
		const newKey = key.replace(/-(\w)/g, (m, p1) => p1.toUpperCase())
		newProps[newKey] = props[key]
	}
	return newProps
}

export default function Icon(props: IconProps) {
	const { src, size, theme, ...rest } = props
	const icon = src[theme as any] || src.default || Object.values(src)[0]

	if (!icon) return <></>

	return (
		<svg
			{...reactifyProps(icon.a)}
			xmlns="http://www.w3.org/2000/svg"
			width={size}
			height={size}
			{...rest}
		>
			{icon.path?.map((a:any,i:number) => <path key={i} {...reactifyProps(a)}></path>)}
			{icon.rect?.map((a:any,i:number) => <rect key={i} {...reactifyProps(a)}></rect>)}
			{icon.circle?.map((a:any,i:number) => <circle key={i} {...reactifyProps(a)}></circle>)}
			{icon.polyline?.map((a:any,i:number) => <polyline key={i} {...reactifyProps(a)}></polyline>)}
			{icon.polygon?.map((a:any,i:number) => <polygon key={i} {...reactifyProps(a)}></polygon>)}
			{icon.line?.map((a:any,i:number) => <line key={i} {...reactifyProps(a)}></line>)}
		</svg>
	)
}