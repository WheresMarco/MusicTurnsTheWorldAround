import React from 'react';
import ReactDOM from 'react-dom';
import autobind from 'autobind-decorator';
import $ from 'jquery';

/*
  <Playlist/>
  The main playlist component
*/
@autobind
class Playlist extends React.Component {
  constructor() {
    super();

    this.state = {
      token : 'BQDcyC2Qi3hZd7gibgv1BM2PAAE7mYnXzJHHggyPfI82NQQ0qFJYMOB-vhRp_Ox-eXVN_HmS7yaGF48GGV2O7g',
      playlist : {
        items : {}
      }
    }
  }

  componentDidMount() {
    // Get access token from spotify

    // Get data from Spotify
    $.ajax({
       url: "https://api.spotify.com/v1/users/evil/playlists/27xfuWd9P7XaTNxLriKY6S/tracks",
       type: "GET",
       context: this,
       beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + this.state.token);},
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
