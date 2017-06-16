/**
 * Testing our Button component
 */

import React from 'react';
import { mount, shallow } from 'enzyme';
import ActionBar from '../index';

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
    expect(actionBar.find('ButtonFold').html()).toContain('FOLD');
    expect(actionBar.find('ButtonCheckCall').length).toBe(1);
    expect(actionBar.find('ButtonBetRaise').length).toBe(1);
  });
});

describe(tests[5].describe, () => {
  it(tests[5].it, () => {
    const actionBar = shallow(
      <ActionBar {...tests[5].props} />
    );
    expect(actionBar.find('ButtonFold').html()).toContain('blank');
    expect(actionBar.find('ButtonCheckCall').length).toBe(1);
    expect(actionBar.find('ButtonBetRaise').length).toBe(1);
  });
});

describe(tests[6].describe, () => {
  it(tests[6].it, () => {
    const actionBar = mount(
      <ActionBar {...tests[6].props} />
    );
    expect(actionBar.find('ButtonFold').html()).toContain('blank');
    expect(actionBar.find('ButtonCheckCall').length).toBe(1);
    expect(actionBar.find('ButtonBetRaise').html()).toContain('BET 2000');
  });
});

describe(tests[7].describe, () => {
  it(tests[7].it, () => {
    const actionBar = mount(
      <ActionBar {...tests[7].props} />
    );
    expect(actionBar.find('ButtonFold').html()).toContain('FOLD');
    expect(actionBar.find('ButtonCheckCall').length).toBe(1);
    expect(actionBar.find('ButtonBetRaise').html()).toContain('RAISE 5000');
  });
});

describe(tests[8].describe, () => {
  it(tests[8].it, () => {
    const actionBar = mount(
      <ActionBar {...tests[8].props} />
    );
    expect(actionBar.find('ButtonFold').html()).toContain('blank');
    expect(actionBar.find('ButtonCheckCall').length).toBe(1);
    expect(actionBar.find('ButtonBetRaise').html()).toContain('BET 1750');
  });
});

describe(tests[9].describe, () => {
  it(tests[9].it, () => {
    const actionBar = shallow(
      <ActionBar {...tests[9].props} />
    );
    expect(actionBar.find('ButtonFold').html()).toContain('blank');
    expect(actionBar.find('ButtonCheckCall').html()).toContain('CHECK');
    expect(actionBar.find('ButtonBetRaise').length).toBe(1);
  });
});

describe(tests[10].describe, () => {
  it(tests[10].it, () => {
    const actionBar = shallow(
      <ActionBar {...tests[10].props} />
    );
    expect(actionBar.find('ButtonCheckCall').html()).toContain('CALL 1000');
  });
});

describe(tests[11].describe, () => {
  it(tests[11].it, () => {
    const actionBar = mount(
      <ActionBar {...tests[11].props} />
    );

    expect(actionBar.find('ButtonFold').length).toBe(1);
    expect(actionBar.find('ButtonCheckCall').html()).toContain('CALL 800');
    expect(actionBar.find('ButtonBetRaise').html()).toContain('blank');
    expect(actionBar.find('ButtonBetRaise').html()).not.toContain('RAISEj');
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
