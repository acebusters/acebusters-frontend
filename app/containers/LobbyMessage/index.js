import React from 'react';
import PropTypes from 'prop-types';

import { RichText } from 'prismic-reactjs';

export default class LobbyMessage extends React.Component {
  static propTypes = {
    bookmark: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      document: null,
      bookmarks: null,
    };

    this.fetchDocument(props.bookmark);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.bookmark !== this.props.bookmark) {
      this.fetchDocument(nextProps.bookmark);
    }
  }

  async fetchSettings() {
    const r = await fetch('https://ab-marketing.prismic.io/api/v2');
    const json = await r.json();

    this.setState({
      bookmarks: json.bookmarks,
      ref: json.refs[0].ref,
    });
  }

  async fetchDocument(bookmark) {
    if (!this.state.bookmarks) {
      await this.fetchSettings();
    }

    const { ref, bookmarks } = this.state;
    const documentId = await bookmarks[bookmark];

    const r = await fetch(`https://ab-marketing.prismic.io/api/v2/documents/search?ref=${ref}&q=%5B%5Bat(document.id%2C+%22${documentId}%22)%5D%5D&format=json`, {
      headers: {
        Accept: 'application/json',
      },
    });
    const { results } = await r.json();

    if (results && results.length === 1) {
      this.setState({
        document: results[0],
      });
    }
  }

  render() {
    const { document } = this.state;

    if (!document) {
      return <div style={{ minHeight: 380 }} />;
    }

    return (
      <div>
        {RichText.render(document.data.title)}
        {RichText.render(document.data.message)}
        {document.data.embed && document.data.embed.html &&
          <div dangerouslySetInnerHTML={{ __html: document.data.embed.html }} />
        }
      </div>
    );
  }

}
