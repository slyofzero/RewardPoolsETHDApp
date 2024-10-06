import { Link } from "./Common";
import { buttonCva } from "./Common/Button";

export function Header() {
  return (
    <header className="flex justify-between items-center">
      <h1></h1>

      <div className="flex gap-4">
        <Link href={"/signin"} className={buttonCva({ type: "light" })}>
          Sign In
        </Link>
      </div>
    </header>
  );
}
