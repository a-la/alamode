// transpiles jsx with the require hook
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
    h('div',{className:"test", required:true, 'data-test':true},
      `Hello World`
    )
  )
}

/**/

/* stderr */
/**/

// resets the value of the global reverts
import alamode from '../../build'
alamode()
console.log(global.ALAMODE_JS)
console.log(global.ALAMODE_JSX)
alamode({
  pragma: 'const { h: createElement } = require("eact")',
})

/* stdout */
[Function: revert]
[Function: revert]

/**/

/* stderr */
Reverting JS hook to add new one.
Reverting JSX hook to add new one, pragma:
const { h } = require("preact");
Reverting JS hook to add new one.
Reverting JSX hook to add new one, pragma:
const { h: createElement } = require("eact")

/**/