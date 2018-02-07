import React from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import Container from 'components/Container';
import WithLoading from 'components/WithLoading';
import { TableStriped } from 'components/List';
import LobbyItem from 'containers/LobbyItem';
import LobbyMessage from 'containers/LobbyMessage';

import { Section } from './styles';

const Lobby = (props) => {
  const { lobby, refreshing, handleRefresh } = props;

  return (
    <Container>
      <Section>
        <LobbyMessage
          bookmark="lobby-msg"
        />
      </Section>

      <Section>
        <WithLoading
          styles={{ outer: { width: '100%', minHeight: 300 } }}
          isLoading={lobby.length === 0}
        >
          <TableStriped>
            <thead>
              <tr>
                <th key="addr" style={{ textAlign: 'left' }}>
                  #
                </th>
                <th key="name" style={{ textAlign: 'left' }}>
                  Table
                </th>
                <th key="blind">Blinds</th>
                <th key="play">Players </th>
                <th key="hand">Hand</th>
                <th key="actn" />
              </tr>
            </thead>
            <tbody>
              {lobby.map((tableAddr, i) =>
                <LobbyItem key={i} tableAddr={tableAddr} />
              )}
            </tbody>
          </TableStriped>
        </WithLoading>
        <Button
          style={{ width: '100%' }}
          onClick={handleRefresh}
          size="medium"
          disabled={refreshing}
        >
          <WithLoading
            isLoading={!!refreshing}
            loadingSize="14px"
            type="inline"
            styles={{
              inner: { marginLeft: 5 },
            }}
          >
            Refresh
          </WithLoading>
        </Button>
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
