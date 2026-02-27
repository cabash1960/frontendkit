import { ErrorBoundary } from "react-error-boundary";
import Errorfallback from "./errorfallback";

function ErrorBoundaryComp({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      FallbackComponent={Errorfallback}
      onError={(error, info) => console.error("Logged Error:", info, error)}
    >
      {children}
    </ErrorBoundary>
  );
}

export default ErrorBoundaryComp;
