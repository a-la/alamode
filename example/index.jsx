import { render } from 'preact'

const Component = ({ test, ...props }) => (
  <div id="example" {...props}>
    {test}
  </div>
)
render(<Component cool>Example</Component>, document.body)