

interface LegalDocProps {
  title: string;
  content: string;
}

export function LegalDocumentRenderer({ title, content }: LegalDocProps) {
  const lines = content.split('\n');

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-8">
        <article className="space-y-4">
          {lines.map((line, idx) => {
            if (!line.trim()) return null;

            if (line.startsWith('# ')) {
              return (
                <h1 key={idx} className="text-4xl font-bold mt-8 mb-6 text-gray-900">
                  {line.replace('# ', '')}
                </h1>
              );
            }
            if (line.startsWith('## ')) {
              return (
                <h2 key={idx} className="text-2xl font-bold mt-6 mb-4 text-gray-800">
                  {line.replace('## ', '')}
                </h2>
              );
            }
            if (line.startsWith('### ')) {
              return (
                <h3 key={idx} className="text-xl font-semibold mt-4 mb-2 text-gray-700">
                  {line.replace('### ', '')}
                </h3>
              );
            }
            if (line.startsWith('- ')) {
              return (
                <li key={idx} className="ml-6 text-gray-700 leading-relaxed">
                  {line.replace('- ', '')}
                </li>
              );
            }
            if (line.startsWith('**') && line.includes(':')) {
              return (
                <p key={idx} className="font-semibold text-gray-800 mt-3 mb-2">
                  {line.replace(/\*\*/g, '')}
                </p>
              );
            }
            if (line.startsWith('*') && line.endsWith('*')) {
              return (
                <p key={idx} className="italic text-gray-600 mt-4 pt-4 border-t border-gray-200">
                  {line.replace(/\*/g, '')}
                </p>
              );
            }
            return (
              <p key={idx} className="text-gray-700 leading-relaxed">
                {line}
              </p>
            );
          })}
        </article>
      </div>
    </div>
  );
}
