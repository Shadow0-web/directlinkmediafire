import { useState } from "react"
import StarryBackground from "./star-animation"

export default function MediafireBypass() {
  const [url, setUrl] = useState("")
  const [result, setResult] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const bypassLink = async () => {
    if (!url) return
    setIsLoading(true)
    setResult("Procesando...")
    try {
      const apiUrl = `https://api.solar-x.top/api/v3/bypass?url=${encodeURIComponent(url)}`
      const response = await fetch(apiUrl)

      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`)
      }
      const data = await response.json()
      if (data.result) {
        setResult(data.result)
      } else {
        setResult("Error: No se encontró un enlace bypassed en la respuesta.")
      }
    } catch (error) {
      console.error("Error:", error)
      setResult(`Error: ${error instanceof Error ? error.message : "No se pudo conectar con la API."}`)
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = () => {
    if (!result.startsWith("http")) return
    navigator.clipboard.writeText(result)
      .then(() => {
        alert("Enlace copiado al portapapeles!")
      })
      .catch(err => {
        console.error("Error al copiar: ", err)
      })
  }

  return (
    <div className="min-h-screen flex justify-center items-center p-4">
      <StarryBackground />

      <div className="w-full max-w-md bg-black/30 backdrop-blur-sm p-6 rounded-lg border border-gray-800 z-10">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Enlaces directos Mediafire</h1>

        <div className="space-y-4">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Ingresa el enlace aquí"
            className="w-full p-3 bg-gray-900 text-white rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={bypassLink}
            disabled={isLoading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded transition-colors"
          >
            {isLoading ? "Generando..." : "Generar"}
          </button>
          {result && (
            <div className="mt-4 p-4 bg-gray-900 border border-gray-700 rounded-lg break-all">
              <p className="text-white font-medium mb-2">Enlace directo:</p>
              <a
                href={result.startsWith("http") ? result : "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors block mb-2"
              >
                {result}
              </a>
              {result.startsWith("http") && (
                <button
                  onClick={copyToClipboard}
                  className="py-2 px-4 bg-gray-800 hover:bg-gray-700 text-white rounded transition-colors text-sm"
                >
                  Copiar enlace
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}