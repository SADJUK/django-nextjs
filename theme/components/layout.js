import TobBar from "./TopBar";

export default function Layout({ children, categories }) {

  return (
    <>
      <TobBar categories={categories} />
      <main>{children}</main>
    </>
  )
}