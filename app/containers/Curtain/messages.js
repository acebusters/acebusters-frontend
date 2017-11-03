import { defineMessages } from 'react-intl';

export default defineMessages({
  placeholder: {
    id: 'app.containers.Curtain.placeholder',
    defaultMessage: `«{tableName}», hand {handId} in state {state} has {playerCount, plural,
      =0 {no&nbsp;players}
      one {#&nbsp;player}
      other {#&nbsp;players}
    }.`,
  },
});
