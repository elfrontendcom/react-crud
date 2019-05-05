import axios from 'axios';
import React from 'react';
import './App.css';
import loadingGif from './loading.gif';

import ListItem from './ListItem';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      newTodo: '',
      editing: false,
      editingIndex: null,
      notification: null,
      todos: [],
      loading: true
    };

    this.apiUrl ='https://5cce4f189eb94f0014c4820b.mockapi.io';

    this.handleChange = this.handleChange.bind(this);
    this.addTodo = this.addTodo.bind(this);
    this.deleteTodo = this.deleteTodo.bind(this);
    this.updateTodo = this.updateTodo.bind(this);
    this.editTodo = this.editTodo.bind(this);
    this.alert = this.alert.bind(this);
  }

  handleChange(event){
    this.setState({
      newTodo: event.target.value
    });
  }

  async addTodo() {  
    this.setState({
      loading: true,
    });
    const response = await axios.post(`${this.apiUrl}/todos`,{
      name: this.state.newTodo
    });

    const todos = this.state.todos;
    todos.push(response.data);

    setTimeout(() => {
      this.setState({
        todos: todos,
        newTodo: '',
        loading: false
      })
    },1000);
    this.alert('Todo added successfully');
  }

  async deleteTodo(index) {
    this.setState({
      loading: true,
    });
    const todos = this.state.todos;
    const todo = todos[index];

    await axios.delete(`${this.apiUrl}/todos/${todo.id}`);

    delete todos[index];
    setTimeout(() => {
      this.setState({ 
        todos,
        loading: false 
      });
    }, 1000);
    
    this.alert('Todo deleted successfully');
  }

  editTodo(index) {
    this.setState({
      loading: true,
    });
    const todo = this.state.todos[index];
    setTimeout(() => {
      this.setState({
        newTodo: todo.name,
        editingIndex: index,
        loading: false,
        editing: true
      })
    }, 1000);
  }

  async updateTodo() {
    this.setState({
      loading: true,
    });
      const todo = this.state.todos[this.state.editingIndex];
      const response = await axios.put(`${this.apiUrl}/todos/${todo.id}`,{
        name: this.state.newTodo
      });

      console.log(response);

      const todos = this.state.todos;
      todos[this.state.editingIndex] = response.data;   
      setTimeout(() => {
        this.setState({ 
          todos, 
          editing: false, 
          editingIndex: null, 
          newTodo: '',
          loading: false
        })
      },1000);
      this.alert('Todo updated successfully');
  }

  alert(notification) {
    this.setState({
      notification
    });

    setTimeout(() => {
      this.setState({
        notification: null
      })
    }, 2000)
  }

  componentWillMount() {
    console.log('Component will mount');
  }
  
  async componentDidMount() {
    const response = await axios.get(`${this.apiUrl}/todos`);
    setTimeout(() => {
      this.setState({
        todos: response.data,
        loading: false
      })
    }, 1000);
  }

  render() {
    return(
      <div className="container">
        {
          this.state.notification && 
          <div className="alert alert-success mt-4">
            <p className="text-center">{this.state.notification}</p>
          </div>
        }
        <input 
          type="text" 
          name="todo"
          className="my-4 form-control"
          placeholder="add a new todo"
          onChange={this.handleChange}
          value={this.state.newTodo}
        />
        <button 
          onClick={this.state.editing ? this.updateTodo : this.addTodo}
          className="btn-success mb-3 form-control"
          disabled={this.state.newTodo.length < 5}
        >
          {this.state.editing ? 'Update todo' : 'Add todo'}
        </button>
        {
          this.state.loading &&
          <img src={loadingGif} alt="" className="loadingGif"/>
        }
        {
          ((!this.state.editing || this.state.loading) && !this.state.loading) &&
          <ul className="list-group">
            {this.state.todos.map((item, index) => {
              return <ListItem 
                key={item.id}
                item={item}
                editTodo={ () => { this.editTodo(index); }}
                deleteTodo={ () => { this.deleteTodo(index); }}
              />
            })}
          </ul>
        }
      </div>
    )
  }
}

export default App;