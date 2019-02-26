// transpiles jsx with the require hood
function App() {
  return (
    <div className="test" required data-test>
      Hello World
    </div>
  )
}

export { App }

console.log(App.toString())

/* stdout */
function App() {
  return (
    h('div',{className:"test", required:'', 'data-test':''},
      `Hello World`
    )
  )
}

/**/

/* stderr */
/**/