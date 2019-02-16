// transpiles jsx with the require hood
function App() {
  return (
    <div className="test">
      Hello World
    </div>
  )
}

export { App }

console.log(App.toString())

/* stdout */
function App() {
  return (
    h('div',{className:"test"},
      `Hello World`
    )
  )
}

/**/

/* stderr */
/**/