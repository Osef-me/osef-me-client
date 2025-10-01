/// <reference types="vite/client" />

/**
 * Imports the SVG file as a React component.
 * @requires [vite-plugin-svgr](https://npmjs.com/package/vite-plugin-svgr)
 */
declare module '*.svg?react' {
  import type React from 'react'
  const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
  export default ReactComponent
}
