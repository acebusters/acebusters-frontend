// These are the pages you can go to.
// They are all wrapped in the App component, which should contain the navbar etc
// See http://blog.mxstbr.com/2016/01/react-apps-with-pages for more information
// about the code splitting business
import App from './containers/App';
import TableFrame from './components/Frames/Tables';
import DashboardFrame from './components/Frames/Dashboard';
import { getAsyncInjectors } from './utils/asyncInjectors';
import { accountSaga } from './containers/AccountProvider/sagas';
import { tableStateSaga } from './containers/Table/sagas';
import { notificationsSaga } from './containers/Notifications/sagas';
import { actionBarSaga } from './containers/ActionBar/sagas';
import { tableMenuSaga } from './containers/TableMenu/sagas';
import { appSaga } from './containers/App/sagas';

const errorLoading = (err) => {
  console.error('Dynamic page loading failed', err); // eslint-disable-line no-console
};

const loadModule = (cb) => (componentModule) => {
  cb(null, componentModule.default);
};

export default function createRoutes(store) {
  // create reusable async injectors using getAsyncInjectors factory
  const { injectReducer, injectSagas } = getAsyncInjectors(store);

  injectSagas([
    accountSaga,
    actionBarSaga,
    tableMenuSaga,
    tableStateSaga,
    notificationsSaga,
    appSaga,
  ]);

  const dashboard = [
    {
      path: 'advanced',
      name: 'advanced',
      getComponent(nextState, cb) {
        const importModules = import('./containers/Dashboard/Advanced');
        const renderRoute = loadModule(cb);

        importModules.then((component) => {
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    },
  ];

  const simplePages = [
    {
      path: '/',
      name: 'default',
      onEnter: (nextState, replace) => {
        replace({
          pathname: '/lobby',
          state: { nextPathname: nextState.location.pathname },
        });
      },
    }, {
      path: 'lobby',
      name: 'lobby',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/Lobby'),
        ]);
        const renderRoute = loadModule(cb);

        importModules.then(([component]) => {
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    },
    {
      path: 'dashboard',
      name: 'dashboard',
      indexRoute: {
        getComponent(nextState, cb) {
          const importModules = import('./containers/Dashboard/Overview');
          const renderRoute = loadModule(cb);

          import('./containers/Dashboard/Overview').then((component) => {
            renderRoute(component);
          });

          importModules.catch(errorLoading);
        },
      },
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/Dashboard/reducer'),
          import('containers/Dashboard/sagas'),
          import('containers/Dashboard'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('dashboard', reducer.default);
          injectSagas(sagas.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
      childRoutes: dashboard,
    },
    {
      path: '*',
      name: 'notfound',
      getComponent(nextState, cb) {
        import('containers/NotFoundPage')
          .then(loadModule(cb))
          .catch(errorLoading);
      },
    },
  ];

  const tables = [
    {
      path: 'table/:tableAddr',
      name: 'table',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/Table/reducer'),
          import('containers/Table'),
        ]);
        const renderRoute = loadModule(cb);

        importModules.then(([reducer, component]) => {
          injectReducer('table', reducer.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    },
  ];

  return [
    {
      component: App,
      childRoutes: [
        {
          component: TableFrame,
          childRoutes: [...tables],
        },
        {
          component: DashboardFrame,
          childRoutes: [...simplePages],
        },
      ],
    },
  ];
}
