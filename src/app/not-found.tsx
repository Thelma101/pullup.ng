import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page-shell flex min-h-[70vh] flex-col items-center justify-center px-5 pt-[4.25rem] text-center">
      <h1 className="font-display text-4xl font-bold">Wrong turn</h1>
      <p className="mt-3 text-steel">That page isn’t on the map.</p>
      <Link href="/" className="btn-primary mt-8">
        Go home
      </Link>
    </div>
  );
}
