import React from 'react';
import ReactDOM from 'react-dom';
import autobind from 'autobind-decorator';
import $ from 'jquery';

var APIUrl = "http://127.0.0.1:5000";

/*
  <Playlist/>
  The main playlist component
*/
@autobind
class Playlist extends React.Component {
  constructor() {
    super();

    this.state = {
      playlist : {
        items : {}
      }
    }
  }

  componentDidMount() {
    // Get data from man in the middle API
    $.ajax({
       url: APIUrl,
       type: "GET",
       context: this,
       success: function(data) {
         // Save the data to state
         this.state.playlist = data;
         this.setState({ playlist : this.state.playlist });
       },
       error: function(error) {
         console.log(error);
       }
    });
  }

  renderSong(key) {
    return <Song key={key} index={key} item={this.state.playlist.items[key]} />;
  }

  render() {
    return (
      <table id="main-table">
        <thead>
          <tr>
            <th id="player"></th>
            <th>Track</th>
            <th>Artist</th>
            <th>Album</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(this.state.playlist.items).reverse().map(this.renderSong)}
        </tbody>
      </table>
    )
  }
}

/*
  <Song />
  An individual song component
*/
@autobind
class Song extends React.Component {
  toggleTrack(trackId) {
    document.getElementById(trackId).play();
  }

  render() {
    let track = this.props.item.track;

    return (
      <tr>
        <td>
          <audio id={track.id} src={track.preview_url} preload="none"></audio>
          <a onClick={this.toggleTrack.bind(null, track.id)}>►</a>
        </td>
        <td><a href={track.external_urls.spotify} target="_blank">{track.name}</a></td>
        <td><a href={track.artists[0].external_urls.spotify} target="_blank">{track.artists[0].name}</a></td>
        <td><a href={track.album.external_urls.spotify} target="_blank">{track.album.name}</a></td>
      </tr>
    )
  }
}

ReactDOM.render(<Playlist/>, document.querySelector('#playlist'));
