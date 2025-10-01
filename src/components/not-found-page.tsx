import { useCanGoBack, useParams, useRouter } from "@tanstack/react-router"; // Import useNavigate

export function NotFoundPage() {
  const { main } = useParams({ strict: false });
  const homepagePath = main ? `/${main}` : "/";
  const canGoBack = useCanGoBack()
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-8">Page Not Found</p>
      <p className="text-md">The page you are looking for does not exist.</p>
      <div className="flex gap-4 mt-8"> {/* Use a div to contain buttons */}
        { canGoBack ? <button
          onClick={() => router.history.back() } // Go back
          className="px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors duration-200"
        >
          Go Back
        </button> : null}
        <a href={homepagePath} className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200">
          Go to Homepage
        </a>
      </div>
    </div>
  );
}
