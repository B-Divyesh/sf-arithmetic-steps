declare const __ARITHMETIC_STEPS_VERSION__: string;

/**
 * The package version is injected by Vite. Keeping this value in the compiled
 * modules lets the app and the two independently-built legal documents share
 * the same release identity.
 */
export const PRODUCT_VERSION = __ARITHMETIC_STEPS_VERSION__;

export function applyBuildVersion(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>("[data-build-version]").forEach((element) => {
    element.textContent = `Build ${PRODUCT_VERSION}`;
  });
}
