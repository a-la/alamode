import { render } from 'preact'
import { test as t } from './test'

const App = ({ test }) => <div>{test}-{t}</div>
render(<App />, document.body)