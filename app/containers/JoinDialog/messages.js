import { defineMessages } from 'react-intl';

export default defineMessages({
  header: {
    id: 'app.containers.JoinDialog.header',
    defaultMessage: 'Join Dialog:',
  },
  slides: {
    id: 'app.containers.JoinDialog.slides',
    first: {
      id: 'app.containers.JoinDialog.slides.first',
      header: {
        id: 'app.containers.JoinDialog.slides.first.header',
        defaultMessage: 'Request send!',
      },
      text: {
        id: 'app.containers.JoinDialog.slides.first.text',
        defaultMessage: `Waiting for the blockchain to confirm your request. This usually takes a couple of seconds up to about 
                        2 minutes!`,
      },
    },
    second: {
      id: 'app.containers.JoinDialog.slides.first',
      header: {
        id: 'app.containers.JoinDialog.slides.second.header',
        defaultMessage: 'Different Seat States',
      },
      active: {
        id: 'app.containers.JoinDialog.slides.second.active',
        defaultMessage: 'Player is active. But it is not his turn.',
      },
      isTurn: {
        id: 'app.containers.JoinDialog.slides.second.isTurn',
        defaultMessage: 'It is this players turn ',
      },
      sitOut: {
        id: 'app.containers.JoinDialog.slides.second.sitOut',
        defaultMessage: 'Player is in sitout or all-in ',
      },
    },
    third: {
      id: 'app.containers.JoinDialog.slides.first',
      header: {
        id: 'app.containers.JoinDialog.slides.second.header',
        defaultMessage: 'Your funds are secure!',
      },
      text: {
        id: 'app.containers.JoinDialog.slides.second.active',
        defaultMessage: 'Funds are stored in a smart contract on the blockchain. You are in full control!',
      },
    },
  },
});
