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

  async getIdByBookmark(bookmark) {
    if (this.state.bookmarks) {
      return this.state.bookmarks[bookmark];
    }

    const r = await fetch('https://ab-marketing.prismic.io/api/v2');
    const json = await r.json();

    this.setState({
      bookmarks: json.bookmarks,
    });

    return json.bookmarks[bookmark];
  }

  async fetchDocument(bookmark) {
    const documentId = await this.getIdByBookmark(bookmark);
    const r = await fetch(`https://ab-marketing.prismic.io/api/v2/documents/search?ref=Wc4-7ScAACgANK0y&q=%5B%5Bat(document.id%2C+%22${documentId}%22)%5D%5D&format=json`, {
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
      return null;
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
