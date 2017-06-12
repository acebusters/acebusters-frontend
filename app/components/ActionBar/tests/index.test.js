/**
 * Testing our Button component
 */

import React from 'react';
import { mount, shallow } from 'enzyme';
import ActionBar from '../index';
import ActionButton from '../ActionButton';

import tests from './tests';

describe(tests[0].describe, () => {
  it(tests[0].it, () => {
    const actionBar = shallow(
      <ActionBar {...tests[0].props} />
    );
    expect(actionBar.find('ActionBarComponent').length).toBe(0);
  });
});

describe(tests[1].describe, () => {
  it(tests[1].it, () => {
    const actionBar = shallow(
      <ActionBar {...tests[1].props} />
    );
    expect(actionBar.find('ActionBarComponent').length).toBe(0);
  });
});

describe(tests[2].describe, () => {
  it(tests[2].it, () => {
    const actionBar = shallow(
      <ActionBar {...tests[2].props} />
    );
    expect(actionBar.find({ name: 'action-bar-wrapper' }).length).toEqual(1);
  });
});

describe(tests[3].describe, () => {
  it(tests[3].it, () => {
    const actionBar = shallow(
      <ActionBar {...tests[3].props} />
    );
    expect(actionBar.find('ActionBarComponent').length).toBe(0);
  });
});

describe(tests[4].describe, () => {
  it(tests[4].it, () => {
    const actionBar = shallow(
      <ActionBar {...tests[4].props} />
    );
    expect(actionBar.find(ActionButton).last().props().text).toBe('FOLD');
  });
});

describe(tests[5].describe, () => {
  it(tests[5].it, () => {
    const actionBar = shallow(
      <ActionBar {...tests[5].props} />
    );
    expect(actionBar.find({ name: 'bet' }).length).toBe(1);
    expect(actionBar.find({ name: 'check' }).length).toBe(1);
    expect(actionBar.find({ name: 'fold' }).length).toBe(0);
  });
});

describe(tests[6].describe, () => {
  it(tests[6].it, () => {
    const actionBar = shallow(
      <ActionBar {...tests[6].props} />
    );
    // actionBar.instance().componentWillReceiveProps(props);
    expect(actionBar.find(ActionButton).first().props().text).toEqual('BET 2000');
  });
});

describe(tests[7].describe, () => {
  it(tests[7].it, () => {
    const actionBar = shallow(
      <ActionBar {...tests[7].props} />
    );
    // actionBar.instance().componentWillReceiveProps(props);
    expect(actionBar.find(ActionButton).first().props().text).toEqual('RAISE 5000');
  });
});

describe(tests[8].describe, () => {
  it(tests[8].it, () => {
    const actionBar = shallow(
      <ActionBar {...tests[8].props} />
    );
    // actionBar.instance().updateamount(2000);
    expect(actionBar.find(ActionButton).first().props().text).toEqual('BET 1750');
  });
});

describe(tests[9].describe, () => {
  it(tests[9].it, () => {
    const actionBar = shallow(
      <ActionBar {...tests[9].props} />
    );
    expect(actionBar.find(ActionButton).nodes[1].props.text).toEqual('CHECK');
  });
});

describe(tests[10].describe, () => {
  it(tests[10].it, () => {
    const actionBar = shallow(
      <ActionBar {...tests[10].props} />
    );
    expect(actionBar.find(ActionButton).nodes[1].props.text).toEqual('CALL 1000');
  });
});

describe(tests[11].describe, () => {
  it(tests[11].it, () => {
    const actionBar = mount(
      <ActionBar {...tests[11].props} />
    );
    expect(actionBar.find({ name: 'call' }).text()).toEqual('CALL 800');
    expect(actionBar.find({ name: 'fold' }).length).toEqual(1);
    expect(actionBar.find({ name: 'null' }).length).toEqual(1);
    expect(actionBar.find({ name: 'raise' }).length).toEqual(0);
  });
});

describe(tests[12].describe, () => {
  it(tests[12].it, () => {
    const actionBar = shallow(
      <ActionBar {...tests[12].props} />
    );
    // actionBar.instance().setActive(false);
    expect(actionBar.find('ActionBarComponent').length).toBe(0);
  });
});
