export function HeaderText({ title }: { title: string }) {
	return <h1 className="font-semibold text-3xl">{title}</h1>;
}

export function SubHeaderText({ title }: { title: string }) {
	return <h2 className="font-semibold text-2xl">{title}</h2>;
}
