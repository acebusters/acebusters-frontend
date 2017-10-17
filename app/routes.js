// These are the pages you can go to.
// They are all wrapped in the App component, which should contain the navbar etc
// See http://blog.mxstbr.com/2016/01/react-apps-with-pages for more information
// about the code splitting business
import { getAsyncInjectors } from './utils/asyncInjectors';
import { accountSaga } from './containers/AccountProvider/sagas';
import { tableStateSaga } from './containers/Table/sagas';
import { selectAccount } from './containers/AccountProvider/selectors';
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

  /**
  * Checks authentication status on route change
  * @param  {object}   nextState The state we want to change into when we change routes
  * @param  {function} replace Function provided by React Router to replace the location
  */
  const checkAuth = (nextState, replace) => {
    const { loggedIn } = selectAccount(store.getState()).toJS();
    if (!loggedIn) {
      replace({
        pathname: '/login',
        state: { nextPathname: nextState.location.pathname },
      });
    }
  };

  injectSagas([
    accountSaga,
    actionBarSaga,
    tableMenuSaga,
    tableStateSaga,
    notificationsSaga,
    appSaga,
  ]);

  return [
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
      path: '/lobby',
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
    }, {
      onEnter: checkAuth,
      childRoutes: [{
        path: '/dashboard',
        name: 'dashboard',
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
      }],
    }, {
      path: '/table/:tableAddr',
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
    }, {
      path: '/login',
      name: 'login',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/LoginPage/sagas'),
          import('containers/LoginPage'),
        ]);
        const renderRoute = loadModule(cb);

        importModules.then(([sagas, component]) => {
          injectSagas(sagas.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/register(/ref/:refCode)',
      name: 'register',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/RegisterPage/sagas'),
          import('containers/RegisterPage'),
        ]);
        const renderRoute = loadModule(cb);

        importModules.then(([sagas, component]) => {
          injectSagas(sagas.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/reset',
      name: 'reset',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/ResetPage'),
        ]);
        const renderRoute = loadModule(cb);

        importModules.then(([component]) => {
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/generate/:confCode',
      name: 'generate',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/GeneratePage/sagas'),
          import('containers/GeneratePage'),
        ]);
        const renderRoute = loadModule(cb);

        importModules.then(([sagas, component]) => {
          injectSagas(sagas.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/confirm',
      name: 'confirmPage',
      getComponent(location, cb) {
        import('containers/ConfirmPage')
          .then(loadModule(cb))
          .catch(errorLoading);
      },
    }, {
      path: '*',
      name: 'notfound',
      getComponent(nextState, cb) {
        import('containers/NotFoundPage')
          .then(loadModule(cb))
          .catch(errorLoading);
      },
    },
  ];
}
