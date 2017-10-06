import React from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import Container from 'components/Container';
import DiscordWidget from 'components/DiscordWidget';
import WithLoading from 'components/WithLoading';
import { TableStriped } from 'components/List';
import LobbyItem from 'containers/LobbyItem';
import LobbyMessage from 'containers/LobbyMessage';

import { Section } from './styles';

const Lobby = (props) => {
  const { lobby, refreshing, handleRefresh } = props;

  return (
    <Container>
      <LobbyMessage
        bookmark="lobby-msg"
      />

      <TableStriped style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th key="number">#</th>
            <th key="blind">Blinds</th>
            <th key="play">Players </th>
            <th key="hand">Hand</th>
            <th key="actn" />
          </tr>
        </thead>
        {lobby && lobby.length > 0 && (
          <tbody>
            {lobby.map((tableAddr, i) =>
              <LobbyItem key={i} tableAddr={tableAddr} />
            )}
          </tbody>
        )}
      </TableStriped>

      <WithLoading
        isLoading={lobby.length === 0}
      />

      <Button
        style={{ width: '100%' }}
        onClick={handleRefresh}
        size="medium"
        disabled={refreshing}
      >
        <WithLoading
          isLoading={refreshing}
          loadingSize="14px"
          type="inline"
          styles={{
            inner: { marginLeft: 5 },
          }}
        >
          Refresh
        </WithLoading>
      </Button>


      <Section>
        <DiscordWidget />
      </Section>

    </Container>
  );
};

Lobby.propTypes = {
  lobby: PropTypes.array,
  refreshing: PropTypes.bool,
  handleRefresh: PropTypes.func,
};

export default Lobby;
