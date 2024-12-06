import type { ReactNode } from "react";
import { useNavigation } from "react-router";
import { useSpinDelay } from "spin-delay";

export function LoadingOverlay({ children }: { children?: ReactNode }) {
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";
  const isSearching = new URLSearchParams(navigation.location?.search).has("q");

  const shouldShow = useSpinDelay(isLoading && !isSearching);

  return (
    <div className={shouldShow ? "opacity-50 transition-opacity" : undefined}>
      {children}
    </div>
  );
}
