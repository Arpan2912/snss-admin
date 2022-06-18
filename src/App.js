import logo from './logo.svg';
import './App.css';
import TextEditor from './AddBlog';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <div className="App">
      <TextEditor style={{ width: '80%' }}></TextEditor>
    </div>
  );
}

export default App;
