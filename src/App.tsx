import {useCallback, useState} from 'react'
import './App.css'

export function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Modal Button Example</h1>
      </header>

      <h2>Contents</h2>
      <ul className="space-y-2">
        <li>
          <ModalButton href="https://github.com/tak-solder/modal-link" title="同一タブで開く" anchorText="GitHubリポジトリへのリンク" blank={false} />
        </li>
        <li>
          <ModalButton href="https://handat.hatenablog.com" title="別タブで開く" anchorText="handatのブログへのリンク" blank={true} />
        </li>
      </ul>
    </div>
  )
}

type ModalButtonProps = {
  href: string;
  title: string
  anchorText: string;
  blank: boolean;
}

function ModalButton({href, title, blank}: ModalButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleClose = useCallback(() => {
    setIsOpen(false)
  }, []);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>モーダルを開く</button>
      {isOpen && (
        <div>
          <div className="fixed inset-0 z-10 overflow-y-auto bg-black opacity-30" onClick={handleClose}/>
          <div className="fixed inset-0 z-20 flex items-center justify-center">
            <header className="bg-white p-4">
              <button onClick={handleClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
                ×
              </button>
              <h2 className="text-lg font-bold">{title}</h2>
            </header>
            <div className="bg-white p-4">
              <a href={href} target={blank ? "_blank" : "_self"} className="bg-white p-4 rounded shadow-lg">
                {title}モーダル
              </a>
            </div>
          </div>
        </div>

      )}
    </>
  )
}

export default App
