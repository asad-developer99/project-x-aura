import AuraPage from "./components/AuraPage";

const ICON = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#0F1011"/><circle cx="32" cy="32" r="20" fill="none" stroke="#C9B8FF" stroke-width="3" stroke-dasharray="2 4"/><circle cx="32" cy="32" r="4" fill="#EDECE8"/></svg>`,
)}`;

/** Aura Sound: spin a product with your scroll wheel. Plan + Motion map: site/DESIGN.md. */
export default function Page() {
  return (
    <>
      {/* never restore the old scroll position on reload · cover the page as it unloads so a reload never flashes the
          old page · ?record=1: hide the mouse arrow from the first frame */}
      <script
        dangerouslySetInnerHTML={{
          __html: `history.scrollRestoration="manual";addEventListener("pagehide",function(){var c=document.createElement("div");c.style.cssText="position:fixed;inset:0;z-index:2147483647;background:#0F1011";document.body.appendChild(c)});addEventListener("pageshow",function(e){if(e.persisted)location.reload()});if(/[?&]record/.test(location.search)){var s=document.createElement("style");s.textContent="*,*::before,*::after{cursor:none!important}html{scrollbar-width:none}html::-webkit-scrollbar{display:none}";document.head.appendChild(s)}`,
        }}
      />
      <link rel="icon" type="image/svg+xml" href={ICON} />
      <link rel="preload" as="image" href="/images/aura/travel/key-front.png" />
      <AuraPage />
    </>
  );
}
