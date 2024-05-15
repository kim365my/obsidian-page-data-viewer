
export default function Header({ header }: {
	header: string
}) {
	return (
		<h2 className="HyperMD-header HyperMD-header-2">
			<span className="cm-header cm-header-2">{header}</span>
		</h2>
	);
}
