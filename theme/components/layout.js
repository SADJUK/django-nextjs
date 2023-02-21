import TopBar from "./Common/TopBar";

export default function Layout({ children, categories }) {

  return (
    <>
      <TopBar categories={categories} />
      <main>{children}</main>
    </>
  )
}