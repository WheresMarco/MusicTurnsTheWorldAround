import React from 'react';
import ReactDOM from 'react-dom';

/*
  <Playlist/>
  The main playlist component
*/
class Playlist extends React.Component {
  render() {
    return (
      <table id="main-table">
        <thead>
          <tr>
            <th></th>
            <th>Track</th>
            <th>Artist</th>
            <th>Album</th>
          </tr>
        </thead>
        <tbody>
          <Song />
        </tbody>
      </table>
    )
  }
}

/*
  <Song />
  An individual song component
*/
class Song extends React.Component {
  render() {
    return (
      <tr>
        <td>►</td>
        <td><a href="#" target="_blank">Uma</a></td>
        <td><a href="#" target="_blank">Panama Wedding</a></td>
        <td><a href="#" target="_blank">Parallel Play</a></td>
      </tr>
    )
  }
}

ReactDOM.render(<Playlist/>, document.querySelector('#playlist'));
