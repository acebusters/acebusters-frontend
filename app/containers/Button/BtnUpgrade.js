import BtnUpgrade from 'components/Dashboard/BtnUpgrade';
import { connect } from 'react-redux';
import { modalAdd, modalDismiss } from 'containers/App/actions';

export default connect(() => ({}), { modalAdd, modalDismiss })(BtnUpgrade);
