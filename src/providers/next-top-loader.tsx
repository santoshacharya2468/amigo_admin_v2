import NextTopLoader from "nextjs-toploader";

export default function TopBarLoader() {
  return (
    <NextTopLoader
      showSpinner={false}
      height={20}
      zIndex={1000}
      color="#rgb(190, 39, 39)"
    />
  );
}
