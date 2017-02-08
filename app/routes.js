// These are the pages you can go to.
// They are all wrapped in the App component, which should contain the navbar etc
// See http://blog.mxstbr.com/2016/01/react-apps-with-pages for more information
// about the code splitting business
import { getAsyncInjectors } from './utils/asyncInjectors';
import { clearError } from './containers/AccountProvider/actions';
import { selectAccount } from './containers/AccountProvider/selectors';

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
    store.dispatch(clearError());

    // Check if the path isn't dashboard. That way we can apply specific logic to
    // display/render the path we want to
    if (nextState.location.pathname !== '/lobby') {
      if (loggedIn) {
        if (nextState.location.state && nextState.location.pathname) {
          replace(nextState.location.pathname);
        } else {
          replace('/');
        }
      }
    } else if (!loggedIn) { // If the user is already logged in, forward them to the homepage
      if (nextState.location.state && nextState.location.pathname) {
        replace(nextState.location.pathname);
      } else {
        replace('/');
      }
    }
  };

  return [
    {
      path: '/',
      name: 'home',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/HomePage/reducer'),
          import('containers/HomePage/sagas'),
          import('containers/HomePage'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('home', reducer.default);
          injectSagas(sagas.default);

          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      onEnter: checkAuth,
      childRoutes: [{
        path: '/lobby',
        name: 'lobby',
        getComponent(nextState, cb) {
          const importModules = Promise.all([
            import('containers/Lobby/reducer'),
            import('containers/Lobby/sagas'),
            import('containers/Lobby'),
          ]);
          const renderRoute = loadModule(cb);

          importModules.then(([reducer, sagas, component]) => {
            injectReducer('lobby', reducer.default);
            injectSagas(sagas.default);

            renderRoute(component);
          });

          importModules.catch(errorLoading);
        },
      }],
    }, {
      path: '/login',
      name: 'login',
      getComponent(nextState, cb) {
        import('containers/LoginPage')
          .then(loadModule(cb))
          .catch(errorLoading);
      },
    }, {
      path: '/register',
      name: 'register',
      getComponent(nextState, cb) {
        import('containers/RegisterPage')
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
