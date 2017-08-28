import { requestApi } from '../../services/api';
import { conf } from '../../app.config';

const request = requestApi(conf().gasStatUrl);

export const requestStat = () => request('get', 'stat');
