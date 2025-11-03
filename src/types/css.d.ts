// CSS module declarations
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

// Side-effect CSS imports
declare module 'tldraw/tldraw.css';
