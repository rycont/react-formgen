import React, { useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from 'react-router-dom'
import { MdDarkMode, MdLightMode, MdExpandMore } from 'react-icons/md'
import {
  JsonSchemaExample,
  JsonSchemaComplexExample,
  JsonSchemaWithRecursiveRefsExample,
  JsonSchemaWithDevToolsExample,
} from './examples/JsonSchema'
import { YupSchemaExample, YupSchemaComplexExample } from './examples/Yup'
import { ZodSchemaExample, ZodSchemaComplexExample } from './examples/Zod'
import { useWindowSize } from './hooks/useWindowSize'
import { useThemeContext } from '@/theme/ThemeProvider'

/**
 * Configuration for navigation links and routes
 */
const links = [
  {
    title: 'JSON Schema',
    links: [
      { title: 'Simple', path: '/json-schema' },
      { title: 'Complex', path: '/json-schema/complex' },
      { title: 'Recursive Refs', path: '/json-schema/recursive-refs' },
      { title: 'Devtools', path: '/json-schema/devtools' },
    ],
  },
  {
    title: 'Yup Schema',
    links: [
      { title: 'Simple', path: '/yup-schema' },
      { title: 'Complex', path: '/yup-schema/complex' },
    ],
  },
  {
    title: 'Zod Schema',
    links: [
      { title: 'Simple', path: '/zod-schema' },
      { title: 'Complex', path: '/zod-schema/complex' },
    ],
  },
]

/**
 * Custom Select Component with better styling
 */
const CustomSelect: React.FC<{
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  options: Array<{ title: string; value?: string }>
  placeholder?: string
  className?: string
}> = ({ value, onChange, options, placeholder, className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      <select
        value={value}
        onChange={onChange}
        className={`w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2.5 pr-10 text-sm font-medium text-gray-900 transition-all duration-200 ease-in-out hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:hover:border-gray-500 dark:focus:border-blue-400`}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.title} value={option.value || option.title}>
            {option.title}
          </option>
        ))}
      </select>
      <MdExpandMore className="pointer-events-none absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
    </div>
  )
}

/**
 * Theme Toggle Button Component
 */
const ThemeToggle: React.FC<{
  isDarkMode: boolean
  toggleDarkMode: () => void
}> = ({ isDarkMode, toggleDarkMode }) => {
  return (
    <button
      onClick={toggleDarkMode}
      className={`relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 transition-all duration-200 ease-in-out hover:border-gray-400 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500/20 focus:outline-none active:scale-95 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:bg-gray-700`}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDarkMode ? (
        <MdLightMode className="h-5 w-5" />
      ) : (
        <MdDarkMode className="h-5 w-5" />
      )}
    </button>
  )
}

/**
 * Redirect component for default route
 */
const Redirect = () => {
  const navigate = useNavigate()
  useEffect(() => {
    navigate('/json-schema')
  }, [navigate])
  return null
}

/**
 * Main App Component
 */
const App = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const size = useWindowSize()
  const { isDarkMode, toggleDarkMode } = useThemeContext()

  // State variables for the selected schema type and subpath
  const [selectedSchemaType, setSelectedSchemaType] = useState('')
  const [selectedSubpath, setSelectedSubpath] = useState('')

  // Update state based on the current location
  useEffect(() => {
    const currentLink = links.find((link) =>
      link.links.some((sublink) => sublink.path === location.pathname),
    )

    if (currentLink) {
      setSelectedSchemaType(currentLink.title)
      const currentSublink = currentLink.links.find(
        (sublink) => sublink.path === location.pathname,
      )
      setSelectedSubpath(currentSublink?.title || currentLink.links[0].title)
    } else {
      setSelectedSchemaType(links[0].title)
      setSelectedSubpath(links[0].links[0].title)
    }
  }, [location])

  // Get the subpaths for the selected schema type
  const currentSchemaTypeLinks = links.find(
    (link) => link.title === selectedSchemaType,
  )

  const handleSchemaTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSchemaTypeTitle = e.target.value
    setSelectedSchemaType(newSchemaTypeTitle)

    const newSchemaType = links.find(
      (link) => link.title === newSchemaTypeTitle,
    )
    if (newSchemaType) {
      const newSubpath = newSchemaType.links[0]
      setSelectedSubpath(newSubpath.title)
      navigate(newSubpath.path)
    }
  }

  const handleSubpathChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSubpathTitle = e.target.value
    setSelectedSubpath(newSubpathTitle)

    const schemaType = links.find((link) => link.title === selectedSchemaType)
    if (schemaType) {
      const subpath = schemaType.links.find(
        (sublink) => sublink.title === newSubpathTitle,
      )
      if (subpath) {
        navigate(subpath.path)
      }
    }
  }

  const isMobile = size.width && size.width < 768

  return (
    <div className="min-h-screen bg-gray-50 transition-colors duration-200 dark:bg-gray-900">
      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-900/80">
        {/* <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"> */}
        <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
          {/* <div className="flex h-16 items-center justify-between"> */}
          <div className="flex items-center justify-between">
            {/* Logo/Title */}
            <div className="flex items-center gap-3">
              <img
                src="/m6.svg"
                alt="M6 Logo"
                className="h-8 w-auto"
                aria-hidden="true"
              ></img>
              <h1 className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-xl font-bold text-transparent dark:from-gray-100 dark:to-gray-400">
                @react-formgen
              </h1>
            </div>

            {/* Controls */}
            <div
              className={`flex items-center gap-3 ${isMobile ? 'flex-col' : 'flex-row'}`}
            >
              {isMobile ? (
                <div className="flex w-full flex-col gap-2">
                  <CustomSelect
                    value={selectedSchemaType}
                    onChange={handleSchemaTypeChange}
                    options={links}
                    className="w-full"
                  />
                  <div className="flex gap-2">
                    <CustomSelect
                      value={selectedSubpath}
                      onChange={handleSubpathChange}
                      options={currentSchemaTypeLinks?.links || []}
                      className="flex-1"
                    />
                    <ThemeToggle
                      isDarkMode={isDarkMode}
                      toggleDarkMode={toggleDarkMode}
                    />
                  </div>
                </div>
              ) : (
                <>
                  <CustomSelect
                    value={selectedSchemaType}
                    onChange={handleSchemaTypeChange}
                    options={links}
                    className="w-48"
                  />
                  <CustomSelect
                    value={selectedSubpath}
                    onChange={handleSubpathChange}
                    options={currentSchemaTypeLinks?.links || []}
                    className="w-40"
                  />
                  <ThemeToggle
                    isDarkMode={isDarkMode}
                    toggleDarkMode={toggleDarkMode}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <Routes>
            <Route path="/json-schema" element={<JsonSchemaExample />} />
            <Route
              path="/json-schema/complex"
              element={<JsonSchemaComplexExample />}
            />
            <Route
              path="/json-schema/recursive-refs"
              element={<JsonSchemaWithRecursiveRefsExample />}
            />
            <Route
              path="/json-schema/devtools"
              element={<JsonSchemaWithDevToolsExample />}
            />
            <Route path="/yup-schema" element={<YupSchemaExample />} />
            <Route
              path="/yup-schema/complex"
              element={<YupSchemaComplexExample />}
            />
            <Route path="/zod-schema" element={<ZodSchemaExample />} />
            <Route
              path="/zod-schema/complex"
              element={<ZodSchemaComplexExample />}
            />
            <Route path="*" element={<Redirect />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}

const RootApp = () => {
  return (
    <Router>
      <App />
    </Router>
  )
}

export default RootApp
