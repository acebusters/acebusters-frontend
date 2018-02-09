import web3Connect from 'containers/AccountProvider/web3Connect';
import { IMPORT_DIALOG, EXPORT_DIALOG } from 'containers/Modal/constants';
import { modalAdd } from 'containers/App/actions';

import Advanced from 'components/Dashboard/Advanced';

const mapDispatchToProps = () => ({
  onImport: () => modalAdd({ modalType: IMPORT_DIALOG }),
  onExport: () => modalAdd({ modalType: EXPORT_DIALOG }),
});

export default web3Connect(
  () => {},
  mapDispatchToProps,
)(Advanced);
