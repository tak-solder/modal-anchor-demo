import {useCallback, useEffect, useState} from 'react'
import './App.css'

type OptionType = 'click' | 'pagehide' | 'pageshow'

const OPTIONS = [
  {
    label: 'aタグのclickイベントでモーダルを閉じる',
    value: 'click' as OptionType,
  },
  {
    label: 'pagehideイベントでモーダルを閉じる',
    value: 'pagehide' as OptionType,
  },
  {
    label: 'pageshowイベントでモーダルを閉じる',
    value: 'pageshow' as OptionType,
  },
];

export function App() {
  const [closeActions, setCloseActions] = useState<OptionType[]>([]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <header className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
          <h1 className="text-3xl font-bold tracking-tight">モーダルで外部サイトを開くデモ</h1>
        </header>

        <div className="p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">オプション</h2>
          <ul className="space-y-2">
            {OPTIONS.map(({label, value}) => (
              <li key={value}>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="query"
                    value={value}
                    checked={closeActions.includes(value)}
                    className="form-checkbox h-5 w-5 text-indigo-600 transition duration-150 ease-in-out"
                    onChange={(event) => {
                      const checked = event.target.checked;
                      setCloseActions((prev) => {
                        if (checked) {
                          return [...prev, value];
                        } else {
                          return prev.filter((v) => v !== value);
                        }
                      });
                    }}
                  />
                  <span className="ml-2 text-gray-700">{label}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">動作検証</h2>
          <ul className="space-y-4">
            <li>
              <ModalButton blank={false} closeActions={closeActions}/>
            </li>
            <li>
              <ModalButton blank={true}  closeActions={closeActions}/>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

type ModalButtonProps = {
  blank: boolean;
  closeActions: OptionType[];
}

function ModalButton({blank, closeActions}: ModalButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleClose = useCallback(() => {
    console.debug('fire: ModalButton.handleClose')
    setIsOpen(false)
  }, []);

  const title = blank ? "別タブで遷移" : "同一タブで遷移"

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-indigo-300 cursor-pointer"
      >
        モーダル内から{title}する場合
      </button>

      {isOpen && (
          <Modal title={title} blank={blank} handleClose={handleClose} closeActions={closeActions} />
      )}
    </>
  )
}

type ModalProps = {
  title: string;
  blank: boolean;
  handleClose: () => void;
  closeActions: OptionType[];
}

function Modal({title, blank, handleClose, closeActions}: ModalProps) {
  console.debug('fire: Modal.render')

  const handleClickAnchor = useCallback(() => {
    console.debug('fire: Modal.handleClickAnchor')
    if (closeActions.includes('click')) {
      handleClose();
    }
  }, []);

  useEffect(() => {
    console.debug('fire: Modal.useEffect')

    const handlePageHide = (event: PageTransitionEvent) => {
      if (event.persisted) {
        console.debug('fire: handlePageHide')
        if (closeActions.includes('pagehide')) {
          handleClose();
        }
      }
    }
    window.addEventListener('pagehide', handlePageHide)

    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        console.debug('fire: handlePageShow')
        if (closeActions.includes('pageshow')) {
          handleClose();
        }
      }
    }
    window.addEventListener('pageshow', handlePageShow)

    return () => {
      console.debug('fire: Modal.cleanup')
      window.removeEventListener('pagehide', handlePageHide)
      window.removeEventListener('pageshow', handlePageShow)
    }
  }, [])

  console.debug('fire: Modal.render')
  return (<div className="relative z-50">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      {/* Modal container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0" onClick={handleClose}>
        <div
          className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full mx-auto overflow-hidden transform transition-all animate-in fade-in slide-in-from-bottom-4"
          onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 text-white">
            <h2 className="text-xl font-bold">{title}</h2>
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 text-white hover:text-indigo-100 transition-colors"
              aria-label="Close modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <a
              href="/modal-anchor-demo/other.html"
              onClick={handleClickAnchor}
              target={blank ? "_blank" : "_self"}
              className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105"
              rel={blank ? "noopener noreferrer" : ""}
            >
              {blank ? "別タブで遷移" : "同一タブで遷移"}
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
