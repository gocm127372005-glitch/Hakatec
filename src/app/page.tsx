import { redirect } from "next/navigation";

// Esta ruta solo redirige; una redirección nunca es "instantánea", así que
// la excluimos de la validación de instant navigation de Cache Components.
export const instant = false;

export default function RootPage() {
  redirect("/login");
}
